import Vue from 'vue';
import Router from 'vue-router';
import Top from './views/Top.vue';
import Home from './views/Home.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'top',
      component: Top,
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
    },
    {
      path: '/login/google',
      name: 'GoogleLogin',
      component: () => import(/* webpackChunkName: "login_google" */ './views/login/Google.vue'),
    },
    {
      path: '*',
      component: () => import(/* webpackChunkName: "errors" */ './views/NotFound.vue'),
    },
  ],
});
