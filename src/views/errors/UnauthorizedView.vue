<script setup lang="ts">
import Button from 'openvue/button';
import ErrorPage from '@/components/ErrorPage.vue';
</script>

<template>
    <ErrorPage code="401" title="Session expired" message="You have been signed out because the session is no longer valid. Sign in again to pick up where you left off." icon="pi pi-lock" tone="warn">
        <Button label="Sign in" icon="pi pi-sign-in" as="router-link" to="/auth/login" />
        <Button label="Reset password" severity="secondary" outlined as="router-link" to="/auth/forgot-password" />

        <template #footer>Sessions end after 30 days of inactivity.</template>
    </ErrorPage>
</template>
