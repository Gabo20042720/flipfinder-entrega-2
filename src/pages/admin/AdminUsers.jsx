import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import FormField from '../../components/FormField.jsx';
import ConfirmButton from '../../components/ConfirmButton.jsx';
import Alert from '../../components/Alert.jsx';
import { Users, Orders } from '../../data/db.js';
import { useDbVersion, useSession } from '../../hooks/useStores.js';
import { isValidEmail, isStrongPassword, formatCLP, formatDate } from '../../utils/format.js';
import { StatusBadge } from './Orders.jsx';

export function UserForm({ initial, onSubmit, submitLabel = 'Guardar', emailTaken = () => false }) {
  const [v, setV] = useState({ name: '', lastName: '', email: '', password: '', role: 'cliente', ...initial });
  const [errors, setErrors] = useState({});
  const set = (k) => (e) => setV({ ...v, [k]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!v.name.trim()) errs.name = 'El nombre es obligatorio';
    if (!isValidEmail(v.email)) errs.email = 'Correo no válido';
    else if (emailTaken(v.email)) errs.email = 'El correo ya está registrado';
    if (!isStrongPassword(v.password)) errs.password = 'Mínimo 6 caracteres';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    onSubmit({ ...v, name: v.name.trim(), lastName: v.lastName.trim(), email: v.email.trim().toLowerCase() });
  };
  return (
    <form onSubmit={submit} noValidate aria-label="Formulario de usuario">
      <FormField id="uf-name" label="Nombre*" value={v.name} onChange={set('name')} error={errors.name} />
      <FormField id="uf-last" label="Apellidos" value={v.lastName} onChange={set('lastName')} />
      <FormField id="uf-email" label="Correo*" type="email" value={v.email} onChange={set('email')} error={errors.email} />
      <FormField id="uf-pass" label="Contraseña*" type="password" value={v.password} onChange={set('password')} error={errors.password} />
      <FormField id="uf-role" label="Rol" as="select" value={v.role} onChange={set('role')}><option value="cliente">Cliente</option><option value="admin">Administrador</option></FormField>
      <button className="btn btn-primary" type="submit">{submitLabel}</button>
    </form>
  );
}
export function AdminUsers() {
  useDbVersion();
  const me = useSession();
  const [msg, setMsg] = useState('');
  const remove = (u) => { if (u.id === me?.id) return setMsg('No puedes eliminar tu propia cuenta.'); setMsg(''); Users.remove(u.id); };
  return (
    <>
      <div className="d-flex justify-content-between mb-3"><h1 className="h3 mb-0">Usuarios</h1><Link className="btn btn-primary btn-sm" to="/admin/usuarios/nuevo">Nuevo usuario</Link></div>
      <Alert message={msg} />
      <div className="table-responsive"><table className="table"><thead><tr><th>Nombre</th><th>Correo</th><th>Rol</th><th /></tr></thead><tbody>
        {Users.list().map((u) => <tr key={u.id}><td><Link to={`/admin/usuarios/${u.id}`}>{u.name} {u.lastName}</Link></td><td>{u.email}</td><td>{u.role}</td>
          <td className="text-nowrap"><Link className="btn btn-outline-primary btn-sm me-1" to={`/admin/usuarios/${u.id}/editar`}>Editar</Link><ConfirmButton onConfirm={() => remove(u)} /></td></tr>)}
      </tbody></table></div>
    </>
  );
}
export function UserNew() {
  const navigate = useNavigate();
  const taken = (email) => Users.list().some((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  return (<><h1 className="h3">Nuevo usuario</h1><UserForm emailTaken={taken} submitLabel="Crear usuario" onSubmit={(d) => { Users.create({ ...d, address: { street: '', department: '', region: '', commune: '' } }); navigate('/admin/usuarios'); }} /></>);
}
export function UserEdit() {
  const { id } = useParams(); const navigate = useNavigate(); const u = Users.get(id);
  if (!u) return <Alert message="El usuario no existe." />;
  const taken = (email) => Users.list().some((x) => x.id !== id && x.email.toLowerCase() === email.trim().toLowerCase());
  return (<><h1 className="h3">Editar usuario</h1><UserForm initial={u} emailTaken={taken} onSubmit={(d) => { Users.update(id, d); navigate('/admin/usuarios'); }} /></>);
}
export function UserDetail() {
  useDbVersion();
  const { id } = useParams(); const u = Users.get(id);
  if (!u) return <Alert message="El usuario no existe." />;
  const orders = Orders.byUser(id);
  return (
    <>
      <h1 className="h3">{u.name} {u.lastName}</h1><p>{u.email} · {u.role}</p>
      <h2 className="h5">Historial de compras</h2>
      {orders.length ? <ul className="list-group mb-3">{orders.map((o) => <li key={o.id} className="list-group-item d-flex justify-content-between"><span>#{o.number} · {formatDate(o.date)}</span><span>{formatCLP(o.total)} <StatusBadge status={o.status} /></span></li>)}</ul> : <p className="text-muted">Sin compras.</p>}
      <Link className="btn btn-outline-primary btn-sm me-2" to={`/admin/usuarios/${id}/editar`}>Editar usuario</Link><Link to="/admin/usuarios">← Volver</Link>
    </>
  );
}
