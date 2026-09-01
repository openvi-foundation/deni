import type { ActivityEntry, CalendarEvent, Customer, Message, Order, Product, SeriesPoint } from '@/types';
import { loadDataset } from './http';

export interface Analytics {
    revenue: SeriesPoint[];
    orders: SeriesPoint[];
    channels: SeriesPoint[];
    categories: SeriesPoint[];
    retention: SeriesPoint[];
    satisfaction: SeriesPoint[];
}

export const getProducts = () => loadDataset<Product[]>('products');
export const getCustomers = () => loadDataset<Customer[]>('customers');
export const getOrders = () => loadDataset<Order[]>('orders');
export const getActivity = () => loadDataset<ActivityEntry[]>('activity');
export const getEvents = () => loadDataset<CalendarEvent[]>('events');
export const getMessages = () => loadDataset<Message[]>('messages');
export const getAnalytics = () => loadDataset<Analytics>('analytics');
