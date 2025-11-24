import './Input.css';

export const Input = ({ label, error, className = '', ...props }) => {
  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <input className={`input-field ${error ? 'input-error' : ''} ${className}`} {...props} />
      {error && <span className="input-error-text">{error}</span>}
    </div>
  );
};

export const Textarea = ({ label, error, className = '', ...props }) => {
  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <textarea className={`input-field textarea-field ${error ? 'input-error' : ''} ${className}`} {...props} />
      {error && <span className="input-error-text">{error}</span>}
    </div>
  );
};

export const Select = ({ label, error, options, className = '', ...props }) => {
  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <select className={`input-field select-field ${error ? 'input-error' : ''} ${className}`} {...props}>
        <option value="">-- Select --</option>
        {options?.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="input-error-text">{error}</span>}
    </div>
  );
};

export default Input;

