import { formatCLP, isValidEmail, isStrongPassword, validateCheckout, formatDate } from '../src/utils/format.js';
import { sortProducts } from '../src/pages/Products.jsx';
import { validateProduct } from '../src/components/ProductForm.jsx';
import { salesByProduct } from '../src/pages/admin/Reports.jsx';
import { salesSummary } from '../src/pages/admin/Dashboard.jsx';

describe('Utilidades de formato y validación', () => {
  it('formatea precios como moneda chilena', () => expect(formatCLP(1000)).toContain('1.000'));
  it('convierte valores no numéricos en cero', () => expect(formatCLP('abc')).toContain('0'));
  it('valida correos', () => {
    expect(isValidEmail('alumno@duoc.cl')).toBeTrue();
    expect(isValidEmail('alumnoduoc.cl')).toBeFalse();
    expect(isValidEmail('')).toBeFalse();
    expect(isValidEmail('  alumno@duoc.cl  ')).toBeTrue();
  });
  it('exige contraseñas de 6 caracteres o más', () => { expect(isStrongPassword('12345')).toBeFalse(); expect(isStrongPassword('123456')).toBeTrue(); });
  it('formatDate devuelve vacío con fechas inválidas', () => { expect(formatDate('xx')).toBe(''); expect(formatDate('2024-10-01T12:00:00Z')).not.toBe(''); });
  it('validateCheckout detecta todos los campos faltantes', () => {
    expect(Object.keys(validateCheckout({})).sort()).toEqual(['card', 'commune', 'email', 'lastName', 'name', 'region', 'street']);
  });
  it('validateCheckout acepta datos completos', () => {
    expect(validateCheckout({ name: 'A', lastName: 'B', email: 'a@b.cl', street: 'Calle 1', region: 'R', commune: 'C', card: '4242 4242 4242 4242' })).toEqual({});
  });
  it('validateProduct valida precio, oferta, stock y categoría', () => {
    const e = validateProduct({ name: '', price: 0, offerPrice: 5000, stock: -1, categoryId: '' });
    expect(Object.keys(e).sort()).toEqual(['categoryId', 'name', 'offerPrice', 'price', 'stock']);
    expect(validateProduct({ name: 'A', price: 100, offerPrice: '', stock: 1, categoryId: 'c1' })).toEqual({});
  });
  it('sortProducts ordena por precio efectivo', () => {
    const list = [{ price: 300, offerPrice: null }, { price: 500, offerPrice: 100 }, { price: 200, offerPrice: null }];
    expect(sortProducts(list, 'asc').map((p) => p.price)).toEqual([500, 200, 300]);
    expect(sortProducts(list, 'desc').map((p) => p.price)).toEqual([300, 200, 500]);
    expect(sortProducts(list, 'relevant')).toBe(list);
  });
  it('salesByProduct y salesSummary consideran solo órdenes pagadas', () => {
    const orders = [
      { status: 'pagado', total: 300, items: [{ name: 'A', price: 100, quantity: 3 }] },
      { status: 'rechazado', total: 999, items: [{ name: 'B', price: 999, quantity: 1 }] }
    ];
    expect(salesByProduct(orders)).toEqual([{ name: 'A', units: 3, amount: 300 }]);
    expect(salesSummary(orders)).toEqual({ count: 1, total: 300 });
  });
});
