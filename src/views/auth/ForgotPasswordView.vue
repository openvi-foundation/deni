<script setup lang="ts">
import Button from 'openvue/button';
import InputText from 'openvue/inputtext';
import Message from 'openvue/message';
import { computed, ref } from 'vue';
import AuthCard from '@/components/AuthCard.vue';

const email = ref('');
const submitted = ref(false);
const sent = ref(false);

const emailInvalid = computed(() => submitted.value && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value));

const send = () => {
    submitted.value = true;

    if (emailInvalid.value) {
        return;
    }

    sent.value = true;
};
</script>

<template>
    <AuthCard title="Reset your password" subtitle="We will email you a link to choose a new one.">
        <Message v-if="sent" severity="success" size="small">If an account exists for {{ email }}, a reset link is on its way.</Message>

        <form v-else class="stack" @submit.prevent="send">
            <div class="field">
                <label class="field-label" for="fp-email">Email</label>
                <InputText id="fp-email" v-model="email" type="email" :invalid="emailInvalid" autocomplete="email" fluid />
            </div>

            <Button type="submit" label="Send reset link" fluid />
        </form>

        <template #footer>
            <RouterLink to="/auth/login">Back to sign in</RouterLink>
        </template>
    </AuthCard>
</template>
