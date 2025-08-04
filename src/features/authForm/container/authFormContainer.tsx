import { PAGE_TEXTS } from '@/features/authForm/ui/authForm';
import { AuthFormUI } from '@/features/authForm/ui/authFormUI';
import { useState, useEffect } from 'react';
import { RootState, useDispatch, useSelector } from '@/services/store/store';
import { loginUser } from '@/services/thunk/authUser';
import { setStep, updateStepOneData } from '@/services/slices/registrationSlice';

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
  const dispatch = useDispatch();
  const currentStep = useSelector((state: RootState) => state.register.step);

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
    if (currentStep === 1 && email && password) {
      dispatch(updateStepOneData({ email, password }));
      dispatch(setStep(2));
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
    </>
  );
};
