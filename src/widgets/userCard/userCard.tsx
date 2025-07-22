import { Skill } from '@/shared/ui/skill/skill.tsx';
import styles from './userCard.module.css';
import { Button } from '@/shared/ui/button/button';
import { useState } from 'react';
import { TUserInfoProps } from '@/types/types';
import { calculateAge } from '@/shared/lib/helpers/data';

export const UserCard: React.FC<TUserInfoProps> = ({
  image,
  name,
  city,
  canTeach,
  wantsToLearn,
  id,
  birthdate,
}) => {
  const myLikes = ['001', '002', '003']; // Заглушка лайков зарегистрированного пользователя

  const like = myLikes.some(like => like === id);
  const [isLiked, setIsliked] = useState(like);
  const [isExchange, setExchange] = useState(true);
  const learnSkill = wantsToLearn.slice(0, 2);
  const moreSkills = wantsToLearn.length - learnSkill.length;

  const handleLikeClick = () => {
    setIsliked(!isLiked);
    //Куда то будет отправляться лайк
  };

  const openProfile = () => {
    // Заглушка на открытие профиля
    setExchange(!isExchange);
  };

  return (
    <div className={styles.cardContainer}>
      <div className={styles.headerCard}>
        <img src={image} alt={`Avatar ${name}`} className={styles.image} />
        <div className={styles.cardLike}>
          <button
            onClick={handleLikeClick}
            className={`${styles.likeButton} ${isLiked ? styles.likeButtonActive : ''}`}
          ></button>
        </div>
        <div className={styles.userInfo}>
          <p className={styles.userName}>{name}</p>
          <p className={styles.userCityAndAge}>{`${city}, ${calculateAge(birthdate)}`}</p>
        </div>
      </div>
      <div className={styles.bodyCard}>
        <div className={styles.teach}>
          <p className={styles.pointCard}>Может научить:</p>
          <div className={styles.skills}>
            {canTeach ? <Skill type={canTeach.type}>{canTeach.name}</Skill> : ''}
          </div>
        </div>
        <div className={styles.teach}>
          <p className={styles.pointCard}>Хочет научиться:</p>
          <div className={styles.skills}>
            {learnSkill &&
              learnSkill.map(skill => (
                <Skill type={skill.type} key={skill.name}>
                  {skill.name}
                </Skill>
              ))}
            {wantsToLearn.length > 2 && (
              <Skill type={'Остальные категории'}>{`+ ${moreSkills}`}</Skill>
            )}
          </div>
        </div>
      </div>
      {isExchange ? (
        <Button onClick={openProfile} type="secondary">
          <span className={styles.contentClock}>
            <div className={styles.clock}></div>
            <span>Обмен предложен</span>
          </span>
        </Button>
      ) : (
        <Button onClick={openProfile} type="primary">
          Подробнее
        </Button>
      )}
    </div>
  );
};
