import { forwardRef } from 'react';
import styles from './textInput.module.css';

export type TextInputProps = {
  className?: string;
  icon?: string;
  id: string;
  title: string;
  placeholder: string;
  onInputClick?: () => void;
  onInputBlur?: () => void;
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'number' | 'url';
};

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      id,
      title,
      placeholder,
      onInputClick,
      value,
      className,
      icon,
      onInputBlur,
      onChange,
      error,
      type,
    },
    ref,
  ) => {
    return (
      <div className={`${styles.container} ${className}`}>
        <label className={styles.label} htmlFor={id}>
          {title}
        </label>
        <input
          type={type}
          className={`${styles.input} ${icon ? styles.inputWithIcon : ''} ${error ? styles.inputError : ''}`}
          id={id}
          placeholder={placeholder}
          onClick={onInputClick}
          value={value}
          style={icon ? { backgroundImage: `url(${icon})` } : undefined}
          onBlur={onInputBlur}
          onChange={e => onChange(e.target.value)}
          ref={ref}
        />
        {error && <span className={styles.error}>{error}</span>}
      </div>
    );
  },
);
