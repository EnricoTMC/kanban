export function Button({ children, onClick, type = 'button', className = '', disabled = false, ...props }) {
  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonGroup({ children, className = '' }) {
  return <div className={`button-group ${className}`}>{children}</div>;
}
