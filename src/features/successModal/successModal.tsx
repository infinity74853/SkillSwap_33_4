import { Modal } from '@/features/modal/modal';
import done from '@/app/assets/static/images/icons/successDone.svg';
import { useNavigate } from 'react-router-dom';

export const SuccessModal = () => {
  const navigate = useNavigate();
  const onClose = () => {
    navigate('/');
  };
  return (
    <Modal
      title={'Ваше предложение создано'}
      type="confirmation"
      image={done}
      onClose={onClose}
      description="Теперь вы можете предложить обмен"
    />
  );
};
