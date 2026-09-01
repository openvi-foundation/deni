<script setup lang="ts">
import { Analytics } from '@vercel/analytics/vue';
import ConfirmDialog from 'openvue/confirmdialog';
import Toast from 'openvue/toast';
</script>

<template>
    <RouterView />
    <Toast position="bottom-right" />
    <ConfirmDialog />
    <Analytics />
</template>
