# Changelog

Deni is a template: you copy it, then you own it. Updates are not installed. Each entry lists the files a release touches so you can port the parts you want into your copy. Releases are tagged (`v1.1.0`, …), so `git diff v1.0.0 v1.1.0 -- <file>` shows the exact change.

## [1.1.0] - 2026-11-02

Requires OpenVue 1.1.0.

### Added

- The Nide preset, listed first in the appearance drawer's preset picker. Aura is still the default.
  - `src/composables/usePreferences.ts`: `'nide'` in `PresetName` and `presetOptions`.
  - `src/composables/useTheme.ts`: a loader for `@openvue/themes/nide`. Nide's default surface is `neutral` (this also applies in the Dim scheme), and accents are drawn at 600 in light and 400 in dark instead of Nide's 900 and 200.
- A *Preset default* swatch at the start of the Primary and Surface rows. It clears the override and reapplies the preset. `setPrimary` and `setSurface` now accept `null`.
  - `src/layout/AppConfigurator.vue`, `src/composables/useTheme.ts`
- On a first visit, the colour scheme follows the OS light or dark setting. Before, the inline script in `index.html` applied dark and then the app reset to light.
  - `src/composables/usePreferences.ts`

### Changed

- OpenVue packages (`openvue`, `@openvue/core`, `@openvue/forms`, `@openvue/themes`) updated to 1.1.0, `@openvue/openicons` to ^1.1.0, plus minor and patch updates to Vue, Vite, chart.js, zod, sass, vue-tsc and `@vitejs/plugin-vue`.
  - `package.json`, `package-lock.json`, `template.json`
- The first chart series uses `--p-primary-color` instead of `--p-primary-500`, so it stays on-brand for presets whose primary is not step 500 (Nide's 500 is a mid grey).
  - `src/composables/useChartTheme.ts`
- The preset picker stretches to the drawer's width and uses tighter padding so five presets fit.
  - `src/assets/styles/_page.scss`

## [1.0.0] - 2026-09-01

First release.
