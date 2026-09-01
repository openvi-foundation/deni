<script setup lang="ts">
defineProps<{
    title: string;
    description?: string;
}>();
</script>

<template>
    <header class="page-header">
        <div class="page-header-text">
            <h1 class="page-title">{{ title }}</h1>
            <p v-if="description" class="page-description">{{ description }}</p>
        </div>

        <div v-if="$slots.actions" class="page-header-actions">
            <slot name="actions" />
        </div>
    </header>
</template>
