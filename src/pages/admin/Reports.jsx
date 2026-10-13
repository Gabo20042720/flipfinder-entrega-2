import React from 'react';
import StatCard from '../../components/StatCard.jsx';
import FormField from '../../components/FormField.jsx';
import Alert from '../../components/Alert.jsx';
import { Orders, Products, Users } from '../../data/db.js';
import { useDbVersion, useSession } from '../../hooks/useStores.js';
import { formatCLP } from '../../utils/format.js';
import { salesSummary } from './Dashboard.jsx';

/** Ventas por producto a partir de las órdenes pagadas. */
export function salesByProduct(orders) {
  const map = {};
  orders.filter((o) => o.status === 'pagado').forEach((o) => o.items.forEach((i) => {
    map[i.name] = map[i.name] ?? { name: i.name, units: 0, amount: 0 };
    map[i.name].units += i.quantity; map[i.name].amount += i.price * i.quantity;
  }));
  return Object.values(map).sort((a, b) => b.amount - a.amount);
}
export function Reports() {
  useDbVersion();
  const orders = Orders.list(); const s = salesSummary(orders); const rows = salesByProduct(orders);
  return (
    <>
      <h1 className="h3">Reportes</h1>
      <div className="row g-3 mb-4"><div className="col-md-4"><StatCard title="Compras pagadas" value={s.count} /></div><div className="col-md-4"><StatCard title="Ventas totales" value={formatCLP(s.total)} color="success" /></div>
        <div className="col-md-4"><StatCard title="Productos" value={Products.list().length} color="dark" /></div></div>
      <h2 className="h5">Ventas por producto</h2>
      <table className="table"><thead><tr><th>Producto</th><th>Unidades</th><th>Monto</th></tr></thead><tbody>
        {rows.map((r) => <tr key={r.name}><td>{r.name}</td><td>{r.units}</td><td>{formatCLP(r.amount)}</td></tr>)}
        {!rows.length && <tr><td colSpan="3" className="text-muted text-center">Sin ventas registradas</td></tr>}
      </tbody></table>
    </>
  );
}
export function Profile() {
  const me = useSession();
  const [v, setV] = React.useState(null);
  const [saved, setSaved] = React.useState(false);
  const form = v ?? { name: me?.name ?? '', lastName: me?.lastName ?? '' };
  const submit = (e) => { e.preventDefault(); if (!form.name.trim()) return; Users.update(me.id, { name: form.name.trim(), lastName: form.lastName.trim() }); setSaved(true); };
  return (
    <form onSubmit={submit} aria-label="Perfil" style={{ maxWidth: 420 }}>
      <h1 className="h3">Perfil</h1><p className="text-muted">{me?.email}</p>
      <Alert type="success" message={saved ? 'Perfil actualizado' : ''} />
      <FormField id="pr-name" label="Nombre" value={form.name} onChange={(e) => { setSaved(false); setV({ ...form, name: e.target.value }); }} />
      <FormField id="pr-last" label="Apellidos" value={form.lastName} onChange={(e) => { setSaved(false); setV({ ...form, lastName: e.target.value }); }} />
      <button className="btn btn-primary" type="submit">Guardar</button>
    </form>
  );
}
