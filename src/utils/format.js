export function formatCLP(amount) {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(Number(amount) || 0);
}
export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email ?? '').trim());
export const isStrongPassword = (pw) => String(pw ?? '').length >= 6;
export const formatDate = (iso) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('es-CL');
};

/** Valida el formulario de checkout; devuelve un objeto { campo: mensaje }. */
export function validateCheckout(v) {
  const errors = {};
  if (!v.name?.trim()) errors.name = 'Ingresa tu nombre';
  if (!v.lastName?.trim()) errors.lastName = 'Ingresa tus apellidos';
  if (!isValidEmail(v.email)) errors.email = 'Correo no válido';
  if (!v.street?.trim()) errors.street = 'Ingresa la calle';
  if (!v.region) errors.region = 'Selecciona una región';
  if (!v.commune) errors.commune = 'Selecciona una comuna';
  if (!/^\d{13,19}$/.test(String(v.card ?? '').replace(/\s/g, ''))) errors.card = 'Tarjeta no válida (13 a 19 dígitos)';
  return errors;
}
export const CARD_REJECTED = '4000000000000002';
