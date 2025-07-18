import React from 'react';
import styles from './button.module.css';
import { TButtonProps } from '@/types/types';

export const Button: React.FC<TButtonProps> = ({
  children,
  onClick,
  disabled = false,
  type = 'primary',
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    onClick?.();
    e.currentTarget.blur();
  };

  const buttonClasses = [styles.button, styles[type], disabled ? styles.disabled : '']
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled}
      aria-disabled={disabled}
    >
      <span className={styles.content}>{children}</span>
    </button>
  );
};
