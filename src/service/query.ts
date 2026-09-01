import { LATENCY } from './http';

export interface QueryParams {
    first?: number;
    rows?: number;
    sortField?: string | null;
    sortOrder?: number | null;
    search?: string | null;
    searchFields?: string[];
    match?: Record<string, unknown>;
}

export interface QueryResult<T> {
    rows: T[];
    total: number;
}

type Row = Record<string, unknown>;

const read = (item: unknown, field: string): unknown => (item as Row)?.[field];

const text = (value: unknown) => (value == null ? '' : String(value).toLowerCase());

function compare(a: unknown, b: unknown): number {
    if (a == null && b == null) return 0;
    if (a == null) return -1;
    if (b == null) return 1;

    if (typeof a === 'number' && typeof b === 'number') {
        return a - b;
    }

    return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
}

function runQuery<T>(source: T[], params: QueryParams): QueryResult<T> {
    const { first = 0, rows, sortField, sortOrder, search, searchFields = [], match = {} } = params;

    let result = source;

    const matched = Object.entries(match).filter(([, value]) => value != null && value !== '' && value !== 'all');

    if (matched.length) {
        result = result.filter((item) =>
            matched.every(([field, value]) => {
                const current = read(item, field);

                return Array.isArray(value) ? (value as unknown[]).includes(current) : current === value;
            })
        );
    }

    const term = search?.trim().toLowerCase();

    if (term && searchFields.length) {
        result = result.filter((item) => searchFields.some((field) => text(read(item, field)).includes(term)));
    }

    if (sortField && sortOrder) {
        result = [...result].sort((a, b) => compare(read(a, sortField), read(b, sortField)) * sortOrder);
    }

    const total = result.length;
    const page = typeof rows === 'number' ? result.slice(first, first + rows) : result;

    return { rows: page, total };
}

export function queryCollection<T>(source: T[], params: QueryParams): Promise<QueryResult<T>> {
    const result = runQuery(source, params);

    return new Promise((resolve) => setTimeout(() => resolve(result), LATENCY));
}
