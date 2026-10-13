import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FormField from '../components/FormField.jsx';
import Alert from '../components/Alert.jsx';
import { login, register } from '../data/auth.js';
import { isValidEmail, isStrongPassword } from '../utils/format.js';

export function Login() {
  const navigate = useNavigate();
  const [v, setV] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const submit = (e) => {
    e.preventDefault();
    if (!isValidEmail(v.email)) return setError('Ingresa un correo válido');
    const r = login(v.email, v.password);
    if (!r.ok) return setError(r.error);
    setError('');
    navigate(r.user.role === 'admin' ? '/admin' : '/');
  };
  return (
    <form className="card p-4 mx-auto" style={{ maxWidth: 420 }} onSubmit={submit} noValidate aria-label="Iniciar sesión">
      <h1 className="h4">Iniciar sesión</h1>
      <Alert message={error} />
      <FormField id="lg-email" label="Correo" type="email" value={v.email} onChange={(e) => setV({ ...v, email: e.target.value })} />
      <FormField id="lg-pass" label="Contraseña" type="password" value={v.password} onChange={(e) => setV({ ...v, password: e.target.value })} />
      <button className="btn btn-primary" type="submit">Ingresar</button>
      <small className="mt-3 text-muted">¿No tienes cuenta? <Link to="/registro">Regístrate</Link><br />Demo: admin@flipfinder.cl / admin123 · cliente@flipfinder.cl / cliente123</small>
    </form>
  );
}

export function Register() {
  const navigate = useNavigate();
  const [v, setV] = useState({ name: '', lastName: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const set = (k) => (e) => setV({ ...v, [k]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!v.name.trim()) errs.name = 'Ingresa tu nombre';
    if (!v.lastName.trim()) errs.lastName = 'Ingresa tus apellidos';
    if (!isValidEmail(v.email)) errs.email = 'Correo no válido';
    if (!isStrongPassword(v.password)) errs.password = 'Mínimo 6 caracteres';
    if (v.confirm !== v.password) errs.confirm = 'Las contraseñas no coinciden';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const r = register(v);
    if (!r.ok) return setError(r.error);
    navigate('/');
  };
  return (
    <form className="card p-4 mx-auto" style={{ maxWidth: 480 }} onSubmit={submit} noValidate aria-label="Crear cuenta">
      <h1 className="h4">Crear cuenta</h1>
      <Alert message={error} />
      <FormField id="rg-name" label="Nombre" value={v.name} onChange={set('name')} error={errors.name} />
      <FormField id="rg-last" label="Apellidos" value={v.lastName} onChange={set('lastName')} error={errors.lastName} />
      <FormField id="rg-email" label="Correo" type="email" value={v.email} onChange={set('email')} error={errors.email} />
      <FormField id="rg-pass" label="Contraseña" type="password" value={v.password} onChange={set('password')} error={errors.password} />
      <FormField id="rg-conf" label="Repetir contraseña" type="password" value={v.confirm} onChange={set('confirm')} error={errors.confirm} />
      <button className="btn btn-primary" type="submit">Crear cuenta</button>
    </form>
  );
}
