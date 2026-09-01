export interface MenuChild {
    label: string;
    to: string;
}

export type BadgeSource = 'unreadMessages' | 'pendingOrders';

export interface MenuLink {
    label: string;
    icon: string;
    to?: string;
    badge?: BadgeSource;
    children?: MenuChild[];
}

export interface MenuSection {
    label: string;
    items: MenuLink[];
}

export const menu: MenuSection[] = [
    {
        label: 'Overview',
        items: [
            { label: 'Dashboard', icon: 'pi pi-home', to: '/' },
            { label: 'Analytics', icon: 'pi pi-chart-bar', to: '/analytics' }
        ]
    },
    {
        label: 'Content manager',
        items: [
            { label: 'Products', icon: 'pi pi-box', to: '/products' },
            { label: 'Orders', icon: 'pi pi-receipt', to: '/orders', badge: 'pendingOrders' },
            { label: 'Customers', icon: 'pi pi-users', to: '/customers' }
        ]
    },
    {
        label: 'Workspace',
        items: [
            { label: 'Inbox', icon: 'pi pi-inbox', to: '/inbox', badge: 'unreadMessages' },
            { label: 'Calendar', icon: 'pi pi-calendar', to: '/calendar' },
            {
                label: 'Forms',
                icon: 'pi pi-pencil',
                children: [
                    { label: 'Layout', to: '/forms/layout' },
                    { label: 'Validation', to: '/forms/validation' }
                ]
            }
        ]
    },
    {
        label: 'Pages',
        items: [
            {
                label: 'Errors',
                icon: 'pi pi-exclamation-triangle',
                children: [
                    { label: '401 Session expired', to: '/errors/401' },
                    { label: '403 Access denied', to: '/errors/403' },
                    { label: '404 Not found', to: '/errors/404' },
                    { label: '500 Server error', to: '/errors/500' },
                    { label: '503 Maintenance', to: '/errors/maintenance' }
                ]
            }
        ]
    },
    {
        label: 'Settings',
        items: [
            { label: 'Profile', icon: 'pi pi-user', to: '/profile' },
            { label: 'Application', icon: 'pi pi-cog', to: '/settings' }
        ]
    }
];
