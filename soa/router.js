import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

import PageNotFoundPage from './pages/NotFound.vue';
import Contract from './pages/Contract.vue';

const FirstPage = () =>
  import('./pages/FirstPage.vue');
const SecondPage = () =>
  import('./pages/SecondPage.vue');
const Policies = () => 
  import('./pages/Policies.vue');

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({
    y: 0
  }),
  routes: [{
    path: '/firstPage',
    component: FirstPage,
  }, {
    path: '/secondPage',
    component: SecondPage,
  }, 
  {
    path: '/policiesIntro',
    component: Policies,
  },
  {
    path: '/contract',
    component: Contract,
  },
  {
    path: '*',
    component: PageNotFoundPage,
  }]
})