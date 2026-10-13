import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CartTable from '../components/CartTable.jsx';
import { useCart } from '../hooks/useStores.js';
import { setQuantity, removeFromCart, clearCart } from '../data/cart.js';
import { formatCLP } from '../utils/format.js';

export default function Cart() {
  const { items, total } = useCart();
  const navigate = useNavigate();
  return (
    <>
      <h1 className="h3">Carrito de compras</h1>
      <CartTable items={items} editable onQuantity={setQuantity} onRemove={removeFromCart} />
      {items.length > 0 ? (
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
          <strong data-testid="cart-total">Total: {formatCLP(total)}</strong>
          <div className="d-flex gap-2">
            <button type="button" className="btn btn-secondary" onClick={clearCart}>Limpiar</button>
            <button type="button" className="btn btn-success" onClick={() => navigate('/checkout')}>Comprar ahora</button>
          </div>
        </div>
      ) : <Link className="btn btn-primary" to="/productos">Ver productos</Link>}
    </>
  );
}
