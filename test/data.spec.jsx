import { freshState } from './helpers.jsx';
import { Products, Categories, Users, Orders, DB_KEY, listActiveProducts, criticalProducts, isOnOffer, effectivePrice, discountStock, reloadDb, subscribe } from '../src/data/db.js';
import { addToCart, getCart, setQuantity, removeFromCart, clearCart, cartTotal, cartCount, CART_KEY, reloadCart } from '../src/data/cart.js';
import { login, logout, register, currentUser, SESSION_KEY } from '../src/data/auth.js';

describe('Archivo de datos (CRUD simulado)', () => {
  let storage;
  beforeEach(() => { storage = freshState(); });

  it('lee los productos iniciales (Read)', () => {
    expect(Products.list().length).toBe(12);
    expect(Products.get('p1').name).toContain('Audífonos');
  });
  it('devuelve null si el id no existe', () => { expect(Products.get('zzz')).toBeNull(); });
  it('crea un producto con id automático (Create)', () => {
    const p = Products.create({ name: 'Nuevo', price: 1000, stock: 2, categoryId: 'c1', active: true });
    expect(p.id).toBeTruthy();
    expect(Products.get(p.id).name).toBe('Nuevo');
  });
  it('actualiza un producto (Update)', () => {
    Products.update('p1', { price: 1 });
    expect(Products.get('p1').price).toBe(1);
    expect(Products.get('p1').name).toContain('Audífonos');
  });
  it('update de un id inexistente devuelve null', () => { expect(Products.update('nope', { price: 1 })).toBeNull(); });
  it('elimina un producto (Delete)', () => {
    expect(Products.remove('p1')).toBeTrue();
    expect(Products.get('p1')).toBeNull();
    expect(Products.remove('p1')).toBeFalse();
  });
  it('persiste los cambios en el almacenamiento', () => {
    Products.update('p2', { stock: 99 });
    expect(JSON.parse(storage.data[DB_KEY]).products.find((p) => p.id === 'p2').stock).toBe(99);
    reloadDb();
    expect(Products.get('p2').stock).toBe(99);
  });
  it('notifica a los suscriptores cuando cambian los datos', () => {
    const spy = jasmine.createSpy('listener');
    const off = subscribe(spy);
    Categories.create({ name: 'X' });
    expect(spy).toHaveBeenCalled();
    off();
  });
  it('lista solo productos activos y filtra por categoría y texto', () => {
    expect(listActiveProducts().some((p) => p.id === 'p12')).toBeFalse();
    expect(listActiveProducts({ categoryId: 'c2' }).every((p) => p.categoryId === 'c2')).toBeTrue();
    expect(listActiveProducts({ query: 'teclado' }).length).toBe(1);
  });
  it('detecta ofertas y calcula el precio efectivo', () => {
    expect(isOnOffer(Products.get('p1'))).toBeTrue();
    expect(effectivePrice(Products.get('p1'))).toBe(29990);
    expect(effectivePrice(Products.get('p2'))).toBe(54990);
    expect(listActiveProducts({ onlyOffers: true }).length).toBeGreaterThan(0);
  });
  it('identifica productos con stock crítico', () => {
    const ids = criticalProducts().map((p) => p.id);
    expect(ids).toContain('p2');
    expect(ids).not.toContain('p9');
  });
  it('descuenta stock sin bajar de cero', () => {
    discountStock([{ productId: 'p5', quantity: 10 }]);
    expect(Products.get('p5').stock).toBe(0);
  });
  it('genera números de orden correlativos', () => {
    const n = Number(Orders.nextNumber());
    Orders.create({ number: String(n), items: [], total: 0, status: 'pagado', date: new Date().toISOString(), customer: {}, address: {} });
    expect(Number(Orders.nextNumber())).toBe(n + 1);
  });
  it('si el almacenamiento está corrupto vuelve a los datos iniciales', () => {
    storage.setItem(DB_KEY, '{no es json');
    reloadDb();
    expect(Products.list().length).toBe(12);
  });
});

describe('Carrito de compras', () => {
  beforeEach(() => { freshState(); });

  it('agrega un producto y calcula total y cantidad', () => {
    expect(addToCart('p1', 2).ok).toBeTrue();
    expect(getCart().length).toBe(1);
    expect(cartTotal()).toBe(29990 * 2);
    expect(cartCount()).toBe(2);
  });
  it('suma cantidades del mismo producto', () => { addToCart('p3'); addToCart('p3'); expect(getCart()[0].quantity).toBe(2); });
  it('rechaza agregar más que el stock', () => {
    const r = addToCart('p11', 2);
    expect(r.ok).toBeFalse();
    expect(r.error).toContain('Stock');
  });
  it('rechaza productos inexistentes u ocultos', () => {
    expect(addToCart('nope').ok).toBeFalse();
    expect(addToCart('p12').ok).toBeFalse();
  });
  it('cambia la cantidad y respeta el stock máximo', () => {
    addToCart('p2'); setQuantity('p2', 50);
    expect(getCart()[0].quantity).toBe(3);
  });
  it('elimina el producto al llegar a cantidad 0', () => { addToCart('p3'); setQuantity('p3', 0); expect(getCart().length).toBe(0); });
  it('removeFromCart y clearCart vacían el carrito', () => {
    addToCart('p3'); addToCart('p4'); removeFromCart('p3');
    expect(getCart().length).toBe(1);
    clearCart(); expect(getCart().length).toBe(0);
  });
  it('persiste el carrito en almacenamiento', () => {
    const s = freshState();
    addToCart('p3');
    expect(JSON.parse(s.data[CART_KEY]).length).toBe(1);
    reloadCart();
    expect(getCart().length).toBe(1);
  });
});

describe('Sesión de usuario', () => {
  beforeEach(() => { freshState(); });

  it('inicia sesión con credenciales correctas y no expone la contraseña', () => {
    const r = login('admin@flipfinder.cl', 'admin123');
    expect(r.ok).toBeTrue();
    expect(currentUser().role).toBe('admin');
    expect(currentUser().password).toBeUndefined();
  });
  it('rechaza credenciales incorrectas', () => {
    const r = login('admin@flipfinder.cl', 'mala');
    expect(r.ok).toBeFalse();
    expect(currentUser()).toBeNull();
  });
  it('cierra sesión', () => { login('cliente@flipfinder.cl', 'cliente123'); logout(); expect(currentUser()).toBeNull(); });
  it('registra un usuario nuevo e inicia sesión', () => {
    const r = register({ name: 'Ana', lastName: 'Pérez', email: 'ANA@mail.cl', password: 'secreto' });
    expect(r.ok).toBeTrue();
    expect(Users.list().some((u) => u.email === 'ana@mail.cl')).toBeTrue();
    expect(currentUser().name).toBe('Ana');
  });
  it('no permite registrar un correo repetido', () => {
    expect(register({ name: 'X', lastName: 'Y', email: 'admin@flipfinder.cl', password: '123456' }).ok).toBeFalse();
  });
  it('guarda el id de sesión en el almacenamiento', () => {
    const s = freshState(); login('cliente@flipfinder.cl', 'cliente123');
    expect(s.data[SESSION_KEY]).toBe('u2');
  });
});
