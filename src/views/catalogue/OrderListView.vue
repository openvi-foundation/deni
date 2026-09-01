<script setup lang="ts">
import Button from 'openvue/button';
import Column from 'openvue/column';
import DataTable from 'openvue/datatable';
import IconField from 'openvue/iconfield';
import InputIcon from 'openvue/inputicon';
import InputText from 'openvue/inputtext';
import SelectButton from 'openvue/selectbutton';
import { computed, onMounted } from 'vue';
import EmptyState from '@/components/EmptyState.vue';
import PageHeader from '@/components/PageHeader.vue';
import PagePanel from '@/components/PagePanel.vue';
import StatusTag from '@/components/StatusTag.vue';
import { useLazyTable } from '@/composables/useLazyTable';
import { orderCollection } from '@/data/collections';
import { queryCollection } from '@/service/query';
import type { Order, OrderStatus } from '@/types';
import { formatCurrencyPrecise, formatDate } from '@/utils/format';

const { items: orders, load } = orderCollection;

const table = useLazyTable<Order>({
    fetcher: (params) => queryCollection(orders.value, params),
    rows: 12,
    sortField: 'placedAt',
    sortOrder: -1,
    searchFields: ['reference', 'customer', 'email', 'status']
});

const statusFilter = computed({
    get: () => (table.match.value.status as OrderStatus | undefined) ?? 'all',
    set: (value: OrderStatus | 'all') => table.setFilter('status', value === 'all' ? null : value)
});

const statusOptions: { label: string; value: OrderStatus | 'all' }[] = [
    { label: 'All', value: 'all' },
    { label: 'Paid', value: 'paid' },
    { label: 'Pending', value: 'pending' },
    { label: 'Refunded', value: 'refunded' },
    { label: 'Failed', value: 'failed' }
];

onMounted(async () => {
    await load();
    await table.reload();
});

const matching = computed(() => (statusFilter.value === 'all' ? orders.value : orders.value.filter((order) => order.status === statusFilter.value)));

const revenue = computed(() => matching.value.reduce((sum, order) => sum + order.total, 0));
const units = computed(() => matching.value.reduce((sum, order) => sum + order.items, 0));

const filtersActive = computed(() => Boolean(table.search.value || statusFilter.value !== 'all'));
</script>

<template>
    <div>
        <PageHeader title="Orders" description="Checkouts from the last 45 days, paged and sorted through the data layer rather than in the browser.">
            <template #actions>
                <Button label="Refresh" icon="pi pi-refresh" severity="secondary" outlined size="small" :loading="table.loading.value" @click="table.reload" />
            </template>
        </PageHeader>

        <PagePanel flush>
            <div class="data-toolbar">
                <IconField>
                    <InputIcon class="pi pi-search" />
                    <InputText v-model="table.search.value" placeholder="Search orders" style="width: 220px" />
                </IconField>

                <SelectButton v-model="statusFilter" :options="statusOptions" option-label="label" option-value="value" :allow-empty="false" size="small" />

                <Button v-if="filtersActive" label="Clear" icon="pi pi-filter-slash" text size="small" @click="table.clearFilters" />

                <div class="data-toolbar-end">
                    <span class="data-toolbar-count" aria-live="polite">{{ table.rangeStart }}–{{ table.rangeEnd }} of {{ table.totalRecords }}</span>
                </div>
            </div>

            <DataTable
                lazy
                :value="table.items.value"
                :loading="table.loading.value"
                :total-records="table.totalRecords.value"
                :first="table.first.value"
                :rows="table.rows.value"
                :sort-field="table.sortField.value"
                :sort-order="table.sortOrder.value"
                data-key="id"
                paginator
                :rows-per-page-options="[12, 25, 50]"
                removable-sort
                current-page-report-template="{first}–{last} of {totalRecords}"
                paginator-template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink RowsPerPageDropdown"
                @page="table.onPage"
                @sort="table.onSort"
            >
                <template #empty>
                    <EmptyState icon="pi pi-receipt" title="No orders match this view" message="Try a different status or clear the search box.">
                        <Button v-if="filtersActive" label="Clear filters" size="small" outlined severity="secondary" @click="table.clearFilters" />
                    </EmptyState>
                </template>

                <Column field="reference" header="Order" sortable style="width: 120px">
                    <template #body="{ data: order }">
                        <RouterLink :to="`/orders/${order.id}`" class="cell-primary">{{ order.reference }}</RouterLink>
                    </template>
                </Column>

                <Column field="customer" header="Customer" sortable>
                    <template #body="{ data: order }">
                        <RouterLink :to="`/customers/${order.customerId}`" class="cell-primary">{{ order.customer }}</RouterLink>
                        <div class="cell-sub">{{ order.email }}</div>
                    </template>
                </Column>

                <Column field="items" header="Items" sortable style="width: 100px">
                    <template #body="{ data: order }">
                        <span class="numeric">{{ order.items }}</span>
                    </template>
                </Column>

                <Column field="total" header="Total" sortable style="width: 130px">
                    <template #body="{ data: order }">
                        <span class="numeric">{{ formatCurrencyPrecise(order.total) }}</span>
                    </template>
                </Column>

                <Column field="status" header="Status" sortable style="width: 120px">
                    <template #body="{ data: order }">
                        <StatusTag :status="order.status" />
                    </template>
                </Column>

                <Column field="placedAt" header="Placed" sortable style="width: 130px">
                    <template #body="{ data: order }">
                        <span class="muted">{{ formatDate(order.placedAt) }}</span>
                    </template>
                </Column>

                <Column header-style="width: 60px">
                    <template #body="{ data: order }">
                        <div class="cell-actions">
                            <Button icon="pi pi-arrow-up-right" severity="secondary" text rounded size="small" aria-label="Open order" as="router-link" :to="`/orders/${order.id}`" />
                        </div>
                    </template>
                </Column>
            </DataTable>

            <div class="table-summary">
                <span class="muted">Totals across {{ matching.length }} matching {{ matching.length === 1 ? 'order' : 'orders' }}</span>
                <span class="table-summary-value numeric">{{ units }} items</span>
                <span class="table-summary-value numeric">{{ formatCurrencyPrecise(revenue) }}</span>
            </div>
        </PagePanel>
    </div>
</template>
