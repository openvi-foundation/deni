<script setup lang="ts">
import Breadcrumb from 'openvue/breadcrumb';
import type { MenuItem } from 'openvue/menuitem';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const home = computed<MenuItem>(() => ({ icon: 'pi pi-home', route: '/' }));
const items = computed<MenuItem[]>(() => (route.meta.breadcrumb ?? []).map((label) => ({ label })));
</script>

<template>
    <Breadcrumb :home="home" :model="items">
        <template #item="{ item, props }">
            <RouterLink v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                <a :href="href" v-bind="props.action" @click="navigate">
                    <i v-if="item.icon" :class="item.icon" />
                    <span v-if="item.label">{{ item.label }}</span>
                </a>
            </RouterLink>
            <span v-else v-bind="props.action">{{ item.label }}</span>
        </template>
    </Breadcrumb>
</template>
