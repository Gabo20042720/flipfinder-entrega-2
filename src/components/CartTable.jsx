import React from 'react';
import { formatCLP } from '../utils/format.js';

/** Tabla del carrito. editable=false la usa solo como resumen. */
export default function CartTable({ items, editable = false, onQuantity, onRemove }) {
  if (!items.length) return <p className="text-muted" role="status">Tu carrito está vacío.</p>;
  return (
    <div className="table-responsive">
      <table className="table align-middle">
        <thead><tr><th>Imagen</th><th>Nombre</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th>{editable && <th>Acciones</th>}</tr></thead>
        <tbody>
          {items.map((i) => (
            <tr key={i.productId}>
              <td><img src={i.image} alt="" width="48" height="48" className="rounded" style={{ objectFit: 'cover' }} /></td>
              <td>{i.name}</td>
              <td>{formatCLP(i.price)}</td>
              <td>
                {editable ? (
                  <div className="btn-group btn-group-sm" role="group" aria-label={`Cantidad de ${i.name}`}>
                    <button type="button" className="btn btn-outline-secondary" aria-label={`Quitar una unidad de ${i.name}`} onClick={() => onQuantity(i.productId, i.quantity - 1)}>−</button>
                    <span className="btn btn-light disabled" data-testid="qty">{i.quantity}</span>
                    <button type="button" className="btn btn-outline-secondary" aria-label={`Agregar una unidad de ${i.name}`} onClick={() => onQuantity(i.productId, i.quantity + 1)}>+</button>
                  </div>
                ) : i.quantity}
              </td>
              <td>{formatCLP(i.price * i.quantity)}</td>
              {editable && <td><button type="button" className="btn btn-danger btn-sm" onClick={() => onRemove(i.productId)}>Eliminar</button></td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
