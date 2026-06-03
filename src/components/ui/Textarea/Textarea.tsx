import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '../../../utils';
import styles from './Textarea.module.css';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const generatedId = id || Math.random().toString(36).substring(7);

    return (
      <div className={cn(styles.wrapper, className)}>
        {label && <label htmlFor={generatedId} className={styles.label}>{label}</label>}
        <textarea
          id={generatedId}
          ref={ref}
          className={cn(styles.textarea, error && styles.errorInput)}
          {...props}
        />
        {error && <span className={styles.errorText}>{error}</span>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
export default Textarea;
