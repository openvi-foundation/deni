import { computed } from 'vue';
import { orderCollection } from '@/data/collections';

export function useOrders() {
    const { items: orders, loading, loaded, load } = orderCollection;

    const pendingCount = computed(() => orders.value.filter((order) => order.status === 'pending').length);
    const failedCount = computed(() => orders.value.filter((order) => order.status === 'failed').length);

    return { orders, loading, loaded, pendingCount, failedCount, load };
}
