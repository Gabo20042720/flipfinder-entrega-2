import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid.jsx';
import { Categories, listActiveProducts, isOnOffer } from '../data/db.js';
import { addToCart } from '../data/cart.js';
import { useDbVersion } from '../hooks/useStores.js';
import Alert from '../components/Alert.jsx';

export default function Home() {
  useDbVersion();
  const [msg, setMsg] = useState('');
  const categories = Categories.list();
  const featured = listActiveProducts().slice(0, 4);
  const offers = listActiveProducts().filter(isOnOffer).slice(0, 4);
  const add = (p) => { const r = addToCart(p.id); setMsg(r.ok ? '' : r.error); };
  return (
    <>
      <section className="ff-hero text-center text-white p-5 mb-4 rounded">
        <h1>Nuevos lanzamientos</h1>
        <p className="lead">Descubre lo último en nuestra tienda, con envío incluido a todo Chile.</p>
        <Link className="btn btn-warning" to="/productos">Ver productos</Link>
      </section>
      <Alert message={msg} />
      <h2 className="h4 mb-3">Categorías</h2>
      <div className="row g-3 mb-4">
        {categories.map((c) => (
          <div className="col-6 col-md-3" key={c.id}>
            <Link to={`/categorias/${c.id}`} className="card ff-cat-card text-decoration-none h-100"><div className="card-body text-center"><strong>{c.name}</strong><div className="small text-muted">{c.description}</div></div></Link>
          </div>
        ))}
      </div>
      <h2 className="h4 mb-3">Destacados</h2>
      <ProductGrid products={featured} categories={categories} onAdd={add} />
      <h2 className="h4 my-3">Ofertas</h2>
      <ProductGrid products={offers} categories={categories} onAdd={add} emptyMessage="Pronto habrá nuevas ofertas." />
    </>
  );
}
