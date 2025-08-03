import { PAGE_TEXTS } from '@/features/authForm/ui/authForm';
import { AuthFormUI } from '@/features/authForm/ui/authFormUI';
import { useState, useEffect } from 'react';
import { RootState, useDispatch, useSelector } from '@/services/store/store';
import { stepActions } from '@/services/slices/stepSlice';
import { loginUser } from '@/services/thunk/authUser';
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
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [previewSkill, setPreviewSkill] = useState<TeachableSkill | null>(null);

  const dispatch = useDispatch();
  const currentStep = useSelector((state: RootState) => state.step.currentStep);

  const textContent = !isFirstStage ? PAGE_TEXTS.firstStage : PAGE_TEXTS.registration;

  const validateEmail = (value: string) => {
    if (!value.trim()) return 'Поле Email обязательно для заполнения';
    if (!/\S+@\S+\.\S+/.test(value)) return 'Некорректный формат email';
    return '';
  };

  const validatePassword = (value: string) => {
    if (!value.trim()) return 'Поле Пароль обязательно для заполнения';
    if (value.length < 8) return 'Пароль должен содержать минимум 8 символов';
    return '';
  };

  useEffect(() => {
    const emailError = touched.email ? validateEmail(email) : '';
    const passwordError = touched.password ? validatePassword(password) : '';

    const formError =
      emailError || passwordError
        ? 'Email или пароль введён неверно. Пожалуйста проверьте правильность введённых данных'
        : errors.form;

    if (
      emailError !== errors.email ||
      passwordError !== errors.password ||
      formError !== errors.form
    ) {
      setErrors({
        email: emailError,
        password: passwordError,
        form: formError,
      });
    }
  }, [email, password, touched]);

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
        form: 'Email или пароль введён неверно. Пожалуйста проверьте правильность введённых данных',
      });
      return;
    }

    if (!isFirstStage) {
      try {
        await dispatch(loginUser({ email, password })).unwrap();
      } catch (err) {
        setErrors(prev => ({
          ...prev,
          form: 'Пользователь не зарегистрирован или неверные данные',
        }));
      }
      return;
    }

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
    } else {
      dispatch(stepActions.nextStep());
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (!touched.email) {
      setTouched(prev => ({ ...prev, email: true }));
    }
    setErrors(prev => ({ ...prev, form: '' }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (!touched.password) {
      setTouched(prev => ({ ...prev, password: true }));
    }
    setErrors(prev => ({ ...prev, form: '' }));
  };

  const handleEmailBlur = () => {
    if (!touched.email) {
      setTouched(prev => ({ ...prev, email: true }));
    }
  };

  const handlePasswordBlur = () => {
    if (!touched.password) {
      setTouched(prev => ({ ...prev, password: true }));
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
          onEdit={handleEdit}
          onSuccess={handleSuccess}
        />
      )}

      {isSuccessOpen && <SuccessModal />}
    </>
  );
};
