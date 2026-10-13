import { Routes, Route } from 'react-router-dom';
import { mount, cleanup, $, $$, byText, click, type, submit, freshState } from './helpers.jsx';
import Products from '../src/pages/Products.jsx';
import Offers from '../src/pages/Offers.jsx';
import Cart from '../src/pages/Cart.jsx';
import Checkout from '../src/pages/Checkout.jsx';
import OrderResult from '../src/pages/OrderResult.jsx';
import ProductDetail from '../src/pages/ProductDetail.jsx';
import { Login, Register } from '../src/pages/Auth.jsx';
import { Contact, Blogs, BlogDetail } from '../src/pages/Static.jsx';
import { AdminProducts, ProductEdit } from '../src/pages/admin/AdminProducts.jsx';
import AdminLayout from '../src/pages/admin/AdminLayout.jsx';
import Dashboard from '../src/pages/admin/Dashboard.jsx';
import { Products as ProductsDb, Orders, Users } from '../src/data/db.js';
import { addToCart, getCart } from '../src/data/cart.js';
import { login, currentUser } from '../src/data/auth.js';

const FILL = { 'co-name': 'Pedro', 'co-last': 'Hacker', 'co-email': 'pedro@mail.cl', 'co-street': 'Los Crisantemos 1', 'co-region': 'Región Metropolitana de Santiago' };
function fillCheckout(host, card) {
  Object.entries(FILL).forEach(([id, v]) => type($(host, `#${id}`), v));
  type($(host, '#co-commune'), 'Cerrillos');
  type($(host, '#co-card'), card);
}
const checkoutApp = () => (
  <Routes>
    <Route path="/checkout" element={<Checkout />} />
    <Route path="/carrito" element={<div>CARRITO</div>} />
    <Route path="/compra/exitosa/:id" element={<OrderResult success />} />
    <Route path="/compra/error/:id" element={<OrderResult success={false} />} />
  </Routes>
);

describe('Páginas de la tienda', () => {
  beforeEach(() => freshState());
  afterEach(cleanup);

  it('Productos lista solo los productos activos', () => {
    const { host } = mount(<Products />, '/productos');
    expect($$(host, '[data-testid="product-card"]').length).toBe(11);
  });
  it('Productos filtra por categoría al hacer clic en un filtro', () => {
    const { host } = mount(<Products />, '/productos');
    click(byText(host, 'button', 'Deportes'));
    expect($$(host, '[data-testid="product-card"]').length).toBe(3);
  });
  it('Productos filtra por el texto de la URL (?q=)', () => {
    const { host } = mount(<Products />, '/productos?q=mochila');
    expect($$(host, '[data-testid="product-card"]').length).toBe(1);
  });
  it('Productos muestra mensaje si la búsqueda no tiene resultados', () => {
    const { host } = mount(<Products />, '/productos?q=zzzz');
    expect(host.textContent).toContain('No encontramos productos');
  });
  it('Ofertas muestra solo productos en oferta', () => {
    const { host } = mount(<Offers />, '/ofertas');
    const cards = $$(host, '[data-testid="product-card"]');
    expect(cards.length).toBe(5);
    expect(cards.every((c) => c.querySelector('s'))).toBeTrue();
  });
  it('añadir desde el catálogo actualiza el carrito', () => {
    const { host } = mount(<Products />, '/productos');
    click($(host, '[data-testid="product-card"] button'));
    expect(getCart().length).toBe(1);
  });
  it('Detalle de producto agrega la cantidad elegida', () => {
    const { host } = mount(<Routes><Route path="/productos/:id" element={<ProductDetail />} /></Routes>, '/productos/p3');
    type($(host, '#qty'), '2');
    click(byText(host, 'button', 'Añadir al carrito'));
    expect(getCart()[0].quantity).toBe(2);
    expect(host.textContent).toContain('añadido');
  });
  it('Detalle de producto inexistente muestra un error', () => {
    const { host } = mount(<Routes><Route path="/productos/:id" element={<ProductDetail />} /></Routes>, '/productos/nope');
    expect($(host, '[role="alert"]')).not.toBeNull();
  });
  it('Carrito vacío ofrece ver productos', () => {
    const { host } = mount(<Cart />, '/carrito');
    expect(host.textContent).toContain('vacío');
  });
  it('Carrito aumenta la cantidad y recalcula el total', () => {
    addToCart('p3');
    const { host } = mount(<Cart />, '/carrito');
    click($(host, '[aria-label^="Agregar una unidad"]'));
    expect($(host, '[data-testid="qty"]').textContent).toBe('2');
    expect($(host, '[data-testid="cart-total"]').textContent).toContain('29.980');
  });
  it('Carrito permite eliminar y limpiar', () => {
    addToCart('p3'); addToCart('p4');
    const { host } = mount(<Cart />, '/carrito');
    click(byText(host, 'button', 'Eliminar'));
    expect(getCart().length).toBe(1);
    click(byText(host, 'button', 'Limpiar'));
    expect(getCart().length).toBe(0);
  });
  it('Contacto valida los campos y muestra confirmación al enviar', () => {
    const { host } = mount(<Contact />);
    submit($(host, 'form'));
    expect(host.textContent).toContain('Ingresa tu nombre');
    type($(host, '#ct-name'), 'Ana'); type($(host, '#ct-email'), 'ana@mail.cl'); type($(host, '#ct-msg'), 'Hola, quisiera consultar.');
    submit($(host, 'form'));
    expect(host.textContent).toContain('Mensaje enviado');
  });
  it('Blog lista las entradas y el detalle muestra el contenido', () => {
    const a = mount(<Blogs />);
    expect($$(a.host, 'article').length).toBe(2);
    const b = mount(<Routes><Route path="/blogs/:id" element={<BlogDetail />} /></Routes>, '/blogs/b1');
    expect(b.host.textContent).toContain('audífonos');
  });
});

describe('Autenticación (vistas)', () => {
  beforeEach(() => freshState());
  afterEach(cleanup);

  it('Login muestra error con credenciales incorrectas', () => {
    const { host } = mount(<Login />);
    type($(host, '#lg-email'), 'admin@flipfinder.cl'); type($(host, '#lg-pass'), 'mala');
    submit($(host, 'form'));
    expect($(host, '[role="alert"]').textContent).toContain('incorrectos');
  });
  it('Login con credenciales correctas inicia la sesión', () => {
    const { host } = mount(<Login />);
    type($(host, '#lg-email'), 'cliente@flipfinder.cl'); type($(host, '#lg-pass'), 'cliente123');
    submit($(host, 'form'));
    expect(currentUser().email).toBe('cliente@flipfinder.cl');
  });
  it('Registro valida contraseñas distintas', () => {
    const { host } = mount(<Register />);
    type($(host, '#rg-name'), 'Ana'); type($(host, '#rg-last'), 'P'); type($(host, '#rg-email'), 'ana@mail.cl');
    type($(host, '#rg-pass'), '123456'); type($(host, '#rg-conf'), '654321');
    submit($(host, 'form'));
    expect(host.textContent).toContain('no coinciden');
    expect(Users.list().length).toBe(2);
  });
  it('Registro crea la cuenta cuando los datos son válidos', () => {
    const { host } = mount(<Register />);
    type($(host, '#rg-name'), 'Ana'); type($(host, '#rg-last'), 'P'); type($(host, '#rg-email'), 'ana@mail.cl');
    type($(host, '#rg-pass'), '123456'); type($(host, '#rg-conf'), '123456');
    submit($(host, 'form'));
    expect(Users.list().length).toBe(3);
  });
});

describe('Checkout y resultado de compra', () => {
  beforeEach(() => freshState());
  afterEach(cleanup);

  it('redirige al carrito si no hay productos', () => {
    const { host } = mount(checkoutApp(), '/checkout');
    expect(host.textContent).toBe('CARRITO');
  });
  it('muestra errores de validación y no crea la orden', () => {
    addToCart('p3');
    const before = Orders.list().length;
    const { host } = mount(checkoutApp(), '/checkout');
    submit($(host, 'form'));
    expect(host.textContent).toContain('Ingresa tu nombre');
    expect(host.textContent).toContain('Tarjeta no válida');
    expect(Orders.list().length).toBe(before);
  });
  it('la comuna depende de la región elegida', () => {
    addToCart('p3');
    const { host } = mount(checkoutApp(), '/checkout');
    expect($(host, '#co-commune').disabled).toBeTrue();
    type($(host, '#co-region'), 'Región del Biobío');
    expect($$(host, '#co-commune option').map((o) => o.textContent)).toContain('Concepción');
  });
  it('autocompleta los datos cuando hay sesión iniciada', () => {
    login('cliente@flipfinder.cl', 'cliente123'); addToCart('p3');
    const { host } = mount(checkoutApp(), '/checkout');
    expect($(host, '#co-name').value).toBe('Camila');
    expect($(host, '#co-street').value).toContain('Crisantemos');
  });
  it('pago aprobado: crea orden pagada, descuenta stock y vacía el carrito', () => {
    addToCart('p3', 2);
    const stock = ProductsDb.get('p3').stock;
    const { host } = mount(checkoutApp(), '/checkout');
    fillCheckout(host, '4242 4242 4242 4242');
    submit($(host, 'form'));
    expect($(host, '[data-testid="result-title"]').textContent).toContain('Se ha realizado la compra');
    expect(Orders.list().some((o) => o.status === 'pagado' && o.customer.name === 'Pedro')).toBeTrue();
    expect(ProductsDb.get('p3').stock).toBe(stock - 2);
    expect(getCart().length).toBe(0);
  });
  it('pago rechazado: orden rechazada, conserva carrito y ofrece reintentar', () => {
    addToCart('p3');
    const { host } = mount(checkoutApp(), '/checkout');
    fillCheckout(host, '4000 0000 0000 0002');
    submit($(host, 'form'));
    expect($(host, '[data-testid="result-title"]').textContent).toContain('No se pudo realizar el pago');
    expect(host.textContent).toContain('Volver a realizar el pago');
    expect(Orders.list().some((o) => o.status === 'rechazado')).toBeTrue();
    expect(getCart().length).toBe(1);
  });
  it('OrderResult con una orden inexistente muestra un error', () => {
    const { host } = mount(<Routes><Route path="/compra/exitosa/:id" element={<OrderResult success />} /></Routes>, '/compra/exitosa/nope');
    expect($(host, '[role="alert"]')).not.toBeNull();
  });
});

describe('Panel de administración', () => {
  beforeEach(() => freshState());
  afterEach(cleanup);
  const adminApp = (route) => mount(
    <Routes>
      <Route path="/login" element={<div>LOGIN</div>} />
      <Route path="/" element={<div>HOME</div>} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="productos" element={<AdminProducts />} />
        <Route path="productos/:id/editar" element={<ProductEdit />} />
      </Route>
    </Routes>, route);

  it('sin sesión redirige a login', () => { expect(adminApp('/admin').host.textContent).toBe('LOGIN'); });
  it('un cliente no puede entrar al panel', () => { login('cliente@flipfinder.cl', 'cliente123'); expect(adminApp('/admin').host.textContent).toBe('HOME'); });
  it('el administrador ve el dashboard con sus métricas', () => {
    login('admin@flipfinder.cl', 'admin123');
    const { host } = adminApp('/admin');
    expect(host.textContent).toContain('Dashboard');
    expect($$(host, '[data-testid="stat-value"]')[0].textContent).toBe('2');
  });
  it('elimina un producto con confirmación y la lista se actualiza', () => {
    login('admin@flipfinder.cl', 'admin123');
    const { host } = adminApp('/admin/productos');
    expect($$(host, 'tbody tr').length).toBe(12);
    click($$(host, 'tbody button')[0]);
    click(byText(host, 'button', '¿Confirmar?'));
    expect($$(host, 'tbody tr').length).toBe(11);
    expect(ProductsDb.get('p1')).toBeNull();
  });
  it('edita un producto y guarda los cambios', () => {
    login('admin@flipfinder.cl', 'admin123');
    const { host } = adminApp('/admin/productos/p2/editar');
    type($(host, '#pf-stock'), '40');
    submit($(host, 'form'));
    expect(ProductsDb.get('p2').stock).toBe(40);
  });
});
