import { onMounted, readonly, ref, shallowRef } from 'vue';

export function useAsyncData<T>(loader: () => Promise<T>, initial: T) {
    const data = shallowRef<T>(initial);
    const loading = ref(true);
    const error = ref<string | null>(null);

    const load = async () => {
        loading.value = true;
        error.value = null;

        try {
            data.value = await loader();
        } catch (cause) {
            error.value = cause instanceof Error ? cause.message : 'Something went wrong while loading data.';
        } finally {
            loading.value = false;
        }
    };

    onMounted(load);

    return { data, loading: readonly(loading), error: readonly(error), reload: load };
}
