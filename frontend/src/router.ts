import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'index',
    meta: {
      title: 'Jovo Inbox',
    },
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import(/* webpackChunkName: "help" */ '@/views/SettingsView.vue'),
    meta: {
      title: 'Settings - Jovo Inbox',
    },
  },
  {
    path: '/:appId',
    name: 'app',
    component: () => import(/* webpackChunkName: "help" */ '@/views/AppView.vue'),
    meta: {
      layout: 'app-layout',
    },
  },
  {
    name: 'conversation',
    path: '/:appId/:userId',
    component: () => import(/* webpackChunkName: "help" */ '@/views/AppView.vue'),
    children: [
      {
        name: 'sessions',
        path: '/:appId/:userId/sessions',
      },
    ],
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});
router.beforeEach((to, from, next) => {
  next();
});
export default router;
