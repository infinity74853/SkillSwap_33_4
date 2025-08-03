import { useSteps } from '@/shared/hooks/useSteps';
import { AuthFormContainer } from '../authForm/container/authFormContainer';
import { AuthWizard } from '../authWizard/authWizard';
import styles from './registrationForms.module.css';
import { Button } from '@/shared/ui/button/button';
import { useNavigate } from 'react-router-dom';

export const RegistrationForms = ({ isRegister = true }) => {
  const forms = [
    <AuthFormContainer key="step1" isFirstStage={true} />,
    <AuthFormContainer key="step2" isFirstStage={true} />, // Мок данные, заменить на другие формы
    <AuthFormContainer key="step3" isFirstStage={true} />, // Мок данные, заменить на другие формы
  ];

  const navigate = useNavigate();

  useSteps(forms.length);

  const onClose = () => {
    navigate('/');
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.logo} onClick={onClose}></div>
        <div className={styles.buttonContainer}>
          <Button type="tertiary" onClick={onClose}>
            Закрыть <div className={styles.close}></div>
          </Button>
        </div>
      </div>
      {isRegister ? (
        <AuthWizard>{forms}</AuthWizard>
      ) : (
        <div className={styles.container}>
          <h2 className={styles.content}>Вход</h2>
          <AuthFormContainer isFirstStage={false} />
        </div>
      )}
    </div>
  );
};
