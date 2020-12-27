import Vue from 'vue';
import { sync } from 'vuex-router-sync';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';

sync(store, router);

Vue.use(ElementUI); 


new Vue({
  render: (h) => h(App),
  el: '#app',
  router,
  store,
});