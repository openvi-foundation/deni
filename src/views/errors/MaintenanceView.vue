<script setup lang="ts">
import Button from 'openvue/button';
import ProgressBar from 'openvue/progressbar';
import ErrorPage from '@/components/ErrorPage.vue';
import { formatDateTime } from '@/utils/format';

const finishesAt = new Date(Date.now() + 45 * 60000).toISOString();

const reload = () => window.location.reload();
</script>

<template>
    <ErrorPage code="503" title="Down for maintenance" :message="`We are shipping an update and expect to be back around ${formatDateTime(finishesAt)}.`" icon="pi pi-wrench" tone="warn">
        <div class="error-progress">
            <ProgressBar :value="68" :show-value="false" />
        </div>

        <Button label="Check again" icon="pi pi-refresh" @click="reload" />
        <Button label="Status page" icon="pi pi-external-link" severity="secondary" outlined as="a" href="https://openvue.dev" target="_blank" rel="noreferrer" />

        <template #footer>Scheduled maintenance runs on the first Sunday of each month.</template>
    </ErrorPage>
</template>
