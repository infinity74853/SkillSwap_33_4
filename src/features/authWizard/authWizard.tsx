import { Children, ReactElement } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './authWizard.module.css';
import { StepIndicator } from '@/shared/ui/stepIndicator/stepIndicator';
import { useSelector } from '@/services/store/store';

interface AuthWizardProps {
  children: ReactElement[];
}

export const AuthWizard = ({ children }: AuthWizardProps) => {
  const currentStep = useSelector(state => state.register.step);
  const totalSteps = 3; // имхо количество общих шагов можно захардкодить
  // оно меняется за 1 клик и почти ни на что не влияет, слайс избыточен
  if (currentStep === null) {
    return <div>Загружаем страницу регистрации</div>;
  }
  const steps = Children.toArray(children);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 345 : -345,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 345 : -345,
      opacity: 0,
    }),
  };

  return (
    <div className={styles.container}>
      <div className={styles.progressInfo}>
        <h2 className={styles.contentStep}>
          Шаг {currentStep} из {totalSteps}
        </h2>
        <StepIndicator currentStep={currentStep - 1} totalSteps={totalSteps} />
      </div>

      <div className={styles.formsContainer}>
        <AnimatePresence mode="wait" initial={false} custom={currentStep}>
          <motion.div
            key={currentStep}
            custom={currentStep}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 345, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className={styles.formWrapper}
          >
            {steps[currentStep - 1]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
