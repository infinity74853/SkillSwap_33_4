import { useState, useRef, ChangeEvent } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './ProfileDetailsPage.module.css';
import { useDispatch, useSelector } from '@/services/store/store';
import { updateStepTwoData } from '@/services/slices/registrationSlice';
import { userSliceSelectors, userSliceActions } from '@/services/slices/authSlice';
import { Button } from '@/shared/ui/button/button';
import { russianCities } from '@/shared/lib/cities';
import { updateProfileApi } from '@/api/skillSwapApi';
import * as yup from 'yup';

const sidebarItems = [
  { icon: 'request', text: 'Заявки', route: '/profile/requests' },
  { icon: 'message-text', text: 'Мои обмены', route: '/profile/exchanges' },
  { icon: 'like', text: 'Избранное', route: '/profile/favorites' },
  { icon: 'idea', text: 'Мои Навыки', route: '/profile/skills' },
  { icon: 'user', text: 'Личные данные', route: '/profile/details' },
];

// Схема валидации
const profileSchema = yup.object().shape({
  name: yup
    .string()
    .required('Имя обязательно')
    .min(2, 'Имя должно содержать минимум 2 символа')
    .max(30, 'Имя должно содержать максимум 30 символов')
    .matches(/^[а-яА-ЯёЁ\s-]+$/, 'Имя должно содержать только кириллические буквы'),
  birthDate: yup
    .string()
    .required('Дата рождения обязательна')
    .test('valid-date', 'Неверная дата рождения', value => {
      if (!value) return false;
      const date = new Date(value);
      return !isNaN(date.getTime());
    })
    .test('age', 'Вам должно быть больше 12 лет', value => {
      if (!value) return false;
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 12;
    }),
  city: yup.string().required('Город обязателен').oneOf(russianCities, 'Выберите город из списка'),
  about: yup.string().max(500, 'Описание должно содержать максимум 500 символов'),
});

type GenderType = 'Мужской' | 'Женский';

export default function ProfileDetailsPage() {
  const location = useLocation();
  const dateInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();

  const user = useSelector(userSliceSelectors.selectUser);
  const registrationData = useSelector(state => state.register.stepTwoData);

  const [formData, setFormData] = useState({
    email: user?.email || '',
    name: registrationData?.name || user?.name || '',
    birthDate: registrationData?.birthdate || '1995-10-28',
    gender: (registrationData?.gender === 'Мужской' ? 'male' : 'female') as 'male' | 'female',
    city: registrationData?.city || 'Москва',
    about: user?.description || 'Люблю учиться новому, особенно если это можно делать за чаем и в пижаме. Всегда готова пообщаться и обменяться чем‑то интересным!',
  });

  const [avatar, setAvatar] = useState(user?.image || '');
  const [avatarPreview, setAvatarPreview] = useState(user?.image || '');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, birthDate: e.target.value }));
    if (errors.birthDate) {
      setErrors(prev => ({ ...prev, birthDate: '' }));
    }
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      setErrors(prev => ({ ...prev, avatar: 'Только изображения разрешены' }));
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, avatar: 'Максимальный размер файла 2MB' }));
      return;
    }

    const reader = new FileReader();
    reader.onload = event => {
      if (event.target?.result) {
        setAvatarPreview(event.target.result as string);
        setAvatar(event.target.result as string);
        setErrors(prev => ({ ...prev, avatar: '' }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      // Валидация формы
      await profileSchema.validate(formData, { abortEarly: false });
      setErrors({});

      setIsLoading(true);

      const gender: GenderType = formData.gender === 'male' ? 'Мужской' : 'Женский';

      const updatedData = {
        name: formData.name,
        birthdate: formData.birthDate,
        gender,
        city: formData.city,
        description: formData.about,
        ...(avatar && { avatar }),
      };

      // Обновляем в Redux
      dispatch(
        updateStepTwoData({
          name: updatedData.name,
          birthdate: updatedData.birthdate,
          gender: updatedData.gender,
          city: updatedData.city,
        }),
      );

      // Обновляем пользователя через action creator
      if (user) {
        dispatch(
          userSliceActions.setUserData({
            ...user,
            name: updatedData.name,
            description: updatedData.description,
            image: avatarPreview,
          }),
        );
      }

      // Отправляем на бэкенд
      const response = await updateProfileApi(updatedData);

      if (!response.success) {
        throw new Error('Ошибка при обновлении профиля');
      }

      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);

      if (err instanceof yup.ValidationError) {
        const newErrors = err.inner.reduce(
          (acc, curr) => {
            if (curr.path) {
              acc[curr.path] = curr.message;
            }
            return acc;
          },
          {} as Record<string, string>,
        );
        setErrors(newErrors);
      } else {
        setErrors(prev => ({ ...prev, form: 'Ошибка при сохранении данных' }));
        console.error('Profile update error:', err);
      }
    }
  };

  const isDirty =
    formData.name !== (registrationData?.name || user?.name) ||
    formData.birthDate !== registrationData?.birthdate ||
    formData.gender !== (registrationData?.gender === 'Мужской' ? 'male' : 'female') ||
    formData.city !== registrationData?.city ||
    formData.about !== user?.description ||
    avatarPreview !== user?.image;

  return (
    <div className={styles.profileWrapper}>
      <div className={styles.profileContent}>
        <aside className={styles.profileSidebar}>
          <div className={styles.profileSidebarItems}>
            {sidebarItems.map(item => {
              const isActive = location.pathname === item.route;
              return (
                <div
                  key={item.text}
                  className={isActive ? styles.profileSidebarItemActive : styles.profileSidebarItem}
                >
                  <span
                    className={`${styles.profileSidebarIcon} ${styles['sidebarIcon-' + item.icon]}`}
                  />
                  {item.text}
                </div>
              );
            })}
          </div>
        </aside>
        <main className={styles.profileMain}>
          <div className={styles.profileAvatarBlock}>
            <img
              src={avatarPreview || '/default-avatar.png'}
              alt="Аватар"
              className={styles.profileAvatar}
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
            <button
              className={styles.profileEditPhotoBtn}
              onClick={() => fileInputRef.current?.click()}
              type="button"
            >
              <span className={`${styles.profileGalleryEdit}`} />
            </button>
            {errors.avatar && <div className={styles.errorText}>{errors.avatar}</div>}
          </div>
          <div className={styles.profileInputBlock}>
            <label>Почта</label>
            <div className={styles.profileEmailInputWrapper}>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={styles.profileEmailInput}
                disabled
              />
              <span className={`${styles.profileEditIcon} ${styles.iconEdit}`} />
            </div>
          </div>
          <button className={styles.profileChangePasswordBtn} type="button">
            Изменить пароль
          </button>
          <div className={styles.profileForm}>
            <div className={styles.profileFormInputs}>
              <div className={styles.profileInputBlock}>
                <label>Имя</label>
                <div className={styles.profileEmailInputWrapper}>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={styles.profileEmailInput}
                  />
                  <span className={`${styles.profileEditIcon} ${styles.iconEdit}`} />
                </div>
                {errors.name && <div className={styles.errorText}>{errors.name}</div>}
              </div>
              <div className={styles.profileInputRow}>
                <div className={styles.profileInputBlock}>
                  <label>Дата рождения</label>
                  <div
                    className={styles.profileDateInputWrapper}
                    tabIndex={0}
                    role="button"
                    aria-label="Выбрать дату рождения"
                    onClick={() => dateInputRef.current?.showPicker()}
                    style={{ cursor: 'pointer' }}
                  >
                    <input
                      type="date"
                      name="birthDate"
                      ref={dateInputRef}
                      value={formData.birthDate}
                      onChange={handleDateChange}
                      className={styles.profileDateInput}
                    />
                    <span className={`${styles.profileCalendarIcon} ${styles.iconCalendar}`} />
                  </div>
                  {errors.birthDate && <div className={styles.errorText}>{errors.birthDate}</div>}
                </div>
                <div className={styles.profileInputBlock}>
                  <label>Пол</label>
                  <div className={styles.profileGenderInputWrapper}>
                    <div className={styles.profileSelectInputWrapper}>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className={styles.profileInputHalf}
                      >
                        <option value="female">Женский</option>
                        <option value="male">Мужской</option>
                      </select>
                    </div>
                    <span className={`${styles.profileChevronIcon} ${styles.iconChevron}`} />
                  </div>
                </div>
              </div>
              <div className={styles.profileInputBlock}>
                <label>Город</label>
                <div
                  className={styles.profileCityInputWrapper}
                  style={{ width: '100%', maxWidth: '100%' }}
                >
                  <div className={styles.profileSelectInputWrapper} style={{ width: '100%' }}>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      style={{ width: '100%' }}
                    >
                      {russianCities.map(city => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>
                  <span className={`${styles.profileChevronIcon} ${styles.iconChevron}`} />
                </div>
                {errors.city && <div className={styles.errorText}>{errors.city}</div>}
              </div>
              <div className={styles.profileInputBlock}>
                <label>О себе</label>
                <div className={styles.profileAboutInputWrapper}>
                  <textarea
                    name="about"
                    value={formData.about}
                    onChange={handleChange}
                    rows={5}
                    className={styles.profileAboutTextarea}
                  />
                  <span className={`${styles.profileAboutEditIcon} ${styles.iconEdit}`} />
                </div>
                {errors.about && <div className={styles.errorText}>{errors.about}</div>}
              </div>
            </div>
            {errors.form && <div className={styles.errorText}>{errors.form}</div>}
            <div className={styles.profileSaveBtnWrapper}>
              <Button type="primary" onClick={handleSave} disabled={!isDirty || isLoading}>
                {isLoading ? 'Сохранение...' : 'Сохранить'}
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
