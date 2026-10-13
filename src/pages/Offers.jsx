import React, { useState } from 'react';
import ProductGrid from '../components/ProductGrid.jsx';
import Alert from '../components/Alert.jsx';
import { Categories, listActiveProducts } from '../data/db.js';
import { addToCart } from '../data/cart.js';
import { useDbVersion } from '../hooks/useStores.js';

export default function Offers() {
  useDbVersion();
  const [msg, setMsg] = useState('');
  const add = (p) => { const r = addToCart(p.id); setMsg(r.ok ? '' : r.error); };
  return (
    <>
      <h1 className="h3">Ofertas</h1>
      <Alert message={msg} />
      <ProductGrid products={listActiveProducts({ onlyOffers: true })} categories={Categories.list()} onAdd={add} emptyMessage="No hay productos en oferta por ahora." />
    </>
  );
}
