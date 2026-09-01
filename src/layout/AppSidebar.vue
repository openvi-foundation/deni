<script setup lang="ts">
import Avatar from 'openvue/avatar';
import Menu from 'openvue/menu';
import type { MenuItem } from 'openvue/menuitem';
import { ref, useSlots } from 'vue';
import { useRouter } from 'vue-router';
import AppMenuItem from './AppMenuItem.vue';
import { menu } from './menu';
import { useLayout } from './useLayout';

const slots = useSlots();

const { preferences } = useLayout();

const router = useRouter();
const accountMenu = ref<InstanceType<typeof Menu> | null>(null);

const accountItems: MenuItem[] = [
    { label: 'Profile', icon: 'pi pi-user', command: () => router.push('/profile') },
    { label: 'Settings', icon: 'pi pi-cog', command: () => router.push('/settings') },
    { separator: true },
    { label: 'Sign out', icon: 'pi pi-sign-out', command: () => router.push('/auth/login') }
];

const openAccountMenu = (event: Event) => {
    accountMenu.value?.toggle(event);
};
</script>

<template>
    <aside class="sidebar" :class="{ 'menu-dark': preferences.menuTheme === 'dark' }">
        <div class="sidebar-brand">
            <span class="sidebar-brand-mark">D</span>
            <span class="sidebar-brand-name">Deni</span>
            <span v-if="slots['brand-badge']" class="sidebar-brand-env">
                <slot name="brand-badge" />
            </span>
        </div>

        <nav class="sidebar-nav" aria-label="Main">
            <div v-for="section in menu" :key="section.label" class="sidebar-section">
                <p class="sidebar-section-label">{{ section.label }}</p>
                <ul class="sidebar-list">
                    <AppMenuItem v-for="item in section.items" :key="item.label" :item="item" />
                </ul>
            </div>
        </nav>

        <div class="sidebar-footer">
            <button type="button" class="sidebar-account" aria-haspopup="true" @click="openAccountMenu">
                <Avatar label="MK" shape="circle" size="normal" />
                <span class="sidebar-account-text">
                    <span class="sidebar-account-name">Mara Keller</span>
                    <span class="sidebar-account-email">mara.keller@mail.dev</span>
                </span>
                <i class="pi pi-ellipsis-v muted" style="margin-left: auto; font-size: 12px" />
            </button>
            <Menu ref="accountMenu" :model="accountItems" :popup="true" />
        </div>
    </aside>
</template>
