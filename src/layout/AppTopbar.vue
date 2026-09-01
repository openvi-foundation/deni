<script setup lang="ts">
import Avatar from 'openvue/avatar';
import Badge from 'openvue/badge';
import Button from 'openvue/button';
import Menu from 'openvue/menu';
import Popover from 'openvue/popover';
import type { MenuItem } from 'openvue/menuitem';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useTheme } from '@/composables/useTheme';
import { formatRelative } from '@/utils/format';
import AppBreadcrumb from './AppBreadcrumb.vue';
import AppSearchDialog from './AppSearchDialog.vue';
import { useLayout } from './useLayout';

const router = useRouter();
const { toggleSidebar, openConfigurator, searchOpen } = useLayout();
const { isDark, themeIcon, toggleDark } = useTheme();

const notifications = ref<InstanceType<typeof Popover> | null>(null);
const userMenu = ref<InstanceType<typeof Menu> | null>(null);

const alerts = [
    { id: 'n1', title: 'Order #48219 was refunded', at: '2026-08-30T07:42:00Z', icon: 'pi pi-undo' },
    { id: 'n2', title: 'Aero Keyboard is out of stock', at: '2026-08-30T05:10:00Z', icon: 'pi pi-exclamation-triangle' },
    { id: 'n3', title: 'Priya Raman accepted an invite', at: '2026-08-29T16:03:00Z', icon: 'pi pi-user-plus' },
    { id: 'n4', title: 'Weekly report is ready', at: '2026-08-29T08:00:00Z', icon: 'pi pi-file' }
];

const userItems: MenuItem[] = [
    { label: 'Profile', icon: 'pi pi-user', command: () => router.push('/profile') },
    { label: 'Settings', icon: 'pi pi-cog', command: () => router.push('/settings') },
    { separator: true },
    { label: 'Sign out', icon: 'pi pi-sign-out', command: () => router.push('/auth/login') }
];

const alertCount = computed(() => (alerts.length > 99 ? '99+' : String(alerts.length)));

const toggleNotifications = (event: Event) => {
    notifications.value?.toggle(event);
};

const toggleUserMenu = (event: Event) => {
    userMenu.value?.toggle(event);
};

const onKeydown = (event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchOpen.value = true;
    }
};

onMounted(() => window.addEventListener('keydown', onKeydown));
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown));
</script>

<template>
    <header class="topbar">
        <div class="topbar-left">
            <Button icon="pi pi-bars" severity="secondary" text rounded aria-label="Toggle navigation" @click="toggleSidebar" />
            <AppBreadcrumb />
        </div>

        <div class="topbar-right">
            <button type="button" class="topbar-search" @click="searchOpen = true">
                <i class="pi pi-search" />
                <span>Search</span>
                <span class="topbar-search-key">⌘K</span>
            </button>

            <span class="topbar-divider" />

            <Button :icon="themeIcon" severity="secondary" text rounded :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'" @click="toggleDark" />
            <Button icon="pi pi-palette" severity="secondary" text rounded aria-label="Theme settings" @click="openConfigurator" />

            <span class="topbar-notify">
                <Button icon="pi pi-bell" severity="secondary" text rounded :aria-label="`Notifications, ${alerts.length} unread`" @click="toggleNotifications" />
                <Badge v-if="alerts.length" :value="alertCount" severity="danger" size="small" class="topbar-notify-badge" />
            </span>

            <span class="topbar-divider" />

            <button type="button" class="topbar-user" aria-haspopup="true" @click="toggleUserMenu">
                <Avatar label="NJ" shape="circle" size="normal" />
                <span class="topbar-user-name">Nikola</span>
                <i class="pi pi-angle-down muted" style="font-size: 12px" />
            </button>
        </div>

        <Popover ref="notifications">
            <div style="width: 320px">
                <p style="font-size: 12px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: var(--p-text-muted-color); padding: 0 4px 8px">Notifications</p>

                <button v-for="alert in alerts" :key="alert.id" type="button" class="search-result" style="align-items: flex-start">
                    <i :class="alert.icon" style="margin-top: 2px" />
                    <span style="display: block">
                        <span style="display: block; font-size: 13px">{{ alert.title }}</span>
                        <span class="cell-sub">{{ formatRelative(alert.at) }}</span>
                    </span>
                </button>
            </div>
        </Popover>

        <Menu ref="userMenu" :model="userItems" :popup="true" />
        <AppSearchDialog v-model="searchOpen" />
    </header>
</template>
