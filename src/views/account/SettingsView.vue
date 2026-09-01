<script setup lang="ts">
import Accordion from 'openvue/accordion';
import AccordionContent from 'openvue/accordioncontent';
import AccordionHeader from 'openvue/accordionheader';
import AccordionPanel from 'openvue/accordionpanel';
import Button from 'openvue/button';
import Fieldset from 'openvue/fieldset';
import InputText from 'openvue/inputtext';
import Message from 'openvue/message';
import Select from 'openvue/select';
import SelectButton from 'openvue/selectbutton';
import ToggleSwitch from 'openvue/toggleswitch';
import { useConfirm } from 'openvue/useconfirm';
import { useToast } from 'openvue/usetoast';
import { reactive } from 'vue';
import PageHeader from '@/components/PageHeader.vue';
import PagePanel from '@/components/PagePanel.vue';
import { presetOptions } from '@/composables/usePreferences';
import { useTheme } from '@/composables/useTheme';

const toast = useToast();
const confirm = useConfirm();
const { preferences, isDark, toggleDark, setPreset } = useTheme();

const workspace = reactive({
    name: 'Acme GmbH',
    slug: 'acme',
    locale: 'English (US)',
    currency: 'USD',
    weekStart: 'Monday'
});

const notifications = reactive({
    orderFailures: true,
    lowStock: true,
    weeklyDigest: false,
    productUpdates: true
});

const locales = ['English (US)', 'English (UK)', 'Deutsch', 'Français', 'Español'];
const currencies = ['USD', 'EUR', 'GBP', 'JPY'];
const weekStarts = [
    { label: 'Monday', value: 'Monday' },
    { label: 'Sunday', value: 'Sunday' }
];

const notificationRows = [
    { key: 'orderFailures', label: 'Failed orders', hint: 'Notify me when a checkout fails or a payment is declined.' },
    { key: 'lowStock', label: 'Low stock', hint: 'Notify me when a product drops below 25 units.' },
    { key: 'weeklyDigest', label: 'Weekly digest', hint: 'A Monday summary of revenue, orders and new customers.' },
    { key: 'productUpdates', label: 'Product updates', hint: 'Occasional emails about new OpenVue releases.' }
] as const;

const save = () => {
    toast.add({ severity: 'success', summary: 'Settings saved', life: 3000 });
};

const deleteWorkspace = () => {
    confirm.require({
        header: 'Delete workspace',
        message: 'Every product, order and customer record in this workspace will be permanently removed.',
        icon: 'pi pi-exclamation-triangle',
        rejectProps: { label: 'Cancel', severity: 'secondary', outlined: true },
        acceptProps: { label: 'Delete workspace', severity: 'danger' },
        accept: () => toast.add({ severity: 'info', summary: 'Demo only', detail: 'Nothing was deleted.', life: 3000 })
    });
};
</script>

<template>
    <div>
        <PageHeader title="Application settings" description="Workspace defaults, appearance and notification preferences.">
            <template #actions>
                <Button label="Save changes" size="small" @click="save" />
            </template>
        </PageHeader>

        <div class="stack" style="max-width: 860px">
            <PagePanel title="Workspace" description="Identity and regional defaults for everyone in this workspace.">
                <div class="form-grid">
                    <div class="field">
                        <label class="field-label" for="ws-name">Workspace name</label>
                        <InputText id="ws-name" v-model="workspace.name" fluid />
                    </div>
                    <div class="field">
                        <label class="field-label" for="ws-slug">URL slug</label>
                        <InputText id="ws-slug" v-model="workspace.slug" fluid />
                        <p class="field-hint">deni.app/{{ workspace.slug }}</p>
                    </div>
                    <div class="field">
                        <label class="field-label">Language</label>
                        <Select v-model="workspace.locale" :options="locales" fluid />
                    </div>
                    <div class="field">
                        <label class="field-label">Currency</label>
                        <Select v-model="workspace.currency" :options="currencies" fluid />
                    </div>
                    <div class="field">
                        <label class="field-label">Week starts on</label>
                        <SelectButton v-model="workspace.weekStart" :options="weekStarts" option-label="label" option-value="value" :allow-empty="false" size="small" />
                    </div>
                </div>
            </PagePanel>

            <PagePanel title="Appearance" description="Applies to your account on this device only.">
                <div class="form-grid">
                    <div class="field">
                        <label class="field-label">Colour scheme</label>
                        <div style="display: flex; align-items: center; gap: 10px">
                            <ToggleSwitch :model-value="isDark" input-id="set-dark" @update:model-value="toggleDark" />
                            <label for="set-dark" style="font-size: 13px">Dark mode</label>
                        </div>
                    </div>

                    <div class="field">
                        <label class="field-label">Theme preset</label>
                        <Select :model-value="preferences.preset" :options="presetOptions" option-label="label" option-value="value" fluid @update:model-value="setPreset" />
                        <p class="field-hint">Swaps the underlying OpenVue design tokens.</p>
                    </div>
                </div>
            </PagePanel>

            <PagePanel title="Notifications" description="Choose what lands in your inbox." flush>
                <div class="panel-body" style="display: flex; flex-direction: column; gap: 4px">
                    <div v-for="row in notificationRows" :key="row.key" style="display: flex; align-items: flex-start; gap: 12px; padding: 10px 0">
                        <ToggleSwitch v-model="notifications[row.key]" :input-id="`notify-${row.key}`" />
                        <label :for="`notify-${row.key}`">
                            <span style="display: block; font-size: 13px; font-weight: 600">{{ row.label }}</span>
                            <span class="field-hint">{{ row.hint }}</span>
                        </label>
                    </div>
                </div>
            </PagePanel>

            <PagePanel title="Advanced" flush>
                <div class="panel-body">
                    <Accordion value="0">
                        <AccordionPanel value="0">
                            <AccordionHeader>Data retention</AccordionHeader>
                            <AccordionContent>
                                <p style="font-size: 13.5px; line-height: 1.6">Order and customer records are kept for 24 months after the last activity, then anonymised. Exports are available at any time from the Orders page.</p>
                            </AccordionContent>
                        </AccordionPanel>
                        <AccordionPanel value="1">
                            <AccordionHeader>API access</AccordionHeader>
                            <AccordionContent>
                                <p style="font-size: 13.5px; line-height: 1.6">Generate a personal access token to use the workspace API. Tokens inherit your own permissions.</p>
                                <Button label="Generate token" icon="pi pi-key" severity="secondary" outlined size="small" style="margin-top: 12px" />
                            </AccordionContent>
                        </AccordionPanel>
                    </Accordion>
                </div>
            </PagePanel>

            <Fieldset legend="Danger zone">
                <Message severity="warn" variant="simple" style="margin-bottom: 12px">Deleting a workspace cannot be undone.</Message>
                <Button label="Delete workspace" icon="pi pi-trash" severity="danger" outlined size="small" @click="deleteWorkspace" />
            </Fieldset>
        </div>
    </div>
</template>
