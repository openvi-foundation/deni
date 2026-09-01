<script setup lang="ts">
import Button from 'openvue/button';
import Column from 'openvue/column';
import DataTable from 'openvue/datatable';
import IconField from 'openvue/iconfield';
import InputIcon from 'openvue/inputicon';
import InputText from 'openvue/inputtext';
import MultiSelect from 'openvue/multiselect';
import Rating from 'openvue/rating';
import Select from 'openvue/select';
import { useConfirm } from 'openvue/useconfirm';
import { useToast } from 'openvue/usetoast';
import { computed, onMounted, ref } from 'vue';
import EmptyState from '@/components/EmptyState.vue';
import PageHeader from '@/components/PageHeader.vue';
import PagePanel from '@/components/PagePanel.vue';
import ProductFormDialog from '@/components/ProductFormDialog.vue';
import StatusTag from '@/components/StatusTag.vue';
import { useDataTableState } from '@/composables/useDataTableState';
import { productCollection } from '@/data/collections';
import type { Product, ProductDraft, ProductStatus } from '@/types';
import { formatCurrencyPrecise, formatDate } from '@/utils/format';
import { createId } from '@/utils/id';

const toast = useToast();
const confirm = useConfirm();

const { items: products, loading, load, create, update, remove, removeMany } = productCollection;

onMounted(load);

const table = useDataTableState(() => products.value, ['name', 'sku', 'category', 'status']);

const categories = computed(() => Array.from(new Set(products.value.map((product) => product.category))).sort());
const categoryFilter = ref<string | null>(null);
const statusFilter = ref<ProductStatus | null>(null);

const statusOptions: { label: string; value: ProductStatus }[] = [
    { label: 'Published', value: 'published' },
    { label: 'Draft', value: 'draft' },
    { label: 'Archived', value: 'archived' }
];

const optionalColumns = [
    { label: 'Category', value: 'category' },
    { label: 'Price', value: 'price' },
    { label: 'Stock', value: 'stock' },
    { label: 'Rating', value: 'rating' },
    { label: 'Status', value: 'status' },
    { label: 'Updated', value: 'updatedAt' }
];

const columns = ref<string[]>(optionalColumns.map((column) => column.value));
const shows = (field: string) => columns.value.includes(field);

const expanded = ref<Product[]>([]);

const visible = computed(() =>
    products.value.filter((product) => {
        const byCategory = !categoryFilter.value || product.category === categoryFilter.value;
        const byStatus = !statusFilter.value || product.status === statusFilter.value;

        return byCategory && byStatus;
    })
);

const filtersActive = computed(() => Boolean(categoryFilter.value || statusFilter.value || table.search.value));

const clearFilters = () => {
    categoryFilter.value = null;
    statusFilter.value = null;
    table.resetFilters();
};

const dialogOpen = ref(false);
const editing = ref<Product | null>(null);

const openCreate = () => {
    editing.value = null;
    dialogOpen.value = true;
};

const openEdit = (product: Product) => {
    editing.value = product;
    dialogOpen.value = true;
};

const save = (draft: ProductDraft, id: string | null) => {
    const updatedAt = new Date().toISOString().slice(0, 10);

    if (id) {
        update(id, { ...draft, updatedAt });
        toast.add({ severity: 'success', summary: 'Product updated', detail: draft.name, life: 3000 });

        return;
    }

    create({ ...draft, id: createId('prd'), updatedAt });
    toast.add({ severity: 'success', summary: 'Product created', detail: draft.name, life: 3000 });
};

const confirmRemove = (product: Product) => {
    confirm.require({
        header: 'Delete product',
        message: `“${product.name}” will be permanently removed. This cannot be undone.`,
        icon: 'pi pi-exclamation-triangle',
        rejectProps: { label: 'Cancel', severity: 'secondary', outlined: true },
        acceptProps: { label: 'Delete', severity: 'danger' },
        accept: () => {
            remove(product.id);
            toast.add({ severity: 'success', summary: 'Product deleted', detail: product.name, life: 3000 });
        }
    });
};

const removeSelected = () => {
    const count = table.selection.value.length;

    confirm.require({
        header: 'Delete products',
        message: `${count} ${count === 1 ? 'product' : 'products'} will be permanently removed.`,
        icon: 'pi pi-exclamation-triangle',
        rejectProps: { label: 'Cancel', severity: 'secondary', outlined: true },
        acceptProps: { label: 'Delete', severity: 'danger' },
        accept: () => {
            removeMany(table.selection.value.map((product) => product.id));
            table.clearSelection();
            toast.add({ severity: 'success', summary: `${count} deleted`, life: 3000 });
        }
    });
};

const exportCsv = () => {
    const header = ['Name', 'SKU', 'Category', 'Price', 'Stock', 'Status'];
    const body = visible.value.map((product) => [product.name, product.sku, product.category, product.price, product.stock, product.status]);
    const csv = [header, ...body].map((line) => line.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const anchor = document.createElement('a');

    anchor.href = url;
    anchor.download = 'products.csv';
    anchor.click();
    URL.revokeObjectURL(url);

    toast.add({ severity: 'info', summary: 'Export ready', detail: `${visible.value.length} rows`, life: 3000 });
};

const lowStock = (stock: number) => stock < 25;

const warehouses = (product: Product) => {
    const split = [0.5, 0.3, 0.2];

    return ['Rotterdam', 'Austin', 'Singapore'].map((name, index) => ({
        name,
        units: Math.round(product.stock * split[index])
    }));
};
</script>

<template>
    <div>
        <PageHeader title="Products" description="Everything in your catalogue, including drafts and archived entries.">
            <template #actions>
                <Button label="Export" icon="pi pi-download" severity="secondary" outlined size="small" @click="exportCsv" />
                <Button label="New product" icon="pi pi-plus" size="small" @click="openCreate" />
            </template>
        </PageHeader>

        <PagePanel flush>
            <div class="data-toolbar">
                <IconField>
                    <InputIcon class="pi pi-search" />
                    <InputText v-model="table.search.value" placeholder="Search products" style="width: 220px" />
                </IconField>

                <Select v-model="categoryFilter" :options="categories" placeholder="Category" show-clear style="width: 170px" />
                <Select v-model="statusFilter" :options="statusOptions" option-label="label" option-value="value" placeholder="Status" show-clear style="width: 150px" />

                <Button v-if="filtersActive" label="Clear" icon="pi pi-filter-slash" text size="small" @click="clearFilters" />

                <div class="data-toolbar-end">
                    <template v-if="table.hasSelection.value">
                        <span class="data-toolbar-count">{{ table.selectedCount }} selected</span>
                        <Button label="Delete" icon="pi pi-trash" severity="danger" outlined size="small" @click="removeSelected" />
                    </template>
                    <template v-else>
                        <span class="data-toolbar-count" aria-live="polite">{{ visible.length }} of {{ table.total }}</span>
                        <MultiSelect v-model="columns" :options="optionalColumns" option-label="label" option-value="value" :max-selected-labels="0" selected-items-label="Columns" placeholder="Columns" style="width: 130px" />
                    </template>
                </div>
            </div>

            <DataTable
                v-model:selection="table.selection.value"
                v-model:expanded-rows="expanded"
                :value="visible"
                :filters="table.filters.value"
                :global-filter-fields="table.globalFields"
                :loading="loading"
                data-key="id"
                paginator
                :rows="10"
                :rows-per-page-options="[10, 25, 50]"
                sort-field="updatedAt"
                :sort-order="-1"
                removable-sort
                resizable-columns
                column-resize-mode="expand"
                reorderable-columns
                scrollable
                scroll-height="600px"
                current-page-report-template="{first}–{last} of {totalRecords}"
                paginator-template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink RowsPerPageDropdown"
            >
                <template #empty>
                    <EmptyState icon="pi pi-box" :title="filtersActive ? 'No matching products' : 'No products yet'" :message="filtersActive ? 'Try removing a filter or searching for something else.' : 'Create your first product to see it listed here.'">
                        <Button v-if="filtersActive" label="Clear filters" size="small" outlined severity="secondary" @click="clearFilters" />
                        <Button v-else label="New product" icon="pi pi-plus" size="small" @click="openCreate" />
                    </EmptyState>
                </template>

                <Column selection-mode="multiple" header-style="width: 42px" :reorderable-column="false" />
                <Column expander header-style="width: 42px" :reorderable-column="false" />

                <Column field="name" header="Product" sortable>
                    <template #body="{ data: product }">
                        <RouterLink :to="`/products/${product.id}`" class="cell-primary">{{ product.name }}</RouterLink>
                        <div class="cell-sub">{{ product.sku }}</div>
                    </template>
                </Column>

                <Column v-if="shows('category')" field="category" header="Category" sortable style="width: 150px" />

                <Column v-if="shows('price')" field="price" header="Price" sortable style="width: 110px">
                    <template #body="{ data: product }">
                        <span class="numeric">{{ formatCurrencyPrecise(product.price) }}</span>
                    </template>
                </Column>

                <Column v-if="shows('stock')" field="stock" header="Stock" sortable style="width: 100px">
                    <template #body="{ data: product }">
                        <span class="numeric" :class="{ 'cell-alert': lowStock(product.stock) }">{{ product.stock }}</span>
                    </template>
                </Column>

                <Column v-if="shows('rating')" field="rating" header="Rating" sortable style="width: 130px">
                    <template #body="{ data: product }">
                        <Rating :model-value="product.rating" readonly />
                    </template>
                </Column>

                <Column v-if="shows('status')" field="status" header="Status" sortable style="width: 120px">
                    <template #body="{ data: product }">
                        <StatusTag :status="product.status" />
                    </template>
                </Column>

                <Column v-if="shows('updatedAt')" field="updatedAt" header="Updated" sortable style="width: 130px">
                    <template #body="{ data: product }">
                        <span class="muted">{{ formatDate(product.updatedAt) }}</span>
                    </template>
                </Column>

                <Column header-style="width: 90px" :reorderable-column="false">
                    <template #body="{ data: product }">
                        <div class="cell-actions">
                            <Button icon="pi pi-pencil" severity="secondary" text rounded size="small" aria-label="Edit" @click="openEdit(product)" />
                            <Button icon="pi pi-trash" severity="danger" text rounded size="small" aria-label="Delete" @click="confirmRemove(product)" />
                        </div>
                    </template>
                </Column>

                <template #expansion="{ data: product }">
                    <div class="row-detail">
                        <p class="row-detail-text">{{ product.description }}</p>

                        <div class="row-detail-stock">
                            <div v-for="warehouse in warehouses(product)" :key="warehouse.name" class="row-detail-stat">
                                <span class="metric-label">{{ warehouse.name }}</span>
                                <span class="numeric">{{ warehouse.units }} units</span>
                            </div>
                        </div>

                        <Button label="Open product" icon="pi pi-arrow-up-right" icon-pos="right" size="small" text as="router-link" :to="`/products/${product.id}`" />
                    </div>
                </template>
            </DataTable>
        </PagePanel>

        <ProductFormDialog v-model:visible="dialogOpen" :product="editing" :categories="categories" @save="save" />
    </div>
</template>
