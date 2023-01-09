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
    path: '/:projectId',
    name: 'project',
    component: () => import(/* webpackChunkName: "help" */ '@/views/ProjectView.vue'),
    meta: {
      layout: 'project-layout',
    },
  },
  {
    name: 'conversation',
    path: '/:projectId/:userId',
    component: () => import(/* webpackChunkName: "help" */ '@/views/ProjectView.vue'),
    children: [
      {
        name: 'sessions',
        path: '/:projectId/:userId/sessions',
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
