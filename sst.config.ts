/// <reference path="./.sst/platform/config.d.ts" />
export default $config({
  app(input) {
    return {
      name: "acm-consulting",
      removal: input?.stage === "production" ? "retain" : "remove",   // Resource states are retained between 'production' deployments, and reset in other deployments
      protect: ["production"].includes(input?.stage),                 // Resources deployed to 'production' stage are protected from deletion
      home: "cloudflare",
      providers: { cloudflare: "5.45.0" },
    };
  },
  async run() {

    const leadsDatabase = new sst.cloudflare.D1("leadsDb");

    const workerApiService = new sst.cloudflare.Worker("HonoService", {
      url: true,
      handler: "packages/hono-api/src/index.ts",
      link: [leadsDatabase],
    });

    new sst.x.DevCommand("Frontend", {
      environment: {
        API_URL: workerApiService.url,
      },
      dev: {
        directory: "./packages/svelte-app",
        command: "pnpm run wrapped-deploy-dev",
        autostart: true,
        title: "Frontend",
      },
    });

    new sst.x.DevCommand("Migrations", {
      environment: {
        DB_NAME: leadsDatabase.nodes.database.name,
      },
      dev: {
        directory: "./packages/database",
        command: "pnpm run db:migrate",
        autostart: true,
        title: "Migrations",
      },
    });

    return {
      /* This puts the url of the workerApiService (the HonoService) into the outputs.json file with the key "api".
        It is being relied upon by the dev.sh script to pass the API URL to the frontend's environment variable.
      */
      api: workerApiService.url,
      db: leadsDatabase.nodes.database.name,
    };
  },
});
