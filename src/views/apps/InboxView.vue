<script setup lang="ts">
import Avatar from 'openvue/avatar';
import Button from 'openvue/button';
import IconField from 'openvue/iconfield';
import InputIcon from 'openvue/inputicon';
import InputText from 'openvue/inputtext';
import Skeleton from 'openvue/skeleton';
import Splitter from 'openvue/splitter';
import SplitterPanel from 'openvue/splitterpanel';
import Textarea from 'openvue/textarea';
import { useToast } from 'openvue/usetoast';
import { computed, onMounted, ref, watch } from 'vue';
import EmptyState from '@/components/EmptyState.vue';
import PageHeader from '@/components/PageHeader.vue';
import PagePanel from '@/components/PagePanel.vue';
import { useMessages } from '@/composables/useMessages';
import type { Message } from '@/types';
import { formatDateTime, formatRelative, initials } from '@/utils/format';

const toast = useToast();
const { messages: data, loading, unreadCount, load, markRead } = useMessages();

onMounted(load);

const search = ref('');
const activeId = ref<string | null>(null);
const reply = ref('');

const messages = computed(() => {
    const term = search.value.trim().toLowerCase();

    if (!term) {
        return data.value;
    }

    return data.value.filter((message) => message.subject.toLowerCase().includes(term) || message.from.toLowerCase().includes(term));
});

const active = computed(() => data.value.find((message) => message.id === activeId.value) ?? null);

watch(
    messages,
    (list) => {
        if (!activeId.value && list.length) {
            activeId.value = list[0].id;
        }
    },
    { immediate: true }
);

const select = (message: Message) => {
    activeId.value = message.id;
    markRead(message.id);
};

const send = () => {
    if (!reply.value.trim()) {
        return;
    }

    toast.add({ severity: 'success', summary: 'Reply sent', detail: active.value?.from, life: 3000 });
    reply.value = '';
};

const rowStyle = (message: Message) => ({
    background: message.id === activeId.value ? 'var(--p-surface-100)' : 'transparent',
    borderLeft: message.id === activeId.value ? '2px solid var(--p-primary-color)' : '2px solid transparent'
});
</script>

<template>
    <div>
        <PageHeader title="Inbox" :description="`${unreadCount} unread of ${data.length} conversations.`">
            <template #actions>
                <Button label="Compose" icon="pi pi-pencil" size="small" />
            </template>
        </PageHeader>

        <PagePanel flush>
            <Splitter style="min-height: 560px; border: 0" :gutter-size="1">
                <SplitterPanel :size="34" :min-size="26">
                    <div style="padding: 12px; border-bottom: 1px solid var(--p-content-border-color)">
                        <IconField>
                            <InputIcon class="pi pi-search" />
                            <InputText v-model="search" placeholder="Search mail" fluid />
                        </IconField>
                    </div>

                    <div style="max-height: 500px; overflow-y: auto">
                        <Skeleton v-if="loading" height="120px" style="margin: 12px" />

                        <EmptyState v-else-if="!messages.length" icon="pi pi-inbox" title="Nothing found" message="No conversation matches that search." />

                        <button
                            v-for="message in messages"
                            v-else
                            :key="message.id"
                            type="button"
                            :style="rowStyle(message)"
                            style="display: flex; gap: 10px; width: 100%; padding: 12px 14px; border: 0; border-bottom: 1px solid var(--p-content-border-color); font: inherit; text-align: left; cursor: pointer"
                            @click="select(message)"
                        >
                            <Avatar :label="initials(message.from)" shape="circle" size="normal" />
                            <span style="display: block; min-width: 0; flex: 1">
                                <span style="display: flex; align-items: baseline; gap: 8px">
                                    <span style="font-size: 13px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap">{{ message.from }}</span>
                                    <span class="cell-sub" style="margin-left: auto; flex: 0 0 auto">{{ formatRelative(message.receivedAt) }}</span>
                                </span>
                                <span style="display: block; font-size: 13px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap" :style="{ fontWeight: message.unread ? 600 : 400 }">{{ message.subject }}</span>
                                <span class="cell-sub" style="display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap">{{ message.preview }}</span>
                            </span>
                        </button>
                    </div>
                </SplitterPanel>

                <SplitterPanel :size="66" :min-size="40">
                    <EmptyState v-if="!active" icon="pi pi-envelope" title="No conversation selected" message="Pick a message from the list to read it here." />

                    <div v-else style="display: flex; flex-direction: column; height: 100%">
                        <div style="display: flex; align-items: flex-start; gap: 12px; padding: 16px; border-bottom: 1px solid var(--p-content-border-color)">
                            <Avatar :label="initials(active.from)" shape="circle" size="large" />
                            <div style="flex: 1; min-width: 0">
                                <p style="font-size: 15px; font-weight: 650">{{ active.subject }}</p>
                                <p class="cell-sub">{{ active.from }} · {{ active.email }}</p>
                            </div>
                            <span class="cell-sub">{{ formatDateTime(active.receivedAt) }}</span>
                        </div>

                        <div style="flex: 1; padding: 20px 16px; font-size: 13.5px; line-height: 1.7">{{ active.body }}</div>

                        <div style="padding: 12px 16px; border-top: 1px solid var(--p-content-border-color); background: var(--p-surface-50)">
                            <Textarea v-model="reply" rows="3" :placeholder="`Reply to ${active.from}`" auto-resize fluid />
                            <div style="display: flex; gap: 8px; margin-top: 10px">
                                <Button label="Send" icon="pi pi-send" size="small" :disabled="!reply.trim()" @click="send" />
                                <Button label="Discard" severity="secondary" text size="small" @click="reply = ''" />
                            </div>
                        </div>
                    </div>
                </SplitterPanel>
            </Splitter>
        </PagePanel>
    </div>
</template>
