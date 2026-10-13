import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Products, Categories, isOnOffer, effectivePrice } from '../data/db.js';
import { addToCart } from '../data/cart.js';
import { useDbVersion } from '../hooks/useStores.js';
import { formatCLP } from '../utils/format.js';
import Alert from '../components/Alert.jsx';

export default function ProductDetail() {
  useDbVersion();
  const { id } = useParams();
  const [qty, setQty] = useState(1);
  const [msg, setMsg] = useState({ text: '', type: 'danger' });
  const p = Products.get(id);
  if (!p || p.active === false) return <Alert message="El producto no existe o no está disponible." />;
  const cat = Categories.get(p.categoryId);
  const add = () => {
    const r = addToCart(p.id, qty);
    setMsg(r.ok ? { text: 'Producto añadido al carrito', type: 'success' } : { text: r.error, type: 'danger' });
  };
  return (
    <div className="row g-4">
      <div className="col-md-5"><img src={p.image} alt={p.name} className="img-fluid rounded ff-detail-img" /></div>
      <div className="col-md-7">
        <nav aria-label="breadcrumb"><small><Link to="/productos">Productos</Link> / {cat?.name}</small></nav>
        <h1 className="h3">{p.name}</h1>
        <p>{p.description}</p>
        <p className="fs-4">
          {isOnOffer(p) && <s className="text-muted fs-6 me-2">{formatCLP(p.price)}</s>}
          <strong>{formatCLP(effectivePrice(p))}</strong>
        </p>
        <p className="text-muted">Stock disponible: {p.stock}</p>
        <div className="d-flex gap-2 align-items-center mb-3">
          <label htmlFor="qty" className="form-label mb-0">Cantidad</label>
          <input id="qty" type="number" min="1" max={p.stock} className="form-control w-auto" value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))} />
          <button type="button" className="btn btn-dark" disabled={p.stock <= 0} onClick={add}>{p.stock <= 0 ? 'Sin stock' : 'Añadir al carrito'}</button>
        </div>
        <Alert message={msg.text} type={msg.type} />
      </div>
    </div>
  );
}
