import React from 'react';
import { NavLink } from 'react-router-dom';

export const ADMIN_LINKS = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/ordenes', label: 'Órdenes' },
  { to: '/admin/productos', label: 'Productos' },
  { to: '/admin/categorias', label: 'Categorías' },
  { to: '/admin/usuarios', label: 'Usuarios' },
  { to: '/admin/reportes', label: 'Reportes' },
  { to: '/admin/perfil', label: 'Perfil' }
];
export default function AdminSidebar({ onLogout }) {
  return (
    <aside className="ff-sidebar p-3">
      <nav className="nav nav-pills flex-lg-column gap-1" aria-label="Administración">
        {ADMIN_LINKS.map((l) => <NavLink key={l.to} end={l.end} to={l.to} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>{l.label}</NavLink>)}
        <hr className="d-none d-lg-block" />
        <NavLink to="/" className="nav-link text-bg-dark">Tienda</NavLink>
        <button type="button" className="btn btn-danger btn-sm mt-1" onClick={onLogout}>Cerrar Sesión</button>
      </nav>
    </aside>
  );
}
