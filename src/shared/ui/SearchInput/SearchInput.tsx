import styles from './SearchInput.module.css';
import { ChangeEvent, useState, useEffect } from 'react';
import { useDebounce } from '@/shared/hooks/useDebounce';

type SearchInputProps = {
  placeholder?: string;
  onSearch: (query: string) => void;
  value?: string;
};

export const SearchInput = ({ placeholder, onSearch, value: parentValue }: SearchInputProps) => {
  const [value, setValue] = useState(parentValue || '');
  const debouncedValue = useDebounce(value, 300);

  useEffect(() => {
    setValue(parentValue || '');
  }, [parentValue]);

  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchIcon}></div>
      <input
        type="text"
        placeholder={placeholder}
        className={styles.input}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
};
