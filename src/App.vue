<script setup lang="ts">
import ConfirmDialog from 'openvue/confirmdialog';
import Toast from 'openvue/toast';
</script>

<template>
    <RouterView />
    <Toast position="bottom-right" />
    <ConfirmDialog />
</template>
