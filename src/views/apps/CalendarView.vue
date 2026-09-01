<script setup lang="ts">
import Button from 'openvue/button';
import DatePicker from 'openvue/datepicker';
import Dialog from 'openvue/dialog';
import Skeleton from 'openvue/skeleton';
import Tag from 'openvue/tag';
import { computed, ref } from 'vue';
import EmptyState from '@/components/EmptyState.vue';
import PageHeader from '@/components/PageHeader.vue';
import PagePanel from '@/components/PagePanel.vue';
import { useAsyncData } from '@/composables/useAsyncData';
import { getEvents } from '@/service';
import type { CalendarEvent } from '@/types';
import { formatDate } from '@/utils/format';

const { data, loading } = useAsyncData(getEvents, [] as CalendarEvent[]);

const selected = ref<Date>(new Date('2026-09-01T00:00:00'));
const active = ref<CalendarEvent | null>(null);

const severities: Record<CalendarEvent['kind'], 'info' | 'success' | 'warn' | 'danger'> = {
    release: 'success',
    meeting: 'info',
    review: 'warn',
    deadline: 'danger'
};

const toKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const byDate = computed(() => {
    const map = new Map<string, CalendarEvent[]>();

    data.value.forEach((event) => {
        const list = map.get(event.date) ?? [];

        list.push(event);
        map.set(event.date, list);
    });

    return map;
});

const selectedKey = computed(() => toKey(selected.value));
const dayEvents = computed(() => byDate.value.get(selectedKey.value) ?? []);
const upcoming = computed(() => data.value.slice(0, 8));

const hasEvents = (date: { year: number; month: number; day: number }) => byDate.value.has(`${date.year}-${String(date.month + 1).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`);
</script>

<template>
    <div>
        <PageHeader title="Calendar" description="Releases, reviews and deadlines for the coming month.">
            <template #actions>
                <Button label="New event" icon="pi pi-plus" size="small" />
            </template>
        </PageHeader>

        <div class="grid" style="grid-template-columns: minmax(0, 1fr) minmax(300px, 380px)">
            <PagePanel title="September 2026">
                <Skeleton v-if="loading" height="320px" />
                <DatePicker v-else v-model="selected" inline show-week class="w-full" style="width: 100%">
                    <template #date="{ date }">
                        <span :style="{ position: 'relative', display: 'inline-block' }">
                            {{ date.day }}
                            <span v-if="hasEvents(date)" :style="{ position: 'absolute', bottom: '-5px', left: '50%', transform: 'translateX(-50%)', width: '4px', height: '4px', borderRadius: '50%', background: 'var(--p-primary-color)' }" />
                        </span>
                    </template>
                </DatePicker>
            </PagePanel>

            <div class="stack">
                <PagePanel :title="formatDate(selectedKey)" description="Scheduled for the selected day.">
                    <EmptyState v-if="!dayEvents.length" icon="pi pi-calendar" title="Nothing scheduled" message="Pick another day or add an event." />

                    <div v-else class="stack" style="gap: 8px">
                        <button v-for="event in dayEvents" :key="event.id" type="button" class="search-result" style="align-items: flex-start" @click="active = event">
                            <span style="display: block; flex: 1">
                                <span style="display: block; font-size: 13px; font-weight: 600">{{ event.title }}</span>
                                <span class="cell-sub">{{ event.time }} · {{ event.owner }}</span>
                            </span>
                            <Tag :value="event.kind" :severity="severities[event.kind]" />
                        </button>
                    </div>
                </PagePanel>

                <PagePanel title="Upcoming">
                    <Skeleton v-if="loading" height="200px" />
                    <div v-else class="stack" style="gap: 8px">
                        <button v-for="event in upcoming" :key="event.id" type="button" class="search-result" @click="active = event">
                            <span style="display: block; flex: 1">
                                <span style="display: block; font-size: 13px">{{ event.title }}</span>
                                <span class="cell-sub">{{ formatDate(event.date) }} · {{ event.time }}</span>
                            </span>
                        </button>
                    </div>
                </PagePanel>
            </div>
        </div>

        <Dialog :visible="Boolean(active)" modal :header="active?.title" :style="{ width: '420px' }" @update:visible="active = null">
            <div v-if="active" class="stack" style="gap: 12px">
                <div>
                    <p class="metric-label">When</p>
                    <p style="margin-top: 4px; font-size: 13.5px">{{ formatDate(active.date) }} at {{ active.time }}</p>
                </div>
                <div>
                    <p class="metric-label">Owner</p>
                    <p style="margin-top: 4px; font-size: 13.5px">{{ active.owner }}</p>
                </div>
                <div>
                    <p class="metric-label">Type</p>
                    <div style="margin-top: 6px"><Tag :value="active.kind" :severity="severities[active.kind]" /></div>
                </div>
            </div>

            <template #footer>
                <Button label="Close" severity="secondary" outlined @click="active = null" />
            </template>
        </Dialog>
    </div>
</template>
