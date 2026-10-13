import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Orders } from '../data/db.js';
import { formatCLP, formatDate } from '../utils/format.js';
import Alert from '../components/Alert.jsx';
import CartTable from '../components/CartTable.jsx';

/** Resumen de la compra. success=true → pago correcto; false → pago con error. */
export default function OrderResult({ success }) {
  const { id } = useParams();
  const order = Orders.get(id);
  if (!order) return <Alert message="No encontramos la orden." />;
  const items = order.items.map((i) => ({ ...i, image: 'img/placeholder.jpg' }));
  return (
    <section className="card p-3 p-md-4 mx-auto" style={{ maxWidth: 760 }} aria-label="Resultado de la compra">
      <h1 className={`h4 ${success ? 'text-success' : 'text-danger'}`} data-testid="result-title">
        {success ? '✔ Se ha realizado la compra' : '✖ No se pudo realizar el pago'} nro #{order.number}
      </h1>
      <small className="text-muted mb-2">Fecha: {formatDate(order.date)}</small>
      <p className="mb-1"><strong>{order.customer.name} {order.customer.lastName}</strong> · {order.customer.email}</p>
      <p>{order.address.street} {order.address.department} · {order.address.commune}, {order.address.region}{order.address.notes ? ` · ${order.address.notes}` : ''}</p>
      <CartTable items={items} />
      <div className="alert alert-light text-center fs-5">{success ? 'Total pagado' : 'Total'}: {formatCLP(order.total)}</div>
      {success
        ? <div className="d-flex gap-2 justify-content-center"><button type="button" className="btn btn-danger btn-sm" onClick={() => window.print()}>Imprimir boleta en PDF</button><Link className="btn btn-primary btn-sm" to="/productos">Seguir comprando</Link></div>
        : <div className="text-center"><Link className="btn btn-success" to="/checkout">Volver a realizar el pago</Link></div>}
    </section>
  );
}
