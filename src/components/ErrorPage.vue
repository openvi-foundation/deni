<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
    defineProps<{
        code?: string;
        title: string;
        message: string;
        icon?: string;
        tone?: 'danger' | 'warn' | 'info';
        reference?: string;
    }>(),
    { code: undefined, icon: 'pi pi-exclamation-triangle', tone: 'danger', reference: undefined }
);

const markClass = computed(() => `error-mark error-mark-${props.tone}`);
</script>

<template>
    <div class="error-shell">
        <div class="panel error-panel">
            <span :class="markClass"><i :class="icon" /></span>

            <p v-if="code" class="error-code">{{ code }}</p>
            <h1 class="error-title">{{ title }}</h1>
            <p class="error-message">{{ message }}</p>

            <div v-if="$slots.default" class="error-actions">
                <slot />
            </div>

            <p v-if="reference" class="error-meta">
                <span>Reference</span>
                <span class="error-meta-code">{{ reference }}</span>
            </p>
        </div>

        <p v-if="$slots.footer" class="error-footer">
            <slot name="footer" />
        </p>
    </div>
</template>
