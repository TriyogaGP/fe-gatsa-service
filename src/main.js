import { createApp } from "vue";
import App from "@/App.vue";
import router from "@/router";
import store from '@/core/services/store';
import vuetify from '@/core/plugins/vuetify'
import { createMetaManager } from 'vue-meta'
import ApiService from '@/core/services/api.service';
import Helper from '@/core/plugins/globalHelper';
import VuetifyMoney from 'vuetify-money';
// import VueDatePickerUi from 'vue-datepicker-ui';
// import 'vue-datepicker-ui/lib/vuedatepickerui.css'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { VueQueryPlugin } from '@tanstack/vue-query';

//Component Import
import VButton from './components/use-component/VButton.vue' 
import VTextField from './components/use-component/VTextField.vue' 
import VTextArea from './components/use-component/VTextarea.vue' 
import VAutocomplete from './components/use-component/VAutocomplete.vue' 

const app = createApp(App)


app.use(VuetifyMoney);
app.use(VueQueryPlugin);
// API service init
app.use(ApiService)
// Global Helper
app.use(Helper)

// component
// app.component('DatePicker', VueDatePickerUi);
app.component('vue-date-picker', VueDatePicker);
app.component('Button', VButton);
app.component('TextField', VTextField);
app.component('TextArea', VTextArea);
app.component('Autocomplete', VAutocomplete);

app.use(createMetaManager())
app.use(vuetify)
app.use(store)
app.use(router)

await router.isReady()
app.mount("#app");
