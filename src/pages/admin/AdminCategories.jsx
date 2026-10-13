import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import FormField from '../../components/FormField.jsx';
import ConfirmButton from '../../components/ConfirmButton.jsx';
import Alert from '../../components/Alert.jsx';
import { Categories, Products } from '../../data/db.js';
import { useDbVersion } from '../../hooks/useStores.js';

export function CategoryForm({ initial, onSubmit, submitLabel = 'Guardar' }) {
  const [v, setV] = useState({ name: initial?.name ?? '', description: initial?.description ?? '' });
  const [error, setError] = useState('');
  const submit = (e) => {
    e.preventDefault();
    if (!v.name.trim()) return setError('El nombre es obligatorio');
    setError(''); onSubmit({ name: v.name.trim(), description: v.description.trim() });
  };
  return (
    <form onSubmit={submit} noValidate aria-label="Formulario de categoría">
      <FormField id="cf-name" label="Nombre*" value={v.name} onChange={(e) => setV({ ...v, name: e.target.value })} error={error} />
      <FormField id="cf-desc" label="Descripción" value={v.description} onChange={(e) => setV({ ...v, description: e.target.value })} />
      <button className="btn btn-primary" type="submit">{submitLabel}</button>
    </form>
  );
}
export function AdminCategories() {
  useDbVersion();
  const [msg, setMsg] = useState('');
  const remove = (c) => {
    if (Products.list().some((p) => p.categoryId === c.id)) return setMsg(`No se puede eliminar "${c.name}": tiene productos asociados.`);
    setMsg(''); Categories.remove(c.id);
  };
  return (
    <>
      <div className="d-flex justify-content-between mb-3"><h1 className="h3 mb-0">Categorías</h1><Link className="btn btn-primary btn-sm" to="/admin/categorias/nueva">Nueva categoría</Link></div>
      <Alert message={msg} />
      <table className="table"><thead><tr><th>Nombre</th><th>Descripción</th><th /></tr></thead><tbody>
        {Categories.list().map((c) => <tr key={c.id}><td>{c.name}</td><td>{c.description}</td><td className="text-nowrap"><Link className="btn btn-outline-primary btn-sm me-1" to={`/admin/categorias/${c.id}/editar`}>Editar</Link><ConfirmButton onConfirm={() => remove(c)} /></td></tr>)}
      </tbody></table>
    </>
  );
}
export function CategoryNew() {
  const navigate = useNavigate();
  return (<><h1 className="h3">Nueva categoría</h1><CategoryForm submitLabel="Crear categoría" onSubmit={(d) => { Categories.create(d); navigate('/admin/categorias'); }} /></>);
}
export function CategoryEdit() {
  const { id } = useParams(); const navigate = useNavigate(); const c = Categories.get(id);
  if (!c) return <Alert message="La categoría no existe." />;
  return (<><h1 className="h3">Editar categoría</h1><CategoryForm initial={c} onSubmit={(d) => { Categories.update(id, d); navigate('/admin/categorias'); }} /></>);
}
