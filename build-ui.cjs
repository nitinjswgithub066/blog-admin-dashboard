const fs = require('fs');
const path = require('path');

const uiDir = path.join(__dirname, 'src', 'components', 'ui');
if (!fs.existsSync(uiDir)) fs.mkdirSync(uiDir, { recursive: true });

const components = [
  {
    name: 'Input',
    tsx: `import React, { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../../utils';
import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
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
`,
    css: `.wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  width: 100%;
}

.label {
  font-size: var(--font-size-sm);
  color: var(--text-primary);
  font-weight: 500;
}

.inputContainer {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.input {
  width: 100%;
  padding: var(--spacing-3) var(--spacing-4);
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: var(--font-size-base);
  transition: var(--transition-fast);
}

.input:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 2px rgba(109, 93, 246, 0.2);
}

.hasLeftIcon {
  padding-left: 2.5rem;
}

.hasRightIcon {
  padding-right: 2.5rem;
}

.leftIcon, .rightIcon {
  position: absolute;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
}

.leftIcon { left: 0.75rem; }
.rightIcon { right: 0.75rem; }

.errorInput {
  border-color: var(--danger);
}

.errorText {
  color: var(--danger);
  font-size: var(--font-size-xs);
  margin-top: 2px;
}
`
  },
  {
    name: 'Textarea',
    tsx: `import React, { TextareaHTMLAttributes, forwardRef } from 'react';
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
`,
    css: `.wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  width: 100%;
}

.label {
  font-size: var(--font-size-sm);
  color: var(--text-primary);
  font-weight: 500;
}

.textarea {
  width: 100%;
  padding: var(--spacing-3) var(--spacing-4);
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: var(--font-size-base);
  transition: var(--transition-fast);
  min-height: 100px;
  resize: vertical;
}

.textarea:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 2px rgba(109, 93, 246, 0.2);
}

.errorInput {
  border-color: var(--danger);
}

.errorText {
  color: var(--danger);
  font-size: var(--font-size-xs);
  margin-top: 2px;
}
`
  },
  {
    name: 'Select',
    tsx: `import React, { SelectHTMLAttributes, forwardRef } from 'react';
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
`,
    css: `.wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  width: 100%;
}

.label {
  font-size: var(--font-size-sm);
  color: var(--text-primary);
  font-weight: 500;
}

.selectContainer {
  position: relative;
  width: 100%;
}

.select {
  width: 100%;
  padding: var(--spacing-3) var(--spacing-4);
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: var(--font-size-base);
  transition: var(--transition-fast);
  appearance: none;
}

.select:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 2px rgba(109, 93, 246, 0.2);
}

.select option {
  background: var(--bg-primary);
  color: var(--text-primary);
}

.errorInput {
  border-color: var(--danger);
}

.errorText {
  color: var(--danger);
  font-size: var(--font-size-xs);
  margin-top: 2px;
}
`
  },
  {
    name: 'Modal',
    tsx: `import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useClickOutside } from '../../../hooks';
import styles from './Modal.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useClickOutside(modalRef, () => {
    if (isOpen) onClose();
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={styles.overlay}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.backdrop}
          />
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={styles.modal}
          >
            <div className={styles.header}>
              {title && <h3 className={styles.title}>{title}</h3>}
              <button onClick={onClose} className={styles.closeBtn}>&times;</button>
            </div>
            <div className={styles.content}>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
`,
    css: `.overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-4);
}

.backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
}

.modal {
  position: relative;
  width: 100%;
  max-width: 500px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-glass);
  display: flex;
  flex-direction: column;
  z-index: 10;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-4) var(--spacing-6);
  border-bottom: 1px solid var(--border-color);
}

.title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-primary);
}

.closeBtn {
  font-size: 24px;
  color: var(--text-muted);
  transition: var(--transition-fast);
}

.closeBtn:hover {
  color: var(--text-primary);
}

.content {
  padding: var(--spacing-6);
}
`
  },
  {
    name: 'Avatar',
    tsx: `import React from 'react';
import { cn } from '../../../utils';
import styles from './Avatar.module.css';

interface AvatarProps {
  src?: string;
  alt?: string;
  initials?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ src, alt, initials = '?', size = 'md', className }) => {
  return (
    <div className={cn(styles.avatar, styles[size], className)}>
      {src ? (
        <img src={src} alt={alt || 'Avatar'} className={styles.image} />
      ) : (
        <span className={styles.initials}>{initials.substring(0, 2).toUpperCase()}</span>
      )}
    </div>
  );
};

export default Avatar;
`,
    css: `.avatar {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  background: var(--accent-primary);
  color: #fff;
  overflow: hidden;
  flex-shrink: 0;
}

.sm { width: 32px; height: 32px; font-size: 12px; }
.md { width: 40px; height: 40px; font-size: 14px; }
.lg { width: 56px; height: 56px; font-size: 18px; }
.xl { width: 80px; height: 80px; font-size: 24px; }

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.initials {
  font-weight: 600;
}
`
  },
  {
    name: 'FileUpload',
    tsx: `import React, { useRef, useState } from 'react';
import { cn } from '../../../utils';
import styles from './FileUpload.module.css';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  label?: string;
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, accept, label = 'Drag & drop a file here, or click to select', className }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div 
      className={cn(styles.uploadContainer, isDragActive && styles.dragActive, className)}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className={styles.hiddenInput}
      />
      <div className={styles.content}>
        <span className={styles.icon}>📁</span>
        <p className={styles.label}>{label}</p>
      </div>
    </div>
  );
};

export default FileUpload;
`,
    css: `.uploadContainer {
  width: 100%;
  min-height: 150px;
  border: 2px dashed var(--border-color);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: var(--card-bg);
  transition: var(--transition-fast);
  padding: var(--spacing-4);
}

.uploadContainer:hover, .dragActive {
  border-color: var(--accent-primary);
  background: rgba(109, 93, 246, 0.05);
}

.hiddenInput {
  display: none;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-2);
  text-align: center;
}

.icon {
  font-size: 32px;
}

.label {
  color: var(--text-muted);
  font-size: var(--font-size-sm);
}
`
  }
];

components.forEach(comp => {
  const compDir = path.join(uiDir, comp.name);
  if (!fs.existsSync(compDir)) fs.mkdirSync(compDir, { recursive: true });
  
  fs.writeFileSync(path.join(compDir, comp.name + '.tsx'), comp.tsx);
  fs.writeFileSync(path.join(compDir, comp.name + '.module.css'), comp.css);
  fs.writeFileSync(path.join(compDir, 'index.ts'), "export { default } from './" + comp.name + "';\n");
});

console.log('UI components generated!');
