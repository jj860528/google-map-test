import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import * as GmapVue from 'gmap-vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)



Vue.config.productionTip = false;
Vue.use(GmapVue, {
  load: {
    key: 'AIzaSyAQnQX7jMRvt7NdgPMKt-14DZQHSG5_j9A',
    libraries: 'places,drawing,visualization', // This is required if you use the Autocomplete plugin
    // OR: libraries: 'places,drawing'
    // OR: libraries: 'places,drawing,visualization'
    // (as you require)

    //// If you want to set the version, you can do so:
    // v: '3.26',
    language: 'zh-TW',
    region: 'zh-TW'
  },
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
