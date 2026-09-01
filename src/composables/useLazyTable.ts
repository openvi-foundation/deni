import { computed, ref, watch, type Ref } from 'vue';
import type { QueryParams, QueryResult } from '@/service/query';

export interface LazyTableEvent {
    first?: number;
    rows?: number;
    sortField?: string | ((item: unknown) => string) | null;
    sortOrder?: number | null;
}

export interface LazyTableOptions<T> {
    fetcher: (params: QueryParams) => Promise<QueryResult<T>>;
    rows?: number;
    sortField?: string | null;
    sortOrder?: number | null;
    searchFields?: string[];
    debounce?: number;
}

export function useLazyTable<T>(options: LazyTableOptions<T>) {
    const items = ref([]) as Ref<T[]>;
    const totalRecords = ref(0);
    const loading = ref(false);

    const first = ref(0);
    const rows = ref(options.rows ?? 10);
    const sortField = ref<string | undefined>(options.sortField ?? undefined);
    const sortOrder = ref<number | undefined>(options.sortOrder ?? undefined);
    const search = ref('');
    const match = ref<Record<string, unknown>>({});

    let token = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const params = computed<QueryParams>(() => ({
        first: first.value,
        rows: rows.value,
        sortField: sortField.value,
        sortOrder: sortOrder.value,
        search: search.value,
        searchFields: options.searchFields ?? [],
        match: match.value
    }));

    const fetchPage = async () => {
        const current = ++token;

        loading.value = true;

        try {
            const result = await options.fetcher(params.value);

            if (current !== token) {
                return;
            }

            items.value = result.rows;
            totalRecords.value = result.total;
        } finally {
            if (current === token) {
                loading.value = false;
            }
        }
    };

    const reload = () => fetchPage();

    const onPage = (event: LazyTableEvent) => {
        first.value = event.first ?? 0;
        rows.value = event.rows ?? rows.value;
        void fetchPage();
    };

    const onSort = (event: LazyTableEvent) => {
        sortField.value = typeof event.sortField === 'string' ? event.sortField : undefined;
        sortOrder.value = event.sortOrder ?? undefined;
        first.value = 0;
        void fetchPage();
    };

    const setFilter = (field: string, value: unknown) => {
        match.value = { ...match.value, [field]: value };
        first.value = 0;
        void fetchPage();
    };

    const clearFilters = () => {
        match.value = {};
        search.value = '';
        first.value = 0;
        void fetchPage();
    };

    watch(search, () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            first.value = 0;
            void fetchPage();
        }, options.debounce ?? 300);
    });

    const rangeStart = computed(() => (totalRecords.value ? first.value + 1 : 0));
    const rangeEnd = computed(() => Math.min(first.value + rows.value, totalRecords.value));

    return { items, totalRecords, loading, first, rows, sortField, sortOrder, search, match, params, rangeStart, rangeEnd, onPage, onSort, setFilter, clearFilters, reload };
}
