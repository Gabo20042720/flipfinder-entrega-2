# ERS — Especificación de Requisitos de Software · FlipFinder (V2, Evaluación Parcial 2)

## 1. Introducción
**Propósito.** Definir los requisitos del frontend de FlipFinder, tienda online chilena, para la Evaluación Parcial 2 de Desarrollo Fullstack II (DSY1104).
**Alcance.** Aplicación web de una sola página (SPA) en React con una vista pública de tienda y un panel de administración. Los datos se simulan con un archivo JavaScript (CRUD) y se persisten en el navegador (`localStorage`). No incluye backend real ni cobros reales (el pago es una simulación).
**Definiciones.** SPA: aplicación de una página · CRUD: crear, leer, actualizar, eliminar · CLP: peso chileno.

## 2. Descripción general
**Usuarios.**
- *Visitante/Cliente:* explora productos, categorías y ofertas, usa el carrito, compra y consulta contenido informativo.
- *Administrador:* gestiona productos, categorías, usuarios y órdenes, y consulta reportes.

**Restricciones y supuestos.** Navegadores modernos con JavaScript y `localStorage`. Autenticación simulada solo con fines académicos: las contraseñas se guardan en el navegador sin cifrar, por lo que no debe usarse en producción.

## 3. Herramientas y tecnologías
| Herramienta | Uso |
|---|---|
| React 18 | Componentes, props y estado |
| React Router 6 | Navegación entre vistas (HashRouter) |
| Bootstrap 5 | Diseño responsivo |
| Vite | Servidor de desarrollo y compilación |
| Jasmine + Karma | Pruebas unitarias en Chrome headless |
| Webpack + Babel + Istanbul | Compilación de pruebas JSX y cobertura |

## 4. Requisitos funcionales
### Tienda
| ID | Requisito |
|---|---|
| RF-01 | Mostrar página principal con carrusel/hero, categorías, destacados y ofertas. |
| RF-02 | Listar productos con búsqueda por texto, filtro por categoría y orden por precio. |
| RF-03 | Mostrar el detalle de un producto (precio, oferta, stock) y permitir añadirlo con una cantidad. |
| RF-04 | Vista de categorías que separa los productos por categoría. |
| RF-05 | Vista de ofertas con todos los productos en oferta. |
| RF-06 | Carrito: añadir, cambiar cantidad (sin superar el stock), eliminar, limpiar y ver el total; se conserva al recargar. |
| RF-07 | Checkout: datos del cliente, dirección (región/comuna dependientes), validación y pago simulado; si hay sesión, se autocompletan los datos. |
| RF-08 | Vistas de compra exitosa (resumen y boleta imprimible) y de pago con error (con opción de reintentar). |
| RF-09 | Registro e inicio/cierre de sesión con validación de datos. |
| RF-10 | Páginas Nosotros, Blog (con detalle de entradas) y Contacto con formulario validado. |
| RF-11 | Navbar responsiva con búsqueda, estado del carrito y estado de sesión. |

### Administración (requiere rol administrador)
| ID | Requisito |
|---|---|
| RF-20 | Dashboard con métricas (compras, productos, usuarios) y accesos a cada módulo. |
| RF-21 | Órdenes/Boletas: listar órdenes con estado y mostrar la boleta. |
| RF-22 | Productos: listar, crear, editar y eliminar (con confirmación) y listar productos críticos (stock ≤ 5). |
| RF-23 | Categorías: listar, crear, editar y eliminar (no se elimina una categoría con productos). |
| RF-24 | Usuarios: listar, crear, editar, eliminar y ver el historial de compras. |
| RF-25 | Reportes: ventas totales y ventas por producto. |
| RF-26 | Perfil: editar los datos del administrador. |
| RF-27 | Proteger las rutas `/admin/*`: sin sesión se redirige a login; un cliente no puede acceder. |

### Datos y persistencia
| ID | Requisito |
|---|---|
| RF-30 | Archivo JS de datos con CRUD para productos, categorías, usuarios y órdenes (`src/data/db.js`). |
| RF-31 | Persistir datos, carrito y sesión en `localStorage`, con respaldo en memoria si no está disponible. |
| RF-32 | Actualizar la interfaz en tiempo real cuando cambian los datos. |

## 5. Flujo de navegación
Tienda: Home · Productos → Detalle · Categorías → Categoría · Ofertas · Carrito → Checkout → Pago correcto / Pago con error · Iniciar sesión ↔ Registro · Nosotros · Blog → Detalle · Contacto.
Administrador: Dashboard · Órdenes → Boleta · Productos → Nuevo / Editar / Críticos · Categorías → Nueva / Editar · Usuarios → Nuevo / Editar / Historial · Reportes · Perfil.

## 6. Requisitos no funcionales
| ID | Requisito |
|---|---|
| RNF-01 | Diseño responsivo (móvil, tablet, escritorio) con Bootstrap. |
| RNF-02 | Componentes con responsabilidad única, reutilizables y con nombres descriptivos. |
| RNF-03 | Accesibilidad básica: etiquetas en formularios, `aria-label`, roles de alerta. |
| RNF-04 | Validación de formularios en el cliente con mensajes claros en español. |
| RNF-05 | Código cubierto por pruebas unitarias automatizadas (ver documento de cobertura). |
| RNF-06 | Instalación, ejecución y pruebas documentadas en el README. |

## 7. Arquitectura
- **Capa de datos** (`src/data`): `db.js` (CRUD + suscripciones), `cart.js`, `auth.js`, `storage.js` (almacenamiento inyectable, útil para mocks).
- **Hooks** (`src/hooks`): `useSyncExternalStore` conecta los datos con los componentes.
- **Componentes** (`src/components`): presentacionales y reutilizables, reciben `props`.
- **Vistas** (`src/pages`, `src/pages/admin`): componentes de página que componen los anteriores.
- **Rutas** (`src/App.jsx`): layout de tienda y layout de administración protegido.

## 8. Fuera de alcance
Backend real, pasarela de pago, cifrado de contraseñas y envío real de correos.
