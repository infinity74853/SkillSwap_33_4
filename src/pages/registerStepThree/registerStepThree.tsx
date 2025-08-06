import { FC, useState } from 'react';
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
import { resetStepThreeData, updateStepThreeData } from '@/services/slices/registrationSlice';
import { RegistrationInfoPanel } from '@/shared/ui/registrationInfoPanel/registrationInfoPanel';
import { stepActions } from '@/services/slices/stepSlice';
import { ProposalPreviewModal } from '@/features/auth/proposalPreviewModal/proposalPreviewModal';
import { SuccessModal } from '@/features/successModal/successModal';
import { TeachableSkill } from '@/widgets/skillCard/skillCard';
import { usersData } from '@/shared/mocks/usersData';

export const RegisterStepThree: FC = () => {
  const dispatch = useDispatch();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [previewSkill, setPreviewSkill] = useState<TeachableSkill | null>(null);

  const skills = Object.keys(skillsCategories).map(val => ({ value: val, label: val }));
  const verifiedSkills = Object.keys(skillsCategories);
  const verifiedSkillsSubcategories = Object.values(skillsCategories).flat();

  const schema = yup.object({
    skillName: yup
      .string()
      .required('Укажите название навыка')
      .matches(/^[а-яёА-ЯЁa-zA-Z0-9\s.,!?-]+$/, 'Некорректные символы')
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
      .test('required', 'Добавьте хотя бы одно изображение', value => !!value && value.length > 0)
      .test(
        'maxLength',
        'Можно загрузить максимум 4 изображения',
        value => !value || value.length <= 4,
      )
      .test(
        'fileFormat',
        'Разрешены только .jpg и .png',
        value => !value || value.every(file => ['image/jpeg', 'image/png'].includes(file.type)),
      )
      .test(
        'fileSize',
        'Максимальный размер каждого файла — 2MB',
        value => !value || value.every(file => file.size <= 2 * 1024 * 1024),
      ),
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

  const selectedCategory = watch('skill');
  const filteredSubcategories = selectedCategory
    ? skillsCategories[selectedCategory as keyof typeof skillsCategories]?.map(val => ({
        value: val,
        label: val,
      })) || []
    : [];

  const onSubmit = (data: any) => {
    dispatch(updateStepThreeData(data));
    const firstUser = usersData[0];
    localStorage.setItem('registrationUserId', firstUser._id);

    const skillForPreview: TeachableSkill = {
      customSkillId: `skill_${Date.now()}`,
      name: data.skillName,
      category: `${data.skill} / ${data.subcategories.join(', ')}`,
      description: data.description,
      image: data.images.map((file: File) => URL.createObjectURL(file)),
    };
    setPreviewSkill(skillForPreview);
    setIsPreviewOpen(true);
  };

  const handleBack = () => {
    dispatch(resetStepThreeData());
    dispatch(stepActions.prevStep());
  };

  const handleEdit = () => {
    setIsPreviewOpen(false);
  };

  const handleSuccess = () => {
    setIsPreviewOpen(false);
    setIsSuccessOpen(true);
  };

  return (
    <>
      <div className={styles.registrationContainer}>
        <form className={styles.registrationForm} onSubmit={handleSubmit(onSubmit)}>
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
                id="skill-category"
                title="Категория навыка"
                placeholder="Выберите категорию навыка"
                error={errors.skill?.message}
                onFocus={() => clearErrors('skill')}
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
                className={styles.fixedHeight}
                options={filteredSubcategories}
                title="Подкатегория навыка"
                id="subcategories"
                placeholder="Выберите подкатегорию"
                error={errors.subcategories?.message}
                onFocus={() => {
                  if (!getValues('skill')) {
                    setError('subcategories', {
                      type: 'manual',
                      message: 'Сначала выберите категорию',
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
            onFocus={() => clearErrors('description')}
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
                onBlur={field.onBlur}
                error={fieldState.error?.message}
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
          icon={boardIcon}
          headerText="Укажите, чем вы готовы заниматься"
          text="Так другие люди смогут увидеть ваши предложения и предложить вам обмен!"
        />
      </div>

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
