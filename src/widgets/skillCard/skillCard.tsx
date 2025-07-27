import { useState, useCallback, useMemo } from 'react';
import styles from './skillCard.module.css';
import { Dropdown } from '@/shared/ui/dropdown/dropdown';
import { LikeButton } from '@/shared/ui/likeButton/likeButton';
import { MoreButton } from '@/shared/ui/moreButton/moreButton';
import { ShareButton } from '@/shared/ui/shareButton/shareButton';
import { Skill } from '@/pages/skillPage/skillPage';

interface SkillCardProps {
  skill: Skill;
}

const SkillCard: React.FC<SkillCardProps> = ({ skill }) => {
  // Мемоизация preview изображений
  const previewImages = useMemo(
    () => (Array.isArray(skill.imagePreview) ? skill.imagePreview : [skill.imagePreview]),
    [skill.imagePreview],
  );

  // Уникальный ID для лайков
  const skillId = useMemo(() => `${skill.id}-${skill.title}`, [skill.id, skill.title]);
  const imageAltText = skill.title;

  // Мемоизация dropdown items
  const dropdownItems = useMemo(
    () => [
      {
        id: 'copy-link',
        label: 'Копировать ссылку',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        ),
        onClick: () => {
          navigator.clipboard.writeText(window.location.href);
          alert('Ссылка скопирована в буфер обмена');
        },
      },
    ],
    [],
  );

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
    <article className={styles.skillCard} aria-label={`Карточка навыка: ${skill.title}`}>
      <div className={styles.action}>
        <LikeButton itemId={skillId} className={styles.actionButton} ariaLabel="Поставить лайк" />
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
      <div className={styles.skillDetails}>
        <div className={styles.skillContent}>
          <h1 className={styles.title}>{skill.title}</h1>
          <p className={styles.category}>{skill.category}</p>
          <p className={styles.description}>{skill.description}</p>
          <button type="button" className={styles.button}>
            Предложить обмен
          </button>
        </div>
        <div className={styles.skillImage}>
          <div className={styles.imageSlider} role="group" aria-label="Слайдер изображений">
            <button
              type="button"
              className={styles.prevArrow}
              aria-label="Предыдущее изображение"
              onClick={goToPrevImage}
              disabled={!canNavigate}
            >
              <img
                className={styles.imageArrow}
                src="../src/app/assets/static/images/icons/arrow-chevron-left.svg"
                alt=""
                aria-hidden="true"
              />
            </button>
            <img
              className={styles.image}
              src={currentMainImage}
              alt={`${imageAltText} - изображение ${currentImageIndex + 1}`}
            />
            <button
              type="button"
              className={styles.nextArrow}
              aria-label="Следующее изображение"
              onClick={goToNextImage}
              disabled={!canNavigate}
            >
              <img
                className={styles.imageArrow}
                src="../src/app/assets/static/images/icons/arrow-chevron-right.svg"
                alt=""
                aria-hidden="true"
              />
            </button>
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
  );
};

export default SkillCard;
