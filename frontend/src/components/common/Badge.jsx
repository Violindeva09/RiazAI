const Badge = ({ variant = 'primary', children, className = '', ...props }) => {
  const variants = {
    primary: 'badge-primary',
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200/60',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant] || variants.primary} ${className}`} {...props}>
      {children}
    </span>
  );
};

export default Badge;