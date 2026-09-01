<script setup lang="ts">
import Button from 'openvue/button';
import Checkbox from 'openvue/checkbox';
import Divider from 'openvue/divider';
import InputText from 'openvue/inputtext';
import Message from 'openvue/message';
import Password from 'openvue/password';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import AuthCard from '@/components/AuthCard.vue';

const router = useRouter();

const email = ref('');
const password = ref('');
const remember = ref(true);
const submitted = ref(false);
const pending = ref(false);

const emailInvalid = computed(() => submitted.value && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value));
const passwordInvalid = computed(() => submitted.value && password.value.length < 1);

const signIn = () => {
    submitted.value = true;

    if (emailInvalid.value || passwordInvalid.value) {
        return;
    }

    pending.value = true;
    window.setTimeout(() => {
        pending.value = false;
        router.push('/');
    }, 600);
};
</script>

<template>
    <AuthCard title="Sign in" subtitle="Use your workspace account to continue.">
        <form class="stack" @submit.prevent="signIn">
            <Message v-if="submitted && (emailInvalid || passwordInvalid)" severity="error" size="small">Check your email address and password.</Message>

            <div class="field">
                <label class="field-label" for="login-email">Email</label>
                <InputText id="login-email" v-model="email" type="email" autocomplete="email" placeholder="you@company.com" :invalid="emailInvalid" fluid />
            </div>

            <div class="field">
                <label class="field-label" for="login-password">Password</label>
                <Password id="login-password" v-model="password" :feedback="false" toggle-mask autocomplete="current-password" :invalid="passwordInvalid" fluid />
            </div>

            <div style="display: flex; align-items: center; gap: 8px">
                <Checkbox v-model="remember" input-id="login-remember" binary />
                <label for="login-remember" style="font-size: 13px">Keep me signed in</label>
                <RouterLink to="/auth/forgot-password" style="margin-left: auto; font-size: 13px">Forgot password?</RouterLink>
            </div>

            <Button type="submit" label="Sign in" :loading="pending" fluid />

            <Divider align="center"><span class="cell-sub">or</span></Divider>

            <Button label="Continue with GitHub" icon="pi pi-github" severity="secondary" outlined fluid />
        </form>

        <template #footer>
            No account yet?
            <RouterLink to="/auth/register">Create one</RouterLink>
        </template>
    </AuthCard>
</template>
