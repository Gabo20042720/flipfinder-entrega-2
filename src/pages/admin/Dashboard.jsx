import React from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../../components/StatCard.jsx';
import { Orders, Products, Users, criticalProducts } from '../../data/db.js';
import { useDbVersion } from '../../hooks/useStores.js';
import { formatCLP } from '../../utils/format.js';

export const salesSummary = (orders) => {
  const paid = orders.filter((o) => o.status === 'pagado');
  return { count: paid.length, total: paid.reduce((s, o) => s + o.total, 0) };
};

export default function Dashboard() {
  useDbVersion();
  const sales = salesSummary(Orders.list());
  const critical = criticalProducts().length;
  const sections = [
    ['Órdenes', 'Seguimiento de las compras realizadas', '/admin/ordenes'],
    ['Productos', 'Inventario y detalle de productos', '/admin/productos'],
    ['Categorías', 'Organiza los productos', '/admin/categorias'],
    ['Usuarios', 'Cuentas y roles', '/admin/usuarios'],
    ['Reportes', 'Informes de ventas', '/admin/reportes'],
    ['Perfil', 'Tu información de cuenta', '/admin/perfil']
  ];
  return (
    <>
      <h1 className="h3">Dashboard</h1><p className="text-muted">Resumen de las actividades diarias</p>
      <div className="row g-3 mb-4">
        <div className="col-md-4"><StatCard title="Compras" value={sales.count} color="primary" note={`Ventas: ${formatCLP(sales.total)}`} /></div>
        <div className="col-md-4"><StatCard title="Productos" value={Products.list().length} color="success" note={`Stock crítico: ${critical}`} /></div>
        <div className="col-md-4"><StatCard title="Usuarios" value={Users.list().length} color="warning" /></div>
      </div>
      <div className="row g-3">
        {sections.map(([t, d, to]) => <div className="col-6 col-lg-4" key={to}><Link to={to} className="card h-100 text-decoration-none"><div className="card-body"><strong>{t}</strong><div className="small text-muted">{d}</div></div></Link></div>)}
      </div>
    </>
  );
}
