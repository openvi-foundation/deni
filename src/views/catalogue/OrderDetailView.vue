<script setup lang="ts">
import Avatar from 'openvue/avatar';
import Button from 'openvue/button';
import Column from 'openvue/column';
import ColumnGroup from 'openvue/columngroup';
import DataTable from 'openvue/datatable';
import Row from 'openvue/row';
import Skeleton from 'openvue/skeleton';
import Timeline from 'openvue/timeline';
import { useConfirm } from 'openvue/useconfirm';
import { useToast } from 'openvue/usetoast';
import { computed } from 'vue';
import EmptyState from '@/components/EmptyState.vue';
import PageHeader from '@/components/PageHeader.vue';
import PagePanel from '@/components/PagePanel.vue';
import RecordNav from '@/components/RecordNav.vue';
import StatusTag from '@/components/StatusTag.vue';
import { useEntity } from '@/composables/useEntity';
import { customerCollection, orderCollection } from '@/data/collections';
import { formatCurrencyPrecise, formatDate, formatDateTime, initials } from '@/utils/format';

const toast = useToast();
const confirm = useConfirm();

const { update } = orderCollection;
const { id, entity: order, loading, notFound, previousId, nextId, position } = useEntity(orderCollection, (item) => item.id);

const customer = computed(() => (order.value ? customerCollection.find(order.value.customerId) : undefined));

const subtotal = computed(() => order.value?.lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0) ?? 0);
const shippingCost = computed(() => (subtotal.value > 500 ? 0 : 14.5));
const tax = computed(() => subtotal.value * 0.21);
const total = computed(() => subtotal.value + shippingCost.value + tax.value);

const refundable = computed(() => order.value?.status === 'paid');

const print = () => window.print();

const refund = () => {
    const target = order.value;

    if (!target) {
        return;
    }

    confirm.require({
        header: 'Refund order',
        message: `${target.reference} will be refunded in full to the original payment method.`,
        icon: 'pi pi-exclamation-triangle',
        rejectProps: { label: 'Cancel', severity: 'secondary', outlined: true },
        acceptProps: { label: 'Refund', severity: 'danger' },
        accept: () => {
            update(id.value, {
                status: 'refunded',
                timeline: [...target.timeline.slice(0, 3), { label: 'Refunded', at: new Date().toISOString(), done: true }]
            });
            toast.add({ severity: 'success', summary: 'Order refunded', detail: target.reference, life: 3000 });
        }
    });
};
</script>

<template>
    <div>
        <PageHeader :title="order?.reference ?? 'Order'" :description="order ? `Placed ${formatDate(order.placedAt)} by ${order.customer}` : undefined">
            <template #actions>
                <RecordNav label="order" :position="position" :previous-to="previousId ? `/orders/${previousId}` : null" :next-to="nextId ? `/orders/${nextId}` : null" />

                <Button label="Orders" icon="pi pi-arrow-left" severity="secondary" outlined size="small" as="router-link" to="/orders" />
                <Button v-if="order" label="Print" icon="pi pi-print" severity="secondary" outlined size="small" @click="print" />
                <Button v-if="refundable" label="Refund" icon="pi pi-undo" severity="danger" outlined size="small" @click="refund" />
            </template>
        </PageHeader>

        <PagePanel v-if="loading && !order">
            <Skeleton height="220px" />
        </PagePanel>

        <PagePanel v-else-if="notFound">
            <EmptyState icon="pi pi-search" title="Order not found" message="This order may have been removed or the link is out of date.">
                <Button label="Back to orders" size="small" as="router-link" to="/orders" />
            </EmptyState>
        </PagePanel>

        <div v-else-if="order" class="grid detail-grid">
            <div class="stack">
                <PagePanel title="Items" :description="`${order.items} units across ${order.lines.length} ${order.lines.length === 1 ? 'line' : 'lines'}`" flush>
                    <DataTable :value="order.lines" data-key="productId">
                        <Column field="name" header="Product">
                            <template #body="{ data: line }">
                                <RouterLink :to="`/products/${line.productId}`" class="cell-primary">{{ line.name }}</RouterLink>
                                <div class="cell-sub">{{ line.sku }}</div>
                            </template>
                        </Column>

                        <Column field="quantity" header="Qty" style="width: 90px">
                            <template #body="{ data: line }">
                                <span class="numeric">{{ line.quantity }}</span>
                            </template>
                        </Column>

                        <Column field="unitPrice" header="Unit price" style="width: 130px">
                            <template #body="{ data: line }">
                                <span class="numeric">{{ formatCurrencyPrecise(line.unitPrice) }}</span>
                            </template>
                        </Column>

                        <Column header="Amount" style="width: 130px">
                            <template #body="{ data: line }">
                                <span class="numeric">{{ formatCurrencyPrecise(line.quantity * line.unitPrice) }}</span>
                            </template>
                        </Column>

                        <ColumnGroup type="footer">
                            <Row>
                                <Column footer="Subtotal" :colspan="3" footer-style="text-align: right" />
                                <Column :footer="formatCurrencyPrecise(subtotal)" />
                            </Row>
                            <Row>
                                <Column :footer="shippingCost ? 'Shipping' : 'Shipping (free)'" :colspan="3" footer-style="text-align: right" />
                                <Column :footer="formatCurrencyPrecise(shippingCost)" />
                            </Row>
                            <Row>
                                <Column footer="VAT 21%" :colspan="3" footer-style="text-align: right" />
                                <Column :footer="formatCurrencyPrecise(tax)" />
                            </Row>
                            <Row>
                                <Column footer="Total" :colspan="3" footer-style="text-align: right" />
                                <Column :footer="formatCurrencyPrecise(total)" />
                            </Row>
                        </ColumnGroup>
                    </DataTable>
                </PagePanel>

                <PagePanel title="Fulfilment">
                    <Timeline :value="order.timeline" class="detail-timeline">
                        <template #marker="{ item }">
                            <span class="timeline-marker" :class="{ 'timeline-marker-done': item.done }">
                                <i :class="item.done ? 'pi pi-check' : 'pi pi-clock'" />
                            </span>
                        </template>
                        <template #content="{ item }">
                            <p class="detail-fact">{{ item.label }}</p>
                            <p class="cell-sub">{{ item.done ? formatDateTime(item.at) : 'Pending' }}</p>
                        </template>
                    </Timeline>
                </PagePanel>
            </div>

            <div class="stack">
                <PagePanel title="Status">
                    <div class="stack detail-side">
                        <div>
                            <p class="metric-label">Payment</p>
                            <div class="detail-side-value"><StatusTag :status="order.status" /></div>
                        </div>
                        <div>
                            <p class="metric-label">Order total</p>
                            <p class="metric-value detail-price">{{ formatCurrencyPrecise(total) }}</p>
                        </div>
                    </div>
                </PagePanel>

                <PagePanel title="Customer">
                    <div class="cell-person">
                        <Avatar :label="initials(order.customer)" shape="circle" size="large" />
                        <div>
                            <RouterLink :to="`/customers/${order.customerId}`" class="cell-primary">{{ order.customer }}</RouterLink>
                            <div class="cell-sub">{{ order.email }}</div>
                        </div>
                    </div>

                    <p v-if="customer" class="field-hint detail-side-note">{{ customer.company }} · {{ customer.role }}</p>
                </PagePanel>

                <PagePanel title="Shipping address">
                    <address class="detail-address">
                        <span>{{ order.shipping.line1 }}</span>
                        <span>{{ order.shipping.postcode }} {{ order.shipping.city }}</span>
                        <span>{{ order.shipping.country }}</span>
                    </address>
                </PagePanel>
            </div>
        </div>
    </div>
</template>
