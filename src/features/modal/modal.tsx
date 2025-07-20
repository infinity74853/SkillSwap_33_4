import { FC, memo, useEffect } from 'react';
import ReactDOM from 'react-dom';

import { TModalProps } from './type';
import { ModalUI } from '@/shared/ui/modal/modalUi';

const modalRoot = document.getElementById('modals');

export const Modal: FC<TModalProps> = memo(props => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      e.key === 'Escape' && props.onClose();
    };

    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [props.onClose]);

  return ReactDOM.createPortal(<ModalUI {...props} />, modalRoot as HTMLDivElement);
});
