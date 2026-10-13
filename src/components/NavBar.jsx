import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { formatCLP } from '../utils/format.js';
import SearchBar from './SearchBar.jsx';

/** Barra de navegación pública. Recibe todo por props (componente presentacional). */
export default function NavBar({ user = null, cartCount = 0, cartTotal = 0, onLogout = () => {} }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const link = ({ isActive }) => `nav-link${isActive ? ' active' : ''}`;
  const close = () => setOpen(false);
  return (
    <header className="ff-header">
      <nav className="navbar navbar-expand-lg container py-2" aria-label="Principal">
        <Link className="navbar-brand ff-brand" to="/" onClick={close}><span className="ff-logo">F</span> FlipFinder</Link>
        <button className="navbar-toggler" type="button" aria-label="Abrir menú" aria-expanded={open} onClick={() => setOpen(!open)}>
          <span className="navbar-toggler-icon" />
        </button>
        <div className={`collapse navbar-collapse${open ? ' show' : ''}`}>
          <ul className="navbar-nav mx-lg-auto">
            <li className="nav-item"><NavLink end className={link} to="/" onClick={close}>Home</NavLink></li>
            <li className="nav-item"><NavLink className={link} to="/productos" onClick={close}>Productos</NavLink></li>
            <li className="nav-item"><NavLink className={link} to="/categorias" onClick={close}>Categorías</NavLink></li>
            <li className="nav-item"><NavLink className={link} to="/ofertas" onClick={close}>Ofertas</NavLink></li>
            <li className="nav-item"><NavLink className={link} to="/nosotros" onClick={close}>Nosotros</NavLink></li>
            <li className="nav-item"><NavLink className={link} to="/blogs" onClick={close}>Blog</NavLink></li>
            <li className="nav-item"><NavLink className={link} to="/contacto" onClick={close}>Contacto</NavLink></li>
          </ul>
          <SearchBar onSearch={(q) => { close(); navigate(`/productos?q=${encodeURIComponent(q)}`); }} />
          <Link to="/carrito" className="btn btn-success btn-sm ms-lg-2 my-2 my-lg-0" data-testid="cart-button" onClick={close}>
            🛒 Carrito {formatCLP(cartTotal)} <span className="badge text-bg-light">{cartCount}</span>
          </Link>
          <div className="ms-lg-2 d-flex gap-2 align-items-center">
            {user ? (
              <>
                <span className="small text-muted" data-testid="user-name">Hola, {user.name}</span>
                {user.role === 'admin' && <Link className="btn btn-outline-dark btn-sm" to="/admin" onClick={close}>Admin</Link>}
                <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => { close(); onLogout(); }}>Salir</button>
              </>
            ) : (
              <>
                <Link className="btn btn-outline-primary btn-sm" to="/login" onClick={close}>Iniciar Sesión</Link>
                <Link className="btn btn-primary btn-sm" to="/registro" onClick={close}>Crear Cuenta</Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
