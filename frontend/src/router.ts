import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/user',
    name: 'user',
    meta: {
      rule: 'editor',
      layout: 'layout-guest',
      title: 'User conversation',
    },
    children: [
      {
        path: ':id',
        name: 'detail',
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
