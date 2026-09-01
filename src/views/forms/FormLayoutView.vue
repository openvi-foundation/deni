<script setup lang="ts">
import AutoComplete from 'openvue/autocomplete';
import Button from 'openvue/button';
import CascadeSelect from 'openvue/cascadeselect';
import Checkbox from 'openvue/checkbox';
import ColorPicker from 'openvue/colorpicker';
import DatePicker from 'openvue/datepicker';
import FloatLabel from 'openvue/floatlabel';
import IconField from 'openvue/iconfield';
import IftaLabel from 'openvue/iftalabel';
import InputGroup from 'openvue/inputgroup';
import InputGroupAddon from 'openvue/inputgroupaddon';
import InputIcon from 'openvue/inputicon';
import InputMask from 'openvue/inputmask';
import InputNumber from 'openvue/inputnumber';
import InputOtp from 'openvue/inputotp';
import InputText from 'openvue/inputtext';
import Knob from 'openvue/knob';
import MultiSelect from 'openvue/multiselect';
import Password from 'openvue/password';
import RadioButton from 'openvue/radiobutton';
import Rating from 'openvue/rating';
import Select from 'openvue/select';
import SelectButton from 'openvue/selectbutton';
import Slider from 'openvue/slider';
import Textarea from 'openvue/textarea';
import ToggleSwitch from 'openvue/toggleswitch';
import { useToast } from 'openvue/usetoast';
import { reactive, ref } from 'vue';
import PageHeader from '@/components/PageHeader.vue';
import PagePanel from '@/components/PagePanel.vue';

const toast = useToast();

const form = reactive({
    name: '',
    email: '',
    website: '',
    phone: '',
    password: '',
    otp: '',
    bio: '',
    country: null as string | null,
    region: null as string | null,
    tags: [] as string[],
    launchDate: null as Date | null,
    price: 249,
    budget: [200, 800],
    quality: 62,
    accent: '6366f1',
    rating: 4,
    plan: 'growth',
    billing: 'monthly',
    notifications: true,
    terms: false
});

const countries = ['Germany', 'Serbia', 'Spain', 'Sweden', 'Japan', 'Portugal', 'India', 'Denmark'];
const countrySuggestions = ref<string[]>([]);

const searchCountry = (event: { query: string }) => {
    countrySuggestions.value = countries.filter((country) => country.toLowerCase().includes(event.query.toLowerCase()));
};

const regions = [
    {
        label: 'Europe',
        children: [
            { label: 'Northern Europe', value: 'eu-north' },
            { label: 'Western Europe', value: 'eu-west' },
            { label: 'Southern Europe', value: 'eu-south' }
        ]
    },
    {
        label: 'Asia Pacific',
        children: [
            { label: 'East Asia', value: 'ap-east' },
            { label: 'South Asia', value: 'ap-south' }
        ]
    }
];

const tagOptions = ['Beta', 'Enterprise', 'Self-hosted', 'Priority support', 'Design partner'];

const plans = [
    { label: 'Starter', value: 'starter' },
    { label: 'Growth', value: 'growth' },
    { label: 'Scale', value: 'scale' }
];

const billingOptions = [
    { label: 'Monthly', value: 'monthly' },
    { label: 'Yearly', value: 'yearly' }
];

const submit = () => {
    toast.add({ severity: 'success', summary: 'Saved', detail: 'Form state written to the console.', life: 3000 });
};
</script>

<template>
    <div>
        <PageHeader title="Form layout" description="Every input OpenVue ships, arranged with the label patterns used across this template." />

        <div class="stack">
            <PagePanel title="Details" description="Standard label-above-field pairs on a responsive two-column grid." flush>
                <div class="panel-body">
                    <div class="form-grid">
                        <div class="field">
                            <label class="field-label" for="fl-name">Full name</label>
                            <InputText id="fl-name" v-model="form.name" placeholder="Ada Lovelace" fluid />
                        </div>

                        <div class="field">
                            <label class="field-label" for="fl-email">Email</label>
                            <IconField>
                                <InputIcon class="pi pi-envelope" />
                                <InputText id="fl-email" v-model="form.email" placeholder="you@company.com" fluid />
                            </IconField>
                            <p class="field-hint">Used for billing receipts and security alerts.</p>
                        </div>

                        <div class="field">
                            <label class="field-label" for="fl-site">Website</label>
                            <InputGroup>
                                <InputGroupAddon>https://</InputGroupAddon>
                                <InputText id="fl-site" v-model="form.website" placeholder="acme.com" />
                            </InputGroup>
                        </div>

                        <div class="field">
                            <label class="field-label" for="fl-phone">Phone</label>
                            <InputMask id="fl-phone" v-model="form.phone" mask="+99 999 999 999" placeholder="+49 000 000 000" fluid />
                        </div>

                        <div class="field">
                            <label class="field-label" for="fl-password">Password</label>
                            <Password id="fl-password" v-model="form.password" toggle-mask fluid />
                        </div>

                        <div class="field">
                            <label class="field-label">Verification code</label>
                            <InputOtp v-model="form.otp" :length="6" integer-only />
                        </div>

                        <div class="field form-grid-full">
                            <label class="field-label" for="fl-bio">Bio<span class="field-optional">optional</span></label>
                            <Textarea id="fl-bio" v-model="form.bio" rows="3" auto-resize fluid placeholder="A short description shown on your public profile." />
                        </div>
                    </div>
                </div>
            </PagePanel>

            <PagePanel title="Floating and in-field labels" description="Alternative label placements for dense forms.">
                <div class="form-grid">
                    <FloatLabel variant="on">
                        <InputText id="fl-float" v-model="form.name" fluid />
                        <label for="fl-float">Company name</label>
                    </FloatLabel>

                    <IftaLabel>
                        <InputText id="fl-ifta" v-model="form.email" fluid />
                        <label for="fl-ifta">Billing email</label>
                    </IftaLabel>
                </div>
            </PagePanel>

            <PagePanel title="Selection" description="Pickers, tags and hierarchical options.">
                <div class="form-grid">
                    <div class="field">
                        <label class="field-label" for="fl-country">Country</label>
                        <AutoComplete id="fl-country" v-model="form.country" :suggestions="countrySuggestions" dropdown fluid @complete="searchCountry" />
                    </div>

                    <div class="field">
                        <label class="field-label">Region</label>
                        <CascadeSelect v-model="form.region" :options="regions" option-label="label" option-group-label="label" :option-group-children="['children']" option-value="value" placeholder="Select a region" fluid />
                    </div>

                    <div class="field">
                        <label class="field-label">Tags</label>
                        <MultiSelect v-model="form.tags" :options="tagOptions" placeholder="Add tags" display="chip" fluid />
                    </div>

                    <div class="field">
                        <label class="field-label">Launch date</label>
                        <DatePicker v-model="form.launchDate" show-icon icon-display="input" date-format="d MM yy" fluid />
                    </div>

                    <div class="field">
                        <label class="field-label" for="fl-price">List price</label>
                        <InputNumber id="fl-price" v-model="form.price" mode="currency" currency="USD" locale="en-US" fluid />
                    </div>

                    <div class="field">
                        <label class="field-label">Plan</label>
                        <Select v-model="form.plan" :options="plans" option-label="label" option-value="value" fluid />
                    </div>
                </div>
            </PagePanel>

            <PagePanel title="Ranges and toggles" description="Numeric ranges, switches and choice groups.">
                <div class="form-grid">
                    <div class="field">
                        <label class="field-label">Budget range</label>
                        <Slider v-model="form.budget" range :min="0" :max="1000" style="margin-top: 10px" />
                        <p class="field-hint numeric">${{ form.budget[0] }} — ${{ form.budget[1] }}</p>
                    </div>

                    <div class="field">
                        <label class="field-label">Quality target</label>
                        <Knob v-model="form.quality" :size="90" value-template="{value}%" />
                    </div>

                    <div class="field">
                        <label class="field-label">Accent colour</label>
                        <ColorPicker v-model="form.accent" />
                    </div>

                    <div class="field">
                        <label class="field-label">Satisfaction</label>
                        <Rating v-model="form.rating" />
                    </div>

                    <div class="field">
                        <label class="field-label">Billing period</label>
                        <SelectButton v-model="form.billing" :options="billingOptions" option-label="label" option-value="value" :allow-empty="false" />
                    </div>

                    <div class="field">
                        <label class="field-label">Delivery</label>
                        <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 2px">
                            <div style="display: flex; align-items: center; gap: 8px">
                                <RadioButton v-model="form.plan" input-id="plan-starter" value="starter" />
                                <label for="plan-starter" style="font-size: 13px">Starter</label>
                            </div>
                            <div style="display: flex; align-items: center; gap: 8px">
                                <RadioButton v-model="form.plan" input-id="plan-growth" value="growth" />
                                <label for="plan-growth" style="font-size: 13px">Growth</label>
                            </div>
                        </div>
                    </div>

                    <div class="field form-grid-full">
                        <div style="display: flex; align-items: center; gap: 10px">
                            <ToggleSwitch v-model="form.notifications" input-id="fl-notify" />
                            <label for="fl-notify" style="font-size: 13px">Email me when an order fails</label>
                        </div>
                        <div style="display: flex; align-items: center; gap: 10px; margin-top: 10px">
                            <Checkbox v-model="form.terms" input-id="fl-terms" binary />
                            <label for="fl-terms" style="font-size: 13px">I accept the terms of service</label>
                        </div>
                    </div>
                </div>

                <template #actions>
                    <Button label="Reset" severity="secondary" text size="small" />
                    <Button label="Save" size="small" @click="submit" />
                </template>
            </PagePanel>
        </div>
    </div>
</template>
