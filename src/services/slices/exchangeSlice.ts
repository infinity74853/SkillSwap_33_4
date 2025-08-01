import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Приблезительный интерфейс запроса
interface ExchangeRequest {
  id: string | number;
  fromUserId: string | number;
  fromUserName: string;
  toUserId?: string | number; // Необязательно поле, пока нет логики для этого
  isRead: boolean; // Просмотрено ли уведомление
  createdAt: string; // Дата создания для сортировки
}

interface ExchangeState {
  requests: ExchangeRequest[];
}

// Фейковые запросы на обмен
const initialState: ExchangeState = {
  requests: [
    {
      id: 1,
      fromUserName: 'Алексей',
      fromUserId: 101,
      createdAt: new Date().toISOString(),
      isRead: false,
    },
    {
      id: 2,
      fromUserName: 'Мария',
      fromUserId: 205,
      createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // Час назад
      isRead: false,
    },
  ],
};

const exchangeSlice = createSlice({
  name: 'exchange',
  initialState,
  reducers: {
    addRequest: {
      reducer(state, action: PayloadAction<ExchangeRequest>) {
        state.requests.unshift(action.payload);
      },
      prepare(payload: Omit<ExchangeRequest, 'id' | 'isRead' | 'createdAt'>) {
        return {
          payload: {
            ...payload,
            id: `req_${Date.now()}`,
            isRead: false,
            createdAt: new Date().toISOString(),
          },
        };
      },
    },
    removeRequest: (state, action) => {
      state.requests = state.requests.filter(req => req.id !== action.payload);
    },
    clearAllRequests: state => {
      state.requests = [];
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const request = state.requests.find(req => req.id === action.payload);
      if (request) {
        request.isRead = true;
      }
    },
    markAllAsRead: state => {
      state.requests.forEach(request => {
        request.isRead = true;
      });
    },
  },
});

export const { addRequest, removeRequest, clearAllRequests, markAsRead, markAllAsRead } =
  exchangeSlice.actions;
export default exchangeSlice.reducer;
