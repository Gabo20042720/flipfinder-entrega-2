import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ProductForm from '../../components/ProductForm.jsx';
import ConfirmButton from '../../components/ConfirmButton.jsx';
import Alert from '../../components/Alert.jsx';
import { Products, Categories, criticalProducts, CRITICAL_STOCK } from '../../data/db.js';
import { useDbVersion } from '../../hooks/useStores.js';
import { formatCLP } from '../../utils/format.js';

function ProductsTable({ products, categories }) {
  return (
    <div className="table-responsive"><table className="table align-middle">
      <thead><tr><th>Producto</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Estado</th><th /></tr></thead>
      <tbody>
        {products.map((p) => (
          <tr key={p.id}>
            <td>{p.name}</td><td>{categories.find((c) => c.id === p.categoryId)?.name}</td><td>{formatCLP(p.price)}</td>
            <td className={p.stock <= CRITICAL_STOCK ? 'text-danger fw-bold' : ''}>{p.stock}</td>
            <td>{p.active ? 'Visible' : 'Oculto'}</td>
            <td className="text-nowrap"><Link className="btn btn-outline-primary btn-sm me-1" to={`/admin/productos/${p.id}/editar`}>Editar</Link>
              <ConfirmButton onConfirm={() => Products.remove(p.id)} /></td>
          </tr>
        ))}
        {!products.length && <tr><td colSpan="6" className="text-center text-muted">Sin productos</td></tr>}
      </tbody>
    </table></div>
  );
}

export function AdminProducts() {
  useDbVersion();
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3"><h1 className="h3 mb-0">Productos</h1>
        <div className="d-flex gap-2"><Link className="btn btn-outline-danger btn-sm" to="/admin/productos/criticos">Productos críticos</Link><Link className="btn btn-primary btn-sm" to="/admin/productos/nuevo">Nuevo producto</Link></div></div>
      <ProductsTable products={Products.list()} categories={Categories.list()} />
    </>
  );
}
export function CriticalProducts() {
  useDbVersion();
  return (<><h1 className="h3">Productos críticos</h1><p className="text-muted">Stock igual o menor a {CRITICAL_STOCK} unidades.</p><ProductsTable products={criticalProducts()} categories={Categories.list()} /><Link to="/admin/productos">← Volver</Link></>);
}
export function ProductNew() {
  const navigate = useNavigate();
  return (<><h1 className="h3">Nuevo producto</h1><ProductForm categories={Categories.list()} submitLabel="Crear producto" onSubmit={(d) => { Products.create(d); navigate('/admin/productos'); }} /></>);
}
export function ProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const p = Products.get(id);
  if (!p) return <Alert message="El producto no existe." />;
  return (<><h1 className="h3">Editar producto</h1><ProductForm initial={p} categories={Categories.list()} submitLabel="Guardar cambios" onSubmit={(d) => { Products.update(id, d); navigate('/admin/productos'); }} /></>);
}
