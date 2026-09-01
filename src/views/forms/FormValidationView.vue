<script setup lang="ts">
import { Form, FormField } from '@openvue/forms';
import type { FormSubmitEvent } from '@openvue/forms';
import { zodResolver } from '@openvue/forms/resolvers/zod';
import Button from 'openvue/button';
import Checkbox from 'openvue/checkbox';
import DatePicker from 'openvue/datepicker';
import InputNumber from 'openvue/inputnumber';
import InputText from 'openvue/inputtext';
import Message from 'openvue/message';
import Password from 'openvue/password';
import Select from 'openvue/select';
import Textarea from 'openvue/textarea';
import { useToast } from 'openvue/usetoast';
import { z } from 'zod';
import PageHeader from '@/components/PageHeader.vue';
import PagePanel from '@/components/PagePanel.vue';

const toast = useToast();

const schema = z
    .object({
        name: z.string().min(2, 'Enter at least two characters.'),
        email: z.string().email('Enter a valid email address.'),
        password: z.string().min(10, 'Use at least ten characters.').regex(/[0-9]/, 'Include at least one number.'),
        confirm: z.string(),
        seats: z.number({ message: 'Enter a number of seats.' }).min(1, 'At least one seat is required.').max(500, 'Contact sales for more than 500 seats.'),
        plan: z.string({ message: 'Choose a plan.' }),
        startDate: z.date({ message: 'Pick a start date.' }),
        notes: z.string().max(280, 'Keep notes under 280 characters.').optional(),
        terms: z.literal(true, { message: 'You must accept the terms.' })
    })
    .refine((values) => values.password === values.confirm, {
        message: 'Passwords do not match.',
        path: ['confirm']
    });

const resolver = zodResolver(schema);

const initialValues = {
    name: '',
    email: '',
    password: '',
    confirm: '',
    seats: 5,
    plan: null,
    startDate: null,
    notes: '',
    terms: false
};

const plans = [
    { label: 'Starter — $19 / seat', value: 'starter' },
    { label: 'Growth — $39 / seat', value: 'growth' },
    { label: 'Scale — $79 / seat', value: 'scale' }
];

const onSubmit = ({ valid, values, reset }: FormSubmitEvent) => {
    if (!valid) {
        toast.add({ severity: 'error', summary: 'Check the highlighted fields', life: 3000 });
        return;
    }

    toast.add({ severity: 'success', summary: 'Subscription created', detail: `${values.seats} seats on the ${values.plan} plan.`, life: 4000 });
    reset();
};
</script>

<template>
    <div>
        <PageHeader title="Validation" description="Schema-driven validation with @openvue/forms and a zod resolver." />

        <Form :initial-values="initialValues" :resolver="resolver" :validate-on-blur="true" :validate-on-value-update="false" style="max-width: 720px" @submit="onSubmit">
            <PagePanel title="New subscription" description="Errors appear on blur and again on submit." flush>
                <div class="panel-body">
                    <div class="form-grid">
                        <FormField v-slot="$field" name="name" class="field">
                            <label class="field-label" for="fv-name">Account name</label>
                            <InputText id="fv-name" name="name" :invalid="$field.invalid" placeholder="Acme GmbH" fluid />
                            <Message v-if="$field.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}</Message>
                        </FormField>

                        <FormField v-slot="$field" name="email" class="field">
                            <label class="field-label" for="fv-email">Billing email</label>
                            <InputText id="fv-email" name="email" :invalid="$field.invalid" placeholder="billing@acme.com" fluid />
                            <Message v-if="$field.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}</Message>
                        </FormField>

                        <FormField v-slot="$field" name="password" class="field">
                            <label class="field-label" for="fv-password">Password</label>
                            <Password id="fv-password" name="password" :invalid="$field.invalid" toggle-mask :feedback="true" fluid />
                            <Message v-if="$field.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}</Message>
                            <p v-else class="field-hint">Ten characters or more, including a number.</p>
                        </FormField>

                        <FormField v-slot="$field" name="confirm" class="field">
                            <label class="field-label" for="fv-confirm">Confirm password</label>
                            <Password id="fv-confirm" name="confirm" :invalid="$field.invalid" :feedback="false" toggle-mask fluid />
                            <Message v-if="$field.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}</Message>
                        </FormField>

                        <FormField v-slot="$field" name="seats" class="field">
                            <label class="field-label" for="fv-seats">Seats</label>
                            <InputNumber id="fv-seats" name="seats" :invalid="$field.invalid" :min="1" show-buttons fluid />
                            <Message v-if="$field.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}</Message>
                        </FormField>

                        <FormField v-slot="$field" name="plan" class="field">
                            <label class="field-label">Plan</label>
                            <Select name="plan" :options="plans" option-label="label" option-value="value" :invalid="$field.invalid" placeholder="Choose a plan" fluid />
                            <Message v-if="$field.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}</Message>
                        </FormField>

                        <FormField v-slot="$field" name="startDate" class="field">
                            <label class="field-label">Start date</label>
                            <DatePicker name="startDate" :invalid="$field.invalid" show-icon icon-display="input" date-format="d MM yy" fluid />
                            <Message v-if="$field.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}</Message>
                        </FormField>

                        <FormField v-slot="$field" name="notes" class="field form-grid-full">
                            <label class="field-label" for="fv-notes">Notes<span class="field-optional">optional</span></label>
                            <Textarea id="fv-notes" name="notes" rows="3" :invalid="$field.invalid" auto-resize fluid />
                            <Message v-if="$field.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}</Message>
                        </FormField>

                        <FormField v-slot="$field" name="terms" class="field form-grid-full">
                            <div style="display: flex; align-items: center; gap: 10px">
                                <Checkbox input-id="fv-terms" name="terms" binary :invalid="$field.invalid" />
                                <label for="fv-terms" style="font-size: 13px">I accept the terms of service and privacy policy.</label>
                            </div>
                            <Message v-if="$field.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}</Message>
                        </FormField>
                    </div>
                </div>

                <div class="form-actions">
                    <span class="data-toolbar-count">All fields except notes are required.</span>
                    <div class="form-actions-end">
                        <Button type="reset" label="Reset" severity="secondary" outlined size="small" />
                        <Button type="submit" label="Create subscription" size="small" />
                    </div>
                </div>
            </PagePanel>
        </Form>
    </div>
</template>
