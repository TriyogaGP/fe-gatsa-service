import '@fortawesome/fontawesome-free/css/all.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import { fa } from "vuetify/iconsets/fa";
import { aliases, mdi } from "vuetify/lib/iconsets/mdi";
import "@mdi/font/css/materialdesignicons.css";
import "@fortawesome/fontawesome-free/css/all.css";
import 'vue-svg-map/dist/index.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as labsComponents from 'vuetify/labs/components'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const myCustomLightTheme = {
  dark: false,
  colors: {
    background: '#FFFFFF',
    surface: '#272727',
    primary: '#0007de',
    'primary-darken-1': '#3700B3',
    secondary: '#03DAC6',
    'secondary-darken-1': '#018786',
    error: '#B00020',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
    'icon-white': '#FFFFFF',
    'icon-black': '#000000',
    'nav-back': '#a9a9d9',
    'background-dialog-card': '#e1e1f0',
  },
}

const vuetify = createVuetify({
  components: {
    ...components,
    ...labsComponents,
  },
  directives,
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
      fa,
    },
  },
	theme: {
    defaultTheme: 'myCustomLightTheme',
    themes: {
      myCustomLightTheme,
    },
  },
  // theme: {
	//   themes: {
	// 	  light: {
	// 			  background: colors.grey.lighten2, // Not automatically applied
	// 		  },
	// 	  dark: {
	// 		  background: colors.shades.white, // If not using lighten/darken, use base to return hex
	// 	  },
	//   },
  // },
})

export default vuetify;