/* eslint-disable */
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import '@fortawesome/fontawesome-free/css/all.css';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import axios from 'axios';

import Vue from 'vue';
import './plugins/vuetify';
import App from './App.vue';
import router from './router';
import './registerServiceWorker';
import { createProvider } from './vue-apollo';
/* eslint-enable */

Vue.config.productionTip = false;
if (window.location.hostname === 'localhost') {
  Vue.prototype.$http = axios.create({
    method: 'POST',
    baseURL: 'http://localhost:8080',
  });
} else {
  Vue.prototype.$http = axios.create({
    method: 'POST',
  });
}

Vue.prototype.$token = options => Vue.prototype.$http({
  method: 'GET',
  url: '/client',
}).then(({ data }) => Vue.prototype.$http({
  url: '/oauth/token',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  data: Object.entries({
    client_id: data[0],
    client_secret: data[1],
    ...options,
  }).reduce((p, e) => p.append(e[0], e[1]) || p, new URLSearchParams()),
}));

new Vue({
  router,
  apolloProvider: createProvider(),
  render: h => h(App),
}).$mount('#app');
