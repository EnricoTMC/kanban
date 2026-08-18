export function Card({ children, className = '', ...props }) {
  return (
    <div className={`cartao-generico ${className}`} {...props}>
      {children}
    </div>
  );
}

export function MetricCard({ label, value, highlight = false, ...props }) {
  return (
    <div className={`cartao-metrica ${highlight ? 'destaque' : ''}`} {...props}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export function EmptyState({ message = 'Sem itens nesta etapa.' }) {
  return <div className="estado-vazio">{message}</div>;
}
