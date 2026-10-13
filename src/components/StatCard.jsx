import React from 'react';
export default function StatCard({ title, value, color = 'primary', note }) {
  return (
    <div className={`card text-bg-${color} h-100`}>
      <div className="card-body"><div className="small">{title}</div><div className="fs-3 fw-bold" data-testid="stat-value">{value}</div>{note && <small>{note}</small>}</div>
    </div>
  );
}
