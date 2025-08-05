import { PAGE_TEXTS } from '@/features/authForm/ui/authForm';
import { AuthFormUI } from '@/features/authForm/ui/authFormUI';
import { useState } from 'react';
import { RootState, useDispatch, useSelector } from '@/services/store/store';
import { stepActions } from '@/services/slices/stepSlice';
import { ProposalPreviewModal } from '@/features/auth/proposalPreviewModal/proposalPreviewModal';
import { SuccessModal } from '@/features/successModal/successModal';
import { TeachableSkill } from '@/widgets/skillCard/skillCard';
import { usersData } from '@/shared/mocks/usersData';

export const AuthFormContainer = ({ isFirstStage = true }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    form: '',
  });

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [previewSkill, setPreviewSkill] = useState<TeachableSkill | null>(null);

  const dispatch = useDispatch();

  const currentStep = useSelector((state: RootState) => state.step.currentStep);

  const textContent = !isFirstStage ? PAGE_TEXTS.firstStage : PAGE_TEXTS.registration;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      if (currentStep === 2) {
        const firstUser = usersData[0];
        const { canTeach } = firstUser;

        const skill: TeachableSkill = {
          customSkillId: canTeach.customSkillId,
          name: canTeach.name,
          category: `${canTeach.category} / ${canTeach.subcategory}`,
          description: canTeach.description,
          image: canTeach.image || ['/placeholder.jpg'],
        };
        setPreviewSkill(skill);
        setIsPreviewOpen(true);
        localStorage.setItem('registrationUserId', firstUser._id);
      } else {
        dispatch(stepActions.nextStep());
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    const newErrors = { email: '', password: '', form: '' };
    let isValid = true;

    if (!email.trim()) {
      newErrors.email = 'Поле Email обязательно для заполнения';
      newErrors.form =
        'Email или пароль введён неверно. Пожалуйста проверьте правильность введённых данных';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Некорректный формат email';
      newErrors.form =
        'Email или пароль введён неверно. Пожалуйста проверьте правильность введённых данных';
      isValid = false;
    }

    if (!password.trim()) {
      newErrors.password = 'Поле Пароль обязательно для заполнения';
      newErrors.form =
        'Email или пароль введён неверно. Пожалуйста проверьте правильность введённых данных';
      isValid = false;
    } else if (password.length < 8) {
      newErrors.password = 'Пароль должен содержать минимум 8 символов';
      newErrors.form =
        'Email или пароль введён неверно. Пожалуйста проверьте правильность введённых данных';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: '' }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (errors.password) {
      setErrors(prev => ({ ...prev, password: '' }));
    }
  };

  const handleEmailBlur = () => {
    if (!email.trim()) {
      setErrors(prev => ({ ...prev, email: 'Поле Email обязательно для заполнения' }));
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors(prev => ({ ...prev, email: 'Некорректный формат email' }));
    } else {
      setErrors(prev => ({ ...prev, email: '' }));
    }
  };

  const handlePasswordBlur = () => {
    if (!password.trim()) {
      setErrors(prev => ({ ...prev, password: 'Поле Пароль обязательно для заполнения' }));
    } else if (password.length < 8) {
      setErrors(prev => ({ ...prev, password: 'Пароль должен содержать минимум 8 символов' }));
    } else {
      setErrors(prev => ({ ...prev, password: '' }));
    }
  };

  const handleEdit = () => {
    setIsPreviewOpen(false);
    dispatch(stepActions.goToStep(2));
  };

  const handleSuccess = () => {
    setIsPreviewOpen(false);
    setIsSuccessOpen(true);
  };

  return (
    <>
      <AuthFormUI
        isFirstStage={!isFirstStage}
        textContent={textContent}
        showPassword={showPassword}
        email={email}
        password={password}
        errors={errors}
        handleSubmit={handleSubmit}
        togglePasswordVisibility={togglePasswordVisibility}
        handleEmailChange={handleEmailChange}
        handlePasswordChange={handlePasswordChange}
        handleEmailBlur={handleEmailBlur}
        handlePasswordBlur={handlePasswordBlur}
      />

      {isPreviewOpen && previewSkill && (
        <ProposalPreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          skill={previewSkill}
          userId={localStorage.getItem('registrationUserId') || ''}
          onEdit={handleEdit}
          onSuccess={handleSuccess}
        />
      )}

      {isSuccessOpen && <SuccessModal onClose={() => setIsSuccessOpen(false)} />}
    </>
  );
};
