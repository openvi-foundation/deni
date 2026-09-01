import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import type { Collection } from '@/data/collection';

export function useEntity<T>(collection: Collection<T>, idOf: (item: T) => string) {
    const route = useRoute();

    onMounted(collection.load);

    const id = computed(() => String(route.params.id ?? ''));
    const entity = computed(() => collection.items.value.find((item) => idOf(item) === id.value));
    const notFound = computed(() => !collection.loading.value && collection.loaded.value && !entity.value);

    const index = computed(() => collection.items.value.findIndex((item) => idOf(item) === id.value));

    const previousId = computed(() => {
        const position = index.value;

        return position > 0 ? idOf(collection.items.value[position - 1]) : null;
    });

    const nextId = computed(() => {
        const position = index.value;

        return position >= 0 && position < collection.items.value.length - 1 ? idOf(collection.items.value[position + 1]) : null;
    });

    const position = computed(() => (index.value >= 0 ? `${index.value + 1} of ${collection.items.value.length}` : ''));

    return { id, entity, loading: collection.loading, notFound, previousId, nextId, position };
}
