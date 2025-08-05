import { FC, useState } from 'react';
import styles from './registerStepTwo.module.css';
import plusIcon from '@/app/assets/static/images/icons/add.svg';
import { TextInput } from '@/shared/ui/textInput/textInput';
import { CustomDatePicker } from '@/widgets/datePicker/datePicker';
import calendarIcon from '@/app/assets/static/images/icons/calendar.svg';
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
import { resetStepTwoData, setStep, updateStepTwoData } from '@/services/slices/registrationSlice';
import { useDispatch } from '@/services/store/store';
import { RegistrationInfoPanel } from '@/shared/ui/registrationInfoPanel/registrationInfoPanel';

export const RegisterStepTwo: FC = () => {
  const [isDatePickerOpen, setDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const skills = Object.keys(skillsCategories).map(val => {
    return { value: val, label: val };
  });
  const dispatch = useDispatch();
  const verifiedSkills = Object.keys(skillsCategories);
  const verifiedSkillsSubcategories = Object.values(skillsCategories).flat();
  const genders = ['Мужской', 'Женский'];
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
      .test('valid-date', 'Введите корректную дату', function (value) {
        if (!value) return false;
        const [day, month, year] = value.split('.');
        const date = new Date(`${year}-${month}-${day}`);
        return !isNaN(date.getTime());
      })
      .test('not-future', 'Введите настоящую дату', function (value) {
        if (!value) return true;
        const [day, month, year] = value.split('.');
        const date = new Date(`${year}-${month}-${day}`);
        return date <= new Date();
      })
      .test('age-range', 'Вам должно быть более 12 лет', function (value) {
        if (!value) return true;
        const [day, month, year] = value.split('.');
        const birthDate = new Date(`${year}-${month}-${day}`);
        const today = new Date();

        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
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
  } = useForm({ resolver: yupResolver(schema), mode: 'onBlur' });
  const genderValue = watch('gender');
  const selectedCategories = watch('categories') || [];
  const filteredSubcategories = selectedCategories
    .flatMap(category => skillsCategories[category as keyof typeof skillsCategories] || [])
    .map(val => ({ value: val, label: val }));
  return (
    <div className={styles.registrationContainer}>
      <form
        className={styles.registrationForm}
        onSubmit={handleSubmit(data => {
          console.log(data);
        })}
      >
        <div className={styles.logoContainer}>
          <label htmlFor="avatar" className={styles.avatarLabel}>
            <img className={styles.avatarLabelPlusIcon} src={plusIcon} />
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
          onFocus={() => {
            if (errors.name) clearErrors('name');
          }}
          onBlur={() => trigger('name')}
        />
        <Controller
          name="date"
          control={control}
          render={({ field }) => {
            const value = field.value ?? '';

            return (
              <div className={styles.datePickerWrapper}>
                <TextInput
                  {...field}
                  type="text"
                  id="date"
                  title="Дата рождения"
                  placeholder="дд.мм.гггг"
                  icon={calendarIcon}
                  onClick={() => setDatePicker(true)}
                  value={value}
                  className={styles.fixedHeight}
                  error={errors.date?.message}
                  hideError={isDatePickerOpen}
                />

                {isDatePickerOpen && (
                  <CustomDatePicker
                    selected={selectedDate}
                    onSelect={(date?: Date) => {
                      setSelectedDate(date);
                    }}
                    onCancelClick={() => {
                      setDatePicker(false);
                      setSelectedDate(undefined);
                      field.onChange('');
                      clearErrors('date');
                    }}
                    onChooseClick={() => {
                      setDatePicker(false);
                      if (selectedDate) {
                        const formatted = selectedDate.toLocaleDateString('ru-RU');
                        field.onChange(formatted);
                        trigger('date');
                      }
                    }}
                    onClose={() => {
                      setDatePicker(false);
                      trigger('date');
                    }}
                    className={styles.datePickerPosition}
                    disabled={{ after: new Date() }}
                  />
                )}
              </div>
            );
          }}
        />
        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <CustomSelect
              {...field}
              options={[
                { value: 'Не указан', label: 'Не указан' },
                { value: 'Мужской', label: 'Мужской' },
                { value: 'Женский', label: 'Женский' },
              ]}
              className={styles.fixedHeight}
              id="gender"
              title="Пол"
              placeholder="Не указан"
              value={genderValue}
              error={errors.gender?.message}
              onFocus={() => clearErrors('gender')}
            />
          )}
        ></Controller>
        <Controller
          name="city"
          control={control}
          render={({ field }) => (
            <Autocomplete
              {...field}
              className={styles.elementFull}
              value={field.value}
              onChange={value => {
                field.onChange(value);
                trigger('city');
              }}
              id="city"
              title="Город"
              placeholder="Не указан"
              suggestions={russianCities}
              error={errors.city?.message || '  '}
              onFocus={() => {
                clearErrors('city');
              }}
            />
          )}
        />
        <Controller
          name="categories"
          control={control}
          render={({ field }) => (
            <MultiSelect
              {...field}
              className={styles.elementFull}
              options={skills}
              title="Категория навыка, которому хотите научиться"
              id="skill"
              placeholder="Выберите категорию"
              value={field.value}
              onChange={value => {
                field.onChange(value);
                trigger('categories');
              }}
              error={errors.categories?.message}
              onFocus={() => clearErrors('categories')}
            />
          )}
        />
        <Controller
          name="subcategories"
          control={control}
          render={({ field }) => (
            <MultiSelect
              {...field}
              className={styles.elementFull}
              options={filteredSubcategories}
              title="Подкатегория навыка, которому хотите научиться"
              id="subSkill"
              placeholder="Выберите подкатегорию"
              value={field.value}
              onChange={value => {
                field.onChange(value);
                trigger('subcategories');
              }}
              error={errors.subcategories?.message}
              onFocus={() => {
                if (filteredSubcategories.length === 0) {
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
          <Button
            children="Назад"
            type="quaternary"
            onClick={() => {
              dispatch(resetStepTwoData());
              dispatch(setStep(1));
            }}
          />
          <Button
            children="Продолжить"
            type="primary"
            onClick={() =>
              handleSubmit(data => {
                dispatch(
                  updateStepTwoData({
                    ...data,
                    gender: data.gender as 'Мужской' | 'Женский',
                  }),
                );
                dispatch(setStep(3));
              })()
            }
          />
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
