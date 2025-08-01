import { Skill } from '@/shared/ui/skill/skill.tsx';
import styles from './userCard.module.css';
import { Button } from '@/shared/ui/button/button';
import { useState } from 'react';
import { calculateAge } from '@/shared/lib/helpers/data';
import { User } from '@/entities/user/model/types';
import { useDispatch, useSelector } from '@/services/store/store';
import { selectIsLiked } from '@/services/selectors/likeSelectors';
import { toggleLike } from '@/services/slices/likeSlice';

export const UserCard: React.FC<User> = ({
  image,
  name,
  city,
  canTeach,
  wantsToLearn,
  _id,
  birthdayDate,
}) => {
  const dispatch = useDispatch();
  const [isExchange, setExchange] = useState(false);
  const learnSkill = wantsToLearn.slice(0, 2);
  const moreSkills = wantsToLearn.length - learnSkill.length;

  // Получаем состояние лайка из Redux
  const isLiked = useSelector(state => selectIsLiked(state, _id));

  const handleLikeClick = () => {
    dispatch(toggleLike(_id)); // Отправляем действие в Redux
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
          <p className={styles.userCityAndAge}>{`${city}, ${calculateAge(birthdayDate)}`}</p>
        </div>
      </div>
      <div className={styles.bodyCard}>
        <div className={styles.teach}>
          <p className={styles.pointCard}>Может научить:</p>
          <div className={styles.skills}>
            {canTeach ? <Skill type={canTeach.category}>{canTeach.name}</Skill> : ''}
          </div>
        </div>
        <div className={styles.teach}>
          <p className={styles.pointCard}>Хочет научиться:</p>
          <div className={styles.skills}>
            {learnSkill &&
              learnSkill.map(skill => (
                <Skill type={skill.category} key={skill.customSkillId}>
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
