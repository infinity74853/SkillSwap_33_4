import { selectExchageRequests } from '@/services/selectors/exchangeSelectors';
import { removeRequest } from '@/services/slices/exchangeSlice';
import { useDispatch, useSelector } from '@/services/store/store';

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
    <div className="exchange-requests-container">
      {requests.map(request => (
        <div key={request.id} className="exchange-request">
          <div className="request-content">
            <span className="request-text">{request.fromUserName} предлагает вам обмен</span>
          </div>
          <div className="request-actions">
            <button
              className="accept-btn"
              onClick={() => console.log('Переход к обмену', request.fromUserId)}
            >
              Перейти
            </button>
            <button className="decline-btn" onClick={() => handleRemove(request.id)}>
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RequestPanel;
