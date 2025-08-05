import { FC, useEffect } from 'react';
import styles from './registerStepThree.module.css';
import { TextInput } from '@/shared/ui/textInput/textInput';
import { CustomSelect } from '@/shared/ui/customSelect/customSelect';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@/shared/ui/button/button';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import boardIcon from '@/app/assets/static/images/background/school-board.svg';
import { DragAndDrop } from '@/widgets/dragAndDrop/dragAndDrop';
import { useDispatch, useSelector } from '@/services/store/store';
import {
  resetStepThreeData,
  setStep,
  updateStepThreeData,
} from '@/services/slices/registrationSlice';
import { RegistrationInfoPanel } from '@/shared/ui/registrationInfoPanel/registrationInfoPanel';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  getCategoriesSelector,
  getSubcategoriesByCategory,
  getSubcategoryIdByName,
} from '@/services/slices/skillsSlice';
import { SkillSubcategory } from '@/entities/skill/model/types';

export const RegisterStepThree: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const rawSkills = useSelector(getCategoriesSelector);
  const skills = rawSkills.map(category => ({
    label: category,
    value: category,
  }));
  const defaultValues = useSelector(state => state.register.stepThreeData);
  const dispatch = useDispatch();
  const schema = yup.object({
    skillName: yup
      .string()
      .required('Укажите название навыка')
      .matches(/^[а-яёА-ЯЁ\s]+$/, 'Только кириллические символы')
      .min(3, 'Минимум 3 символа')
      .max(50, 'Максимум 50 символов'),
    skillCategory: yup.string().required('Укажите категорию навыка').oneOf(rawSkills),
    skillSubCategory: yup.string().required('Подкатегория обязательна'),
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
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onBlur',
    defaultValues: { ...defaultValues, images: undefined },
  });

  const selectedCategory = watch('skillCategory') || '';
  const subcategoryOptions = useSelector(state =>
    getSubcategoriesByCategory(state, selectedCategory),
  ).map((category: string) => ({
    label: category,
    value: category,
  }));
  const subcategoryId = useSelector(state =>
    getSubcategoryIdByName(state, watch('skillSubCategory')),
  );
  const user = useSelector(state => state.register);
  useEffect(() => {
    if (subcategoryOptions.length > 0) {
      setValue('skillSubCategory', subcategoryOptions[0].value);
      clearErrors('skillSubCategory');
    } else {
      setValue('skillSubCategory', '');
    }
  }, [subcategoryOptions, clearErrors, setValue]);

  return (
    <div className={styles.registrationContainer}>
      <form
        className={styles.registrationForm}
        onSubmit={async e => {
          e.preventDefault();

          await handleSubmit(async data => {
            dispatch(resetStepThreeData());
            const files: File[] = data.images ?? [];
            const base64Images = await Promise.all(
              files.map(
                file =>
                  new Promise<string>((res, rej) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => res(reader.result as string);
                    reader.onerror = err => rej(err);
                  }),
              ),
            );

            dispatch(
              updateStepThreeData({
                skillName: data.skillName,
                skillCategory: data.skillCategory,
                skillSubCategory: data.skillSubCategory as SkillSubcategory<
                  typeof data.skillCategory
                >,
                description: data.description,
                pics: base64Images,
                customSkillId: String(Math.random()),
                skillSubCategoryId: subcategoryId,
              }),
            );
            dispatch(setStep(null));
            console.log(user);
            navigate('/register/preview', { state: { background: location } });
          })();
        }}
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
          name="skillCategory"
          control={control}
          render={({ field }) => (
            <CustomSelect
              {...field}
              options={skills}
              className={styles.fixedHeight}
              id="gender"
              title="Категория навыка"
              placeholder="Выберите категорию навыка"
              error={errors.skillCategory?.message}
              onFocus={() => clearErrors('skillCategory')}
            />
          )}
        ></Controller>
        <Controller
          name="skillSubCategory"
          control={control}
          render={({ field }) => (
            <CustomSelect
              {...field}
              className={styles.fixedHeight}
              options={subcategoryOptions}
              title="Подкатегория навыка, которому хотите научиться"
              id="skill"
              placeholder="Выберите подкатегорию"
              value={field.value}
              onChange={value => {
                field.onChange(value);
                trigger('skillSubCategory');
              }}
              error={errors.skillSubCategory?.message}
              onFocus={() => {
                if (subcategoryOptions.length === 0) {
                  setError('skillSubCategory', {
                    type: 'manual',
                    message: 'Сначала выберите категорию',
                  });
                } else {
                  clearErrors('skillSubCategory');
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
              dispatch(setStep(2));
              dispatch(resetStepThreeData());
            }}
            htmlType="button"
          />
          <Button children="Продолжить" type="primary" />
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