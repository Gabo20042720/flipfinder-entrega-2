import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid.jsx';
import Alert from '../components/Alert.jsx';
import { Categories as Cats, listActiveProducts } from '../data/db.js';
import { addToCart } from '../data/cart.js';
import { useDbVersion } from '../hooks/useStores.js';

/** /categorias (todas) y /categorias/:id (una categoría). */
export default function CategoriesPage() {
  useDbVersion();
  const { id } = useParams();
  const [msg, setMsg] = useState('');
  const categories = Cats.list();
  const selected = id ? Cats.get(id) : null;
  const add = (p) => { const r = addToCart(p.id); setMsg(r.ok ? '' : r.error); };
  if (id && !selected) return <Alert message="La categoría no existe." />;
  return (
    <>
      <h1 className="h3">Categorías</h1>
      <div className="row g-3 mb-4">
        {categories.map((c) => (
          <div className="col-6 col-md-3" key={c.id}>
            <Link to={`/categorias/${c.id}`} className={`card text-decoration-none ff-cat-card h-100${selected?.id === c.id ? ' border-primary' : ''}`}>
              <div className="card-body text-center"><strong>{c.name}</strong></div>
            </Link>
          </div>
        ))}
      </div>
      <Alert message={msg} />
      {selected
        ? <><h2 className="h4">{selected.name}</h2><ProductGrid products={listActiveProducts({ categoryId: selected.id })} categories={categories} onAdd={add} /></>
        : <p className="text-muted">Selecciona una categoría para ver sus productos.</p>}
    </>
  );
}
