import { AuthFormContainer } from '../authForm/container/authFormContainer';
import { AuthWizard } from '../authWizard/authWizard';
import styles from './registrationForms.module.css';
import { Button } from '@/shared/ui/button/button';
import { useNavigate } from 'react-router-dom';
import { RegisterStepTwo } from '@/pages/registerStepTwo/registerStepTwo';
import { RegisterStepThree } from '@/pages/registerStepThree/registerStepThree';
import { useEffect } from 'react';
import { useDispatch, useSelector } from '@/services/store/store';
import {
  resetStepOneData,
  resetStepThreeData,
  resetStepTwoData,
  setStep,
} from '@/services/slices/registrationSlice';

export const RegistrationForms = ({ isRegister = true }) => {
  const forms = [
    <AuthFormContainer key="step1" isFirstStage={true} />,
    <RegisterStepTwo key="step2" />,
    <RegisterStepThree key="step3" />,
  ];
  const currentStep = useSelector(state => state.register.step);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onClose = () => {
    switch (currentStep) {
      case 1:
        dispatch(resetStepOneData());
        break;
      case 2:
        dispatch(resetStepTwoData());
        break;
      case 3:
        dispatch(resetStepThreeData());
        break;
      default:
        break;
    }
    dispatch(setStep(1));
    navigate('/');
  };

  useEffect(() => {
    if (currentStep === null) {
      dispatch(setStep(1));
    }
  }, [currentStep, dispatch]); // возможно лучше перенести в App или еще куда-то
  // пока оставил здесь, ибо было сделано по аналогии

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
