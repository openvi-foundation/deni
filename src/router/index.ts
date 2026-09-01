import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';
import FullPageLayout from '@/layout/FullPageLayout.vue';

declare module 'vue-router' {
    interface RouteMeta {
        title?: string;
        breadcrumb?: string[];
    }
}

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: AppLayout,
        children: [
            {
                path: '',
                name: 'dashboard',
                component: () => import('@/views/DashboardView.vue'),
                meta: { title: 'Dashboard', breadcrumb: ['Dashboard'] }
            },
            {
                path: 'products',
                name: 'products',
                component: () => import('@/views/catalogue/ProductListView.vue'),
                meta: { title: 'Products', breadcrumb: ['Catalogue', 'Products'] }
            },
            {
                path: 'products/:id',
                name: 'product-detail',
                component: () => import('@/views/catalogue/ProductDetailView.vue'),
                meta: { title: 'Product', breadcrumb: ['Catalogue', 'Products', 'Detail'] }
            },
            {
                path: 'customers',
                name: 'customers',
                component: () => import('@/views/catalogue/CustomerListView.vue'),
                meta: { title: 'Customers', breadcrumb: ['Catalogue', 'Customers'] }
            },
            {
                path: 'customers/:id',
                name: 'customer-detail',
                component: () => import('@/views/catalogue/CustomerDetailView.vue'),
                meta: { title: 'Customer', breadcrumb: ['Catalogue', 'Customers', 'Detail'] }
            },
            {
                path: 'orders',
                name: 'orders',
                component: () => import('@/views/catalogue/OrderListView.vue'),
                meta: { title: 'Orders', breadcrumb: ['Catalogue', 'Orders'] }
            },
            {
                path: 'orders/:id',
                name: 'order-detail',
                component: () => import('@/views/catalogue/OrderDetailView.vue'),
                meta: { title: 'Order', breadcrumb: ['Catalogue', 'Orders', 'Detail'] }
            },
            {
                path: 'analytics',
                name: 'analytics',
                component: () => import('@/views/AnalyticsView.vue'),
                meta: { title: 'Analytics', breadcrumb: ['Analytics'] }
            },
            {
                path: 'calendar',
                name: 'calendar',
                component: () => import('@/views/apps/CalendarView.vue'),
                meta: { title: 'Calendar', breadcrumb: ['Apps', 'Calendar'] }
            },
            {
                path: 'inbox',
                name: 'inbox',
                component: () => import('@/views/apps/InboxView.vue'),
                meta: { title: 'Inbox', breadcrumb: ['Apps', 'Inbox'] }
            },
            {
                path: 'forms/layout',
                name: 'form-layout',
                component: () => import('@/views/forms/FormLayoutView.vue'),
                meta: { title: 'Form layout', breadcrumb: ['Forms', 'Layout'] }
            },
            {
                path: 'forms/validation',
                name: 'form-validation',
                component: () => import('@/views/forms/FormValidationView.vue'),
                meta: { title: 'Validation', breadcrumb: ['Forms', 'Validation'] }
            },
            {
                path: 'profile',
                name: 'profile',
                component: () => import('@/views/account/ProfileView.vue'),
                meta: { title: 'Profile', breadcrumb: ['Account', 'Profile'] }
            },
            {
                path: 'settings',
                name: 'settings',
                component: () => import('@/views/account/SettingsView.vue'),
                meta: { title: 'Settings', breadcrumb: ['Account', 'Settings'] }
            }
        ]
    },
    {
        path: '/auth',
        component: FullPageLayout,
        children: [
            {
                path: 'login',
                name: 'login',
                component: () => import('@/views/auth/LoginView.vue'),
                meta: { title: 'Sign in' }
            },
            {
                path: 'register',
                name: 'register',
                component: () => import('@/views/auth/RegisterView.vue'),
                meta: { title: 'Create account' }
            },
            {
                path: 'forgot-password',
                name: 'forgot-password',
                component: () => import('@/views/auth/ForgotPasswordView.vue'),
                meta: { title: 'Reset password' }
            },
            {
                path: 'denied',
                redirect: '/errors/403'
            }
        ]
    },
    {
        path: '/errors',
        component: FullPageLayout,
        children: [
            {
                path: '401',
                name: 'unauthorized',
                component: () => import('@/views/errors/UnauthorizedView.vue'),
                meta: { title: 'Session expired' }
            },
            {
                path: '403',
                name: 'access-denied',
                component: () => import('@/views/errors/AccessDeniedView.vue'),
                meta: { title: 'Access denied' }
            },
            {
                path: '404',
                name: 'not-found',
                component: () => import('@/views/errors/NotFoundView.vue'),
                meta: { title: 'Not found' }
            },
            {
                path: '500',
                name: 'server-error',
                component: () => import('@/views/errors/ServerErrorView.vue'),
                meta: { title: 'Something went wrong' }
            },
            {
                path: 'maintenance',
                name: 'maintenance',
                component: () => import('@/views/errors/MaintenanceView.vue'),
                meta: { title: 'Down for maintenance' }
            }
        ]
    },
    {
        path: '/:pathMatch(.*)*',
        component: FullPageLayout,
        children: [
            {
                path: '',
                name: 'catch-all',
                component: () => import('@/views/errors/NotFoundView.vue'),
                meta: { title: 'Not found' }
            }
        ]
    }
];

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior: () => ({ top: 0 })
});

router.afterEach((to) => {
    document.title = to.meta.title ? `${to.meta.title} · Deni` : 'Deni';
});
