import { FC, useState } from 'react';
import styles from './registerStepTwo.module.css';
import { TextInput } from '@/shared/ui/textInput/textInput';
import { CustomDatePicker } from '@/widgets/datePicker/datePicker';
import calendarIcon from '@/app/assets/static/images/icons/calendar.svg';
import plusIcon from '@/app/assets/static/images/icons/add.svg';
import { CustomSelect } from '@/shared/ui/customSelect/customSelect';
import { Autocomplete } from '@/shared/ui/autoComplete/autoComplete';
import { MultiSelect } from '@/shared/ui/multiSelect/multiSelect';
import { skillsCategories } from '@/shared/lib/categories';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@/shared/ui/button/button';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { russianCities } from '@/shared/lib/cities';
import userIcon from '@/app/assets/static/images/background/user-info.svg';
import {
  resetStepTwoData,
  TStepTwoData,
  updateStepTwoData,
} from '@/services/slices/registrationSlice';
import { useDispatch } from '@/services/store/store';
import { RegistrationInfoPanel } from '@/shared/ui/registrationInfoPanel/registrationInfoPanel';
import { stepActions } from '@/services/slices/stepSlice';

export const RegisterStepTwo: FC = () => {
  const [isDatePickerOpen, setDatePicker] = useState(false);
  const dispatch = useDispatch();

  const skills = Object.keys(skillsCategories).map(val => ({ value: val, label: val }));
  const verifiedSkills = Object.keys(skillsCategories);
  const verifiedSkillsSubcategories = Object.values(skillsCategories).flat();
  const genders = ['Мужской', 'Женский', 'Не указан'];

  const schema = yup.object({
    name: yup
      .string()
      .required('Укажите имя')
      .matches(/^[а-яёА-ЯЁ\s]+$/, 'Только кириллические символы')
      .min(3, 'Минимум 3 символа')
      .max(20, 'Максимум 20 символов'),
    date: yup
      .string()
      .required('Укажите дату рождения')
      .test('valid-date', 'Введите корректную дату', value => {
        if (!value) return false;
        const [day, month, year] = value.split('.');
        const date = new Date(+year, +month - 1, +day);
        return !isNaN(date.getTime());
      })
      .test('not-future', 'Введите настоящую дату', value => {
        if (!value) return true;
        const [day, month, year] = value.split('.');
        const date = new Date(+year, +month - 1, +day);
        return date <= new Date();
      })
      .test('age-range', 'Вам должно быть более 12 лет', value => {
        if (!value) return true;
        const [day, month, year] = value.split('.');
        const birthDate = new Date(+year, +month - 1, +day);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        return age >= 12 && age <= 100;
      }),
    city: yup
      .string()
      .required('Укажите город')
      .oneOf(russianCities, 'Выбранный город не существует'),
    gender: yup.string().required('Укажите пол').oneOf(genders, 'Выберите пол'),
    categories: yup
      .array()
      .of(yup.string().defined().oneOf(verifiedSkills, 'Неверная категория'))
      .min(1, 'Выберите хотя бы одну категорию')
      .required('Категория обязательна'),
    subcategories: yup
      .array()
      .of(yup.string().defined().oneOf(verifiedSkillsSubcategories, 'Неверная подкатегория'))
      .min(1, 'Выберите хотя бы одну подкатегорию')
      .required('Подкатегория обязательна'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    watch,
    control,
    trigger,
    setError,
    getValues,
  } = useForm({ resolver: yupResolver(schema), mode: 'onBlur' });

  const selectedCategories = watch('categories') || [];
  const filteredSubcategories = selectedCategories
    .flatMap(category => skillsCategories[category as keyof typeof skillsCategories] || [])
    .map(val => ({ value: val, label: val }));

  const onSubmit = (data: TStepTwoData) => {
    dispatch(
      updateStepTwoData({
        ...data,
        birthdate: data.date,
        gender: data.gender as 'Мужской' | 'Женский',
      }),
    );
    dispatch(stepActions.nextStep());
  };

  const handleBack = () => {
    dispatch(resetStepTwoData());
    dispatch(stepActions.prevStep());
  };

  return (
    <div className={styles.registrationContainer}>
      <form className={styles.registrationForm} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.logoContainer}>
          <label htmlFor="avatar" className={styles.avatarLabel}>
            <img className={styles.avatarLabelPlusIcon} src={plusIcon} alt="Добавить фото" />
          </label>
          <input id="avatar" className={styles.avatarInput} type="file" />
        </div>
        <TextInput
          {...register('name')}
          id="name"
          title="Имя"
          placeholder="Введите ваше имя"
          className={styles.elementFull}
          error={errors.name?.message}
          onFocus={() => clearErrors('name')}
          onBlur={() => trigger('name')}
        />
        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <div className={styles.datePickerWrapper}>
              <TextInput
                {...field}
                id="date"
                title="Дата рождения"
                placeholder="дд.мм.гггг"
                icon={calendarIcon}
                onClick={() => setDatePicker(true)}
                className={styles.fixedHeight}
                error={errors.date?.message}
                hideError={isDatePickerOpen}
              />
              {isDatePickerOpen && (
                <CustomDatePicker
                  selected={
                    field.value ? new Date(field.value.split('.').reverse().join('-')) : undefined
                  }
                  onSelect={date => {
                    if (date) {
                      field.onChange(date.toLocaleDateString('ru-RU'));
                      trigger('date');
                    }
                    setDatePicker(false);
                  }}
                  onCancelClick={() => setDatePicker(false)}
                  onChooseClick={() => setDatePicker(false)}
                  onClose={() => setDatePicker(false)}
                  className={styles.datePickerPosition}
                  disabled={{ after: new Date() }}
                />
              )}
            </div>
          )}
        />
        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <CustomSelect
              {...field}
              options={genders.map(g => ({ value: g, label: g }))}
              className={styles.fixedHeight}
              id="gender"
              title="Пол"
              placeholder="Не указан"
              error={errors.gender?.message}
              onFocus={() => clearErrors('gender')}
            />
          )}
        />
        <Controller
          name="city"
          control={control}
          render={({ field }) => (
            <Autocomplete
              {...field}
              className={styles.elementFull}
              id="city"
              title="Город"
              placeholder="Не указан"
              suggestions={russianCities}
              error={errors.city?.message}
              onFocus={() => clearErrors('city')}
            />
          )}
        />
        <Controller
          name="categories"
          control={control}
          defaultValue={[]}
          render={({ field }) => (
            <MultiSelect
              {...field}
              className={styles.elementFull}
              options={skills}
              title="Категория навыка, которому хотите научиться"
              id="skill"
              placeholder="Выберите категорию"
              error={errors.categories?.message}
              onFocus={() => clearErrors('categories')}
            />
          )}
        />
        <Controller
          name="subcategories"
          control={control}
          defaultValue={[]}
          render={({ field }) => (
            <MultiSelect
              {...field}
              className={styles.elementFull}
              options={filteredSubcategories}
              title="Подкатегория навыка, которому хотите научиться"
              id="subSkill"
              placeholder="Выберите подкатегорию"
              error={errors.subcategories?.message}
              onFocus={() => {
                if (!getValues('categories')?.length) {
                  setError('subcategories', {
                    type: 'manual',
                    message: 'Сначала выберите хотя бы одну категорию',
                  });
                } else {
                  clearErrors('subcategories');
                }
              }}
            />
          )}
        />
        <div className={styles.buttonContainer}>
          <Button type="quaternary" onClick={handleBack}>
            Назад
          </Button>
          <Button type="primary" onClick={handleSubmit(onSubmit)}>
            Продолжить
          </Button>
        </div>
      </form>
      <RegistrationInfoPanel
        headerText="Расскажите немного о себе"
        icon={userIcon}
        text="Это поможет другим людям лучше вас узнать, чтобы выбрать для обмена"
      />
    </div>
  );
};
