import { createApp } from "vue";
import App from "@/App.vue";
import router from "@/router";
import store from '@/core/services/store';
import vuetify from '@/core/plugins/vuetify'
import { createMetaManager } from 'vue-meta'
import ApiService from '@/core/services/api.service';
import Helper from '@/core/plugins/globalHelper';
import VuetifyMoney from 'vuetify-money';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { VueQueryPlugin } from '@tanstack/vue-query';
import PrimeVue from 'primevue/config';
import "primevue/resources/themes/lara-light-blue/theme.css";
import "primevue/resources/primevue.min.css"; /* Deprecated */
import Tailwind from 'primevue/passthrough/tailwind';
import { SvgMap } from "vue-svg-map";
import VueSignaturePad from 'vue-signature-pad';
import {
  DraggableElement,
  DraggableArea,
  StencilPreview,
  Cropper,
  CircleStencil,
} from "vue-advanced-cropper";
import JsonViewer from 'vue-json-viewer'

//Component Import
import Footer from './components/Footer.vue'

import VButton from './components/use-component/VButton.vue' 
import VTextField from './components/use-component/VTextField.vue' 
import VTextArea from './components/use-component/VTextarea.vue' 
import VAutocomplete from './components/use-component/VAutocomplete.vue' 
import VVirtualScroll from "./components/use-component/VVirtualScroll.vue";
import VLoaderDataTables from './components/use-component/VLoaderDataTables.vue' 

import CascadeSelect from 'primevue/cascadeselect';
import Fieldset from 'primevue/fieldset';

const app = createApp(App)


app.use(VuetifyMoney);
app.use(VueQueryPlugin);
app.use(VueSignaturePad);
app.use(JsonViewer);
// API service init
app.use(ApiService)
// Global Helper
app.use(Helper)

app.use(createMetaManager())
app.use(PrimeVue, { ripple: true  })
app.use(vuetify)
app.use(store)
app.use(router)

// component
app.component('Footer', Footer);

app.component('svg-map', SvgMap);
app.component('vue-date-picker', VueDatePicker);
app.component('Button', VButton);
app.component('TextField', VTextField);
app.component('TextArea', VTextArea);
app.component('Autocomplete', VAutocomplete);
app.component('VirtualScroll', VVirtualScroll);
app.component('LoaderDataTables', VLoaderDataTables);

app.component('CascadeSelect', CascadeSelect);
app.component('Fieldset', Fieldset);

//cropper
app.component('DraggableElement', DraggableElement);
app.component('DraggableArea', DraggableArea);
app.component('StencilPreview', StencilPreview);
app.component('Cropper', Cropper);
app.component('CircleStencil', CircleStencil);

router.isReady()
app.mount("#app");
