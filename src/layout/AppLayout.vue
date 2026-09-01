<script setup lang="ts">
import { onMounted } from 'vue';
import { useMessages } from '@/composables/useMessages';
import { useOrders } from '@/composables/useOrders';
import AppConfigurator from './AppConfigurator.vue';
import AppSidebar from './AppSidebar.vue';
import AppTopbar from './AppTopbar.vue';
import { useLayout } from './useLayout';

const { containerClass, overlayOpen, closeOverlay } = useLayout();
const { load: loadMessages } = useMessages();
const { load: loadOrders } = useOrders();

onMounted(() => {
    loadMessages();
    loadOrders();
});
</script>

<template>
    <div class="layout" :class="containerClass">
        <AppSidebar />

        <button v-if="overlayOpen" class="layout-mask" type="button" aria-label="Close navigation" @click="closeOverlay" />

        <div class="layout-main">
            <AppTopbar />

            <main class="layout-content">
                <RouterView v-slot="{ Component }">
                    <component :is="Component" />
                </RouterView>
            </main>
        </div>

        <AppConfigurator />
    </div>
</template>
