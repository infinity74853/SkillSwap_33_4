import React from 'react';
import styles from './checkbox.module.css';
import { CustomCheckboxMask } from './type';

interface CheckboxUiProps {
  // Базовые пропсы input
  id: string;
  checked: boolean;
  name?: string;
  disabled?: boolean;
  readOnly?: boolean;

  // Визуальное состояние
  label: string;
  customCheckboxMask?: CustomCheckboxMask;

  // Обработчики
  onChange: () => void;

  // ARIA-атрибуты
  ariaLabel?: string;
  ariaLabelledby?: string;
  role?: string;
}

export const CheckboxUI: React.FC<CheckboxUiProps> = ({
  id,
  name,
  checked,
  disabled = false,
  readOnly = false,
  label,
  customCheckboxMask = 'empty',
  onChange,
  ariaLabel,
  ariaLabelledby,
  role = 'checkbox',
}) => {
  return (
    <div className={styles.checkboxContainer}>
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        disabled={disabled}
        readOnly={readOnly}
        onChange={() => {}} // Пустой обработчик для контролируемого input
        className={styles.hiddenCheckbox}
        aria-label={ariaLabel || label}
        aria-labelledby={ariaLabelledby}
        role={role}
      />
      <label
        htmlFor={id}
        className={`${styles.customCheckbox} ${styles[customCheckboxMask]}`}
        onClick={e => {
          e.preventDefault();
          onChange?.();
        }}
      >
        <span className={styles.checkmark} />
        <span className={styles.labelText}>{label}</span>
      </label>
    </div>
  );
};
