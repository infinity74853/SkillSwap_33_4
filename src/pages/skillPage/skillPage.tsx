import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import SkillCard from '@/widgets/skillCard/skillCard';
import SameOffers from '@/widgets/sameOffers/sameOffers';
import UserInfo from '@/widgets/userInfo/userInfo';
import { usersData } from '@/shared/mocks/usersData';
import styles from './skillPage.module.css';

const SkillPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const currentUser = useMemo(() => {
    return usersData.find(user => user._id === id);
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!id) {
    return <div className={styles.error}>Неверный ID</div>;
  }

  if (!currentUser) {
    return <div className={styles.error}>Пользователь не найден</div>;
  }

  if (!currentUser.canTeach) {
    return <div className={styles.error}>Нет доступного навыка</div>;
  }

  return (
    <div className={styles.skillPage}>
      <div className={styles.userOffer}>
        <UserInfo user={currentUser} />
        <SkillCard skill={currentUser.canTeach} />
      </div>
      {/* Передаём данные в SameOffers */}
      <SameOffers currentUser={currentUser} users={usersData} />
    </div>
  );
};

export default SkillPage;
