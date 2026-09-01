<script setup lang="ts">
import Tag from 'openvue/tag';
import { computed } from 'vue';

type Severity = 'success' | 'info' | 'warn' | 'danger' | 'secondary';

const props = defineProps<{ status: string }>();

const severities: Record<string, Severity> = {
    published: 'success',
    active: 'success',
    paid: 'success',
    draft: 'warn',
    pending: 'warn',
    invited: 'info',
    archived: 'secondary',
    refunded: 'secondary',
    suspended: 'danger',
    failed: 'danger'
};

const severity = computed<Severity>(() => severities[props.status] ?? 'secondary');
</script>

<template>
    <Tag :value="status" :severity="severity" />
</template>
