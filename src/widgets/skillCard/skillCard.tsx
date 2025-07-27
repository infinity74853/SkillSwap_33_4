import styles from './skillCard.module.css';
import { Skill } from '@/pages/skillPage/skillPage';
import { LikeButton } from '@/shared/ui/likeButton/likeButton';

interface SkillCardProps {
  skill: Skill;
}

const SkillCard: React.FC<SkillCardProps> = ({ skill }) => {
  const imageAltText = skill.title;
  const imagePreviewSrc = skill.imagePreview;

  return (
    <article className={styles.skillCard} aria-label={`Карточка навыка: ${skill.title}`}>
      <div className={styles.action}>
        <LikeButton
          itemId={skill.title}
          className={`${styles.actionButton}`}
          ariaLabel="Поставить лайк"
        />
        <button
          type="button"
          className={`${styles.shareButton} ${styles.actionButton}`}
          aria-label="Share"
        />
        <button
          type="button"
          className={`${styles.moreButton} ${styles.actionButton}`}
          aria-label="More"
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
            <button type="button" className={styles.prevArrow} aria-label="Предыдущее изображение">
              <img
                className={styles.imageArrow}
                src="../src/app/assets/static/images/icons/arrow-chevron-left.svg"
                alt=""
                aria-hidden="true"
              />
            </button>
            <img className={styles.image} src={skill.image} alt={imageAltText} />
            <button type="button" className={styles.nextArrow} aria-label="Следующее изображение">
              <img
                className={styles.imageArrow}
                src="../src/app/assets/static/images/icons/arrow-chevron-right.svg"
                alt=""
                aria-hidden="true"
              />
            </button>
          </div>
          <div className={styles.preview}>
            <img
              className={styles.imagePreview}
              src={imagePreviewSrc}
              alt={`Превью: ${imageAltText}`}
            />
            <img
              className={styles.imagePreview}
              src={imagePreviewSrc}
              alt={`Превью: ${imageAltText}`}
            />
            <div className={styles.imagePreviewOverlay}>
              <img
                className={styles.imagePreview}
                src={imagePreviewSrc}
                alt={`Превью: ${imageAltText}`}
              />
              <span className={styles.overlayText} aria-label="Еще изображения">
                +3
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default SkillCard;
