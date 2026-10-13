// "Base de datos" simulada en JavaScript con CRUD y persistencia en localStorage.
import { SEED_CATEGORIES, SEED_PRODUCTS, SEED_USERS, SEED_ORDERS } from './seed.js';
import { getStorage } from './storage.js';

export const DB_KEY = 'flipfinder_db_v2';
const listeners = new Set();
let cache = null;
let version = 0;

const clone = (v) => JSON.parse(JSON.stringify(v));
const seed = () => clone({ categories: SEED_CATEGORIES, products: SEED_PRODUCTS, users: SEED_USERS, orders: SEED_ORDERS });

function load() {
  if (cache) return cache;
  try {
    const raw = getStorage().getItem(DB_KEY);
    cache = raw ? JSON.parse(raw) : seed();
  } catch { cache = seed(); }
  return cache;
}
function persist() {
  version += 1;
  try { getStorage().setItem(DB_KEY, JSON.stringify(cache)); } catch { /* sin persistencia */ }
  listeners.forEach((fn) => fn());
}

/** Suscripción a cambios: permite refrescar la interfaz en tiempo real. */
export function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }
export function getVersion() { return version; }

/** Restaura los datos iniciales (útil para pruebas y demostración). */
export function resetDb() { cache = seed(); persist(); }
/** Descarta la caché en memoria para volver a leer desde el storage. */
export function reloadDb() { cache = null; version += 1; listeners.forEach((fn) => fn()); }

let counter = 0;
const newId = (prefix) => `${prefix}${Date.now().toString(36)}${(counter++).toString(36)}`;

function table(name, prefix) {
  return {
    list: () => clone(load()[name]),
    get: (id) => { const r = load()[name].find((x) => x.id === id); return r ? clone(r) : null; },
    create: (data) => {
      const rec = { ...clone(data), id: data.id ?? newId(prefix) };
      load()[name].push(rec); persist(); return clone(rec);
    },
    update: (id, patch) => {
      const rows = load()[name]; const i = rows.findIndex((x) => x.id === id);
      if (i < 0) return null;
      rows[i] = { ...rows[i], ...clone(patch), id }; persist(); return clone(rows[i]);
    },
    remove: (id) => {
      const rows = load()[name]; const i = rows.findIndex((x) => x.id === id);
      if (i < 0) return false;
      rows.splice(i, 1); persist(); return true;
    }
  };
}

export const Categories = table('categories', 'c');
export const Products = table('products', 'p');
export const Users = table('users', 'u');
const OrdersBase = table('orders', 'o');
export const Orders = {
  ...OrdersBase,
  /** Genera el siguiente número de orden correlativo. */
  nextNumber: () => String(Math.max(20240000, ...load().orders.map((o) => Number(o.number) || 0)) + 1),
  byUser: (userId) => OrdersBase.list().filter((o) => o.userId === userId)
};

// Consultas de negocio
export const isOnOffer = (p) => p.offerPrice != null && p.offerPrice > 0 && p.offerPrice < p.price;
export const effectivePrice = (p) => (isOnOffer(p) ? p.offerPrice : p.price);
export const CRITICAL_STOCK = 5;
export const isCritical = (p) => p.stock <= CRITICAL_STOCK;

export function listActiveProducts({ categoryId, query, onlyOffers } = {}) {
  const q = (query ?? '').trim().toLowerCase();
  return Products.list().filter((p) =>
    p.active !== false &&
    (!categoryId || p.categoryId === categoryId) &&
    (!onlyOffers || isOnOffer(p)) &&
    (!q || `${p.name} ${p.description}`.toLowerCase().includes(q)));
}
export const criticalProducts = () => Products.list().filter(isCritical);

/** Descuenta stock al confirmar una compra pagada. */
export function discountStock(items) {
  items.forEach(({ productId, quantity }) => {
    const p = Products.get(productId);
    if (p) Products.update(productId, { stock: Math.max(0, p.stock - quantity) });
  });
}
