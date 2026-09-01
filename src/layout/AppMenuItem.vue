<script setup lang="ts">
import Badge from 'openvue/badge';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useMessages } from '@/composables/useMessages';
import { useOrders } from '@/composables/useOrders';
import type { MenuLink } from './menu';
import { useLayout } from './useLayout';

const props = defineProps<{ item: MenuLink }>();

const route = useRoute();
const { closeOverlay, isSlim } = useLayout();
const { unreadCount } = useMessages();
const { pendingCount } = useOrders();

const badgeValue = computed(() => {
    const count = props.item.badge === 'unreadMessages' ? unreadCount.value : props.item.badge === 'pendingOrders' ? pendingCount.value : 0;

    return count > 0 ? String(count) : null;
});

const hasChildren = computed(() => Boolean(props.item.children?.length));
const childActive = computed(() => props.item.children?.some((child) => route.path === child.to) ?? false);
const open = ref(childActive.value);

const linkClass = computed(() => ({
    'sidebar-link': true,
    'sidebar-link-active': hasChildren.value ? childActive.value && !open.value : route.path === props.item.to
}));

const tooltip = computed(() => (isSlim.value ? props.item.label : ''));

const toggle = () => {
    open.value = !open.value;
};
</script>

<template>
    <li>
        <button v-if="hasChildren" v-tooltip.right="tooltip" type="button" :class="linkClass" :aria-expanded="open" @click="toggle">
            <i :class="item.icon" />
            <span>{{ item.label }}</span>
            <i class="pi pi-chevron-right sidebar-link-caret" :class="{ 'sidebar-link-caret-open': open }" />
        </button>

        <RouterLink v-else v-tooltip.right="tooltip" :to="item.to ?? '/'" :class="linkClass" @click="closeOverlay">
            <i :class="item.icon" />
            <span>{{ item.label }}</span>
            <Badge v-if="badgeValue" :value="badgeValue" severity="secondary" class="sidebar-link-badge" />
        </RouterLink>

        <ul v-if="hasChildren && open" class="sidebar-sublist">
            <li v-for="child in item.children" :key="child.to">
                <RouterLink :to="child.to" class="sidebar-sublink" :class="{ 'sidebar-sublink-active': route.path === child.to }" @click="closeOverlay">
                    {{ child.label }}
                </RouterLink>
            </li>
        </ul>
    </li>
</template>
