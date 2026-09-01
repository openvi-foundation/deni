<script setup lang="ts">
import Button from 'openvue/button';
import { useRoute, useRouter } from 'vue-router';
import ErrorPage from '@/components/ErrorPage.vue';

const route = useRoute();
const router = useRouter();

const back = () => router.back();
</script>

<template>
    <ErrorPage code="404" title="Page not found" message="The page you are looking for has moved, or the link that brought you here is out of date." icon="pi pi-search" tone="info" :reference="route.fullPath">
        <Button label="Back to dashboard" icon="pi pi-home" as="router-link" to="/" />
        <Button label="Go back" icon="pi pi-arrow-left" severity="secondary" outlined @click="back" />

        <template #footer>Still stuck? Try the search in the topbar, or browse <RouterLink to="/products">products</RouterLink>.</template>
    </ErrorPage>
</template>
