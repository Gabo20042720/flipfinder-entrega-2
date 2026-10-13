import React from 'react';
import ProductCard from './ProductCard.jsx';

/** Lista de productos; muestra un mensaje cuando no hay resultados. */
export default function ProductGrid({ products, onAdd, categories = [], emptyMessage = 'No encontramos productos.' }) {
  if (!products.length) return <div className="alert alert-light text-center" role="status">{emptyMessage}</div>;
  const nameOf = (id) => categories.find((c) => c.id === id)?.name;
  return (
    <div className="row g-3 row-cols-2 row-cols-md-3 row-cols-lg-4">
      {products.map((p) => (
        <div className="col" key={p.id}><ProductCard product={p} onAdd={onAdd} categoryName={nameOf(p.categoryId)} /></div>
      ))}
    </div>
  );
}
