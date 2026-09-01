export type ProductStatus = 'published' | 'draft' | 'archived';

export interface Product {
    id: string;
    name: string;
    sku: string;
    category: string;
    price: number;
    stock: number;
    rating: number;
    status: ProductStatus;
    updatedAt: string;
    description: string;
}

export type ProductDraft = Omit<Product, 'id' | 'updatedAt'>;

export type CustomerStatus = 'active' | 'invited' | 'suspended';

export interface Customer {
    id: string;
    name: string;
    email: string;
    company: string;
    country: string;
    role: string;
    status: CustomerStatus;
    joinedAt: string;
    spend: number;
    phone?: string;
    notes?: string;
}

export type OrderStatus = 'paid' | 'pending' | 'refunded' | 'failed';

export interface OrderLine {
    productId: string;
    name: string;
    sku: string;
    quantity: number;
    unitPrice: number;
}

export interface OrderAddress {
    line1: string;
    city: string;
    postcode: string;
    country: string;
}

export interface OrderEvent {
    label: string;
    at: string;
    done: boolean;
}

export interface Order {
    id: string;
    reference: string;
    customerId: string;
    customer: string;
    email: string;
    total: number;
    items: number;
    status: OrderStatus;
    placedAt: string;
    lines: OrderLine[];
    shipping: OrderAddress;
    timeline: OrderEvent[];
}

export interface ActivityEntry {
    id: string;
    actor: string;
    action: string;
    target: string;
    at: string;
    kind: 'create' | 'update' | 'delete' | 'publish';
    productId?: string;
    customerId?: string;
}

export interface CalendarEvent {
    id: string;
    title: string;
    date: string;
    time: string;
    kind: 'release' | 'meeting' | 'review' | 'deadline';
    owner: string;
}

export interface Message {
    id: string;
    from: string;
    email: string;
    subject: string;
    preview: string;
    body: string;
    receivedAt: string;
    unread: boolean;
    starred: boolean;
}

export interface SeriesPoint {
    label: string;
    value: number;
}

export interface DashboardMetric {
    key: string;
    label: string;
    value: string;
    delta: number;
    hint: string;
}

export interface SelectOption<T = string> {
    label: string;
    value: T;
}
