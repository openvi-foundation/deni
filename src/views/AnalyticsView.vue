<script setup lang="ts">
import Chart from 'openvue/chart';
import Skeleton from 'openvue/skeleton';
import { computed } from 'vue';
import PageHeader from '@/components/PageHeader.vue';
import PagePanel from '@/components/PagePanel.vue';
import { useAsyncData } from '@/composables/useAsyncData';
import { baseChartOptions, useChartTheme } from '@/composables/useChartTheme';
import { getAnalytics, type Analytics } from '@/service';

const empty: Analytics = { revenue: [], orders: [], channels: [], categories: [], retention: [], satisfaction: [] };

const { data, loading } = useAsyncData(getAnalytics, empty);
const { theme } = useChartTheme();

const options = computed(() => baseChartOptions(theme.value));

const noScales = computed(() => ({
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
        legend: { labels: { color: theme.value.muted, usePointStyle: true, pointStyle: 'circle', boxWidth: 6, boxHeight: 6, padding: 16, font: { size: 12 } } }
    }
}));

const radarOptions = computed(() => ({
    maintainAspectRatio: false,
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
        r: {
            grid: { color: theme.value.border },
            angleLines: { color: theme.value.border },
            pointLabels: { color: theme.value.muted, font: { size: 11 } },
            ticks: { display: false }
        }
    }
}));

const categoriesChart = computed(() => ({
    labels: data.value.categories.map((point) => point.label),
    datasets: [{ label: 'Units sold', data: data.value.categories.map((point) => point.value), backgroundColor: theme.value.series[0], borderRadius: 3, barThickness: 18 }]
}));

const channelsChart = computed(() => ({
    labels: data.value.channels.map((point) => point.label),
    datasets: [{ data: data.value.channels.map((point) => point.value), backgroundColor: theme.value.series, borderWidth: 0 }]
}));

const retentionChart = computed(() => ({
    labels: data.value.retention.map((point) => point.label),
    datasets: [
        {
            label: 'Retained',
            data: data.value.retention.map((point) => point.value),
            borderColor: theme.value.series[3],
            backgroundColor: 'transparent',
            borderWidth: 2,
            tension: 0.3,
            pointRadius: 0,
            pointHoverRadius: 4
        }
    ]
}));

const satisfactionChart = computed(() => ({
    labels: data.value.satisfaction.map((point) => point.label),
    datasets: [{ label: 'Score', data: data.value.satisfaction.map((point) => point.value), borderColor: theme.value.primary, backgroundColor: 'transparent', borderWidth: 2, pointBackgroundColor: theme.value.primary }]
}));

const revenueChart = computed(() => ({
    labels: data.value.revenue.map((point) => point.label),
    datasets: [
        { label: 'Revenue', type: 'line' as const, data: data.value.revenue.map((point) => point.value), borderColor: theme.value.primary, borderWidth: 2, tension: 0.35, pointRadius: 0, yAxisID: 'y' },
        { label: 'Orders', type: 'bar' as const, data: data.value.orders.map((point) => point.value * 60), backgroundColor: theme.value.series[1], borderRadius: 3, barThickness: 20, yAxisID: 'y' }
    ]
}));
</script>

<template>
    <div>
        <PageHeader title="Analytics" description="Revenue, acquisition and retention across the last six months." />

        <div class="stack">
            <PagePanel title="Revenue and volume" description="Line shows revenue; bars show order volume, scaled for comparison.">
                <Skeleton v-if="loading" height="280px" />
                <Chart v-else type="bar" :data="revenueChart" :options="options" style="height: 280px" />
            </PagePanel>

            <div class="grid grid-halves">
                <PagePanel title="Units by category">
                    <Skeleton v-if="loading" height="240px" />
                    <Chart v-else type="bar" :data="categoriesChart" :options="options" class="chart-box" />
                </PagePanel>

                <PagePanel title="Acquisition channels">
                    <Skeleton v-if="loading" height="240px" />
                    <Chart v-else type="doughnut" :data="channelsChart" :options="noScales" class="chart-box" />
                </PagePanel>

                <PagePanel title="Weekly retention">
                    <Skeleton v-if="loading" height="240px" />
                    <Chart v-else type="line" :data="retentionChart" :options="options" class="chart-box" />
                </PagePanel>

                <PagePanel title="Satisfaction">
                    <Skeleton v-if="loading" height="240px" />
                    <Chart v-else type="radar" :data="satisfactionChart" :options="radarOptions" class="chart-box" />
                </PagePanel>
            </div>
        </div>
    </div>
</template>
