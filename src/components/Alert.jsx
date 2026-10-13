import React from 'react';
/** Muestra un mensaje solo cuando existe (renderizado condicional). */
export default function Alert({ message, type = 'danger' }) {
  if (!message) return null;
  return <div className={`alert alert-${type}`} role="alert">{message}</div>;
}
