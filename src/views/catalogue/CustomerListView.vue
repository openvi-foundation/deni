<script setup lang="ts">
import Avatar from 'openvue/avatar';
import Button from 'openvue/button';
import Column from 'openvue/column';
import DataTable from 'openvue/datatable';
import DataView from 'openvue/dataview';
import IconField from 'openvue/iconfield';
import InputIcon from 'openvue/inputicon';
import InputText from 'openvue/inputtext';
import MultiSelect from 'openvue/multiselect';
import SelectButton from 'openvue/selectbutton';
import { computed, onMounted, ref } from 'vue';
import EmptyState from '@/components/EmptyState.vue';
import PageHeader from '@/components/PageHeader.vue';
import PagePanel from '@/components/PagePanel.vue';
import StatusTag from '@/components/StatusTag.vue';
import { useDataTableState } from '@/composables/useDataTableState';
import { customerCollection } from '@/data/collections';
import { formatCurrency, formatDate, initials } from '@/utils/format';

const { items: customers, loading, load } = customerCollection;

onMounted(load);

const table = useDataTableState(() => customers.value, ['name', 'email', 'company', 'country', 'role']);

const roles = computed(() => Array.from(new Set(customers.value.map((customer) => customer.role))).sort());
const roleFilter = ref<string[]>([]);

const view = ref<'table' | 'cards'>('table');
const viewOptions = [
    { value: 'table', icon: 'pi pi-list' },
    { value: 'cards', icon: 'pi pi-th-large' }
];

const byRole = computed(() => (roleFilter.value.length ? customers.value.filter((customer) => roleFilter.value.includes(customer.role)) : customers.value));

const term = computed(() => table.search.value.trim().toLowerCase());

const visible = computed(() => {
    if (!term.value) {
        return byRole.value;
    }

    return byRole.value.filter((customer) => [customer.name, customer.email, customer.company, customer.country, customer.role].some((field) => field.toLowerCase().includes(term.value)));
});

const filtersActive = computed(() => Boolean(roleFilter.value.length || table.search.value));

const clearFilters = () => {
    roleFilter.value = [];
    table.resetFilters();
};
</script>

<template>
    <div>
        <PageHeader title="Customers" description="People and organisations with an account in your workspace.">
            <template #actions>
                <Button label="Invite" icon="pi pi-user-plus" size="small" />
            </template>
        </PageHeader>

        <PagePanel flush>
            <div class="data-toolbar">
                <IconField>
                    <InputIcon class="pi pi-search" />
                    <InputText v-model="table.search.value" placeholder="Search customers" style="width: 220px" />
                </IconField>

                <MultiSelect v-model="roleFilter" :options="roles" placeholder="Role" :max-selected-labels="1" selected-items-label="{0} roles" style="width: 180px" />

                <Button v-if="filtersActive" label="Clear" icon="pi pi-filter-slash" text size="small" @click="clearFilters" />

                <div class="data-toolbar-end">
                    <span class="data-toolbar-count" aria-live="polite">{{ visible.length }} of {{ table.total }}</span>
                    <SelectButton v-model="view" :options="viewOptions" option-value="value" :allow-empty="false" size="small" aria-label="View mode">
                        <template #option="{ option }">
                            <i :class="option.icon" />
                        </template>
                    </SelectButton>
                </div>
            </div>

            <DataTable
                v-if="view === 'table'"
                :value="visible"
                :loading="loading"
                data-key="id"
                paginator
                :rows="12"
                :rows-per-page-options="[12, 25, 50]"
                sort-field="joinedAt"
                :sort-order="-1"
                removable-sort
                current-page-report-template="{first}–{last} of {totalRecords}"
                paginator-template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink RowsPerPageDropdown"
            >
                <template #empty>
                    <EmptyState icon="pi pi-users" title="No matching customers" message="Adjust the filters or invite someone new to your workspace.">
                        <Button v-if="filtersActive" label="Clear filters" size="small" outlined severity="secondary" @click="clearFilters" />
                    </EmptyState>
                </template>

                <Column field="name" header="Name" sortable>
                    <template #body="{ data: customer }">
                        <div class="cell-person">
                            <Avatar :label="initials(customer.name)" shape="circle" size="normal" />
                            <div>
                                <RouterLink :to="`/customers/${customer.id}`" class="cell-primary">{{ customer.name }}</RouterLink>
                                <div class="cell-sub">{{ customer.email }}</div>
                            </div>
                        </div>
                    </template>
                </Column>

                <Column field="company" header="Company" sortable style="width: 180px" />
                <Column field="country" header="Country" sortable style="width: 140px" />
                <Column field="role" header="Role" sortable style="width: 140px" />

                <Column field="spend" header="Lifetime spend" sortable style="width: 150px">
                    <template #body="{ data: customer }">
                        <span class="numeric">{{ formatCurrency(customer.spend) }}</span>
                    </template>
                </Column>

                <Column field="status" header="Status" sortable style="width: 120px">
                    <template #body="{ data: customer }">
                        <StatusTag :status="customer.status" />
                    </template>
                </Column>

                <Column field="joinedAt" header="Joined" sortable style="width: 130px">
                    <template #body="{ data: customer }">
                        <span class="muted">{{ formatDate(customer.joinedAt) }}</span>
                    </template>
                </Column>
            </DataTable>

            <DataView v-else :value="visible" :rows="12" paginator layout="grid" data-key="id" current-page-report-template="{first}–{last} of {totalRecords}">
                <template #empty>
                    <EmptyState icon="pi pi-users" title="No matching customers" message="Adjust the filters or invite someone new to your workspace.">
                        <Button v-if="filtersActive" label="Clear filters" size="small" outlined severity="secondary" @click="clearFilters" />
                    </EmptyState>
                </template>

                <template #grid="{ items }">
                    <div class="customer-grid">
                        <article v-for="customer in items" :key="customer.id" class="customer-card">
                            <header class="customer-card-head">
                                <Avatar :label="initials(customer.name)" shape="circle" size="large" />
                                <div class="customer-card-identity">
                                    <RouterLink :to="`/customers/${customer.id}`" class="cell-primary">{{ customer.name }}</RouterLink>
                                    <span class="cell-sub">{{ customer.email }}</span>
                                </div>
                                <StatusTag :status="customer.status" />
                            </header>

                            <dl class="customer-card-facts">
                                <div>
                                    <dt class="metric-label">Company</dt>
                                    <dd>{{ customer.company }}</dd>
                                </div>
                                <div>
                                    <dt class="metric-label">Role</dt>
                                    <dd>{{ customer.role }}</dd>
                                </div>
                                <div>
                                    <dt class="metric-label">Spend</dt>
                                    <dd class="numeric">{{ formatCurrency(customer.spend) }}</dd>
                                </div>
                                <div>
                                    <dt class="metric-label">Joined</dt>
                                    <dd class="muted">{{ formatDate(customer.joinedAt) }}</dd>
                                </div>
                            </dl>
                        </article>
                    </div>
                </template>
            </DataView>
        </PagePanel>
    </div>
</template>
