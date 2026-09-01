import { createCollection } from './collection';
import { getCustomers, getMessages, getOrders, getProducts } from '@/service';
import type { Customer, Message, Order, Product } from '@/types';

export const productCollection = createCollection<Product>({
    key: 'products',
    loader: getProducts,
    idOf: (product) => product.id,
    labelOf: (product) => product.name
});

export const customerCollection = createCollection<Customer>({
    key: 'customers',
    loader: getCustomers,
    idOf: (customer) => customer.id,
    labelOf: (customer) => customer.name
});

export const orderCollection = createCollection<Order>({
    key: 'orders',
    loader: getOrders,
    idOf: (order) => order.id,
    labelOf: (order) => order.reference
});

export const messageCollection = createCollection<Message>({
    key: 'messages',
    loader: getMessages,
    idOf: (message) => message.id,
    labelOf: (message) => message.subject,
    track: false
});

const all = [productCollection, customerCollection, orderCollection, messageCollection];

export const resetDemoData = () => Promise.all(all.map((collection) => collection.reset()));
