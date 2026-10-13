import React from 'react';
import { Link } from 'react-router-dom';
import { formatCLP } from '../utils/format.js';
import { isOnOffer, effectivePrice } from '../data/db.js';

/** Tarjeta de producto. Props: product, onAdd (función), categoryName (opcional). */
export default function ProductCard({ product, onAdd, categoryName }) {
  const soldOut = product.stock <= 0;
  const low = product.stock > 0 && product.stock <= 3;
  return (
    <article className="card h-100 ff-card" data-testid="product-card">
      <Link to={`/productos/${product.id}`}>
        <img src={product.image} className="card-img-top ff-card-img" alt={product.name} loading="lazy"
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'img/placeholder.jpg'; }} />
      </Link>
      <div className="card-body d-flex flex-column">
        {categoryName && <small className="text-muted">{categoryName}</small>}
        <h3 className="h6 card-title">{product.name}</h3>
        <p className="mb-1">
          {isOnOffer(product) && <s className="text-muted me-2 small">{formatCLP(product.price)}</s>}
          <strong className={isOnOffer(product) ? 'text-danger' : ''}>{formatCLP(effectivePrice(product))}</strong>
        </p>
        {low && <span className="badge text-bg-warning align-self-start mb-2">¡Últimas unidades!</span>}
        <button type="button" className="btn btn-dark mt-auto" disabled={soldOut} onClick={() => onAdd?.(product)}>
          {soldOut ? 'Sin stock' : 'Añadir'}
        </button>
      </div>
    </article>
  );
}
