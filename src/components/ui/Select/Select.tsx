import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '../../../utils';
import styles from './Select.module.css';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { label: string; value: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, id, ...props }, ref) => {
    const generatedId = id || Math.random().toString(36).substring(7);

    return (
      <div className={cn(styles.wrapper, className)}>
        {label && <label htmlFor={generatedId} className={styles.label}>{label}</label>}
        <div className={styles.selectContainer}>
          <select
            id={generatedId}
            ref={ref}
            className={cn(styles.select, error && styles.errorInput)}
            {...props}
          >
            {options.map((opt, i) => (
              <option key={i} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        {error && <span className={styles.errorText}>{error}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;
