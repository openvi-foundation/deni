<script setup lang="ts">
defineProps<{
    title: string;
    subtitle?: string;
}>();
</script>

<template>
    <div class="auth-shell">
        <div class="auth-brand">
            <span class="sidebar-brand-mark">D</span>
            <span class="auth-brand-name">Deni</span>
        </div>

        <div class="panel auth-panel">
            <h1 class="auth-title">{{ title }}</h1>
            <p v-if="subtitle" class="auth-subtitle">{{ subtitle }}</p>

            <div class="auth-body">
                <slot />
            </div>
        </div>

        <p v-if="$slots.footer" class="auth-footer">
            <slot name="footer" />
        </p>
    </div>
</template>
