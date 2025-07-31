import { PAGE_TEXTS } from '@/features/authForm/ui/authForm';
import { AuthFormUI } from '@/features/authForm/ui/authFormUI';
import { useState } from 'react';
import { RootState, useDispatch, useSelector } from '@/services/store/store';
import { stepActions } from '@/services/slices/stepSlice';
import { Skill } from '@/pages/skillPage/skillPage';
import { ProposalPreviewModal } from '@/features/auth/proposalPreviewModal/proposalPreviewModal';
import { SuccessModal } from '@/features/successModal/successModal';

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
  const [previewSkill, setPreviewSkill] = useState<Skill | null>(null);

  const dispatch = useDispatch();

  const currentStep = useSelector((state: RootState) => state.step.currentStep);

  const textContent = !isFirstStage ? PAGE_TEXTS.firstStage : PAGE_TEXTS.registration;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      if (currentStep === 2) {
        const skill: Skill = {
          id: '1',
          title: 'Игра на барабанах',
          category: 'Творчество и искусство / Музыка и звук',
          description:
            'Привет! Я играю на барабанах уже больше 10 лет — от репетиций в гараже до выступлений на сцене с живыми группами. Научу основам техники (и как не отбить себе пальцы), играть любимые ритмы и разбирать песни, импровизировать и звучать уверенно даже без паритуры',
          image:
            '../src/app/assets/static/images/authUserProfileImages/706f87d20b14825dacb3f1b32ca9fb7be905f467.jpg',
          imagePreview: [
            'https://i1.poltava.to/uploads/2021/09/2021-09-25/image1.jpg',
            'https://b0bcebf4-d767-420b-9f5a-cccfc5015c46.selstorage.ru/iblock/472/03hqhsxyo79gldivild8evlkezaf1vzm.jpg',
            'https://st4.depositphotos.com/22740078/25330/i/450/depositphotos_253309794-stock-photo-playing-the-drum-cut-out.jpg',
            'https://st.depositphotos.com/1034582/3737/i/450/depositphotos_37377787-stock-photo man-playing-the-drums.jpg',
          ],
        };
        setPreviewSkill(skill);
        setIsPreviewOpen(true);
      } else {
        // Логика отправки формы
        dispatch(stepActions.nextStep());
      }

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
      />

      {/* Модальное окно предпросмотра */}
      {isPreviewOpen && previewSkill && (
        <ProposalPreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          skill={previewSkill}
          onEdit={handleEdit}
          onSuccess={handleSuccess}
        />
      )}

      {/* Модальное окно успешного создания предложения */}
      {isSuccessOpen && <SuccessModal />}
    </>
  );
};
