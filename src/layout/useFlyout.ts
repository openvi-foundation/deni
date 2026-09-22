import { computed, nextTick, ref, watch, type Ref } from 'vue';

const EDGE_GAP = 8;

export function useFlyout(anchor: Ref<HTMLElement | null>, panel: Ref<HTMLElement | null>, enabled: Ref<boolean>) {
    const visible = ref(false);
    const top = ref(0);

    const style = computed(() => ({ top: `${top.value}px` }));

    const show = async () => {
        if (!enabled.value || !anchor.value) {
            return;
        }

        top.value = anchor.value.getBoundingClientRect().top;
        visible.value = true;

        await nextTick();

        const maxTop = window.innerHeight - (panel.value?.offsetHeight ?? 0) - EDGE_GAP;
        top.value = Math.max(EDGE_GAP, Math.min(top.value, maxTop));
    };

    const hide = () => {
        visible.value = false;
    };

    const toggle = () => (visible.value ? hide() : show());

    watch(enabled, hide);

    return { visible, style, show, hide, toggle };
}
