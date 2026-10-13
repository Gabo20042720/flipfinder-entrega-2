import { useSyncExternalStore } from 'react';
import { subscribe, getVersion } from '../data/db.js';
import { subscribeCart, getCartVersion, getCart, cartTotal, cartCount } from '../data/cart.js';
import { subscribeSession, getSessionVersion, currentUser } from '../data/auth.js';

/** Re-renderiza el componente cuando cambia la "base de datos". */
export const useDbVersion = () => useSyncExternalStore(subscribe, getVersion);
export function useCart() {
  useSyncExternalStore(subscribeCart, getCartVersion);
  const items = getCart();
  return { items, total: cartTotal(items), count: cartCount(items) };
}
export function useSession() {
  useSyncExternalStore(subscribeSession, getSessionVersion);
  useSyncExternalStore(subscribe, getVersion);
  return currentUser();
}
