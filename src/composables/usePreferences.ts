import { reactive, readonly } from 'vue';
import type { SelectOption } from '@/types';

const STORAGE_KEY = 'deni-preferences';

export type Scheme = 'light' | 'dim' | 'dark';
export type MenuMode = 'static' | 'overlay' | 'slim';
export type MenuTheme = 'light' | 'dark';
export type PresetName = 'aura' | 'lara' | 'material' | 'nora';

export const schemeOptions: SelectOption<Scheme>[] = [
    { label: 'Light', value: 'light' },
    { label: 'Dim', value: 'dim' },
    { label: 'Dark', value: 'dark' }
];

export const presetOptions: SelectOption<PresetName>[] = [
    { label: 'Aura', value: 'aura' },
    { label: 'Lara', value: 'lara' },
    { label: 'Material', value: 'material' },
    { label: 'Nora', value: 'nora' }
];

export const menuModeOptions: SelectOption<MenuMode>[] = [
    { label: 'Static', value: 'static' },
    { label: 'Overlay', value: 'overlay' },
    { label: 'Slim', value: 'slim' }
];

export const menuThemeOptions: SelectOption<MenuTheme>[] = [
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' }
];

export const primaryOptions = [
    { label: 'Indigo', value: 'indigo' },
    { label: 'Violet', value: 'violet' },
    { label: 'Blue', value: 'blue' },
    { label: 'Emerald', value: 'emerald' },
    { label: 'Amber', value: 'amber' },
    { label: 'Rose', value: 'rose' }
] as const;

export const surfaceOptions = [
    { label: 'Slate', value: 'slate' },
    { label: 'Gray', value: 'gray' },
    { label: 'Zinc', value: 'zinc' },
    { label: 'Neutral', value: 'neutral' },
    { label: 'Stone', value: 'stone' }
] as const;

export type PrimaryName = (typeof primaryOptions)[number]['value'];
export type SurfaceName = (typeof surfaceOptions)[number]['value'];

export interface Preferences {
    scheme: Scheme;
    preset: PresetName;
    primary: PrimaryName | null;
    surface: SurfaceName | null;
    menuMode: MenuMode;
    menuTheme: MenuTheme;
    boxed: boolean;
    ripple: boolean;
}

export const defaultPreferences: Preferences = {
    scheme: 'light',
    preset: 'aura',
    primary: null,
    surface: null,
    menuMode: 'static',
    menuTheme: 'light',
    boxed: true,
    ripple: true
};

function readStored(): Partial<Preferences> {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);

        return raw ? (JSON.parse(raw) as Partial<Preferences>) : {};
    } catch {
        return {};
    }
}

const state = reactive<Preferences>({ ...defaultPreferences, ...readStored() });

function persist() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
        return;
    }
}

export function usePreferences() {
    const set = <K extends keyof Preferences>(key: K, value: Preferences[K]) => {
        state[key] = value;
        persist();
    };

    const reset = () => {
        Object.assign(state, defaultPreferences);
        persist();
    };

    return { preferences: readonly(state), set, reset };
}
