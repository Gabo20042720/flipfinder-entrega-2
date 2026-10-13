import { mount, cleanup, $, $$, byText, click, type, submit, freshState } from './helpers.jsx';
import NavBar from '../src/components/NavBar.jsx';
import SearchBar from '../src/components/SearchBar.jsx';
import ProductCard from '../src/components/ProductCard.jsx';
import ProductGrid from '../src/components/ProductGrid.jsx';
import CategoryChips from '../src/components/CategoryChips.jsx';
import Alert from '../src/components/Alert.jsx';
import CartTable from '../src/components/CartTable.jsx';
import ProductForm from '../src/components/ProductForm.jsx';
import ConfirmButton from '../src/components/ConfirmButton.jsx';
import StatCard from '../src/components/StatCard.jsx';
import FormField from '../src/components/FormField.jsx';
import AdminSidebar from '../src/components/AdminSidebar.jsx';
import Footer from '../src/components/Footer.jsx';
import { Products, Categories } from '../src/data/db.js';

describe('Pruebas de renderizado', () => {
  beforeEach(() => freshState());
  afterEach(cleanup);

  it('ProductGrid renderiza todos los elementos de la lista', () => {
    const { host } = mount(<ProductGrid products={Products.list().slice(0, 5)} categories={Categories.list()} />);
    expect($$(host, '[data-testid="product-card"]').length).toBe(5);
  });
  it('ProductGrid muestra el mensaje vacío cuando no hay productos (renderizado condicional)', () => {
    const { host } = mount(<ProductGrid products={[]} emptyMessage="Nada por aquí" />);
    expect(host.textContent).toContain('Nada por aquí');
    expect($$(host, '[data-testid="product-card"]').length).toBe(0);
  });
  it('Alert solo se muestra cuando hay un error', () => {
    const a = mount(<Alert message="" />);
    expect($(a.host, '[role="alert"]')).toBeNull();
    const b = mount(<Alert message="Algo falló" />);
    expect($(b.host, '[role="alert"]').textContent).toBe('Algo falló');
  });
  it('ProductCard muestra precio tachado cuando está en oferta', () => {
    const { host } = mount(<ProductCard product={Products.get('p1')} />);
    expect($(host, 's')).not.toBeNull();
    expect(host.textContent).toContain('29.990');
  });
  it('ProductCard sin oferta no muestra precio tachado', () => {
    const { host } = mount(<ProductCard product={Products.get('p2')} />);
    expect($(host, 's')).toBeNull();
  });
  it('ProductCard avisa de últimas unidades', () => {
    const { host } = mount(<ProductCard product={Products.get('p2')} />);
    expect(host.textContent).toContain('Últimas unidades');
  });
  it('StatCard muestra título y valor', () => {
    const { host } = mount(<StatCard title="Compras" value={7} />);
    expect(host.textContent).toContain('Compras');
    expect($(host, '[data-testid="stat-value"]').textContent).toBe('7');
  });
  it('CartTable muestra mensaje si el carrito está vacío', () => {
    const { host } = mount(<CartTable items={[]} />);
    expect(host.textContent).toContain('vacío');
  });
  it('Footer y FormField se renderizan con etiqueta y error', () => {
    const { host } = mount(<><Footer /><FormField id="x" label="Campo" error="Obligatorio" /></>);
    expect(host.textContent).toContain('Envío incluido');
    expect($(host, 'label[for="x"]').textContent).toBe('Campo');
    expect($(host, '#x').getAttribute('aria-invalid')).toBe('true');
  });
});

describe('Pruebas de propiedades (props)', () => {
  beforeEach(() => freshState());
  afterEach(cleanup);

  it('ProductCard recibe nombre, imagen y categoría por props', () => {
    const p = Products.get('p3');
    const { host } = mount(<ProductCard product={p} categoryName="Tecnología" />);
    expect($(host, 'h3').textContent).toBe(p.name);
    expect($(host, 'img').getAttribute('alt')).toBe(p.name);
    expect(host.textContent).toContain('Tecnología');
  });
  it('el botón recibe la etiqueta y la función onClick', () => {
    const onAdd = jasmine.createSpy('onAdd');
    const p = Products.get('p3');
    const { host } = mount(<ProductCard product={p} onAdd={onAdd} />);
    const btn = $(host, 'button');
    expect(btn.textContent).toBe('Añadir');
    click(btn);
    expect(onAdd).toHaveBeenCalledWith(p);
  });
  it('ProductCard deshabilita el botón sin stock', () => {
    const { host } = mount(<ProductCard product={{ ...Products.get('p3'), stock: 0 }} />);
    const btn = $(host, 'button');
    expect(btn.disabled).toBeTrue();
    expect(btn.textContent).toBe('Sin stock');
  });
  it('CategoryChips marca como presionada la categoría seleccionada', () => {
    const { host } = mount(<CategoryChips categories={Categories.list()} selected="c2" onSelect={() => {}} />);
    expect(byText(host, 'button', 'Hogar').getAttribute('aria-pressed')).toBe('true');
    expect(byText(host, 'button', 'Todos').getAttribute('aria-pressed')).toBe('false');
  });
  it('NavBar muestra la cantidad y el total del carrito recibidos por props', () => {
    const { host } = mount(<NavBar cartCount={3} cartTotal={12000} />);
    const cart = $(host, '[data-testid="cart-button"]');
    expect(cart.textContent).toContain('12.000');
    expect(cart.textContent).toContain('3');
  });
  it('NavBar sin sesión muestra Iniciar Sesión y Crear Cuenta', () => {
    const { host } = mount(<NavBar />);
    expect(host.textContent).toContain('Iniciar Sesión');
    expect(host.textContent).toContain('Crear Cuenta');
  });
  it('NavBar con administrador muestra su nombre y el acceso Admin', () => {
    const { host } = mount(<NavBar user={{ name: 'Ana', role: 'admin' }} />);
    expect($(host, '[data-testid="user-name"]').textContent).toContain('Ana');
    expect(byText(host, 'a', 'Admin')).toBeDefined();
    expect(host.textContent).not.toContain('Crear Cuenta');
  });
  it('NavBar con cliente no muestra el acceso Admin', () => {
    const { host } = mount(<NavBar user={{ name: 'Luis', role: 'cliente' }} />);
    expect(byText(host, 'a', 'Admin')).toBeUndefined();
  });
  it('AdminSidebar muestra los enlaces del panel y ejecuta onLogout', () => {
    const onLogout = jasmine.createSpy('logout');
    const { host } = mount(<AdminSidebar onLogout={onLogout} />);
    expect(host.textContent).toContain('Dashboard');
    expect(host.textContent).toContain('Usuarios');
    click(byText(host, 'button', 'Cerrar Sesión'));
    expect(onLogout).toHaveBeenCalled();
  });
});

describe('Pruebas de estado (state)', () => {
  beforeEach(() => freshState());
  afterEach(cleanup);

  it('SearchBar actualiza su estado cuando el usuario escribe', () => {
    const { host } = mount(<SearchBar onSearch={() => {}} />);
    const input = $(host, 'input');
    type(input, 'teclado');
    expect(input.value).toBe('teclado');
  });
  it('ProductForm cambia su estado al introducir texto', () => {
    const { host } = mount(<ProductForm categories={Categories.list()} onSubmit={() => {}} />);
    type($(host, '#pf-name'), 'Silla gamer');
    expect($(host, '#pf-name').value).toBe('Silla gamer');
  });
  it('ConfirmButton pasa por dos pasos antes de ejecutar la acción', () => {
    const onConfirm = jasmine.createSpy('confirm');
    const { host } = mount(<ConfirmButton onConfirm={onConfirm} />);
    click(byText(host, 'button', 'Eliminar'));
    expect(onConfirm).not.toHaveBeenCalled();
    expect(host.textContent).toContain('¿Confirmar?');
    click(byText(host, 'button', '¿Confirmar?'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
  it('ConfirmButton permite cancelar', () => {
    const onConfirm = jasmine.createSpy('confirm');
    const { host } = mount(<ConfirmButton onConfirm={onConfirm} />);
    click(byText(host, 'button', 'Eliminar'));
    click(byText(host, 'button', 'Cancelar'));
    expect(host.textContent).toContain('Eliminar');
    expect(onConfirm).not.toHaveBeenCalled();
  });
  it('NavBar abre y cierra el menú móvil', () => {
    const { host } = mount(<NavBar />);
    const toggler = $(host, '.navbar-toggler');
    expect($(host, '.navbar-collapse').classList.contains('show')).toBeFalse();
    click(toggler);
    expect($(host, '.navbar-collapse').classList.contains('show')).toBeTrue();
    expect(toggler.getAttribute('aria-expanded')).toBe('true');
  });
});

describe('Pruebas de eventos', () => {
  beforeEach(() => freshState());
  afterEach(cleanup);

  it('SearchBar envía el texto (sin espacios) al enviar el formulario', () => {
    const onSearch = jasmine.createSpy('search');
    const { host } = mount(<SearchBar onSearch={onSearch} />);
    type($(host, 'input'), '  mouse ');
    submit($(host, 'form'));
    expect(onSearch).toHaveBeenCalledWith('mouse');
  });
  it('CategoryChips llama a onSelect con el id de la categoría', () => {
    const onSelect = jasmine.createSpy('select');
    const { host } = mount(<CategoryChips categories={Categories.list()} onSelect={onSelect} />);
    click(byText(host, 'button', 'Deportes'));
    expect(onSelect).toHaveBeenCalledWith('c3');
  });
  it('CartTable llama a los callbacks de cantidad y eliminar', () => {
    const items = [{ productId: 'p1', name: 'Audífonos', price: 1000, image: 'x.jpg', quantity: 2 }];
    const onQuantity = jasmine.createSpy('q'); const onRemove = jasmine.createSpy('r');
    const { host } = mount(<CartTable items={items} editable onQuantity={onQuantity} onRemove={onRemove} />);
    click($(host, '[aria-label^="Agregar una unidad"]'));
    expect(onQuantity).toHaveBeenCalledWith('p1', 3);
    click($(host, '[aria-label^="Quitar una unidad"]'));
    expect(onQuantity).toHaveBeenCalledWith('p1', 1);
    click(byText(host, 'button', 'Eliminar'));
    expect(onRemove).toHaveBeenCalledWith('p1');
  });
  it('ProductForm muestra errores y no envía si hay datos inválidos', () => {
    const onSubmit = jasmine.createSpy('submit');
    const { host } = mount(<ProductForm categories={Categories.list()} onSubmit={onSubmit} />);
    submit($(host, 'form'));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(host.textContent).toContain('El nombre es obligatorio');
    expect(host.textContent).toContain('El precio debe ser mayor a 0');
  });
  it('ProductForm envía los datos convertidos cuando son válidos', () => {
    const onSubmit = jasmine.createSpy('submit');
    const { host } = mount(<ProductForm categories={Categories.list()} onSubmit={onSubmit} />);
    type($(host, '#pf-name'), ' Silla ');
    type($(host, '#pf-price'), '50000');
    type($(host, '#pf-stock'), '4');
    type($(host, '#pf-cat'), 'c2');
    submit($(host, 'form'));
    expect(onSubmit).toHaveBeenCalledTimes(1);
    const sent = onSubmit.calls.mostRecent().args[0];
    expect(sent.name).toBe('Silla');
    expect(sent.price).toBe(50000);
    expect(sent.stock).toBe(4);
    expect(sent.offerPrice).toBeNull();
  });
  it('ProductForm en modo edición carga los valores del producto', () => {
    const { host } = mount(<ProductForm initial={Products.get('p1')} categories={Categories.list()} onSubmit={() => {}} />);
    expect($(host, '#pf-name').value).toContain('Audífonos');
    expect($(host, '#pf-offer').value).toBe('29990');
  });
});
