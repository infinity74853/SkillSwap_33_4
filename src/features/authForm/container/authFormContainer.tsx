import { PAGE_TEXTS } from '@/features/authForm/ui/authForm';
import { AuthFormUI } from '@/features/authForm/ui/authFormUI';
import { useState } from 'react';
import { useDispatch } from '@/app/providers/store/store';
import { stepActions } from '@/app/providers/slices/stepSlice';

export const AuthFormContainer = ({ isFirstStage = true }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    form: '',
  });
  const dispatch = useDispatch();

  const textContent = !isFirstStage ? PAGE_TEXTS.firstStage : PAGE_TEXTS.registration;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // Логика отправки формы
      dispatch(stepActions.nextStep());
      console.log('Форма отправлена', { email, password });
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

  return (
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
    />
  );
};
