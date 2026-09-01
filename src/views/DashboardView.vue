<script setup lang="ts">
import Button from 'openvue/button';
import Chart from 'openvue/chart';
import Column from 'openvue/column';
import DataTable from 'openvue/datatable';
import Menu from 'openvue/menu';
import MeterGroup from 'openvue/metergroup';
import Skeleton from 'openvue/skeleton';
import Timeline from 'openvue/timeline';
import type { MenuItem } from 'openvue/menuitem';
import { computed, ref } from 'vue';
import EmptyState from '@/components/EmptyState.vue';
import MetricTile from '@/components/MetricTile.vue';
import PageHeader from '@/components/PageHeader.vue';
import PagePanel from '@/components/PagePanel.vue';
import StatusTag from '@/components/StatusTag.vue';
import { useAsyncData } from '@/composables/useAsyncData';
import { baseChartOptions, useChartTheme } from '@/composables/useChartTheme';
import { getActivity, getAnalytics, getOrders, type Analytics } from '@/service';
import { formatCompact, formatCurrency, formatCurrencyPrecise, formatRelative } from '@/utils/format';

const emptyAnalytics: Analytics = { revenue: [], orders: [], channels: [], categories: [], retention: [], satisfaction: [] };

const { data: analytics, loading: analyticsLoading } = useAsyncData(getAnalytics, emptyAnalytics);
const { data: orders, loading: ordersLoading } = useAsyncData(getOrders, []);
const { data: activity, loading: activityLoading } = useAsyncData(getActivity, []);

const { theme } = useChartTheme();

const rangeMenu = ref<InstanceType<typeof Menu> | null>(null);
const range = ref('Last 6 months');
const rangeItems: MenuItem[] = ['Last 7 days', 'Last 30 days', 'Last 6 months', 'Year to date'].map((label) => ({
    label,
    command: () => {
        range.value = label;
    }
}));

const totalRevenue = computed(() => analytics.value.revenue.reduce((sum, point) => sum + point.value, 0));
const totalOrders = computed(() => analytics.value.orders.reduce((sum, point) => sum + point.value, 0));
const averageOrder = computed(() => (totalOrders.value ? totalRevenue.value / totalOrders.value : 0));

const metrics = computed(() => [
    { key: 'revenue', label: 'Revenue', value: formatCurrency(totalRevenue.value), delta: 12.4, hint: 'vs previous period' },
    { key: 'orders', label: 'Orders', value: formatCompact(totalOrders.value), delta: 6.1, hint: 'vs previous period' },
    { key: 'aov', label: 'Average order', value: formatCurrencyPrecise(averageOrder.value), delta: -2.3, hint: 'vs previous period' },
    { key: 'customers', label: 'Active customers', value: '1,284', delta: 4.8, hint: 'seen in last 30 days' }
]);

const revenueChart = computed(() => ({
    labels: analytics.value.revenue.map((point) => point.label),
    datasets: [
        {
            label: 'Revenue',
            data: analytics.value.revenue.map((point) => point.value),
            borderColor: theme.value.primary,
            backgroundColor: 'transparent',
            borderWidth: 2,
            tension: 0.35,
            pointRadius: 0,
            pointHoverRadius: 4
        }
    ]
}));

const ordersChart = computed(() => ({
    labels: analytics.value.orders.map((point) => point.label),
    datasets: [
        {
            label: 'Orders',
            data: analytics.value.orders.map((point) => point.value),
            backgroundColor: theme.value.series[1],
            borderRadius: 3,
            barThickness: 22
        }
    ]
}));

const chartOptions = computed(() => baseChartOptions(theme.value));

const channelMeter = computed(() =>
    analytics.value.channels.map((channel, index) => ({
        label: channel.label,
        value: channel.value,
        color: theme.value.series[index % theme.value.series.length]
    }))
);

const recentOrders = computed(() => orders.value.slice(0, 6));
const recentActivity = computed(() => activity.value.slice(0, 6));

const activityIcons: Record<string, string> = {
    create: 'pi pi-plus',
    update: 'pi pi-pencil',
    delete: 'pi pi-trash',
    publish: 'pi pi-send'
};

const openRangeMenu = (event: Event) => {
    rangeMenu.value?.toggle(event);
};
</script>

<template>
    <div>
        <PageHeader title="Dashboard" description="Revenue, orders and catalogue activity across your workspace.">
            <template #actions>
                <Button :label="range" icon="pi pi-calendar" icon-pos="left" severity="secondary" outlined size="small" @click="openRangeMenu" />
                <Menu ref="rangeMenu" :model="rangeItems" :popup="true" />
                <Button label="Export" icon="pi pi-download" size="small" />
            </template>
        </PageHeader>

        <div class="stack">
            <div class="grid grid-metrics">
                <MetricTile v-for="metric in metrics" :key="metric.key" :label="metric.label" :value="metric.value" :delta="metric.delta" :hint="metric.hint" :loading="analyticsLoading" />
            </div>

            <div class="grid grid-halves">
                <PagePanel title="Revenue" description="Net of refunds, by month.">
                    <Skeleton v-if="analyticsLoading" height="240px" />
                    <Chart v-else type="line" :data="revenueChart" :options="chartOptions" style="height: 240px" />
                </PagePanel>

                <PagePanel title="Orders" description="Completed checkouts, by month.">
                    <Skeleton v-if="analyticsLoading" height="240px" />
                    <Chart v-else type="bar" :data="ordersChart" :options="chartOptions" style="height: 240px" />
                </PagePanel>
            </div>

            <div class="grid" style="grid-template-columns: minmax(0, 2fr) minmax(280px, 1fr); align-items: start">
                <PagePanel title="Recent orders" flush>
                    <template #actions>
                        <Button label="View all" size="small" text as="router-link" to="/orders" />
                    </template>

                    <DataTable :value="recentOrders" :loading="ordersLoading" data-key="id" size="small">
                        <template #empty>
                            <EmptyState icon="pi pi-receipt" title="No orders yet" message="Orders placed in your storefront will appear here." />
                        </template>

                        <Column field="reference" header="Order">
                            <template #body="{ data }">
                                <span class="cell-primary">{{ data.reference }}</span>
                            </template>
                        </Column>
                        <Column field="customer" header="Customer">
                            <template #body="{ data }">
                                <div>
                                    <div>{{ data.customer }}</div>
                                    <div class="cell-sub">{{ data.email }}</div>
                                </div>
                            </template>
                        </Column>
                        <Column field="total" header="Total" style="width: 120px">
                            <template #body="{ data }">
                                <span class="numeric">{{ formatCurrencyPrecise(data.total) }}</span>
                            </template>
                        </Column>
                        <Column field="status" header="Status" style="width: 120px">
                            <template #body="{ data }">
                                <StatusTag :status="data.status" />
                            </template>
                        </Column>
                    </DataTable>
                </PagePanel>

                <div class="stack">
                    <PagePanel title="Traffic sources" description="Share of sessions this month.">
                        <Skeleton v-if="analyticsLoading" height="120px" />
                        <MeterGroup v-else :value="channelMeter" />
                    </PagePanel>

                    <PagePanel title="Activity">
                        <Skeleton v-if="activityLoading" height="200px" />
                        <Timeline v-else :value="recentActivity" data-key="id">
                            <template #marker="{ item }">
                                <span class="empty-state-icon" style="width: 26px; height: 26px; margin: 0; font-size: 11px; background: var(--p-surface-0)">
                                    <i :class="activityIcons[item.kind]" />
                                </span>
                            </template>
                            <template #content="{ item }">
                                <div style="font-size: 13px">
                                    <span class="cell-primary">{{ item.actor }}</span>
                                    {{ item.action }}
                                    <span class="cell-primary">{{ item.target }}</span>
                                </div>
                                <div class="cell-sub">{{ formatRelative(item.at) }}</div>
                            </template>
                        </Timeline>
                    </PagePanel>
                </div>
            </div>
        </div>
    </div>
</template>
