<script setup lang="ts">
import Button from 'openvue/button';
import Drawer from 'openvue/drawer';
import SelectButton from 'openvue/selectbutton';
import ToggleSwitch from 'openvue/toggleswitch';
import { usePrimeVue } from 'openvue/config';
import { useToast } from 'openvue/usetoast';
import { computed, ref } from 'vue';
import { resetDemoData } from '@/data/collections';
import { menuModeOptions, menuThemeOptions, presetOptions, primaryOptions, schemeOptions, surfaceOptions, usePreferences, type MenuMode, type MenuTheme, type PresetName, type PrimaryName, type Scheme, type SurfaceName } from '@/composables/usePreferences';
import { useTheme } from '@/composables/useTheme';
import { useLayout } from './useLayout';

const config = usePrimeVue();
const toast = useToast();
const { reset } = usePreferences();
const { configuratorOpen, setMenuMode, setMenuTheme, setBoxed } = useLayout();
const { preferences, restore, setScheme, setPreset, setPrimary, setSurface } = useTheme();

const swatch: Record<PrimaryName, string> = {
    indigo: '#6366f1',
    violet: '#8b5cf6',
    blue: '#3b82f6',
    emerald: '#10b981',
    amber: '#f59e0b',
    rose: '#f43f5e'
};

const surfaceSwatch: Record<SurfaceName, string> = {
    slate: '#64748b',
    gray: '#6b7280',
    zinc: '#71717a',
    neutral: '#737373',
    stone: '#78716c'
};

const scheme = computed({
    get: () => preferences.scheme,
    set: (value: Scheme | null) => value && setScheme(value)
});

const preset = computed({
    get: () => preferences.preset,
    set: (value: PresetName | null) => value && setPreset(value)
});

const menuMode = computed({
    get: () => preferences.menuMode,
    set: (value: MenuMode | null) => value && setMenuMode(value)
});

const menuTheme = computed({
    get: () => preferences.menuTheme,
    set: (value: MenuTheme | null) => value && setMenuTheme(value)
});

const boxed = computed({
    get: () => preferences.boxed,
    set: (value: boolean) => setBoxed(value)
});

const ripple = computed({
    get: () => preferences.ripple,
    set: (value: boolean) => {
        config.config.ripple = value;
        usePreferences().set('ripple', value);
    }
});

const swatchStyle = (color: string, active: boolean) => ({
    background: color,
    width: '28px',
    height: '28px',
    borderRadius: '4px',
    cursor: 'pointer',
    border: active ? '2px solid var(--p-text-color)' : '1px solid var(--p-content-border-color)'
});

const resetAll = async () => {
    reset();
    config.config.ripple = preferences.ripple;
    await restore();
};

const restoringData = ref(false);

const restoreDemoData = async () => {
    restoringData.value = true;

    try {
        await resetDemoData();
        toast.add({ severity: 'success', summary: 'Demo data restored', detail: 'Local edits have been discarded.', life: 3000 });
    } finally {
        restoringData.value = false;
    }
};
</script>

<template>
    <Drawer v-model:visible="configuratorOpen" position="right" header="Appearance" :style="{ width: '340px' }">
        <div class="stack">
            <div class="field">
                <label class="field-label">Colour scheme</label>
                <SelectButton v-model="scheme" :options="schemeOptions" option-label="label" option-value="value" :allow-empty="false" size="small" />
                <p class="field-hint">Dim is a softer dark, applied before the app mounts.</p>
            </div>

            <div class="field">
                <label class="field-label">Preset</label>
                <SelectButton v-model="preset" :options="presetOptions" option-label="label" option-value="value" :allow-empty="false" size="small" />
            </div>

            <div class="field">
                <label class="field-label">Primary</label>
                <div style="display: flex; flex-wrap: wrap; gap: 8px">
                    <button v-for="option in primaryOptions" :key="option.value" type="button" :title="option.label" :aria-label="option.label" :style="swatchStyle(swatch[option.value], preferences.primary === option.value)" @click="setPrimary(option.value)" />
                </div>
                <p class="field-hint">Unset means the preset's own accent.</p>
            </div>

            <div class="field">
                <label class="field-label">Surface</label>
                <div style="display: flex; flex-wrap: wrap; gap: 8px">
                    <button v-for="option in surfaceOptions" :key="option.value" type="button" :title="option.label" :aria-label="option.label" :style="swatchStyle(surfaceSwatch[option.value], preferences.surface === option.value)" @click="setSurface(option.value)" />
                </div>
            </div>

            <div class="field">
                <label class="field-label">Menu mode</label>
                <SelectButton v-model="menuMode" :options="menuModeOptions" option-label="label" option-value="value" :allow-empty="false" size="small" />
                <p class="field-hint">Applies on desktop; small screens always use overlay.</p>
            </div>

            <div class="field">
                <label class="field-label">Menu theme</label>
                <SelectButton v-model="menuTheme" :options="menuThemeOptions" option-label="label" option-value="value" :allow-empty="false" size="small" />
            </div>

            <div class="field">
                <div style="display: flex; align-items: center; gap: 10px">
                    <ToggleSwitch v-model="boxed" input-id="cfg-boxed" />
                    <label for="cfg-boxed" style="font-size: 13px">Boxed content width</label>
                </div>
                <div style="display: flex; align-items: center; gap: 10px; margin-top: 10px">
                    <ToggleSwitch v-model="ripple" input-id="cfg-ripple" />
                    <label for="cfg-ripple" style="font-size: 13px">Ripple effect</label>
                </div>
            </div>

            <div class="field">
                <label class="field-label">Demo data</label>
                <p class="field-hint">Products, orders and customers you edit are kept in this browser.</p>
                <Button label="Restore demo data" icon="pi pi-database" severity="secondary" outlined size="small" :loading="restoringData" @click="restoreDemoData" />
            </div>

            <Button label="Reset to defaults" icon="pi pi-refresh" severity="secondary" outlined size="small" @click="resetAll" />
        </div>
    </Drawer>
</template>
