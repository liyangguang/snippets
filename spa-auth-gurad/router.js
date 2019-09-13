import Vue from 'vue';
import VueRouter from 'vue-router';
import {checkIsAdmin} from './firebase-helpers';

// Pages
import Home from './pages/Home.vue'
import Admin from './pages/Admin.vue'

Vue.use(VueRouter)

const routerGuard = (_to, _from, next) => {
  checkIsAdmin().then(isAdmin => {
    if (isAdmin) next();
    else router.push('/');
  })
};

const ROUTES = [
  { path: '/', component: Home },
  { path: '/admin', component: Admin, beforeEnter: routerGuard },
  { path: '/(.*)', redirect: '/' },
];

export const router = new VueRouter({
  mode: 'history',
  routes: ROUTES,
});
