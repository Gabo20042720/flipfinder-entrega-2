// Carrito de compras: estado simple con persistencia en localStorage.
import { getStorage } from './storage.js';
import { Products, effectivePrice } from './db.js';

export const CART_KEY = 'flipfinder_cart_v2';
const listeners = new Set();
let items = null;
let version = 0;

function read() {
  if (items) return items;
  try { items = JSON.parse(getStorage().getItem(CART_KEY)) ?? []; } catch { items = []; }
  if (!Array.isArray(items)) items = [];
  return items;
}
function commit() {
  version += 1;
  try { getStorage().setItem(CART_KEY, JSON.stringify(items)); } catch { /* sin persistencia */ }
  listeners.forEach((fn) => fn());
}
export const subscribeCart = (fn) => { listeners.add(fn); return () => listeners.delete(fn); };
export const getCartVersion = () => version;
export function reloadCart() { items = null; version += 1; listeners.forEach((fn) => fn()); }

export const getCart = () => read().map((i) => ({ ...i }));

export function addToCart(productId, quantity = 1) {
  const p = Products.get(productId);
  if (!p || p.active === false) return { ok: false, error: 'Producto no disponible' };
  const list = read();
  const line = list.find((i) => i.productId === productId);
  const next = (line?.quantity ?? 0) + quantity;
  if (next > p.stock) return { ok: false, error: 'Stock insuficiente' };
  if (line) line.quantity = next;
  else list.push({ productId, name: p.name, price: effectivePrice(p), image: p.image, quantity });
  commit();
  return { ok: true };
}
export function setQuantity(productId, quantity) {
  const list = read(); const i = list.findIndex((x) => x.productId === productId);
  if (i < 0) return;
  if (quantity <= 0) list.splice(i, 1);
  else {
    const p = Products.get(productId);
    list[i].quantity = p ? Math.min(quantity, p.stock) : quantity;
  }
  commit();
}
export function removeFromCart(productId) { setQuantity(productId, 0); }
export function clearCart() { items = []; commit(); }

export const cartTotal = (list = read()) => list.reduce((s, i) => s + i.price * i.quantity, 0);
export const cartCount = (list = read()) => list.reduce((s, i) => s + i.quantity, 0);
