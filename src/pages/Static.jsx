import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import FormField from '../components/FormField.jsx';
import Alert from '../components/Alert.jsx';
import { BLOGS } from '../data/seed.js';
import { isValidEmail, formatDate } from '../utils/format.js';

export function About() {
  return (
    <section>
      <h1 className="h3">Nosotros</h1>
      <p>FlipFinder es una tienda online chilena creada como proyecto de la asignatura Desarrollo Fullstack II (DSY1104) de Duoc UC. Ofrecemos tecnología, hogar, deporte y moda con envío incluido a todo Chile.</p>
      <h2 className="h5">Tecnologías</h2>
      <ul className="d-flex flex-wrap gap-2 list-unstyled">{['React 18', 'React Router', 'Bootstrap 5', 'Vite', 'Jasmine + Karma'].map((t) => <li key={t} className="badge text-bg-secondary">{t}</li>)}</ul>
    </section>
  );
}

export function Blogs() {
  return (
    <>
      <h1 className="h3">Blog</h1>
      <div className="row g-3">
        {BLOGS.map((b) => (
          <div className="col-md-6" key={b.id}><article className="card h-100"><div className="card-body">
            <h2 className="h5"><Link to={`/blogs/${b.id}`}>{b.title}</Link></h2>
            <small className="text-muted">{formatDate(b.date)}</small><p className="mt-2">{b.summary}</p>
          </div></article></div>
        ))}
      </div>
    </>
  );
}

export function BlogDetail() {
  const { id } = useParams();
  const b = BLOGS.find((x) => x.id === id);
  if (!b) return <Alert message="La entrada no existe." />;
  return <article><h1 className="h3">{b.title}</h1><small className="text-muted">{formatDate(b.date)}</small><p className="mt-3">{b.content}</p><Link to="/blogs">← Volver al blog</Link></article>;
}

export function Contact() {
  const [v, setV] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const set = (k) => (e) => setV({ ...v, [k]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!v.name.trim()) errs.name = 'Ingresa tu nombre';
    if (!isValidEmail(v.email)) errs.email = 'Correo no válido';
    if (v.message.trim().length < 10) errs.message = 'El mensaje debe tener al menos 10 caracteres';
    setErrors(errs);
    if (Object.keys(errs).length) return setSent(false);
    setSent(true); setV({ name: '', email: '', message: '' });
  };
  return (
    <form className="card p-4 mx-auto" style={{ maxWidth: 560 }} onSubmit={submit} noValidate aria-label="Contacto">
      <h1 className="h4">Contacto</h1>
      <Alert type="success" message={sent ? '¡Mensaje enviado! Te responderemos pronto.' : ''} />
      <FormField id="ct-name" label="Nombre" value={v.name} onChange={set('name')} error={errors.name} />
      <FormField id="ct-email" label="Correo" type="email" value={v.email} onChange={set('email')} error={errors.email} />
      <FormField id="ct-msg" label="Mensaje" as="textarea" rows="4" value={v.message} onChange={set('message')} error={errors.message} />
      <button className="btn btn-primary" type="submit">Enviar</button>
    </form>
  );
}

export function NotFound() { return <div className="text-center py-5"><h1>404</h1><p>La página no existe.</p><Link to="/">Volver al inicio</Link></div>; }
