import { FC, memo } from 'react';
import styles from './modalUi.module.css';
import { TModalUIProps } from './type';
import { ModalOverlayUI } from '../modal-overlay/modal-overlay';
import { Button } from '../button/button';

export const ModalUI: FC<TModalUIProps> = memo(
  ({ type = 'info', title, description, image, onClose, children, ...props }) => (
    <>
      <ModalOverlayUI onClick={onClose} />

      <div className={`${styles.modal} ${props.className || ''}`}>
        {/* Показываем изображение только для типа confirmation */}
        {type === 'confirmation' && image && (
          <img src={image} alt="Status" className={styles.img} />
        )}

        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          {description && <p className={styles.description}>{description}</p>}
        </div>

        {/* Дочерний контент только для типа info */}
        {type === 'info' && <div className={styles.content}>{children}</div>}

        {/* Кнопка только для типа confirmation */}
        {type === 'confirmation' && (
          <div className={styles.buttonContainer}>
            <Button onClick={onClose} type="primary">
              Готово
            </Button>
          </div>
        )}
      </div>
    </>
  ),
);
