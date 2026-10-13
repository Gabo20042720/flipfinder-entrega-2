# Documento de cobertura del testing — FlipFinder (Evaluación Parcial 2)

## 1. Entorno de pruebas
| Elemento | Detalle |
|---|---|
| Framework | Jasmine 5 (`describe`, `it`, `expect`, espías `jasmine.createSpy`) |
| Ejecutor | Karma 6 en Chrome Headless |
| Compilación | Webpack 5 + Babel (preset-env y preset-react) |
| Cobertura | `karma-coverage` con `babel-plugin-istanbul` (informe en `coverage/`) |
| Comando | `npm test` |

## 2. Estrategia
Se prueban cuatro aspectos propuestos por el docente: **renderizado** (correcto y condicional), **propiedades (props)**, **estado (state)** y **eventos**, más la lógica de datos y las vistas principales.
- **Mocks:** `test/helpers.jsx` reemplaza `localStorage` por un almacenamiento falso en memoria (`fakeStorage`) y se usan espías (`jasmine.createSpy`) como funciones `onClick`, `onSubmit` y `onSelect`. Cada prueba parte de un estado limpio (`freshState`).
- **DOM:** los componentes se montan con `react-dom/client` dentro de `act()`, se simulan eventos reales (`click`, `input`, `change`, `submit`) y se verifica el DOM resultante.

## 3. Resumen de pruebas (96 casos)
| Archivo | Casos | Qué valida |
|---|---|---|
| `test/data.spec.jsx` | 28 | CRUD del archivo de datos, persistencia, suscripciones, ofertas, stock crítico, carrito, sesión |
| `test/format.spec.jsx` | 10 | Formato CLP, validación de correo/contraseña/checkout/producto, orden por precio, reportes |
| `test/components.spec.jsx` | 29 | Renderizado, props, estado y eventos de los componentes reutilizables |
| `test/pages.spec.jsx` | 29 | Vistas: catálogo, ofertas, carrito, checkout (pago aprobado/rechazado), login/registro, contacto, panel admin |

## 4. Casos por categoría (ejemplos)
| Categoría | Caso | Resultado esperado |
|---|---|---|
| Renderizado | `ProductGrid` con 5 productos | Renderiza 5 tarjetas |
| Renderizado condicional | `Alert` sin mensaje / con mensaje | Solo se muestra cuando hay error |
| Props | `ProductCard` con `onAdd` | Muestra etiqueta «Añadir» y llama a `onAdd(producto)` al hacer clic |
| Props | `ProductCard` sin stock | Botón deshabilitado con «Sin stock» |
| Estado | `SearchBar` al escribir | El input refleja el texto |
| Estado | `ConfirmButton` | Requiere dos clics antes de ejecutar la acción |
| Eventos | `ProductForm` inválido | Muestra errores y no llama a `onSubmit` |
| Eventos | `CartTable` + / − / Eliminar | Llama a los callbacks con id y cantidad correctos |
| Integración | Checkout con tarjeta 4242… | Crea orden pagada, descuenta stock, vacía el carrito |
| Integración | Checkout con tarjeta 4000… | Orden rechazada, conserva el carrito, ofrece reintentar |
| Seguridad de rutas | `/admin` sin sesión / como cliente | Redirige a login / a inicio |

## 5. Resultados de ejecución
- **Verificación realizada antes de la entrega:** los 96 casos se ejecutaron en Chromium headless con las mismas especificaciones y pasaron (96/96). Esa verificación se hizo con un arnés local equivalente porque el entorno de preparación no tenía acceso a npm; **la ejecución oficial con Karma debe correrse con `npm install && npm test`**.
- **Cobertura:** el porcentaje exacto lo calcula `karma-coverage` al ejecutar `npm test` (resumen en consola e informe HTML en `coverage/html/index.html`).

| Fecha de ejecución | Navegador | Aprobadas / Total | Statements | Branches | Functions | Lines |
|---|---|---|---|---|---|---|
| 12/10/2026 | Chrome Headless 150 | 96 / 96 | 86,73 % | 85,62 % | 82,98 % | 90,07 % |



## 6. Alcance y límites
Se cubren la capa de datos, los componentes reutilizables, las vistas principales de tienda y administración y los flujos de compra. No se cubren pruebas end-to-end en navegador real, accesibilidad automatizada ni pruebas de carga. Las pantallas administrativas de categorías y usuarios (nuevo/editar) tienen cobertura parcial; el borrado de productos y la edición de productos sí están cubiertos.
