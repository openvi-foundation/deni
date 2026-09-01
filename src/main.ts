import { createApp } from 'vue';

import OpenVue from 'openvue/config';
import ConfirmationService from 'openvue/confirmationservice';
import DialogService from 'openvue/dialogservice';
import ToastService from 'openvue/toastservice';

import AnimateOnScroll from 'openvue/animateonscroll';
import BadgeDirective from 'openvue/badgedirective';
import FocusTrap from 'openvue/focustrap';
import KeyFilter from 'openvue/keyfilter';
import Ripple from 'openvue/ripple';
import StyleClass from 'openvue/styleclass';
import Tooltip from 'openvue/tooltip';

import '@openvue/openicons/openicons.css';
import '@openvue/openicons/openicons-compat.css';
import './assets/styles/main.scss';

import Aura from '@openvue/themes/aura';

import App from './App.vue';
import { router } from './router';
import { usePreferences } from './composables/usePreferences';
import { useTheme } from './composables/useTheme';

const { preferences } = usePreferences();

const app = createApp(App);

app.use(router);
app.use(OpenVue, {
    ripple: preferences.ripple,
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.app-dark',
            cssLayer: false
        }
    }
});

app.use(ToastService);
app.use(ConfirmationService);
app.use(DialogService);

app.directive('animateonscroll', AnimateOnScroll);
app.directive('badge', BadgeDirective);
app.directive('focustrap', FocusTrap);
app.directive('keyfilter', KeyFilter);
app.directive('ripple', Ripple);
app.directive('styleclass', StyleClass);
app.directive('tooltip', Tooltip);

useTheme()
    .restore()
    .finally(() => app.mount('#app'));
