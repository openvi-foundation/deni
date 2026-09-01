<script setup lang="ts">
import Avatar from 'openvue/avatar';
import Button from 'openvue/button';
import Column from 'openvue/column';
import DataTable from 'openvue/datatable';
import Skeleton from 'openvue/skeleton';
import Textarea from 'openvue/textarea';
import Timeline from 'openvue/timeline';
import { useToast } from 'openvue/usetoast';
import { computed, onMounted, ref, watch } from 'vue';
import EmptyState from '@/components/EmptyState.vue';
import MetricTile from '@/components/MetricTile.vue';
import PageHeader from '@/components/PageHeader.vue';
import PagePanel from '@/components/PagePanel.vue';
import RecordNav from '@/components/RecordNav.vue';
import StatusTag from '@/components/StatusTag.vue';
import { useAsyncData } from '@/composables/useAsyncData';
import { useEntity } from '@/composables/useEntity';
import { customerCollection, orderCollection } from '@/data/collections';
import { getActivity } from '@/service';
import type { ActivityEntry } from '@/types';
import { formatCurrency, formatCurrencyPrecise, formatDate, formatRelative, initials } from '@/utils/format';

const toast = useToast();

const { update } = customerCollection;
const { id, entity: customer, loading, notFound, previousId, nextId, position } = useEntity(customerCollection, (item) => item.id);

const { data: activity } = useAsyncData(getActivity, [] as ActivityEntry[]);

onMounted(orderCollection.load);

const orders = computed(() => orderCollection.items.value.filter((order) => order.customerId === id.value));

const spend = computed(() => orders.value.reduce((sum, order) => sum + order.total, 0));
const averageOrder = computed(() => (orders.value.length ? spend.value / orders.value.length : 0));

const metrics = computed(() => [
    { key: 'lifetime', label: 'Lifetime spend', value: formatCurrency(customer.value?.spend ?? 0), hint: 'since joining' },
    { key: 'orders', label: 'Orders', value: String(orders.value.length), hint: 'in the last 45 days' },
    { key: 'aov', label: 'Average order', value: formatCurrencyPrecise(averageOrder.value), hint: 'across recent orders' }
]);

const history = computed(() => activity.value.filter((entry) => entry.customerId === id.value));

const notes = ref('');

watch(
    customer,
    (value) => {
        notes.value = value?.notes ?? '';
    },
    { immediate: true }
);

const saveNotes = () => {
    update(id.value, { notes: notes.value });
    toast.add({ severity: 'success', summary: 'Notes saved', life: 2500 });
};
</script>

<template>
    <div>
        <PageHeader :title="customer?.name ?? 'Customer'" :description="customer ? `${customer.role} at ${customer.company}` : undefined">
            <template #actions>
                <RecordNav label="customer" :position="position" :previous-to="previousId ? `/customers/${previousId}` : null" :next-to="nextId ? `/customers/${nextId}` : null" />

                <Button label="Customers" icon="pi pi-arrow-left" severity="secondary" outlined size="small" as="router-link" to="/customers" />
                <Button v-if="customer" label="Send message" icon="pi pi-envelope" size="small" as="router-link" to="/inbox" />
            </template>
        </PageHeader>

        <PagePanel v-if="loading && !customer">
            <Skeleton height="220px" />
        </PagePanel>

        <PagePanel v-else-if="notFound">
            <EmptyState icon="pi pi-search" title="Customer not found" message="This account may have been removed or the link is out of date.">
                <Button label="Back to customers" size="small" as="router-link" to="/customers" />
            </EmptyState>
        </PagePanel>

        <div v-else-if="customer" class="stack">
            <div class="grid grid-metrics">
                <MetricTile v-for="metric in metrics" :key="metric.key" :label="metric.label" :value="metric.value" :hint="metric.hint" />
            </div>

            <div class="grid detail-grid">
                <div class="stack">
                    <PagePanel title="Orders" :description="`${orders.length} ${orders.length === 1 ? 'order' : 'orders'} on record`" flush>
                        <DataTable :value="orders" data-key="id" sort-field="placedAt" :sort-order="-1" removable-sort>
                            <template #empty>
                                <EmptyState icon="pi pi-receipt" title="No orders yet" message="Orders placed by this customer will appear here." />
                            </template>

                            <Column field="reference" header="Order" style="width: 120px">
                                <template #body="{ data: order }">
                                    <RouterLink :to="`/orders/${order.id}`" class="cell-primary">{{ order.reference }}</RouterLink>
                                </template>
                            </Column>

                            <Column field="items" header="Items" sortable style="width: 90px">
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
                        </DataTable>
                    </PagePanel>

                    <PagePanel title="Notes" description="Visible to everyone in your workspace.">
                        <Textarea v-model="notes" rows="4" auto-resize fluid placeholder="Add context about this account" />
                        <div class="detail-note-actions">
                            <Button label="Save notes" size="small" @click="saveNotes" />
                        </div>
                    </PagePanel>
                </div>

                <div class="stack">
                    <PagePanel title="Profile">
                        <div class="cell-person">
                            <Avatar :label="initials(customer.name)" shape="circle" size="large" />
                            <div>
                                <p class="cell-primary">{{ customer.name }}</p>
                                <p class="cell-sub">{{ customer.email }}</p>
                            </div>
                        </div>

                        <div class="stack detail-side detail-side-list">
                            <div>
                                <p class="metric-label">Status</p>
                                <div class="detail-side-value"><StatusTag :status="customer.status" /></div>
                            </div>
                            <div>
                                <p class="metric-label">Phone</p>
                                <p class="detail-fact">{{ customer.phone ?? '—' }}</p>
                            </div>
                            <div>
                                <p class="metric-label">Country</p>
                                <p class="detail-fact">{{ customer.country }}</p>
                            </div>
                            <div>
                                <p class="metric-label">Joined</p>
                                <p class="detail-fact">{{ formatDate(customer.joinedAt) }}</p>
                            </div>
                        </div>
                    </PagePanel>

                    <PagePanel title="Activity">
                        <EmptyState v-if="!history.length" icon="pi pi-history" title="Nothing recorded" message="Workspace activity for this account will show here." />

                        <Timeline v-else :value="history" class="detail-timeline">
                            <template #marker>
                                <span class="timeline-marker"><i class="pi pi-user" /></span>
                            </template>
                            <template #content="{ item }">
                                <p class="detail-fact">{{ item.actor }} {{ item.action }} {{ item.target }}</p>
                                <p class="cell-sub">{{ formatRelative(item.at) }}</p>
                            </template>
                        </Timeline>
                    </PagePanel>
                </div>
            </div>
        </div>
    </div>
</template>
