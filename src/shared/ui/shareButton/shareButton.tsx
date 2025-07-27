import styles from './shareButton.module.css';

interface ShareButtonProps {
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  onClick,
  className = '',
  ariaLabel = 'Поделиться',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${styles.shareButton} ${className}`}
      aria-label={ariaLabel}
    />
  );
};
