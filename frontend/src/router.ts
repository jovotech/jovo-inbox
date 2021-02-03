import Vue from 'vue';
import VueRouter, { Route, RouteConfig } from 'vue-router';
import store from '@/store';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'login',
    component: () => import('@/views/pages/auth/Login.vue'),
    meta: {
      rule: 'editor',
      layout: 'layout-guest',
      title: 'Login',
    },
    beforeEnter: ifNotAuthenticated,
  },
  {
    path: '/confirm/:code',
    name: 'confirm-account',
    component: () => import('@/views/pages/auth/ConfirmAccount.vue'),
    meta: {
      rule: 'editor',
      layout: 'layout-guest',
      title: 'Account bestätigen',
    },
  },
  {
    path: '/passwort-vergessen',
    name: 'forgot-password',
    component: () => import('@/views/pages/auth/ForgotPassword.vue'),
    meta: {
      rule: 'editor',
      layout: 'layout-guest',
      title: 'Passwort vergessen',
    },
    beforeEnter: ifNotAuthenticated,
  },
  {
    path: '/logout',
    name: 'logout',
    component: () => import('@/views/pages/auth/Login.vue'),
    meta: {
      rule: 'editor',
      layout: 'layout-guest',
      title: 'Logout',
    },
    beforeEnter: ifNotAuthenticated,
  },
  // {
  //   path: '/',
  //   name: 'empty',
  //   component: () => import('@/views/pages/Empty.vue'),
  //   meta: {
  //     rule: 'editor',
  //   },
  // },
  {
    path: '/start',
    name: 'start',
    component: () => import('@/views/pages/Start.vue'),
    meta: {
      rule: 'editor',
      layout: 'layout-main',
      title: 'Start',
    },
    beforeEnter: ifAuthenticated,
  },
  {
    path: '/dashboard/uebersicht',
    name: 'dashboard.overview',
    component: () => import('@/views/pages/DashboardOverview.vue'),
    meta: {
      rule: 'editor',
      layout: 'layout-main',
      title: 'Übersicht',
    },
    beforeEnter: ifAuthenticated,
  },
  {
    path: '/dashboard/ziele',
    name: 'dashboard.goals',
    component: () => import('@/views/pages/DashboardGoals.vue'),
    meta: {
      rule: 'editor',
      layout: 'layout-main',
      title: 'Ziele',
    },
    beforeEnter: ifAuthenticated,
  },

  {
    path: '/vertraege/anbahnungen',
    name: 'policies.leads',
    component: () => import('@/views/pages/policies/Leads.vue'),
    meta: {
      rule: 'editor',
      layout: 'layout-main',
      filter: 'leads-filter',
      title: 'Anbahnungen',
    },
    beforeEnter: ifAuthenticated,
  },

  {
    path: '/vertraege/alle',
    name: 'policies.all',
    component: () => import('@/views/pages/policies/AllPolicies.vue'),
    meta: {
      rule: 'editor',
      layout: 'layout-main',
      filter: 'policy-filter',
      title: 'Verträge',
    },
    beforeEnter: ifAuthenticated,
  },
  {
    path: '/policen/policiert',
    name: 'policies.policed',
    component: () => import('@/views/pages/policies/Policed.vue'),
    meta: {
      rule: 'editor',
      layout: 'layout-main',
      filter: 'policy-filter',
      title: 'Policiert',
    },
    beforeEnter: ifAuthenticated,
  },
  {
    path: '/policen/abgesagt',
    name: 'policies.declined',
    component: () => import('@/views/pages/policies/Declined.vue'),
    meta: {
      rule: 'editor',
      layout: 'layout-main',
      filter: 'policy-filter',
      title: 'Abgesagt',
    },
    beforeEnter: ifAuthenticated,
  },
  {
    path: '/geschaeftsplan',
    name: 'businessplan',
    component: () => import('@/views/pages/BusinessPlan.vue'),
    meta: {
      rule: 'editor',
      layout: 'layout-main',
      title: 'Geschäftsplan',
    },
    beforeEnter: ifAuthenticated,
  },
  {
    path: '/agenturwerte',
    name: 'agencyvalues',
    component: () => import('@/views/pages/AgencyValues.vue'),
    meta: {
      rule: 'editor',
      layout: 'layout-main',
      title: 'Agenturwerte',
    },
    beforeEnter: ifAuthenticated,
  },
  {
    path: '/ringausschreibung',
    name: 'ringtender',
    component: () => import('@/views/pages/RingTender.vue'),
    meta: {
      rule: 'editor',
      layout: 'layout-main',
      title: 'Ringausschreibung',
    },
    beforeEnter: ifAuthenticated,
  },
  {
    path: '/mitarbeiter',
    name: 'employees',
    component: () => import('@/views/pages/Employees.vue'),
    meta: {
      rule: 'editor',
      layout: 'layout-main',
      filter: 'employees-filter',
      title: 'Mitarbeiter',
    },
    beforeEnter: ifAuthenticated,
  },
  {
    path: '/einstellungen',
    name: 'settings',
    component: () => import('@/views/pages/settings/Settings.vue'),
    meta: {
      rule: 'editor',
      layout: 'layout-main',
      title: 'Einstellungen',
    },
    beforeEnter: ifAuthenticated,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});
router.beforeEach((to, from, next) => {
  document.title = to.meta.title + ' - Admiral Dashboard';
  next();
});
export default router;
