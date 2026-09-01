<script setup lang="ts">
import Button from 'openvue/button';
import { ref } from 'vue';
import ErrorPage from '@/components/ErrorPage.vue';
import { createId } from '@/utils/id';

const reference = ref(createId('err').toUpperCase());
const retrying = ref(false);

const retry = () => {
    retrying.value = true;
    window.location.reload();
};
</script>

<template>
    <ErrorPage code="500" title="Something went wrong" message="The request could not be completed. The team has been notified — retrying usually works." icon="pi pi-server" tone="danger" :reference="reference">
        <Button label="Try again" icon="pi pi-refresh" :loading="retrying" @click="retry" />
        <Button label="Back to dashboard" severity="secondary" outlined as="router-link" to="/" />

        <template #footer>Quote the reference above when contacting support.</template>
    </ErrorPage>
</template>
