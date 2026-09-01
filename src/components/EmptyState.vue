<script setup lang="ts">
withDefaults(
    defineProps<{
        icon?: string;
        title: string;
        message?: string;
    }>(),
    { icon: 'pi pi-inbox' }
);
</script>

<template>
    <div class="empty-state">
        <span class="empty-state-icon"><i :class="icon" /></span>
        <p class="empty-state-title">{{ title }}</p>
        <p v-if="message" class="empty-state-message">{{ message }}</p>
        <div v-if="$slots.default" class="empty-state-action">
            <slot />
        </div>
    </div>
</template>
