<script setup lang="ts">
import Button from 'openvue/button';

defineProps<{
    previousTo?: string | null;
    nextTo?: string | null;
    position?: string;
    label: string;
}>();
</script>

<template>
    <div class="record-nav">
        <Button v-if="previousTo" icon="pi pi-chevron-left" severity="secondary" outlined size="small" :aria-label="`Previous ${label}`" as="router-link" :to="previousTo" />
        <Button v-else icon="pi pi-chevron-left" severity="secondary" outlined size="small" :aria-label="`Previous ${label}`" disabled />

        <span v-if="position" class="record-nav-position">{{ position }}</span>

        <Button v-if="nextTo" icon="pi pi-chevron-right" severity="secondary" outlined size="small" :aria-label="`Next ${label}`" as="router-link" :to="nextTo" />
        <Button v-else icon="pi pi-chevron-right" severity="secondary" outlined size="small" :aria-label="`Next ${label}`" disabled />
    </div>
</template>
