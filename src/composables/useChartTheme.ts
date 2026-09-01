import { onBeforeUnmount, onMounted, ref } from 'vue';

export interface ChartTheme {
    text: string;
    muted: string;
    border: string;
    primary: string;
    series: string[];
}

const readToken = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

const readTheme = (): ChartTheme => ({
    text: readToken('--p-text-color'),
    muted: readToken('--p-text-muted-color'),
    border: readToken('--p-content-border-color'),
    primary: readToken('--p-primary-color'),
    series: [readToken('--p-primary-500'), readToken('--p-cyan-500'), readToken('--p-amber-500'), readToken('--p-emerald-500'), readToken('--p-rose-500'), readToken('--p-violet-500')]
});

export function useChartTheme() {
    const theme = ref<ChartTheme>(readTheme());
    let observer: MutationObserver | null = null;

    const refresh = () => {
        theme.value = readTheme();
    };

    onMounted(() => {
        refresh();
        observer = new MutationObserver(refresh);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style'] });
    });

    onBeforeUnmount(() => {
        observer?.disconnect();
        observer = null;
    });

    return { theme, refresh };
}

export function baseChartOptions(theme: ChartTheme) {
    return {
        maintainAspectRatio: false,
        responsive: true,
        interaction: { mode: 'index' as const, intersect: false },
        plugins: {
            legend: {
                labels: { color: theme.muted, usePointStyle: true, pointStyle: 'circle', boxWidth: 6, boxHeight: 6, padding: 16, font: { size: 12 } }
            },
            tooltip: {
                backgroundColor: theme.text,
                padding: 10,
                cornerRadius: 4,
                displayColors: false,
                titleFont: { size: 12 },
                bodyFont: { size: 12 }
            }
        },
        scales: {
            x: {
                grid: { display: false },
                border: { color: theme.border },
                ticks: { color: theme.muted, font: { size: 11 } }
            },
            y: {
                grid: { color: theme.border, drawTicks: false },
                border: { display: false },
                ticks: { color: theme.muted, font: { size: 11 }, padding: 8 }
            }
        }
    };
}
