import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'top',
      component: () => import(/* webpackChunkName: "general" */ './views/Top.vue'),
    },
    {
      path: '/home',
      name: 'home',
      component: () => import(/* webpackChunkName: "general" */ './views/Home.vue'),
      meta: { showSignOut: true },
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
