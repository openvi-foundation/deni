<script setup lang="ts">
import Button from 'openvue/button';
import Column from 'openvue/column';
import DataTable from 'openvue/datatable';
import Divider from 'openvue/divider';
import Rating from 'openvue/rating';
import Skeleton from 'openvue/skeleton';
import Tab from 'openvue/tab';
import TabList from 'openvue/tablist';
import TabPanel from 'openvue/tabpanel';
import TabPanels from 'openvue/tabpanels';
import Tabs from 'openvue/tabs';
import Timeline from 'openvue/timeline';
import { useConfirm } from 'openvue/useconfirm';
import { useToast } from 'openvue/usetoast';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import EmptyState from '@/components/EmptyState.vue';
import PageHeader from '@/components/PageHeader.vue';
import PagePanel from '@/components/PagePanel.vue';
import ProductFormDialog from '@/components/ProductFormDialog.vue';
import RecordNav from '@/components/RecordNav.vue';
import StatusTag from '@/components/StatusTag.vue';
import { useAsyncData } from '@/composables/useAsyncData';
import { useEntity } from '@/composables/useEntity';
import { productCollection } from '@/data/collections';
import { getActivity } from '@/service';
import type { ActivityEntry, ProductDraft } from '@/types';
import { formatCurrencyPrecise, formatDate, formatRelative } from '@/utils/format';

const router = useRouter();
const toast = useToast();
const confirm = useConfirm();

const { items: products, historyFor, update, remove } = productCollection;
const { id, entity: product, loading, notFound, previousId, nextId, position } = useEntity(productCollection, (item) => item.id);

const { data: activity } = useAsyncData(getActivity, [] as ActivityEntry[]);

const dialogOpen = ref(false);

const categories = computed(() => Array.from(new Set(products.value.map((item) => item.category))).sort());

const facts = computed(() => {
    if (!product.value) {
        return [];
    }

    return [
        { label: 'SKU', value: product.value.sku },
        { label: 'Category', value: product.value.category },
        { label: 'Price', value: formatCurrencyPrecise(product.value.price) },
        { label: 'Stock on hand', value: String(product.value.stock) },
        { label: 'Last updated', value: formatDate(product.value.updatedAt) }
    ];
});

const warehouses = computed(() => {
    if (!product.value) {
        return [];
    }

    const stock = product.value.stock;
    const split = [
        { name: 'Rotterdam', share: 0.5 },
        { name: 'Austin', share: 0.3 },
        { name: 'Singapore', share: 0.2 }
    ];

    return split.map((warehouse) => {
        const units = Math.round(stock * warehouse.share);

        return {
            name: warehouse.name,
            units,
            reserved: Math.round(units * 0.12),
            available: units - Math.round(units * 0.12)
        };
    });
});

const history = computed(() => {
    const edits = historyFor(id.value).map((entry) => ({ id: entry.id, title: `You ${entry.action} this product`, at: entry.at, icon: 'pi pi-pencil' }));

    const seeded = activity.value
        .filter((entry) => entry.productId === id.value)
        .map((entry) => ({ id: entry.id, title: `${entry.actor} ${entry.action} this product`, at: entry.at, icon: 'pi pi-user' }));

    return [...edits, ...seeded].sort((a, b) => b.at.localeCompare(a.at));
});

const related = computed(() => {
    if (!product.value) {
        return [];
    }

    return products.value.filter((item) => item.category === product.value?.category && item.id !== product.value?.id).slice(0, 4);
});

const save = (draft: ProductDraft) => {
    update(id.value, { ...draft, updatedAt: new Date().toISOString().slice(0, 10) });
    toast.add({ severity: 'success', summary: 'Product updated', detail: draft.name, life: 3000 });
};

const confirmRemove = () => {
    const target = product.value;

    if (!target) {
        return;
    }

    confirm.require({
        header: 'Delete product',
        message: `“${target.name}” will be permanently removed. This cannot be undone.`,
        icon: 'pi pi-exclamation-triangle',
        rejectProps: { label: 'Cancel', severity: 'secondary', outlined: true },
        acceptProps: { label: 'Delete', severity: 'danger' },
        accept: () => {
            remove(target.id);
            toast.add({ severity: 'success', summary: 'Product deleted', detail: target.name, life: 3000 });
            router.push('/products');
        }
    });
};
</script>

<template>
    <div>
        <PageHeader :title="product?.name ?? 'Product'" :description="product ? `Catalogue entry ${product.sku}` : undefined">
            <template #actions>
                <RecordNav label="product" :position="position" :previous-to="previousId ? `/products/${previousId}` : null" :next-to="nextId ? `/products/${nextId}` : null" />

                <Button label="Products" icon="pi pi-arrow-left" severity="secondary" outlined size="small" as="router-link" to="/products" />
                <Button v-if="product" label="Edit" icon="pi pi-pencil" size="small" @click="dialogOpen = true" />
                <Button v-if="product" icon="pi pi-trash" severity="danger" outlined size="small" aria-label="Delete product" @click="confirmRemove" />
            </template>
        </PageHeader>

        <PagePanel v-if="loading && !product">
            <Skeleton height="220px" />
        </PagePanel>

        <PagePanel v-else-if="notFound">
            <EmptyState icon="pi pi-search" title="Product not found" message="This entry may have been deleted or the link is out of date.">
                <Button label="Back to products" size="small" as="router-link" to="/products" />
            </EmptyState>
        </PagePanel>

        <div v-else-if="product" class="grid detail-grid">
            <div class="stack">
                <PagePanel flush>
                    <Tabs value="overview">
                        <TabList>
                            <Tab value="overview">Overview</Tab>
                            <Tab value="inventory">Inventory</Tab>
                            <Tab value="history">History</Tab>
                        </TabList>

                        <TabPanels>
                            <TabPanel value="overview">
                                <p class="detail-copy">{{ product.description }}</p>
                                <Divider />
                                <div class="grid grid-thirds">
                                    <div v-for="fact in facts" :key="fact.label">
                                        <p class="metric-label">{{ fact.label }}</p>
                                        <p class="detail-fact">{{ fact.value }}</p>
                                    </div>
                                </div>
                            </TabPanel>

                            <TabPanel value="inventory">
                                <DataTable :value="warehouses" data-key="name">
                                    <Column field="name" header="Warehouse" />
                                    <Column field="units" header="On hand">
                                        <template #body="{ data: warehouse }">
                                            <span class="numeric">{{ warehouse.units }}</span>
                                        </template>
                                    </Column>
                                    <Column field="reserved" header="Reserved">
                                        <template #body="{ data: warehouse }">
                                            <span class="numeric muted">{{ warehouse.reserved }}</span>
                                        </template>
                                    </Column>
                                    <Column field="available" header="Available">
                                        <template #body="{ data: warehouse }">
                                            <span class="numeric">{{ warehouse.available }}</span>
                                        </template>
                                    </Column>
                                </DataTable>
                            </TabPanel>

                            <TabPanel value="history">
                                <EmptyState v-if="!history.length" icon="pi pi-history" title="No revisions recorded" message="Edits made to this product will be listed here." />

                                <Timeline v-else :value="history" class="detail-timeline">
                                    <template #marker="{ item }">
                                        <span class="timeline-marker"><i :class="item.icon" /></span>
                                    </template>
                                    <template #content="{ item }">
                                        <p class="detail-fact">{{ item.title }}</p>
                                        <p class="cell-sub">{{ formatRelative(item.at) }}</p>
                                    </template>
                                </Timeline>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </PagePanel>

                <PagePanel v-if="related.length" title="More in this category" :description="product.category">
                    <div class="related-list">
                        <RouterLink v-for="item in related" :key="item.id" :to="`/products/${item.id}`" class="related-item">
                            <span class="cell-primary">{{ item.name }}</span>
                            <span class="cell-sub">{{ item.sku }}</span>
                            <span class="numeric related-item-price">{{ formatCurrencyPrecise(item.price) }}</span>
                        </RouterLink>
                    </div>
                </PagePanel>
            </div>

            <div class="stack">
                <PagePanel title="Status">
                    <div class="stack detail-side">
                        <div>
                            <p class="metric-label">Visibility</p>
                            <div class="detail-side-value"><StatusTag :status="product.status" /></div>
                        </div>
                        <div>
                            <p class="metric-label">Rating</p>
                            <div class="detail-side-value"><Rating :model-value="product.rating" readonly /></div>
                        </div>
                    </div>
                </PagePanel>

                <PagePanel title="Pricing">
                    <p class="metric-value detail-price">{{ formatCurrencyPrecise(product.price) }}</p>
                    <p class="field-hint">Excludes tax and shipping.</p>
                </PagePanel>
            </div>
        </div>

        <ProductFormDialog v-model:visible="dialogOpen" :product="product ?? null" :categories="categories" @save="save" />
    </div>
</template>
