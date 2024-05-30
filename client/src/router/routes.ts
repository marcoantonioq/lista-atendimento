import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/', component: () => import('pages/IndexPage.vue') },
      {
        path: '/lista/:local?',
        name: 'LISTA',
        component: () => import('pages/ListasPage.vue'),
      },
      {
        path: '/darpe',
        name: 'DARPE',
        component: () => import('pages/DarpePage.vue'),
      },
      {
        path: '/calendar',
        name: 'Calendário',
        component: () => import('pages/CalendarPage.vue'),
      },
      {
        path: '/config',
        name: 'CONFIG',
        component: () => import('pages/ConfigPage.vue'),
      },
      {
        path: '/save',
        component: () => import('../components/SavePopupComponent.vue'),
      },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
