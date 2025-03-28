/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'
import { setupLayouts } from 'virtual:generated-layouts'

const routes = [
  {
    path: '/',
    // component: () => import('../layouts/default.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import(/* webpackChunkName: "home" */ '../pages/index.vue'),
      },
      {
        path: '/history',
        name: 'History',
        component: () => import(/* webpackChunkName: "home" */ '../pages/history.vue'),
      },
      {
        path: '/compare',
        name: 'Compare',
        component: () => import(/* webpackChunkName: "manage" */ '../pages/compare.vue'),
        children: [
          {
            path: 'companies/:companyID/sites/:siteID',
            name: 'TemporalSelector',
            component: () => import(/* webpackChunkName: "manage" */ '../components/Compare/TemporalSelector.vue'),
          },
          {
            path: 'companies/:companyID/sites/:siteID/versions/:selectedBase/:selectedComp',
            name: 'CompareResults',
            component: () => import(/* webpackChunkName: "manage" */ '../components/Compare/CompareResults.vue'),
          },
          {
            path: '',
            name: 'CompareHome',
            component: () => import(/* webpackChunkName: "manage" */ '../components/Compare/CompareSelector.vue'),
          }
        ]
      },
          
      {
        path: '/manage',
        name: 'Manage',
        component: () => import(/* webpackChunkName: "manage" */ '../pages/manage/index.vue'),
        children: [
          {
            path: '',
            name: 'ManageHome',
            component: () => import(/* webpackChunkName: "manage" */ '../pages/manage/companies.vue'),
          },
          {
            path: 'companies/:companyID',
            name: 'ManageCompany',
            component: () => import(/* webpackChunkName: "manage" */ '../pages/manage/companies.vue'),
          },
          {
            path: 'companies/:companyID/sites/:siteID',
            name: 'Site',
            component: () => import(/* webpackChunkName: "manage" */ '../pages/manage/sites.vue'),
            
          },
          {
            path: 'companies/:companyID/sites/:siteID/capture',
            name: 'SiteCapture',
            component: () => import(/* webpackChunkName: "manage" */ '../pages/manage/sitesCapture.vue'),
            
          },
          {
            path: 'companies/:companyID/sites/:siteID/pages/:pageID',
            name: 'Page',
            component: () => import(/* webpackChunkName: "manage" */ '../pages/manage/pages.vue'),
            
          },
        ]
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
