import { updatePreset, updatePrimaryPalette, updateSurfacePalette, usePreset } from '@openvue/themes';
import { computed } from 'vue';
import { usePreferences, type PresetName, type PrimaryName, type Scheme, type SurfaceName } from './usePreferences';

const presetLoaders: Record<PresetName, () => Promise<{ default: Record<string, unknown> }>> = {
    aura: () => import('@openvue/themes/aura'),
    lara: () => import('@openvue/themes/lara'),
    material: () => import('@openvue/themes/material'),
    nora: () => import('@openvue/themes/nora'),
    nide: () => import('@openvue/themes/nide')
};

const presetSurface: Partial<Record<PresetName, { light: SurfaceName; dark: SurfaceName }>> = {
    nide: { light: 'neutral', dark: 'neutral' }
};

const DEFAULT_SURFACE = { light: 'slate', dark: 'zinc' } as const satisfies { light: SurfaceName; dark: SurfaceName };

const nideAccentScheme = {
    light: { primary: { color: '{primary.600}', contrastColor: '#ffffff', hoverColor: '{primary.700}', activeColor: '{primary.800}' } },
    dark: { primary: { color: '{primary.400}', contrastColor: '{surface.950}', hoverColor: '{primary.300}', activeColor: '{primary.200}' } }
};

const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

function paletteRef(color: string, shift = 0): Record<string, string> {
    const map: Record<string, string> = { 0: '#ffffff' };

    STEPS.forEach((step, index) => {
        map[step] = `{${color}.${STEPS[Math.max(0, index - shift)]}}`;
    });

    return map;
}

const DIM_SHIFT = 1;

export function useTheme() {
    const { preferences, set } = usePreferences();

    const applySchemeClasses = (scheme: Scheme) => {
        const root = document.documentElement;

        root.classList.toggle('app-dark', scheme !== 'light');
        root.classList.toggle('app-dim', scheme === 'dim');
    };

    const applySurface = () => {
        const fallback = presetSurface[preferences.preset] ?? DEFAULT_SURFACE;
        const light = preferences.surface ?? fallback.light;
        const dark = preferences.surface ?? fallback.dark;

        if (preferences.scheme === 'dim') {
            updateSurfacePalette({ light: paletteRef(light), dark: paletteRef(dark, DIM_SHIFT) });
            return;
        }

        if (preferences.surface) {
            updateSurfacePalette({ light: paletteRef(light), dark: paletteRef(dark) });
        }
    };

    const applyPrimary = () => {
        if (!preferences.primary) {
            return;
        }

        updatePrimaryPalette(paletteRef(preferences.primary));

        if (preferences.preset === 'nide') {
            updatePreset({ semantic: { colorScheme: nideAccentScheme } });
        }
    };

    const applyPreset = async (value: PresetName) => {
        const loaded = await presetLoaders[value]();

        usePreset(loaded.default);
        applyPrimary();
        applySurface();
    };

    const restore = async () => {
        applySchemeClasses(preferences.scheme);
        await applyPreset(preferences.preset);
    };

    const setScheme = async (value: Scheme) => {
        set('scheme', value);
        applySchemeClasses(value);
        await applyPreset(preferences.preset);
    };

    const toggleDark = () => setScheme(preferences.scheme === 'light' ? 'dark' : 'light');

    const setPreset = async (value: PresetName) => {
        set('preset', value);
        await applyPreset(value);
    };

    const setPrimary = async (value: PrimaryName | null) => {
        set('primary', value);

        if (value) {
            applyPrimary();
            return;
        }

        await applyPreset(preferences.preset);
    };

    const setSurface = async (value: SurfaceName | null) => {
        set('surface', value);

        if (value) {
            applySurface();
            return;
        }

        await applyPreset(preferences.preset);
    };

    const isDark = computed(() => preferences.scheme !== 'light');
    const themeIcon = computed(() => (isDark.value ? 'pi pi-sun' : 'pi pi-moon'));

    return {
        preferences,
        isDark,
        themeIcon,
        restore,
        setScheme,
        toggleDark,
        setPreset,
        setPrimary,
        setSurface
    };
}
