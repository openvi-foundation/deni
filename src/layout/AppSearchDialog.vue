<script setup lang="ts">
import Dialog from 'openvue/dialog';
import IconField from 'openvue/iconfield';
import InputIcon from 'openvue/inputicon';
import InputText from 'openvue/inputtext';
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { menu } from './menu';

const open = defineModel<boolean>({ required: true });

const router = useRouter();
const query = ref('');

interface SearchEntry {
    label: string;
    group: string;
    icon: string;
    to: string;
}

const entries = computed<SearchEntry[]>(() =>
    menu.flatMap((section) =>
        section.items.flatMap((item) => {
            if (item.children) {
                return item.children.map((child) => ({ label: `${item.label} · ${child.label}`, group: section.label, icon: item.icon, to: child.to }));
            }

            return item.to ? [{ label: item.label, group: section.label, icon: item.icon, to: item.to }] : [];
        })
    )
);

const results = computed(() => {
    const term = query.value.trim().toLowerCase();

    if (!term) {
        return entries.value;
    }

    return entries.value.filter((entry) => entry.label.toLowerCase().includes(term) || entry.group.toLowerCase().includes(term));
});

watch(open, (value) => {
    if (value) {
        query.value = '';
    }
});

const go = (to: string) => {
    open.value = false;
    router.push(to);
};
</script>

<template>
    <Dialog v-model:visible="open" modal :draggable="false" :show-header="false" :style="{ width: '520px' }" :breakpoints="{ '640px': '92vw' }" content-class="p-0">
        <div style="padding: 12px 12px 0">
            <IconField>
                <InputIcon class="pi pi-search" />
                <InputText v-model="query" placeholder="Search pages" autofocus fluid />
            </IconField>
        </div>

        <div style="max-height: 320px; overflow-y: auto; padding: 8px 12px 12px">
            <p v-if="!results.length" class="muted" style="padding: 24px 4px; text-align: center; font-size: 13px">No pages match “{{ query }}”.</p>

            <button v-for="result in results" :key="result.to" type="button" class="search-result" @click="go(result.to)">
                <i :class="result.icon" />
                <span>{{ result.label }}</span>
                <span class="search-result-group">{{ result.group }}</span>
            </button>
        </div>
    </Dialog>
</template>
