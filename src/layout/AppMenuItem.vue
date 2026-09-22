<script setup lang="ts">
import Badge from 'openvue/badge';
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useMessages } from '@/composables/useMessages';
import { useOrders } from '@/composables/useOrders';
import type { MenuLink } from './menu';
import { useFlyout } from './useFlyout';
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

const root = ref<HTMLLIElement | null>(null);
const submenu = ref<HTMLElement | null>(null);
const { visible: flyoutOpen, style: flyoutStyle, show: showFlyout, hide: hideFlyout, toggle: toggleFlyout } = useFlyout(root, submenu, computed(() => isSlim.value && hasChildren.value));

const expanded = computed(() => (isSlim.value ? flyoutOpen.value : open.value));
const tooltip = computed(() => (isSlim.value && !hasChildren.value ? props.item.label : ''));

const linkClass = computed(() => ({
    'sidebar-link': true,
    'sidebar-link-active': hasChildren.value ? childActive.value && (isSlim.value || !open.value) : route.path === props.item.to
}));

const toggle = () => {
    if (isSlim.value) {
        toggleFlyout();
    } else {
        open.value = !open.value;
    }
};

watch(() => route.path, hideFlyout);
</script>

<template>
    <li ref="root" @mouseenter="showFlyout" @mouseleave="hideFlyout" @keydown.esc="hideFlyout">
        <button v-if="hasChildren" v-tooltip.right="tooltip" type="button" :class="linkClass" :aria-expanded="expanded" @click="toggle">
            <i :class="item.icon" />
            <span>{{ item.label }}</span>
            <i class="pi pi-chevron-right sidebar-link-caret" :class="{ 'sidebar-link-caret-open': open }" />
        </button>

        <RouterLink v-else v-tooltip.right="tooltip" :to="item.to ?? '/'" :class="linkClass" @click="closeOverlay">
            <i :class="item.icon" />
            <span>{{ item.label }}</span>
            <Badge v-if="badgeValue" :value="badgeValue" severity="secondary" class="sidebar-link-badge" />
        </RouterLink>

        <div v-if="hasChildren && expanded" ref="submenu" :class="{ 'sidebar-flyout': isSlim }" :style="isSlim ? flyoutStyle : undefined">
            <p v-if="isSlim" class="sidebar-flyout-title">{{ item.label }}</p>
            <ul class="sidebar-sublist">
                <li v-for="child in item.children" :key="child.to">
                    <RouterLink :to="child.to" class="sidebar-sublink" :class="{ 'sidebar-sublink-active': route.path === child.to }" @click="closeOverlay">
                        {{ child.label }}
                    </RouterLink>
                </li>
            </ul>
        </div>
    </li>
</template>
