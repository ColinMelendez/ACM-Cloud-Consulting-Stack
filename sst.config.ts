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

    const workerApiService = new sst.cloudflare.Worker("HonoService", {
      url: true,
      handler: "index.ts",
    });

    return {
      /* This puts the url of the workerApiService (the HonoService) into the outputs.json file with the key "api".
        It is being relied upon by the dev.sh script to pass the API URL to the frontend's environment variable.
      */
      api: workerApiService.url,
    };
  },
});
