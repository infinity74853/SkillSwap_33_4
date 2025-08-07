import { useSelector } from '@/services/store/store';
import { selectFromUserExchangeRequest } from '@/services/selectors/exchangeSelectors';
import { UserCard } from '@/widgets/userCard/userCard';
import { usersData } from '@/shared/mocks/usersData';
import { Button } from '@/shared/ui/button/button';
import { useNavigate } from 'react-router-dom';
import styles from './ProfileExchanges.module.css';
import { Key } from 'react';

export function ProfileExchanges() {
  const requests = useSelector(selectFromUserExchangeRequest);
  const navigate = useNavigate();

  if (requests.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <p className={styles.emptyText}>К сожалению, на данный момент, предложенных обменов нет</p>
        <Button type="primary" onClick={() => navigate('/')}>
          На главную
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {requests.map((request: { toUserId: string; id: Key | null | undefined }) => {
        const user = usersData.find(u => u._id === request.toUserId);
        if (!user) return null;

        return <UserCard key={request.id} {...user} showDetails={true} />;
      })}
    </div>
  );
}
