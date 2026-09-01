<script setup lang="ts">
withDefaults(
    defineProps<{
        title?: string;
        description?: string;
        flush?: boolean;
    }>(),
    { flush: false }
);
</script>

<template>
    <section class="panel">
        <div v-if="title || $slots.actions" class="panel-header">
            <div v-if="title">
                <h2 class="panel-title">{{ title }}</h2>
                <p v-if="description" class="panel-description">{{ description }}</p>
            </div>
            <div v-if="$slots.actions" class="panel-actions">
                <slot name="actions" />
            </div>
        </div>

        <div class="panel-body" :class="{ 'panel-body-flush': flush }">
            <slot />
        </div>
    </section>
</template>
