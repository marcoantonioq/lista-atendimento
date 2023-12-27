const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    entry: "./web/main.ts",
  },
  pwa: {
    name: "CCB - LISTA DE ATENDIMENTO",
    themeColor: "#D4D9E2",
    msTileColor: "#000000",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black",
    // workboxPluginMode: "InjectManifest",
  },
});
