import { useState, useCallback, useMemo } from 'react';
import { Dropdown } from '@/shared/ui/dropdown/dropdown';
import { LikeButton } from '@/shared/ui/likeButton/likeButton';
import { MoreButton } from '@/shared/ui/moreButton/moreButton';
import { ShareButton } from '@/shared/ui/shareButton/shareButton';
import { CopyLinkDropdownItem } from '@/features/copyLink';
import arrowLeft from '@/app/assets/static/images/icons/arrow-chevron-left.svg';
import arrowRight from '@/app/assets/static/images/icons/arrow-chevron-right.svg';
import styles from './skillCard.module.css';
import { SuccessModal } from '@/features/successModal/successModal';
import { CustomSkill } from '@/entities/skill/model/types';

// === Интерфейс для canTeach из usersData ===
/*  export interface TeachableSkill {
  customSkillId: string;
  name: string;
  category: string;
  description: string;
  image: string[];
} */
// ?? Что это? уже есть тип CustomSkill

export interface SkillCardProps {
  skill: CustomSkill;
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
  className,
}) => {
  // === Извлечение изображений ===
  const mainImage = useMemo(() => skill.image[0] || '/placeholder.jpg', [skill.image]);
  const previewImages = useMemo(() => skill.image.slice(1), [skill.image]);

  // === Все изображения для слайдера ===
  const allImages = useMemo(() => [mainImage, ...previewImages], [mainImage, previewImages]);
  const totalImages = allImages.length;
  const canNavigate = totalImages > 1;

  // === Состояния ===
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  // === Обработчики ===
  const goToPrevImage = useCallback(() => {
    setCurrentImageIndex(prev => (prev === 0 ? totalImages - 1 : prev - 1));
  }, [totalImages]);

  const goToNextImage = useCallback(() => {
    setCurrentImageIndex(prev => (prev === totalImages - 1 ? 0 : prev + 1));
  }, [totalImages]);

  const setImageIndex = useCallback(
    (index: number) => {
      if (index >= 0 && index < totalImages) {
        setCurrentImageIndex(index);
      }
    },
    [totalImages],
  );

  const handleExchangeProposal = useCallback(() => {
    setIsSuccessOpen(true);
  }, []);

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

  return (
    <>
      <article
        className={`${styles.skillCard} ${className || ''}`}
        aria-label={`Навык: ${skill.name}`}
      >
        {/* === Панель действий === */}
        {!hideActions && (
          <div className={styles.action}>
            <LikeButton
              itemId={skill.customSkillId}
              className={styles.actionButton}
              ariaLabel="Понравилось"
            />
            <ShareButton
              title={skill.name}
              text={`Посмотри этот навык: ${skill.name} — ${skill.description}`}
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

        {/* === Основной контент === */}
        <div className={styles.skillDetails}>
          <div className={styles.skillContent}>
            <h1 className={styles.title}>{skill.name}</h1>
            <p className={styles.category}>{skill.category}</p>
            <p className={styles.description}>{skill.description}</p>

            {renderButton ? (
              renderButton()
            ) : (
              <button
                type="button"
                className={styles.button}
                onClick={handleExchangeProposal}
                aria-label="Предложить обмен"
              >
                Предложить обмен
              </button>
            )}
          </div>

          {/* === Галерея изображений === */}
          <div className={styles.skillImage}>
            <div className={styles.imageSlider} role="group" aria-label="Галерея изображений">
              {canNavigate && !hideSliderControls && (
                <button
                  type="button"
                  className={styles.prevArrow}
                  aria-label="Предыдущее изображение"
                  onClick={goToPrevImage}
                >
                  <img src={arrowLeft} alt="" aria-hidden="true" className={styles.imageArrow} />
                </button>
              )}

              <img
                className={styles.image}
                src={allImages[currentImageIndex]}
                alt={`${skill.name} (${currentImageIndex + 1}/${totalImages})`}
              />

              {canNavigate && !hideSliderControls && (
                <button
                  type="button"
                  className={styles.nextArrow}
                  aria-label="Следующее изображение"
                  onClick={goToNextImage}
                >
                  <img src={arrowRight} alt="" aria-hidden="true" className={styles.imageArrow} />
                </button>
              )}
            </div>

            {/* === Превью === */}
            <div className={styles.preview}>
              {previewImages.slice(0, 2).map((img, index) => (
                <img
                  key={index}
                  className={styles.imagePreview}
                  src={img}
                  alt={`Превью ${index + 1}: ${skill.name}`}
                  onClick={() => setImageIndex(index + 1)}
                />
              ))}
              <div className={styles.imagePreviewOverlay}>
                <img
                  className={styles.imagePreview}
                  src={previewImages[2] || previewImages[0]}
                  alt={`Превью с оверлеем: ${skill.name}`}
                  onClick={() => {
                    const targetImage = previewImages[2] || previewImages[0];
                    const realIndex = allImages.findIndex(img => img === targetImage);
                    setImageIndex(realIndex);
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

      {/* Модальное окно успешного создания предложения */}
      {isSuccessOpen && <SuccessModal />}
    </>
  );
};

export default SkillCard;
