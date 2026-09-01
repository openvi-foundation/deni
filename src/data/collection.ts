import { ref, type Ref } from 'vue';

export type JournalAction = 'created' | 'updated' | 'deleted';

export interface JournalEntry {
    id: string;
    entityId: string;
    action: JournalAction;
    label: string;
    at: string;
}

export interface CollectionOptions<T> {
    key: string;
    loader: () => Promise<T[]>;
    idOf: (item: T) => string;
    labelOf?: (item: T) => string;
    track?: boolean;
}

export interface Collection<T> {
    key: string;
    items: Ref<T[]>;
    journal: Ref<JournalEntry[]>;
    loading: Ref<boolean>;
    loaded: Ref<boolean>;
    error: Ref<string | null>;
    load: () => Promise<void>;
    find: (id: string) => T | undefined;
    historyFor: (id: string) => JournalEntry[];
    create: (item: T) => T;
    update: (id: string, patch: Partial<T>) => T | undefined;
    remove: (id: string) => void;
    removeMany: (ids: string[]) => void;
    reset: () => Promise<void>;
    flush: () => void;
}

const SCHEMA_VERSION = 2;

interface Envelope<T> {
    version: number;
    rows: T;
}

function readJson<T>(key: string): T | null {
    try {
        const raw = localStorage.getItem(key);

        if (!raw) {
            return null;
        }

        const envelope = JSON.parse(raw) as Envelope<T>;

        return envelope?.version === SCHEMA_VERSION ? envelope.rows : null;
    } catch {
        return null;
    }
}

function writeJson<T>(key: string, rows: T) {
    try {
        localStorage.setItem(key, JSON.stringify({ version: SCHEMA_VERSION, rows } satisfies Envelope<T>));
    } catch {
        return;
    }
}

function dropJson(key: string) {
    try {
        localStorage.removeItem(key);
    } catch {
        return;
    }
}

export function createCollection<T>(options: CollectionOptions<T>): Collection<T> {
    const dataKey = `deni-data-${options.key}`;
    const journalKey = `deni-journal-${options.key}`;

    const items = ref([]) as Ref<T[]>;
    const journal = ref<JournalEntry[]>([]);
    const loading = ref(false);
    const loaded = ref(false);
    const error = ref<string | null>(null);

    const label = (item: T) => (options.labelOf ? options.labelOf(item) : options.idOf(item));

    const record = (entityId: string, action: JournalAction, text: string) => {
        if (options.track === false) {
            return;
        }

        journal.value =[{ id: `log-${Date.now()}-${journal.value.length}`, entityId, action, label: text, at: new Date().toISOString() }, ...journal.value];
        writeJson(journalKey, journal.value);
    };

    let pending: ReturnType<typeof setTimeout> | undefined;

    const persist = () => {
        clearTimeout(pending);
        pending = setTimeout(() => {
            pending = undefined;
            writeJson(dataKey, items.value);
        }, 250);
    };

    const flush = () => {
        if (pending) {
            clearTimeout(pending);
            pending = undefined;
            writeJson(dataKey, items.value);
        }
    };

    const discardPending = () => {
        clearTimeout(pending);
        pending = undefined;
    };

    window.addEventListener('pagehide', flush);

    const seed = async () => {
        loading.value = true;
        error.value = null;

        try {
            const stored = readJson<T[]>(dataKey);

            items.value = stored ?? (await options.loader());
            journal.value = readJson<JournalEntry[]>(journalKey) ?? [];
            loaded.value = true;
        } catch (cause) {
            error.value = cause instanceof Error ? cause.message : 'Something went wrong while loading data.';
        } finally {
            loading.value = false;
        }
    };

    const load = async () => {
        if (loaded.value || loading.value) {
            return;
        }

        await seed();
    };

    const find = (id: string) => items.value.find((item) => options.idOf(item) === id);

    const historyFor = (id: string) => journal.value.filter((entry) => entry.entityId === id);

    const create = (item: T) => {
        items.value = [item, ...items.value];
        persist();
        record(options.idOf(item), 'created', label(item));

        return item;
    };

    const update = (id: string, patch: Partial<T>) => {
        let updated: T | undefined;

        items.value = items.value.map((item) => {
            if (options.idOf(item) !== id) {
                return item;
            }

            updated = { ...item, ...patch };

            return updated;
        });

        if (updated) {
            persist();
            record(id, 'updated', label(updated));
        }

        return updated;
    };

    const remove = (id: string) => {
        const target = find(id);

        items.value = items.value.filter((item) => options.idOf(item) !== id);
        persist();

        if (target) {
            record(id, 'deleted', label(target));
        }
    };

    const removeMany = (ids: string[]) => {
        const set = new Set(ids);
        const targets = items.value.filter((item) => set.has(options.idOf(item)));

        items.value = items.value.filter((item) => !set.has(options.idOf(item)));
        persist();
        targets.forEach((item) => record(options.idOf(item), 'deleted', label(item)));
    };

    const reset = async () => {
        discardPending();
        dropJson(dataKey);
        dropJson(journalKey);
        loaded.value = false;
        items.value = [];
        journal.value = [];

        await seed();
    };

    return { key: options.key, items, journal, loading, loaded, error, load, find, historyFor, create, update, remove, removeMany, reset, flush };
}
