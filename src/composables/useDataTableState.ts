import { FilterMatchMode } from '@openvue/core/api';
import { computed, ref } from 'vue';

interface DataTableFilter {
    value: unknown;
    matchMode: string;
}

export function useDataTableState<T>(rows: () => T[], globalFields: string[]) {
    const filters = ref<Record<string, DataTableFilter>>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });

    const selection = ref<T[]>([]);

    const search = computed({
        get: () => (filters.value.global?.value as string | null) ?? '',
        set: (value: string) => {
            filters.value.global = { value: value || null, matchMode: FilterMatchMode.CONTAINS };
        }
    });

    const total = computed(() => rows().length);
    const selectedCount = computed(() => selection.value.length);
    const hasSelection = computed(() => selectedCount.value > 0);

    const clearSelection = () => {
        selection.value = [];
    };

    const resetFilters = () => {
        filters.value = { global: { value: null, matchMode: FilterMatchMode.CONTAINS } };
    };

    return { filters, selection, search, total, selectedCount, hasSelection, globalFields, clearSelection, resetFilters };
}
