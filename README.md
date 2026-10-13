# FlipFinder — Evaluación Parcial 2 (DSY1104)

Tienda online frontend construida con **React 18, React Router, Bootstrap 5 y Vite**, con pruebas unitarias en **Jasmine + Karma**.

## Requisitos
- Node.js 18 o superior y npm
- Google Chrome/Chromium (para Karma; si no se detecta, define `CHROME_BIN`)

## Ejecución
```bash
npm install
npm run dev        # servidor de desarrollo
npm run build      # compilación de producción
npm test           # pruebas Jasmine + Karma con informe de cobertura (carpeta coverage/)
```

## Usuarios de demostración
| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | admin@flipfinder.cl | admin123 |
| Cliente | cliente@flipfinder.cl | cliente123 |

Tarjetas de prueba en el checkout: `4242 4242 4242 4242` (aprobada) y `4000 0000 0000 0002` (rechazada). No se realizan cobros reales.

## Estructura
```
src/
  data/        seed.js (datos iniciales) · db.js (CRUD + persistencia) · cart.js · auth.js · storage.js
  hooks/       useStores.js (suscripción a cambios → UI en tiempo real)
  components/  NavBar, SearchBar, ProductCard, ProductGrid, CategoryChips, CartTable, ProductForm, FormField, ...
  pages/       Home, Products, ProductDetail, Categories, Offers, Cart, Checkout, OrderResult, Auth, Static (Nosotros, Blog, Contacto)
  pages/admin/ Dashboard, Órdenes/Boleta, Productos (+críticos), Categorías, Usuarios (+historial), Reportes, Perfil
test/          pruebas Jasmine (renderizado, props, estado, eventos, mocks)
docs/          ERS.md (V2) · COBERTURA_TESTING.md
```

## Cómo se cumplen los requisitos
- **HTML → React:** cada vista es un componente; los elementos repetidos (tarjeta, tabla de carrito, formularios) son componentes reutilizables con una única responsabilidad, reciben datos por `props` y usan `useState` solo cuando necesitan estado propio.
- **Archivo de datos JS:** `src/data/db.js` simula la base de datos con CRUD (`list`, `get`, `create`, `update`, `remove`) para productos, categorías, usuarios y órdenes.
- **Persistencia:** los datos, el carrito y la sesión se guardan en `localStorage`; los componentes se actualizan al cambiar los datos (`useSyncExternalStore`).
- **Bootstrap:** grilla responsiva, navbar colapsable y tablas con scroll en móvil.
- **Vistas nuevas:** categorías, ofertas, checkout, compra exitosa/error y panel de administración (ver ERS).
- **Pruebas:** Jasmine + Karma, ver `docs/COBERTURA_TESTING.md`.
