import { createRouter, createWebHistory } from 'vue-router';

import DashboardLayout from '../components/DashboardLayout.vue';
import AuthLayout from '../components/AuthLayout.vue';
import SurveyView from '../views/SurveyView.vue';
import Dashboard from '../views/Dashboard.vue';
import Register from '../views/Register.vue';
import Survey from '../views/Survey.vue';
import Login from '../views/Login.vue';

import store from '../store/index';

const routes = [
  {
    path: '/',
    component: DashboardLayout,
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard
      },
      {
        path: '/surveys',
        name: 'Surveys',
        component: Survey
      },
      {
        path: '/surveys/:id',
        name: 'SurveyView',
        component: SurveyView
      },
      {
        path: '/surveys/create',
        name: 'SurveyCreate',
        component: SurveyView
      },
    ],
    meta: { authLogin: true }
  },
  {
    path: '/auth',
    name: 'Auth',
    redirect: '/login',
    component: AuthLayout,
    children: [
      {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: { authGuest: true }
      },
      {
        path: '/register',
        name: 'Register',
        component: Register,
        meta: { authGuest: true }
      }
    ],
    meta: { authGuest: true }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to, from) => {
  if(to.meta.authLogin && !store.state.user.token) {
    return { name: 'Login' };
  } else if(to.meta.authGuest && store.state.user.token) {
    return { name: 'Dashboard' };
  }
});

export default router;
