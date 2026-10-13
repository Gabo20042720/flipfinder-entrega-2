// Datos iniciales (simulan la base de datos). Se cargan solo la primera vez.
export const SEED_CATEGORIES = [
  { id: 'c1', name: 'Tecnología', description: 'Audífonos, teclados y accesorios' },
  { id: 'c2', name: 'Hogar', description: 'Pequeños electrodomésticos y decoración' },
  { id: 'c3', name: 'Deportes', description: 'Equipamiento para entrenar y salir a correr' },
  { id: 'c4', name: 'Moda', description: 'Mochilas, relojes y accesorios' }
];

const img = (n) => `img/foto${n}.jpg`;

export const SEED_PRODUCTS = [
  { id: 'p1', name: 'Audífonos Bluetooth Pro', description: 'Cancelación de ruido y 30 h de batería.', price: 39990, offerPrice: 29990, stock: 14, categoryId: 'c1', image: img(1), active: true },
  { id: 'p2', name: 'Teclado Mecánico RGB', description: 'Switches rojos, formato 75 %.', price: 54990, offerPrice: null, stock: 3, categoryId: 'c1', image: img(2), active: true },
  { id: 'p3', name: 'Mouse Inalámbrico Ergo', description: 'Sensor 4000 DPI, recargable USB-C.', price: 19990, offerPrice: 14990, stock: 25, categoryId: 'c1', image: img(3), active: true },
  { id: 'p4', name: 'Cafetera de Cápsulas', description: 'Presión de 19 bares, depósito de 0,8 L.', price: 69990, offerPrice: null, stock: 8, categoryId: 'c2', image: img(4), active: true },
  { id: 'p5', name: 'Lámpara LED Escritorio', description: 'Brillo regulable y puerto de carga.', price: 15990, offerPrice: null, stock: 2, categoryId: 'c2', image: img(5), active: true },
  { id: 'p6', name: 'Freidora de Aire 4 L', description: 'Cocina con poco aceite, 8 programas.', price: 59990, offerPrice: 49990, stock: 11, categoryId: 'c2', image: img(1), active: true },
  { id: 'p7', name: 'Mancuernas Ajustables 20 kg', description: 'Par con selector rápido de peso.', price: 74990, offerPrice: null, stock: 6, categoryId: 'c3', image: img(2), active: true },
  { id: 'p8', name: 'Zapatillas Running', description: 'Amortiguación ligera para asfalto.', price: 44990, offerPrice: 34990, stock: 4, categoryId: 'c3', image: img(3), active: true },
  { id: 'p9', name: 'Botella Térmica 1 L', description: 'Acero inoxidable, mantiene frío 24 h.', price: 12990, offerPrice: null, stock: 40, categoryId: 'c3', image: img(4), active: true },
  { id: 'p10', name: 'Mochila Urbana 25 L', description: 'Compartimento para notebook de 15".', price: 27990, offerPrice: null, stock: 18, categoryId: 'c4', image: img(5), active: true },
  { id: 'p11', name: 'Reloj Deportivo', description: 'Resistente al agua, GPS y pulsómetro.', price: 89990, offerPrice: 74990, stock: 1, categoryId: 'c4', image: img(1), active: true },
  { id: 'p12', name: 'Lentes de Sol Polarizados', description: 'Protección UV400.', price: 17990, offerPrice: null, stock: 0, categoryId: 'c4', image: img(2), active: false }
];

export const SEED_USERS = [
  { id: 'u1', name: 'Admin', lastName: 'FlipFinder', email: 'admin@flipfinder.cl', password: 'admin123', role: 'admin', address: { street: 'Av. Providencia 1234', department: '', region: 'Región Metropolitana de Santiago', commune: 'Providencia' } },
  { id: 'u2', name: 'Camila', lastName: 'Rojas', email: 'cliente@flipfinder.cl', password: 'cliente123', role: 'cliente', address: { street: 'Los Crisantemos 45', department: 'Depto 603', region: 'Región Metropolitana de Santiago', commune: 'Cerrillos' } }
];

export const SEED_ORDERS = [
  { id: 'o1', number: '20241001', userId: 'u2', status: 'pagado', date: '2024-10-01T15:20:00.000Z',
    customer: { name: 'Camila', lastName: 'Rojas', email: 'cliente@flipfinder.cl' },
    address: { street: 'Los Crisantemos 45', department: 'Depto 603', region: 'Región Metropolitana de Santiago', commune: 'Cerrillos', notes: '' },
    items: [{ productId: 'p1', name: 'Audífonos Bluetooth Pro', price: 29990, quantity: 1 }], total: 29990 },
  { id: 'o2', number: '20241002', userId: 'u2', status: 'pagado', date: '2024-10-02T18:05:00.000Z',
    customer: { name: 'Camila', lastName: 'Rojas', email: 'cliente@flipfinder.cl' },
    address: { street: 'Los Crisantemos 45', department: 'Depto 603', region: 'Región Metropolitana de Santiago', commune: 'Cerrillos', notes: 'Dejar con conserje' },
    items: [{ productId: 'p9', name: 'Botella Térmica 1 L', price: 12990, quantity: 2 }], total: 25980 }
];

export const BLOGS = [
  { id: 'b1', title: 'Cómo elegir audífonos inalámbricos', date: '2024-09-12', summary: 'Autonomía, cancelación de ruido y códecs: qué mirar antes de comprar.',
    content: 'Revisa primero la autonomía real, no solo la que declara el fabricante. La cancelación activa de ruido ayuda en el transporte público, pero encarece el producto. Si usas el equipo para videollamadas, prioriza un buen micrófono.' },
  { id: 'b2', title: '5 consejos para comprar seguro online', date: '2024-09-28', summary: 'Verifica el vendedor, los medios de pago y la política de devolución.',
    content: 'Compra en sitios que muestren datos de contacto claros, compara precios y guarda siempre tu comprobante. Desconfía de ofertas demasiado buenas y revisa los plazos de despacho antes de pagar.' }
];

export const REGIONS = {
  'Región Metropolitana de Santiago': ['Cerrillos', 'Providencia', 'Santiago', 'Maipú', 'Las Condes', 'Ñuñoa'],
  'Región de Valparaíso': ['Valparaíso', 'Viña del Mar', 'Quilpué'],
  'Región del Biobío': ['Concepción', 'Talcahuano', 'Los Ángeles']
};
