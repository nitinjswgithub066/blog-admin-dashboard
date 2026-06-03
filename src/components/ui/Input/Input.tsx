import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../../utils';
import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, leftIcon, rightIcon, id, ...props }, ref) => {
    const generatedId = id || Math.random().toString(36).substring(7);

    return (
      <div className={cn(styles.wrapper, className)}>
        {label && <label htmlFor={generatedId} className={styles.label}>{label}</label>}
        <div className={styles.inputContainer}>
          {leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}
          <input
            id={generatedId}
            ref={ref}
            className={cn(styles.input, leftIcon && styles.hasLeftIcon, rightIcon && styles.hasRightIcon, error && styles.errorInput)}
            {...props}
          />
          {rightIcon && <span className={styles.rightIcon}>{rightIcon}</span>}
        </div>
        {error && <span className={styles.errorText}>{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
