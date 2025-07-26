import styles from './skillCard.module.css';
import type { Skill } from '../skillPage/skillPage';

interface SkillCardProps {
  skill: Skill;
}

const SkillCard: React.FC<SkillCardProps> = ({ skill }) => {
  return (
    <div className={styles.skillCard}>
      <div className={styles.action}>
        <button
          className={`${styles.likeButton} ${styles.actionButton}`}
          aria-label="Like"
        ></button>
        <button
          className={`${styles.shareButton} ${styles.actionButton}`}
          aria-label="Share"
        ></button>
        <button
          className={`${styles.moreButton} ${styles.actionButton}`}
          aria-label="More"
        ></button>
      </div>
      <div className={styles.skillDetails}>
        <div className={styles.skillContent}>
          <h1 className={styles.title}>{skill.title}</h1>
          <caption className={styles.category}>{skill.category}</caption>
          <p className={styles.description}>{skill.description}</p>
          <button className={styles.button}>Предложить обмен</button>
        </div>
        <div className={styles.skillImage}>
          <img className={styles.image} src={skill.image} alt={skill.title} />
          <div className={styles.preview}>
            <img className={styles.imagePreview} src={skill.imagePreview} alt={skill.title} />
            <img className={styles.imagePreview} src={skill.imagePreview} alt={skill.title} />
            <img className={styles.imagePreview} src={skill.imagePreview} alt={skill.title} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillCard;
