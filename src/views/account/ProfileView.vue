<script setup lang="ts">
import Avatar from 'openvue/avatar';
import Button from 'openvue/button';
import Divider from 'openvue/divider';
import FileUpload from 'openvue/fileupload';
import InputText from 'openvue/inputtext';
import Select from 'openvue/select';
import Tab from 'openvue/tab';
import TabList from 'openvue/tablist';
import TabPanel from 'openvue/tabpanel';
import TabPanels from 'openvue/tabpanels';
import Tabs from 'openvue/tabs';
import Textarea from 'openvue/textarea';
import ToggleSwitch from 'openvue/toggleswitch';
import { useToast } from 'openvue/usetoast';
import { reactive } from 'vue';
import PageHeader from '@/components/PageHeader.vue';
import PagePanel from '@/components/PagePanel.vue';

const toast = useToast();

const profile = reactive({
    name: 'Nikola Jevric',
    email: 'njevric9@gmail.com',
    title: 'Product engineer',
    location: 'Berlin, Germany',
    timezone: 'Europe/Berlin',
    bio: 'Building and maintaining the OpenVue component library.'
});

const security = reactive({
    twoFactor: true,
    sessionAlerts: true,
    passwordless: false
});

const timezones = ['Europe/Berlin', 'Europe/Belgrade', 'Europe/London', 'America/New_York', 'Asia/Tokyo'];

const sessions = [
    { id: 's1', device: 'MacBook Pro · Chrome', location: 'Berlin, DE', last: 'Active now', current: true },
    { id: 's2', device: 'iPhone 15 · Safari', location: 'Berlin, DE', last: '2 hours ago', current: false },
    { id: 's3', device: 'Windows · Firefox', location: 'Belgrade, RS', last: '4 days ago', current: false }
];

const save = () => {
    toast.add({ severity: 'success', summary: 'Profile updated', life: 3000 });
};
</script>

<template>
    <div>
        <PageHeader title="Profile" description="Your personal details and sign-in security.">
            <template #actions>
                <Button label="Save changes" size="small" @click="save" />
            </template>
        </PageHeader>

        <PagePanel flush>
            <Tabs value="general">
                <TabList>
                    <Tab value="general">General</Tab>
                    <Tab value="security">Security</Tab>
                    <Tab value="sessions">Sessions</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel value="general">
                        <div style="display: flex; align-items: center; gap: 16px">
                            <Avatar label="NJ" shape="circle" size="xlarge" />
                            <div>
                                <p style="font-size: 14px; font-weight: 600">{{ profile.name }}</p>
                                <p class="cell-sub">{{ profile.title }}</p>
                                <FileUpload mode="basic" choose-label="Change photo" accept="image/*" :max-file-size="1000000" custom-upload auto class="p-button-sm p-button-outlined p-button-secondary" style="margin-top: 8px" />
                            </div>
                        </div>

                        <Divider />

                        <div class="form-grid">
                            <div class="field">
                                <label class="field-label" for="pf-name">Full name</label>
                                <InputText id="pf-name" v-model="profile.name" fluid />
                            </div>
                            <div class="field">
                                <label class="field-label" for="pf-email">Email</label>
                                <InputText id="pf-email" v-model="profile.email" fluid />
                            </div>
                            <div class="field">
                                <label class="field-label" for="pf-title">Job title</label>
                                <InputText id="pf-title" v-model="profile.title" fluid />
                            </div>
                            <div class="field">
                                <label class="field-label" for="pf-location">Location</label>
                                <InputText id="pf-location" v-model="profile.location" fluid />
                            </div>
                            <div class="field">
                                <label class="field-label">Timezone</label>
                                <Select v-model="profile.timezone" :options="timezones" fluid />
                            </div>
                            <div class="field form-grid-full">
                                <label class="field-label" for="pf-bio">Bio</label>
                                <Textarea id="pf-bio" v-model="profile.bio" rows="3" auto-resize fluid />
                            </div>
                        </div>
                    </TabPanel>

                    <TabPanel value="security">
                        <div class="stack" style="max-width: 620px">
                            <div class="option-row">
                                <ToggleSwitch v-model="security.twoFactor" input-id="sec-2fa" />
                                <label for="sec-2fa">
                                    <span class="option-title">Two-factor authentication</span>
                                    <span class="field-hint">Require a one-time code from your authenticator app at sign-in.</span>
                                </label>
                            </div>

                            <div class="option-row">
                                <ToggleSwitch v-model="security.sessionAlerts" input-id="sec-alerts" />
                                <label for="sec-alerts">
                                    <span class="option-title">New sign-in alerts</span>
                                    <span class="field-hint">Email me whenever a new device signs in to this account.</span>
                                </label>
                            </div>

                            <div class="option-row">
                                <ToggleSwitch v-model="security.passwordless" input-id="sec-passwordless" />
                                <label for="sec-passwordless">
                                    <span class="option-title">Passwordless sign-in</span>
                                    <span class="field-hint">Use a passkey instead of a password where the browser supports it.</span>
                                </label>
                            </div>

                            <Divider />

                            <Button label="Change password" icon="pi pi-key" severity="secondary" outlined size="small" style="align-self: flex-start" />
                        </div>
                    </TabPanel>

                    <TabPanel value="sessions">
                        <div class="stack" style="gap: 0">
                            <div
                                v-for="session in sessions"
                                :key="session.id"
                                style="display: flex; align-items: center; gap: 12px; padding: 14px 0"
                                :style="{ borderBottom: session.id === sessions[sessions.length - 1].id ? 'none' : '1px solid var(--p-content-border-color)' }"
                            >
                                <i class="pi pi-desktop muted" />
                                <div style="flex: 1">
                                    <p style="font-size: 13px; font-weight: 600">{{ session.device }}</p>
                                    <p class="cell-sub">{{ session.location }} · {{ session.last }}</p>
                                </div>
                                <Button v-if="!session.current" label="Revoke" severity="danger" text size="small" />
                                <span v-else class="cell-sub">Current session</span>
                            </div>
                        </div>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </PagePanel>
    </div>
</template>
