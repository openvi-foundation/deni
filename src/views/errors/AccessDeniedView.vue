<script setup lang="ts">
import Button from 'openvue/button';
import ErrorPage from '@/components/ErrorPage.vue';
</script>

<template>
    <ErrorPage code="403" title="Access denied" message="Your account does not have permission to open this page. Ask a workspace administrator to review your role." icon="pi pi-ban" tone="danger">
        <Button label="Back to dashboard" icon="pi pi-home" as="router-link" to="/" />
        <Button label="View your profile" icon="pi pi-user" severity="secondary" outlined as="router-link" to="/profile" />

        <template #footer>Signed in with the wrong account? <RouterLink to="/auth/login">Switch account</RouterLink>.</template>
    </ErrorPage>
</template>
