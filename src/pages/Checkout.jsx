import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import CartTable from '../components/CartTable.jsx';
import FormField from '../components/FormField.jsx';
import { useCart, useSession } from '../hooks/useStores.js';
import { clearCart } from '../data/cart.js';
import { Orders, discountStock } from '../data/db.js';
import { REGIONS } from '../data/seed.js';
import { formatCLP, validateCheckout, CARD_REJECTED } from '../utils/format.js';

/** Checkout: datos del cliente, dirección y pago simulado. Si hay sesión, se autocompleta. */
export default function Checkout() {
  const { items, total } = useCart();
  const user = useSession();
  const navigate = useNavigate();
  const [v, setV] = useState({
    name: user?.name ?? '', lastName: user?.lastName ?? '', email: user?.email ?? '',
    street: user?.address?.street ?? '', department: user?.address?.department ?? '',
    region: user?.address?.region ?? '', commune: user?.address?.commune ?? '', notes: '', card: ''
  });
  const [errors, setErrors] = useState({});
  const set = (k) => (e) => setV({ ...v, [k]: e.target.value, ...(k === 'region' ? { commune: '' } : {}) });

  if (!items.length) return <Navigate to="/carrito" replace />;

  const pay = (e) => {
    e.preventDefault();
    const errs = validateCheckout(v);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const approved = v.card.replace(/\s/g, '') !== CARD_REJECTED;
    const order = Orders.create({
      number: Orders.nextNumber(), userId: user?.id ?? null, status: approved ? 'pagado' : 'rechazado', date: new Date().toISOString(),
      customer: { name: v.name.trim(), lastName: v.lastName.trim(), email: v.email.trim() },
      address: { street: v.street.trim(), department: v.department.trim(), region: v.region, commune: v.commune, notes: v.notes.trim() },
      items: items.map(({ productId, name, price, quantity }) => ({ productId, name, price, quantity })), total
    });
    if (approved) { discountStock(order.items); clearCart(); }
    navigate(approved ? `/compra/exitosa/${order.id}` : `/compra/error/${order.id}`);
  };

  return (
    <form className="card p-3 p-md-4 mx-auto" style={{ maxWidth: 760 }} onSubmit={pay} noValidate aria-label="Checkout">
      <div className="d-flex justify-content-between align-items-start">
        <div><h1 className="h4 mb-0">Carrito de compra</h1><small className="text-muted">Completa la siguiente información</small></div>
        <span className="badge text-bg-primary fs-6">Total a pagar: {formatCLP(total)}</span>
      </div>
      <CartTable items={items} />
      <h2 className="h5">Información del cliente</h2>
      <div className="row">
        <div className="col-md-6"><FormField id="co-name" label="Nombre*" value={v.name} onChange={set('name')} error={errors.name} /></div>
        <div className="col-md-6"><FormField id="co-last" label="Apellidos*" value={v.lastName} onChange={set('lastName')} error={errors.lastName} /></div>
        <div className="col-md-6"><FormField id="co-email" label="Correo*" type="email" value={v.email} onChange={set('email')} error={errors.email} /></div>
      </div>
      <h2 className="h5">Dirección de entrega de los productos</h2>
      <div className="row">
        <div className="col-md-6"><FormField id="co-street" label="Calle*" value={v.street} onChange={set('street')} error={errors.street} /></div>
        <div className="col-md-6"><FormField id="co-dep" label="Departamento (opcional)" placeholder="Ej: 603" value={v.department} onChange={set('department')} /></div>
        <div className="col-md-6">
          <FormField id="co-region" label="Región*" as="select" value={v.region} onChange={set('region')} error={errors.region}>
            <option value="">Selecciona…</option>{Object.keys(REGIONS).map((r) => <option key={r}>{r}</option>)}
          </FormField>
        </div>
        <div className="col-md-6">
          <FormField id="co-commune" label="Comuna*" as="select" value={v.commune} onChange={set('commune')} error={errors.commune} disabled={!v.region}>
            <option value="">Selecciona…</option>{(REGIONS[v.region] ?? []).map((c) => <option key={c}>{c}</option>)}
          </FormField>
        </div>
      </div>
      <FormField id="co-notes" label="Indicaciones para la entrega (opcional)" as="textarea" rows="2" value={v.notes} onChange={set('notes')} />
      <h2 className="h5">Pago</h2>
      <FormField id="co-card" label="Número de tarjeta*" inputMode="numeric" placeholder="4242 4242 4242 4242" value={v.card} onChange={set('card')} error={errors.card} />
      <p className="small text-muted">Demostración: <code>4242 4242 4242 4242</code> se aprueba; <code>4000 0000 0000 0002</code> se rechaza. No se realizan cobros reales.</p>
      <button type="submit" className="btn btn-success align-self-end">Pagar ahora {formatCLP(total)}</button>
    </form>
  );
}
