import { selectExchageRequests } from '@/services/selectors/exchangeSelectors';
import { removeRequest } from '@/services/slices/exchangeSlice';
import { useDispatch, useSelector } from '@/services/store/store';
import styles from './requestPanel.module.css';

/* ВРЕМЕННОЕ РЕШЕНИЕ */

//Боковая панель с уведомлениями об обменах

const RequestPanel = () => {
  const requests = useSelector(selectExchageRequests);
  const dispatch = useDispatch();

  // TODO: На данный момет нажатие по крестику удаляет запрос из среза, возможно нужно будет сделать что-то другое
  const handleRemove = (id: string | number) => {
    dispatch(removeRequest(id));
  };

  if (requests.length === 0) {
    return null;
  }

  return (
    <div className={styles.sidePanel}>
      {requests.map(request => (
        <div key={request.id} className={styles.requestCard}>
          <div className={styles.cardContent}>
            <div className={styles.requestTextContainer}>
              <div className={styles.icon}></div>
              <span className={styles.requestText}>
                {request.fromUserName} предлагает вам обмен
              </span>
              <button className={styles.closeBtn} onClick={() => handleRemove(request.id)}>
                <div className={styles.closeIcon}></div>
              </button>
            </div>
            <button className={styles.goBtn}>
              {/* Здесь будет логика перехода к обмену
                // Например: navigate(`/exchange/${request.id}`);*/}
              Перейти
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RequestPanel;
