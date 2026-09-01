import { computed, readonly, ref } from 'vue';
import { usePreferences, type MenuMode, type MenuTheme } from '@/composables/usePreferences';

const MOBILE_BREAKPOINT = 1024;

const collapsed = ref(false);
const overlayOpen = ref(false);
const configuratorOpen = ref(false);
const searchOpen = ref(false);

const viewport = ref(window.innerWidth);

window.addEventListener('resize', () => {
    viewport.value = window.innerWidth;
});

const isDesktop = computed(() => viewport.value > MOBILE_BREAKPOINT);

export function useLayout() {
    const { preferences, set } = usePreferences();

    const isSlim = computed(() => isDesktop.value && preferences.menuMode === 'slim');

    const containerClass = computed(() => ({
        [`layout-${preferences.menuMode}`]: true,
        'layout-boxed': preferences.boxed,
        'layout-collapsed': collapsed.value,
        'layout-overlay-open': overlayOpen.value
    }));

    const usesOverlay = () => !isDesktop.value || preferences.menuMode === 'overlay';

    const toggleSidebar = () => {
        if (usesOverlay()) {
            overlayOpen.value = !overlayOpen.value;
            return;
        }

        collapsed.value = !collapsed.value;
    };

    const closeOverlay = () => {
        overlayOpen.value = false;
    };

    const openConfigurator = () => {
        configuratorOpen.value = true;
    };

    const openSearch = () => {
        searchOpen.value = true;
    };

    const setMenuMode = (value: MenuMode) => {
        set('menuMode', value);
        overlayOpen.value = false;
        collapsed.value = false;
    };

    const setMenuTheme = (value: MenuTheme) => set('menuTheme', value);
    const setBoxed = (value: boolean) => set('boxed', value);

    return {
        preferences,
        isDesktop,
        isSlim,
        collapsed: readonly(collapsed),
        overlayOpen: readonly(overlayOpen),
        configuratorOpen,
        searchOpen,
        containerClass,
        toggleSidebar,
        closeOverlay,
        openConfigurator,
        openSearch,
        setMenuMode,
        setMenuTheme,
        setBoxed
    };
}
