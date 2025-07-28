import styles from './SearchInput.module.css';

type SearchInputProps = {
  placeholder?: string;
};

export const SearchInput = ({ placeholder }: SearchInputProps) => {
  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchIcon}></div>
      <input type="text" placeholder={placeholder} className={styles.input} />
    </div>
  );
};
