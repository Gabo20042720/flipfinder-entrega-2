import React from 'react';

/** Campo de formulario reutilizable con etiqueta y error. */
export default function FormField({ id, label, error, as = 'input', children, ...props }) {
  const Tag = as;
  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">{label}</label>
      <Tag id={id} className={`form-control${error ? ' is-invalid' : ''}`} aria-invalid={error ? 'true' : undefined} {...props}>{children}</Tag>
      {error && <div className="invalid-feedback d-block">{error}</div>}
    </div>
  );
}
