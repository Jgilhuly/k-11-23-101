import './Button.css';

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  className = '',
  ...props 
}) => {
  const buttonClass = `btn btn-${variant} btn-${size} ${className}`;
  return (
    <button className={buttonClass} disabled={disabled} {...props}>
      {children}
    </button>
  );
};

export default Button;

