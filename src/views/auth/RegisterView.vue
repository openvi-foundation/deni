<script setup lang="ts">
import Button from 'openvue/button';
import Checkbox from 'openvue/checkbox';
import InputText from 'openvue/inputtext';
import Password from 'openvue/password';
import { useToast } from 'openvue/usetoast';
import { computed, ref } from 'vue';
import AuthCard from '@/components/AuthCard.vue';

const toast = useToast();

const name = ref('');
const email = ref('');
const password = ref('');
const terms = ref(false);
const submitted = ref(false);

const nameInvalid = computed(() => submitted.value && name.value.trim().length < 2);
const emailInvalid = computed(() => submitted.value && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value));
const passwordInvalid = computed(() => submitted.value && password.value.length < 10);
const termsInvalid = computed(() => submitted.value && !terms.value);

const register = () => {
    submitted.value = true;

    if (nameInvalid.value || emailInvalid.value || passwordInvalid.value || termsInvalid.value) {
        return;
    }

    toast.add({ severity: 'success', summary: 'Account created', detail: 'Check your inbox to confirm your email.', life: 4000 });
};
</script>

<template>
    <AuthCard title="Create your account" subtitle="Fourteen days of the Growth plan, no card required.">
        <form class="stack" @submit.prevent="register">
            <div class="field">
                <label class="field-label" for="reg-name">Full name</label>
                <InputText id="reg-name" v-model="name" :invalid="nameInvalid" autocomplete="name" fluid />
            </div>

            <div class="field">
                <label class="field-label" for="reg-email">Work email</label>
                <InputText id="reg-email" v-model="email" type="email" :invalid="emailInvalid" autocomplete="email" fluid />
            </div>

            <div class="field">
                <label class="field-label" for="reg-password">Password</label>
                <Password id="reg-password" v-model="password" toggle-mask :invalid="passwordInvalid" autocomplete="new-password" fluid />
                <p class="field-hint">At least ten characters.</p>
            </div>

            <div style="display: flex; align-items: flex-start; gap: 8px">
                <Checkbox v-model="terms" input-id="reg-terms" binary :invalid="termsInvalid" />
                <label for="reg-terms" style="font-size: 13px; line-height: 1.5">I accept the terms of service and privacy policy.</label>
            </div>

            <Button type="submit" label="Create account" fluid />
        </form>

        <template #footer>
            Already have an account?
            <RouterLink to="/auth/login">Sign in</RouterLink>
        </template>
    </AuthCard>
</template>
