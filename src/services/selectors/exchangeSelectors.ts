import { RootState } from '@/services/store/store';
import { createSelector } from '@reduxjs/toolkit';

export const selectExchageRequests = (state: RootState) => state.exchange.requests;

/* СЕЛЕКТОРЫ ДЛЯ РЕАЛЬНОЙ РАБОТЫ ЗАЯВОК*/

// Селектор, который пригодиться для получения всех запросов, сделанных пользователю
export const selectToUserExchangeRequest = createSelector([selectExchageRequests], requests =>
  requests.filter(req => req.toUserId === 1),
);

// Селектор, который пригодиться для получения всех запросов, сделанных пользователем
export const selectFromUserExchangeRequest = createSelector([selectExchageRequests], requests =>
  requests.filter(req => req.fromUserId === 1),
);
/* ------ */

export const selectNewRequests = createSelector([selectExchageRequests], requests =>
  requests.filter(req => !req.isRead),
);

export const selectViewedRequests = createSelector([selectExchageRequests], requests =>
  requests.filter(req => req.isRead),
);

export const selectHasUnreadRequests = createSelector(
  [selectNewRequests],
  newRequests => newRequests.length > 0,
);
