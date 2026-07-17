import type { UseFormRegisterReturn } from 'react-hook-form';

interface Props {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  registration: UseFormRegisterReturn;
  type?: string;
  placeholder?: string;
  as?: 'input' | 'textarea' | 'select';
  children?: React.ReactNode;
}

export default function FormField({
  label, required, error, hint, registration, type = 'text', placeholder, as = 'input', children
}: Props) {
  const cls = error ? 'err' : '';

  return (
    <div className="field">
      <label>
        {label}{required && <span className="req">*</span>}
      </label>
      {as === 'textarea' ? (
        <textarea className={cls} placeholder={placeholder} rows={3} {...registration} />
      ) : as === 'select' ? (
        <select className={cls} {...registration}>{children}</select>
      ) : (
        <input type={type} className={cls} placeholder={placeholder} {...registration} />
      )}
      {hint && <span className="field-hint">{hint}</span>}
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}
