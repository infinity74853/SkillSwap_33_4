import { FC, useEffect, useRef, useState } from 'react';
import styles from './multiSelect.module.css';
type Option = { value: string; label: string };

type MultiSelectProps = {
  options: Option[];
  value: string[];
  onChange: (newValues: string[]) => void;
  title: string;
  id: string;
  placeholder?: string;
  error?: string;
  className?: string;
  onFocus?: () => void;
  onBlur?: () => void;
};

export const MultiSelect: FC<MultiSelectProps> = ({
  options,
  value = [],
  onChange,
  title,
  id,
  placeholder = 'Выберите элементы',
  error,
  className = '',
  onBlur,
  onFocus,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const handleSelect = (optionValue: string) => {
    const newValues = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];

    onChange(newValues);
  };

  const getDisplayText = () => {
    if (value.length === 0) return placeholder;
    const selectedLabels = value
      .map(val => options.find(opt => opt.value === val)?.label)
      .filter(Boolean);
    return selectedLabels.length === 1 ? selectedLabels[0] : `Выбрано: ${selectedLabels.length}`;
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
      setIsOpen(false);
      setFocusedIndex(null);
      onBlur?.();
    }
  };
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // навигация клавишами
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
        setFocusedIndex(0);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex(prev => {
        if (prev === null) return 0;
        return Math.min(prev + 1, options.length - 1);
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex(prev => {
        if (prev === null) return options.length - 1;
        return Math.max(prev - 1, 0);
      });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (focusedIndex !== null) {
        handleSelect(options[focusedIndex].value);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setFocusedIndex(null);
    }
  };

  return (
    <div className={`${styles.container} ${className}`}>
      <label htmlFor={id} className={styles.label}>
        {title}
      </label>
      <div
        id={id}
        className={`${styles.wrapper} ${isOpen ? styles.wrapperOpen : ''}`}
        ref={containerRef}
      >
        <div
          className={`${styles.select} ${isOpen ? styles.selectOpen : ''} ${value.length === 0 ? styles.selectHasPlaceholder : ''}`}
          onClick={e => {
            setIsOpen(prev => {
              if (options.length > 0) {
                return !prev;
              }
              return false;
            });
            setFocusedIndex(0);
          }}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="combobox"
          aria-expanded={isOpen}
          aria-multiselectable={true}
          onFocus={onFocus}
        >
          {getDisplayText()}
        </div>

        {isOpen && (
          <ul className={styles.ul} ref={listRef} role="listbox">
            {options.map((option, index) => {
              const isChosen = value.includes(option.value);
              const isSelected = focusedIndex === index;

              return (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={isChosen}
                  className={`${styles.li} ${isChosen ? styles.chosen : ''} ${isSelected ? styles.selected : ''}`}
                  onClick={() => handleSelect(option.value)}
                  onMouseEnter={() => setFocusedIndex(index)}
                  onMouseLeave={() => setFocusedIndex(null)}
                >
                  {option.label}
                </li>
              );
            })}
          </ul>
        )}
      </div>
      {error && !isOpen && <span className={styles.error}>{error}</span>}
    </div>
  );
};
