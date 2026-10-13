import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid.jsx';
import CategoryChips from '../components/CategoryChips.jsx';
import SearchBar from '../components/SearchBar.jsx';
import Alert from '../components/Alert.jsx';
import { Categories, listActiveProducts } from '../data/db.js';
import { addToCart } from '../data/cart.js';
import { useDbVersion } from '../hooks/useStores.js';

const SORTS = { relevant: 'Más relevantes', asc: 'Precio: menor a mayor', desc: 'Precio: mayor a menor' };
export function sortProducts(list, sort) {
  const price = (p) => (p.offerPrice && p.offerPrice < p.price ? p.offerPrice : p.price);
  if (sort === 'asc') return [...list].sort((a, b) => price(a) - price(b));
  if (sort === 'desc') return [...list].sort((a, b) => price(b) - price(a));
  return list;
}

export default function Products() {
  useDbVersion();
  const [params, setParams] = useSearchParams();
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('relevant');
  const [msg, setMsg] = useState('');
  const query = params.get('q') ?? '';
  const categories = Categories.list();
  const products = sortProducts(listActiveProducts({ categoryId: category, query }), sort);
  const add = (p) => { const r = addToCart(p.id); setMsg(r.ok ? '' : r.error); };
  return (
    <>
      <h1 className="h3">Productos</h1>
      <div className="d-flex flex-wrap gap-3 justify-content-between mb-3">
        <SearchBar key={query} initialValue={query} onSearch={(q) => setParams(q ? { q } : {})} />
        <select className="form-select form-select-sm w-auto" aria-label="Ordenar" value={sort} onChange={(e) => setSort(e.target.value)}>
          {Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>
      <CategoryChips categories={categories} selected={category} onSelect={setCategory} />
      <p className="text-muted small" role="status">{products.length} producto{products.length === 1 ? '' : 's'}</p>
      <Alert message={msg} />
      <ProductGrid products={products} categories={categories} onAdd={add} />
    </>
  );
}
