/// <reference path="./.sst/platform/config.d.ts" />
export default $config({
  app(input) {
    return {
      name: "acm-consulting",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "cloudflare",
      providers: { cloudflare: "5.45.0" },
    };
  },
  async run() {

    const honoRestApiService = new sst.cloudflare.Worker("HonoService", {
      url: true,
      handler: "index.ts",
    });

    return {
      api: honoRestApiService.url,
    };
  },
});
