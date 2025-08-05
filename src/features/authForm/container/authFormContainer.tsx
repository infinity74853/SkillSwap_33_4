import { PAGE_TEXTS } from '@/features/authForm/ui/authForm';
import { AuthFormUI } from '@/features/authForm/ui/authFormUI';
import { useEffect, useState } from 'react';
import { RootState, useDispatch, useSelector } from '@/services/store/store';
import { stepActions } from '@/services/slices/stepSlice';
import { ProposalPreviewModal } from '@/features/auth/proposalPreviewModal/proposalPreviewModal';
import { SuccessModal } from '@/features/successModal/successModal';
import { TeachableSkill } from '@/widgets/skillCard/skillCard';
import { usersData } from '@/shared/mocks/usersData';
import { loginUser } from '@/services/thunk/authUser';

export const AuthFormContainer = ({ isFirstStage = true }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    passwordIsFirstStage: 'Пароль должен содержать не менее 8 знаков',
    form: '',
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [previewSkill, setPreviewSkill] = useState<TeachableSkill | null>(null);

  const dispatch = useDispatch();

  const currentStep = useSelector((state: RootState) => state.step.currentStep);
  
  const textContent = isFirstStage ? PAGE_TEXTS.registration : PAGE_TEXTS.firstStage;

  const validateEmail = (value: string) => {
    if (!value.trim()) return 'Поле Email обязательно для заполнения';
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) return 'Некорректный формат email';
    return '';
  };

  const validatePassword = (value: string) => {
    if (!value.trim()) return 'Поле Пароль обязательно для заполнения';
    if (value.length < 8) return 'Пароль должен содержать минимум 8 символов';
    return '';
  };

  const validateField = () => {
    const newErrors = {
      email: touched.email ? validateEmail(email) : '',
      password: touched.password ? validatePassword(password) : '',
      passwordIsFirstStage: !validatePassword(password)
        ? 'Надёжный'
        : 'Пароль должен содержать не менее 8 знаков',
      form: errors.form,
    };

    const shouldShowFormError = newErrors.email || newErrors.password;

    setErrors({
      ...newErrors,
      form: shouldShowFormError
        ? 'Email или пароль введён неверно. Пожалуйста проверьте правильность введённых данных'
        : newErrors.form,
    });

    if (!shouldShowFormError) {
      setErrors({
        email: '',
        password: '',
        passwordIsFirstStage: newErrors.passwordIsFirstStage,
        form: '',
      });
    }
  };

  useEffect(() => {
    if (touched.email || touched.password) {
      validateField();
    }
  }, [email, password, touched.email, touched.password]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({
      email: true,
      password: true,
    });

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setErrors({
        email: emailError,
        password: passwordError,
        passwordIsFirstStage: '',
        form: 'Email или пароль введён неверно. Пожалуйста проверьте правильность введённых данных',
      });
      return;
    }
    
    if (!isFirstStage) {
      try {
        await dispatch(loginUser({ email, password })).unwrap();
      } catch {
        setErrors(prev => ({
          ...prev,
          form: 'Пользователь не зарегистрирован или неверные данные',
        }));
      }
      return;
    }
    
    if (isFirstStage) {
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

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleEmailBlur = () => {
    if (!touched.email) setTouched(prev => ({ ...prev, email: true }));
  };

  const handlePasswordBlur = () => {
    if (!touched.password) setTouched(prev => ({ ...prev, password: true }));
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
        isFirstStage={isFirstStage}
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