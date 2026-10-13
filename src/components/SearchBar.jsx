import React, { useState } from 'react';

/** Barra de búsqueda controlada: mantiene el texto en su propio estado. */
export default function SearchBar({ onSearch, initialValue = '', placeholder = 'Buscar' }) {
  const [text, setText] = useState(initialValue);
  const submit = (e) => { e.preventDefault(); onSearch(text.trim()); };
  return (
    <form className="d-flex gap-2" role="search" onSubmit={submit}>
      <input className="form-control form-control-sm" type="search" aria-label="Buscar productos" placeholder={placeholder}
        value={text} onChange={(e) => setText(e.target.value)} />
      <button className="btn btn-outline-success btn-sm" type="submit">Buscar</button>
    </form>
  );
}
