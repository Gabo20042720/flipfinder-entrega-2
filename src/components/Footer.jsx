import React from 'react';
export default function Footer() {
  return (
    <footer className="ff-footer mt-5 py-4 text-center">
      <p className="mb-1">🚚 Envío incluido a todo Chile</p>
      <small>© {new Date().getFullYear()} FlipFinder · Proyecto DSY1104 Duoc UC</small>
    </footer>
  );
}
