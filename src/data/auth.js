// Sesión de usuario y registro (simulado sobre la "base de datos" JS).
import { Users } from './db.js';
import { getStorage } from './storage.js';

export const SESSION_KEY = 'flipfinder_session_v2';
const listeners = new Set();
let version = 0;
const emit = () => { version += 1; listeners.forEach((fn) => fn()); };
export const subscribeSession = (fn) => { listeners.add(fn); return () => listeners.delete(fn); };
export const getSessionVersion = () => version;

export function currentUser() {
  try {
    const id = getStorage().getItem(SESSION_KEY);
    if (!id) return null;
    const u = Users.get(id);
    if (!u) return null;
    const { password, ...safe } = u; // eslint-disable-line no-unused-vars
    return safe;
  } catch { return null; }
}

export function login(email, password) {
  const e = String(email ?? '').trim().toLowerCase();
  const u = Users.list().find((x) => x.email.toLowerCase() === e && x.password === password);
  if (!u) return { ok: false, error: 'Correo o contraseña incorrectos' };
  getStorage().setItem(SESSION_KEY, u.id); emit();
  return { ok: true, user: currentUser() };
}
export function logout() { getStorage().removeItem(SESSION_KEY); emit(); }

export function register({ name, lastName, email, password }) {
  const e = String(email ?? '').trim().toLowerCase();
  if (Users.list().some((u) => u.email.toLowerCase() === e)) return { ok: false, error: 'El correo ya está registrado' };
  const u = Users.create({ name: name.trim(), lastName: lastName.trim(), email: e, password, role: 'cliente', address: { street: '', department: '', region: '', commune: '' } });
  getStorage().setItem(SESSION_KEY, u.id); emit();
  return { ok: true, user: currentUser() };
}
