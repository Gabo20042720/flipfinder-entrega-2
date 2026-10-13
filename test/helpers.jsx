import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { setStorage } from '../src/data/storage.js';
import { reloadDb, resetDb } from '../src/data/db.js';
import { reloadCart } from '../src/data/cart.js';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

/** Storage falso (mock) en memoria para aislar cada prueba de localStorage real. */
export function fakeStorage(initial = {}) {
  const data = { ...initial };
  return {
    data,
    getItem: (k) => (k in data ? data[k] : null),
    setItem: (k, v) => { data[k] = String(v); },
    removeItem: (k) => { delete data[k]; }
  };
}
/** Deja la "base de datos", el carrito y la sesión en estado inicial. */
export function freshState() {
  const s = fakeStorage();
  setStorage(s); reloadDb(); reloadCart(); resetDb();
  return s;
}

const mounted = [];
export function mount(ui, route = '/') {
  const host = document.createElement('div');
  document.body.appendChild(host);
  const root = createRoot(host);
  act(() => root.render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>));
  const api = { host, unmount() { act(() => root.unmount()); host.remove(); } };
  mounted.push(api);
  return api;
}
export function cleanup() { while (mounted.length) mounted.pop().unmount(); }

export const $ = (host, sel) => host.querySelector(sel);
export const $$ = (host, sel) => Array.from(host.querySelectorAll(sel));
export const byText = (host, sel, text) => $$(host, sel).find((e) => e.textContent.includes(text));
export function click(el) { act(() => { el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })); }); }
export function type(el, value) {
  const proto = el.tagName === 'SELECT' ? HTMLSelectElement.prototype : el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(proto, 'value').set;
  act(() => {
    setter.call(el, value);
    el.dispatchEvent(new Event(el.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true }));
  });
}
export function submit(form) { act(() => { form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })); }); }
