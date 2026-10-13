import ConfirmButton from '../../components/ConfirmButton.jsx';
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Orders } from '../../data/db.js';
import { useDbVersion } from '../../hooks/useStores.js';
import { formatCLP, formatDate } from '../../utils/format.js';
import Alert from '../../components/Alert.jsx';
import CartTable from '../../components/CartTable.jsx';

const BADGE = { pagado: 'success', rechazado: 'danger', pendiente: 'warning' };
export const StatusBadge = ({ status }) => <span className={`badge text-bg-${BADGE[status] ?? 'secondary'}`}>{status}</span>;

export function OrdersList() {
  useDbVersion();
  const orders = Orders.list().sort((a, b) => b.date.localeCompare(a.date));
  return (
    <>
      <h1 className="h3">Órdenes / Boletas</h1>
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr><th>N°</th><th>Fecha</th><th>Cliente</th><th>Total</th><th>Estado</th><th /></tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>#{o.number}</td>
                <td>{formatDate(o.date)}</td>
                <td>{o.customer.name} {o.customer.lastName}</td>
                <td>{formatCLP(o.total)}</td>
                <td><StatusBadge status={o.status} /></td>
                <td className="text-nowrap">
                  <Link className="me-2" to={`/admin/ordenes/${o.id}`}>Mostrar boleta</Link>
                  <ConfirmButton onConfirm={() => Orders.remove(o.id)} />
                </td>
              </tr>
            ))}
            {!orders.length && <tr><td colSpan="6" className="text-center text-muted">Sin órdenes</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}

export function OrderDetail() {
  const { id } = useParams();
  const o = Orders.get(id);
  if (!o) return <Alert message="La orden no existe." />;
  return (
    <>
      <h1 className="h3">Boleta #{o.number} <StatusBadge status={o.status} /></h1>
      <p>{o.customer.name} {o.customer.lastName} · {o.customer.email}<br />{o.address.street} {o.address.department}, {o.address.commune}, {o.address.region}</p>
      <CartTable items={o.items.map((i) => ({ ...i, image: 'img/placeholder.jpg' }))} />
      <p className="fs-5"><strong>Total: {formatCLP(o.total)}</strong></p>
      <Link to="/admin/ordenes">← Volver</Link>
    </>
  );
}
