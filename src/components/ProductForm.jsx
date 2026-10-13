import React, { useState } from 'react';
import FormField from './FormField.jsx';

export function validateProduct(v) {
  const e = {};
  if (!v.name?.trim()) e.name = 'El nombre es obligatorio';
  if (!(Number(v.price) > 0)) e.price = 'El precio debe ser mayor a 0';
  if (v.offerPrice !== '' && v.offerPrice != null && !(Number(v.offerPrice) > 0 && Number(v.offerPrice) < Number(v.price))) e.offerPrice = 'La oferta debe ser menor al precio';
  if (!Number.isInteger(Number(v.stock)) || Number(v.stock) < 0) e.stock = 'El stock debe ser un entero ≥ 0';
  if (!v.categoryId) e.categoryId = 'Selecciona una categoría';
  return e;
}

const EMPTY = { name: '', description: '', price: '', offerPrice: '', stock: 0, categoryId: '', image: 'img/placeholder.jpg', active: true };

/** Formulario de producto (crear/editar). initial = producto existente (opcional). */
export default function ProductForm({ initial, categories, onSubmit, submitLabel = 'Guardar' }) {
  const [values, setValues] = useState({ ...EMPTY, ...initial, offerPrice: initial?.offerPrice ?? '' });
  const [errors, setErrors] = useState({});
  const set = (k) => (e) => setValues({ ...values, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  const submit = (e) => {
    e.preventDefault();
    const errs = validateProduct(values);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    onSubmit({ ...values, name: values.name.trim(), price: Number(values.price), stock: Number(values.stock),
      offerPrice: values.offerPrice === '' ? null : Number(values.offerPrice) });
  };
  return (
    <form onSubmit={submit} noValidate aria-label="Formulario de producto">
      <FormField id="pf-name" label="Nombre*" value={values.name} onChange={set('name')} error={errors.name} />
      <FormField id="pf-desc" label="Descripción" as="textarea" rows="2" value={values.description} onChange={set('description')} />
      <div className="row">
        <div className="col-md-4"><FormField id="pf-price" label="Precio*" type="number" value={values.price} onChange={set('price')} error={errors.price} /></div>
        <div className="col-md-4"><FormField id="pf-offer" label="Precio oferta" type="number" value={values.offerPrice} onChange={set('offerPrice')} error={errors.offerPrice} /></div>
        <div className="col-md-4"><FormField id="pf-stock" label="Stock*" type="number" value={values.stock} onChange={set('stock')} error={errors.stock} /></div>
      </div>
      <FormField id="pf-cat" label="Categoría*" as="select" value={values.categoryId} onChange={set('categoryId')} error={errors.categoryId}>
        <option value="">Selecciona…</option>
        {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
      </FormField>
      <FormField id="pf-img" label="Imagen (URL o ruta)" value={values.image} onChange={set('image')} />
      <div className="form-check mb-3">
        <input id="pf-active" type="checkbox" className="form-check-input" checked={!!values.active} onChange={set('active')} />
        <label htmlFor="pf-active" className="form-check-label">Visible en la tienda</label>
      </div>
      <button className="btn btn-primary" type="submit">{submitLabel}</button>
    </form>
  );
}
