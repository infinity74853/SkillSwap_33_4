import { FC, memo } from 'react';
import styles from './modalUi.module.css';
import { TModalUIProps } from './type';
import { ModalOverlayUI } from '../modal-overlay/modal-overlay';
import { Button } from '../button/button';

const ModalUIComponent: FC<TModalUIProps> = ({
  type = 'info',
  title,
  description,
  image,
  onClose,
  children,
  className,
  primaryButtonText = 'Готово',
  primaryButtonAction,
  secondaryButtonText,
  secondaryButtonAction,
}) => {
  // Определяем действие для основной кнопки
  const handlePrimary = primaryButtonAction || onClose;

  return (
    <>
      <ModalOverlayUI onClick={onClose} />

      {/* Модальное окно */}
      <div className={`${styles.modal} ${className || ''}`}>
        {/* Показываем изображение только для типа confirmation */}
        {type === 'confirmation' && image && (
          <img src={image} alt="Status" className={styles.img} />
        )}

        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          {description && <p className={styles.description}>{description}</p>}
        </div>

        {/* Дочерний контент только для типа info */}
        {type === 'info' && children && <div className={styles.content}>{children}</div>}

        {/* Кнопки только для типа confirmation */}
        {type === 'confirmation' && (
          <div className={styles.buttonContainer}>
            {secondaryButtonText && secondaryButtonAction && (
              <Button type="secondary" onClick={secondaryButtonAction}>
                {secondaryButtonText}
              </Button>
            )}
            <Button type="primary" onClick={handlePrimary}>
              {primaryButtonText}
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export const ModalUI = memo(ModalUIComponent);

ModalUI.displayName = 'ModalUI';
