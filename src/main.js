/* eslint-disable */
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import '@fortawesome/fontawesome-free/css/all.css';
import 'typeface-roboto/index.css';
/* eslint-enable */

import axios from 'axios';

import Vue from 'vue';
import './plugins/vuetify';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';
import { createProvider } from './vue-apollo';

Vue.config.productionTip = false;
Vue.prototype.$http = axios.create({
  method: 'POST',
  baseURL: 'http://localhost:8080',
});

new Vue({
  router,
  store,
  apolloProvider: createProvider(),
  render: h => h(App),
}).$mount('#app');
