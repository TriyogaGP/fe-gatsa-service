const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: [
    'vuetify',
    'vue-meta'
  ],
  devServer: {
    client: {
      overlay: {
        errors: false,
        warnings: false,
        runtimeErrors: false,
      }
    }
  },
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.m?js$/,
          resolve: {
            fullySpecified: false // ⬅️ penting untuk ESM Vuetify
          }
        }
      ]
    }
  }
})
