import React from 'react';
import styles from './checkbox.module.css';

interface CheckboxUiProps {
  id: string;
  name: string;
  checked: boolean;
  onChange: () => void;
  label: string;
}

export const CheckboxUI: React.FC<CheckboxUiProps> = ({ id, name, checked, onChange, label }) => {
  return (
    <div className={styles.checkboxContainer}>
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
        className={styles.hiddenCheckbox}
      />
      <label htmlFor={id} className={styles.customCheckbox}>
        <span className={styles.checkmark} />
        <span className={styles.labelText}>{label}</span>
      </label>
    </div>
  );
};
