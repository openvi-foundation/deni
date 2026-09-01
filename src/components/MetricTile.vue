<script setup lang="ts">
import Skeleton from 'openvue/skeleton';
import { computed } from 'vue';

const props = withDefaults(
    defineProps<{
        label: string;
        value: string;
        delta?: number;
        hint?: string;
        loading?: boolean;
    }>(),
    { loading: false }
);

const hasDelta = computed(() => typeof props.delta === 'number');
const up = computed(() => (props.delta ?? 0) >= 0);
const deltaClass = computed(() => (up.value ? 'metric-delta metric-delta-up' : 'metric-delta metric-delta-down'));
const deltaIcon = computed(() => (up.value ? 'pi pi-arrow-up-right' : 'pi pi-arrow-down-right'));
const deltaLabel = computed(() => `${up.value ? '+' : ''}${(props.delta ?? 0).toFixed(1)}%`);
</script>

<template>
    <article class="metric">
        <p class="metric-label">{{ label }}</p>

        <Skeleton v-if="loading" width="7rem" height="1.75rem" class="metric-value" />
        <p v-else class="metric-value">{{ value }}</p>

        <div class="metric-foot">
            <span v-if="hasDelta" :class="deltaClass">
                <i :class="deltaIcon" />
                {{ deltaLabel }}
            </span>
            <span v-if="hint">{{ hint }}</span>
        </div>
    </article>
</template>
