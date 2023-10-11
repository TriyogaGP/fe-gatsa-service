const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: [
    'vuetify',
    'vue-meta'
  ],
  devServer: {
    client: {
      overlay: {
        warnings: false,
        errors: false,
      },

      // or
      overlay: true,
    }
  }
})
