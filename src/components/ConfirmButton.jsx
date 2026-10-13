import React, { useState } from 'react';
/** Botón con confirmación en dos pasos (para acciones destructivas). */
export default function ConfirmButton({ label = 'Eliminar', confirmLabel = '¿Confirmar?', onConfirm, className = 'btn btn-danger btn-sm' }) {
  const [asking, setAsking] = useState(false);
  if (!asking) return <button type="button" className={className} onClick={() => setAsking(true)}>{label}</button>;
  return (
    <span className="btn-group btn-group-sm">
      <button type="button" className="btn btn-danger" onClick={() => { setAsking(false); onConfirm(); }}>{confirmLabel}</button>
      <button type="button" className="btn btn-outline-secondary" onClick={() => setAsking(false)}>Cancelar</button>
    </span>
  );
}
