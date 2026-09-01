<script setup lang="ts">
import Button from 'openvue/button';
import Dialog from 'openvue/dialog';
import InputNumber from 'openvue/inputnumber';
import InputText from 'openvue/inputtext';
import Rating from 'openvue/rating';
import Select from 'openvue/select';
import Textarea from 'openvue/textarea';
import { computed, reactive, ref, watch } from 'vue';
import type { Product, ProductDraft, ProductStatus } from '@/types';

const props = withDefaults(
    defineProps<{
        product?: Product | null;
        categories?: string[];
    }>(),
    { product: null, categories: () => [] }
);

const emit = defineEmits<{ save: [draft: ProductDraft, id: string | null] }>();

const visible = defineModel<boolean>('visible', { required: true });

const statusOptions: { label: string; value: ProductStatus }[] = [
    { label: 'Published', value: 'published' },
    { label: 'Draft', value: 'draft' },
    { label: 'Archived', value: 'archived' }
];

const blank = (): ProductDraft => ({
    name: '',
    sku: '',
    category: '',
    price: 0,
    stock: 0,
    rating: 3,
    status: 'draft',
    description: ''
});

const form = reactive<ProductDraft>(blank());
const submitted = ref(false);

const editing = computed(() => Boolean(props.product));
const title = computed(() => (editing.value ? 'Edit product' : 'New product'));
const nameInvalid = computed(() => submitted.value && !form.name.trim());
const categoryInvalid = computed(() => submitted.value && !form.category);

const options = computed(() => {
    const known = new Set(props.categories);

    if (form.category) {
        known.add(form.category);
    }

    return Array.from(known).sort();
});

watch(visible, (open) => {
    if (!open) {
        return;
    }

    submitted.value = false;
    Object.assign(form, blank(), props.product ?? {});
});

const save = () => {
    submitted.value = true;

    if (nameInvalid.value || categoryInvalid.value) {
        return;
    }

    emit('save', { ...form }, props.product?.id ?? null);
    visible.value = false;
};
</script>

<template>
    <Dialog v-model:visible="visible" modal :header="title" :style="{ width: '560px' }" :breakpoints="{ '640px': '92vw' }">
        <div class="form-grid">
            <div class="field form-grid-full">
                <label class="field-label" for="product-name">Name</label>
                <InputText id="product-name" v-model="form.name" :invalid="nameInvalid" fluid />
                <small v-if="nameInvalid" class="field-error">A name is required.</small>
            </div>

            <div class="field">
                <label class="field-label" for="product-sku">SKU</label>
                <InputText id="product-sku" v-model="form.sku" fluid />
            </div>

            <div class="field">
                <label class="field-label" for="product-category">Category</label>
                <Select id="product-category" v-model="form.category" :options="options" placeholder="Select a category" :invalid="categoryInvalid" editable fluid />
                <small v-if="categoryInvalid" class="field-error">Pick a category.</small>
            </div>

            <div class="field">
                <label class="field-label" for="product-price">Price</label>
                <InputNumber id="product-price" v-model="form.price" mode="currency" currency="USD" locale="en-US" fluid />
            </div>

            <div class="field">
                <label class="field-label" for="product-stock">Stock</label>
                <InputNumber id="product-stock" v-model="form.stock" :min="0" show-buttons fluid />
            </div>

            <div class="field">
                <label class="field-label" for="product-status">Status</label>
                <Select id="product-status" v-model="form.status" :options="statusOptions" option-label="label" option-value="value" fluid />
            </div>

            <div class="field">
                <label class="field-label">Rating</label>
                <Rating v-model="form.rating" />
            </div>

            <div class="field form-grid-full">
                <label class="field-label" for="product-description">Description</label>
                <Textarea id="product-description" v-model="form.description" rows="3" auto-resize fluid />
                <p class="field-hint">Shown on the storefront product page.</p>
            </div>
        </div>

        <template #footer>
            <Button label="Cancel" severity="secondary" outlined @click="visible = false" />
            <Button :label="editing ? 'Save changes' : 'Create product'" @click="save" />
        </template>
    </Dialog>
</template>
