import React from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar.jsx';
import { useSession } from '../../hooks/useStores.js';
import { logout } from '../../data/auth.js';

/** Protege las rutas /admin/*: solo usuarios con rol admin. */
export default function AdminLayout() {
  const user = useSession();
  const navigate = useNavigate();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;
  return (
    <div className="row g-0 ff-admin">
      <div className="col-lg-2"><AdminSidebar onLogout={() => { logout(); navigate('/'); }} /></div>
      <div className="col-lg-10 p-3 p-lg-4"><Outlet /></div>
    </div>
  );
}
