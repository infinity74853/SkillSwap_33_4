import { FC } from 'react';
import styles from './registerStepThree.module.css';
import { TextInput } from '@/shared/ui/textInput/textInput';
import { CustomSelect } from '@/shared/ui/customSelect/customSelect';
import { MultiSelect } from '@/shared/ui/multiSelect/multiSelect';
import { skillsCategories } from '@/shared/lib/categories';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@/shared/ui/button/button';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import boardIcon from '@/app/assets/static/images/background/school-board.svg';
import { DragAndDrop } from '@/widgets/dragAndDrop/dragAndDrop';
import { useDispatch } from '@/services/store/store';
import {
  resetStepThreeData,
  setStep,
  updateStepThreeData,
} from '@/services/slices/registrationSlice';
import { RegistrationInfoPanel } from '@/shared/ui/registrationInfoPanel/registrationInfoPanel';

export const RegisterStepThree: FC = () => {
  const skills = Object.keys(skillsCategories).map(val => {
    return { value: val, label: val };
  });
  const verifiedSkills = Object.keys(skillsCategories);
  const verifiedSkillsSubcategories = Object.values(skillsCategories).flat();
  const dispatch = useDispatch();
  const schema = yup.object({
    skillName: yup
      .string()
      .required('Укажите название навыка')
      .matches(/^[а-яёА-ЯЁ\s]+$/, 'Только кириллические символы')
      .min(3, 'Минимум 3 символа')
      .max(50, 'Максимум 50 символов'),
    skill: yup
      .string()
      .required('Укажите категорию навыка')
      .oneOf(verifiedSkills, 'Неверная категория'),
    subcategories: yup
      .array()
      .of(yup.string().defined().oneOf(verifiedSkillsSubcategories, 'Неверная подкатегория'))
      .min(1, 'Выберите хотя бы одну подкатегорию')
      .required('Подкатегория обязательна'),
    description: yup.string().required('Введите описание навыка').max(500, 'Максимум 500 символов'),
    images: yup
      .mixed<File[]>()
      .test('required', 'Добавьте хотя бы одно изображение', (value: File[] | undefined) => {
        return !!value && value.length > 0;
      })
      .test('maxLength', 'Можно загрузить максимум 4 изображения', (value: File[] | undefined) => {
        return !value || value.length <= 4;
      })
      .test('fileFormat', 'Разрешены только .jpg и .png', (value: File[] | undefined) => {
        if (!value) return true;
        return value.every(file => ['image/jpeg', 'image/png'].includes(file.type));
      })
      .test('fileSize', 'Максимальный размер каждого файла — 2MB', (value: File[] | undefined) => {
        if (!value) return true;
        return value.every(file => file.size <= 2 * 1024 * 1024);
      }),
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
  const selectedCategory = watch('skill');
  const filteredSubcategories = selectedCategory
    ? skillsCategories[selectedCategory as keyof typeof skillsCategories]?.map(val => ({
        value: val,
        label: val,
      })) || []
    : [];
  return (
    <div className={styles.registrationContainer}>
      <form
        className={styles.registrationForm}
        onSubmit={handleSubmit(data => {
          console.log(data);
        })}
      >
        <TextInput
          {...register('skillName')}
          id="name"
          title="Название навыка"
          placeholder="Введите название вашего навыка"
          className={styles.fixedHeight}
          error={errors.skillName?.message}
          onFocus={() => clearErrors('skillName')}
        />

        <Controller
          name="skill"
          control={control}
          render={({ field }) => (
            <CustomSelect
              {...field}
              options={skills}
              className={styles.fixedHeight}
              id="gender"
              title="Категория навыка"
              placeholder="Выберите категорию навыка"
              error={errors.skill?.message}
              onFocus={() => clearErrors('skill')}
            />
          )}
        ></Controller>
        <Controller
          name="subcategories"
          control={control}
          render={({ field }) => (
            <MultiSelect
              {...field}
              className={styles.fixedHeight}
              options={filteredSubcategories}
              title="Подкатегория навыка, которому хотите научиться"
              id="skill"
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
                    message: 'Сначала выберите    категорию',
                  });
                } else {
                  clearErrors('subcategories');
                }
              }}
            />
          )}
        />
        <TextInput
          {...register('description')}
          id="description"
          title="Описание"
          placeholder="Коротко опишите, чему можете научить"
          error={errors.description?.message}
          onFocus={() => {
            if (errors.description) clearErrors('description');
          }}
          onBlur={() => trigger('description')}
          type="textarea"
        />
        <Controller
          name="images"
          control={control}
          defaultValue={[]}
          render={({ field, fieldState }) => (
            <DragAndDrop
              label="Выбрать изображения"
              placeholder="Перетащите или выберите изображения навыка"
              multiple
              value={field.value}
              onChange={(files: File[]) => {
                field.onChange(files);
                trigger('images');
              }}
              onBlur={() => {
                field.onBlur();
              }}
              error={fieldState.error?.message}
            />
          )}
        />
        <div className={styles.buttonContainer}>
          <Button
            children="Назад"
            type="quaternary"
            onClick={() => {
              (dispatch(setStep(2)), dispatch(resetStepThreeData()));
            }}
          />
          <Button
            children="Продолжить"
            type="primary"
            onClick={() =>
              handleSubmit(data => {
                dispatch(updateStepThreeData(data));
              })
            }
          />
        </div>
      </form>
      <RegistrationInfoPanel
        icon={boardIcon}
        headerText="Укажите, чем вы готовы заниматься"
        text="Так другие люди смогут увидеть ваши предложения и предложить вам обмен!"
      />
    </div>
  );
};
