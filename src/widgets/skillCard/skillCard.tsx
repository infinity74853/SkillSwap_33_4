import { useState, useCallback, useMemo } from 'react';
import styles from './skillCard.module.css';
import { Dropdown } from '@/shared/ui/dropdown/dropdown';
import { LikeButton } from '@/shared/ui/likeButton/likeButton';
import { MoreButton } from '@/shared/ui/moreButton/moreButton';
import { ShareButton } from '@/shared/ui/shareButton/shareButton';
import { Skill } from '@/pages/skillPage/skillPage';
import { ModalUI } from '@/shared/ui/modal/modalUi';
import { CopyLinkDropdownItem } from '@/features/copyLink';

interface SkillCardProps {
  skill: Skill;
  // Пропсы для управления отображением
  hideActions?: boolean;
  hideSliderControls?: boolean;
  renderButton?: () => React.ReactNode;
  className?: string;
}

const SkillCard: React.FC<SkillCardProps> = ({
  skill,
  hideActions = false,
  hideSliderControls = false,
  renderButton,
  ...props
}) => {
  // Мемоизация preview изображений
  const previewImages = useMemo(
    () => (Array.isArray(skill.imagePreview) ? skill.imagePreview : [skill.imagePreview]),
    [skill.imagePreview],
  );

  // Уникальный ID для лайков
  const skillId = useMemo(() => skill.id, [skill.id]);
  const imageAltText = skill.title;

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Мемоизация dropdown items
  const dropdownItems = useMemo(
    () => [
      CopyLinkDropdownItem({
        url: window.location.href,
        onSuccess: () => alert('Ссылка скопирована в буфер обмена'),
        onError: () => alert('Не удалось скопировать ссылку'),
      }),
    ],
    [],
  );

  // Обработчик кнопки "Предложить обмен"
  const handleExchangeProposal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  // Состояние галереи
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Мемоизация всех изображений
  const allImages = useMemo(() => [skill.image, ...previewImages], [skill.image, previewImages]);

  // Текущее основное изображение
  const currentMainImage = useMemo(
    () => allImages[currentImageIndex] || skill.image,
    [allImages, currentImageIndex, skill.image],
  );

  // Оптимизированные функции навигации
  const goToPrevImage = useCallback(() => {
    setCurrentImageIndex(prev => (prev === 0 ? Math.max(0, allImages.length - 1) : prev - 1));
  }, [allImages.length]);

  const goToNextImage = useCallback(() => {
    setCurrentImageIndex(prev => (prev === allImages.length - 1 ? 0 : prev + 1));
  }, [allImages.length]);

  // Функция для установки конкретного изображения
  const setImageIndex = useCallback(
    (index: number) => {
      if (index >= 0 && index < allImages.length) {
        setCurrentImageIndex(index);
      }
    },
    [allImages.length],
  );

  // Проверка возможности навигации
  const canNavigate = allImages.length > 1;

  return (
    <>
      <article
        className={`${styles.skillCard} ${props.className || ''}`}
        aria-label={`Карточка навыка: ${skill.title}`}
      >
        {/* Условное отображение панели действий */}
        {!hideActions && (
          <div className={styles.action}>
            <LikeButton
              itemId={skillId}
              className={styles.actionButton}
              ariaLabel="Поставить лайк"
            />
            <ShareButton
              title={skill.title}
              text={`Посмотри этот навык: ${skill.title} в категории ${skill.category}`}
              url={window.location.href}
              className={styles.actionButton}
              aria-label="Поделиться"
            />
            <Dropdown
              trigger={<MoreButton className={styles.actionButton} ariaLabel="Еще" />}
              items={dropdownItems}
              position="bottom-right"
            />
          </div>
        )}
        <div className={styles.skillDetails}>
          <div className={styles.skillContent}>
            <h1 className={styles.title}>{skill.title}</h1>
            <p className={styles.category}>{skill.category}</p>
            <p className={styles.description}>{skill.description}</p>
            {/* Кастомная или стандартная кнопка */}
            {renderButton ? (
              renderButton()
            ) : (
              <button type="button" className={styles.button} onClick={handleExchangeProposal}>
                Предложить обмен
              </button>
            )}
          </div>
          <div className={styles.skillImage}>
            <div className={styles.imageSlider} role="group" aria-label="Слайдер изображений">
              {/* Условное отображение стрелок */}
              {canNavigate && !hideSliderControls && (
                <button
                  type="button"
                  className={styles.prevArrow}
                  aria-label="Предыдущее изображение"
                  onClick={goToPrevImage}
                  // disabled={!canNavigate}
                >
                  <img
                    className={styles.imageArrow}
                    src="../src/app/assets/static/images/icons/arrow-chevron-left.svg"
                    alt=""
                    aria-hidden="true"
                  />
                </button>
              )}
              <img
                className={styles.image}
                src={currentMainImage}
                alt={`${imageAltText} - изображение ${currentImageIndex + 1}`}
              />
              {canNavigate && !hideSliderControls && (
                <button
                  type="button"
                  className={styles.nextArrow}
                  aria-label="Следующее изображение"
                  onClick={goToNextImage}
                  // disabled={!canNavigate}
                >
                  <img
                    className={styles.imageArrow}
                    src="../src/app/assets/static/images/icons/arrow-chevron-right.svg"
                    alt=""
                    aria-hidden="true"
                  />
                </button>
              )}
            </div>
            <div className={styles.preview}>
              {previewImages.slice(0, 2).map((previewImg, index) => (
                <img
                  key={index}
                  className={styles.imagePreview}
                  src={previewImg}
                  alt={`Превью ${index + 1}: ${imageAltText}`}
                  onClick={() => {
                    const imageIndex = allImages.findIndex(img => img === previewImg);
                    setImageIndex(imageIndex);
                  }}
                />
              ))}
              <div className={styles.imagePreviewOverlay}>
                <img
                  className={styles.imagePreview}
                  src={previewImages[2] || previewImages[0]}
                  alt={`Превью с оверлеем: ${imageAltText}`}
                  onClick={() => {
                    const targetImage = previewImages[2] || previewImages[0];
                    const imageIndex = allImages.findIndex(img => img === targetImage);
                    setImageIndex(imageIndex);
                  }}
                />
                <span className={styles.overlayText} aria-label="Еще изображения">
                  +{Math.max(0, previewImages.length - 3)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </article>

      {isModalOpen && (
        <ModalUI
          type="confirmation"
          title="Ваше предложение создано"
          description="Теперь вы можете предложить обмен"
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default SkillCard;
