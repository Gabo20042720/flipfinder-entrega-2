import React from 'react';

/** Filtros por categoría. selected = id de categoría o '' (todas). */
export default function CategoryChips({ categories, selected = '', onSelect }) {
  const all = [{ id: '', name: 'Todos' }, ...categories];
  return (
    <div className="d-flex flex-wrap gap-2 mb-3" role="group" aria-label="Filtrar por categoría">
      {all.map((c) => (
        <button key={c.id || 'all'} type="button" aria-pressed={selected === c.id}
          className={`btn btn-sm ${selected === c.id ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => onSelect(c.id)}>
          {c.name}
        </button>
      ))}
    </div>
  );
}
