import { UserCard } from '../userCard/userCard';
import styles from './userInfo.module.css';
import { useSelector } from '@/services/store/store';
import { RootState } from '@/services/store/store';
import { useParams } from 'react-router-dom';

const UserInfo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const users = useSelector((state: RootState) => state.catalog.users);
  const user = users.find(u => u._id === id);

  if (!user) {
    return <div className={styles.userInfo}>Пользователь не найден</div>;
  }

  return (
    <div className={styles.userInfo}>
      <UserCard {...user} showLike={false} showDescription={true} showDetails={false} />
    </div>
  );
};

export default UserInfo;
