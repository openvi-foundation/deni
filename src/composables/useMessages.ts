import { computed } from 'vue';
import { messageCollection } from '@/data/collections';

export function useMessages() {
    const { items: messages, loading, loaded, load, update } = messageCollection;

    const unreadCount = computed(() => messages.value.filter((message) => message.unread).length);

    const markRead = (id: string) => {
        const message = messageCollection.find(id);

        if (message?.unread) {
            update(id, { unread: false });
        }
    };

    const toggleStar = (id: string) => {
        const message = messageCollection.find(id);

        if (message) {
            update(id, { starred: !message.starred });
        }
    };

    return { messages, loading, loaded, unreadCount, load, markRead, toggleStar };
}
