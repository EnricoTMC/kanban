export function Input({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  min,
  max,
  required = false,
  className = '',
  ...props
}) {
  return (
    <label>
      {label}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        max={max}
        required={required}
        className={className}
        {...props}
      />
    </label>
  );
}

export function Select({ label, name, value, onChange, options, required = false, className = '', ...props }) {
  return (
    <label>
      {label}
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={className}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
