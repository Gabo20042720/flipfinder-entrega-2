// Acceso a almacenamiento con respaldo en memoria (si localStorage no está disponible).
const memory = {};
export const memoryStorage = {
  getItem: (k) => (k in memory ? memory[k] : null),
  setItem: (k, v) => { memory[k] = String(v); },
  removeItem: (k) => { delete memory[k]; }
};

let current;
function detect() {
  try {
    const t = '__ff_test__';
    window.localStorage.setItem(t, '1');
    window.localStorage.removeItem(t);
    return window.localStorage;
  } catch { return memoryStorage; }
}
export function getStorage() { if (!current) current = detect(); return current; }
/** Permite inyectar un storage falso (mock) en pruebas. */
export function setStorage(s) { current = s; }
