import type { RootState } from '@/services/store/store';
import { RequestStatus } from '@/entities/auth/model/types';
import {
  selectExchageRequests,
  selectToUserExchangeRequest,
  selectFromUserExchangeRequest,
  selectNewRequests,
  selectViewedRequests,
  selectHasUnreadRequests,
} from '../exchangeSelectors';

const mockState: RootState = {
  register: {
    stepOneData: { email: '', password: '' },
    stepTwoData: {
      name: '',
      birthdate: '',
      gender: 'Мужской',
      city: '',
      categories: [],
      subcategories: [],
      avatar: [],
    },
    stepThreeData: {
      skillName: '',
      skill: 'Бизнес и карьера',
      subcategories: [],
      description: '',
      images: [],
    },
    error: undefined,
    loading: false,
  },
  catalog: { users: [], loading: false, error: null, searchQuery: '' },
  exchange: {
    requests: [
      {
        id: '1',
        fromUserId: 'u1',
        fromUserName: 'A',
        toUserId: 'u2',
        isRead: false,
        createdAt: '',
      },
      {
        id: '2',
        fromUserId: 'u2',
        fromUserName: 'B',
        toUserId: 'u1',
        isRead: true,
        createdAt: '',
      },
      {
        id: '3',
        fromUserId: 'u1',
        fromUserName: 'A',
        toUserId: 'u3',
        isRead: false,
        createdAt: '',
      },
    ],
  },
  skills: { skills: [], loading: false, error: undefined },
  step: { currentStep: 0, totalSteps: 0 },
  filters: { mode: 'all', gender: 'any', city: [], skill: [] },
  likes: { likedItems: {}, loading: false, error: null },
  authUser: {
    data: {
      _id: 'u1',
      name: '',
      createdAt: '',
      image: '',
      city: '',
      gender: 'male',
      birthdayDate: '',
      description: '',
      likes: [],
      canTeach: {
        name: '',
        image: [],
        description: '',
        customSkillId: '',
        category: 'Бизнес и карьера',
        subcategory: 'Управление командой',
        subcategoryId: '',
      },
      wantsToLearn: [],
    },
    authStatus: RequestStatus.Idle,
    userCheck: false,
  },
};

describe('exchangeSelectors', () => {
  describe('Обработка отсутствующего authUser или _id', () => {
    test('selectToUserExchangeRequest возвращает [] если authUser.data отсутствует или _id пуст', () => {
      const stateWithoutData = {
        ...mockState,
        authUser: { ...mockState.authUser, data: null },
      };

      const stateWithEmptyId = {
        ...mockState,
        authUser: {
          ...mockState.authUser,
          data: { ...mockState.authUser.data!, _id: '' }, // ! — потому что внутри теста мы уверены, что data существует в mockState
        },
      };

      expect(selectToUserExchangeRequest(stateWithoutData)).toEqual([]);
      expect(selectToUserExchangeRequest(stateWithEmptyId)).toEqual([]);
    });

    test('selectFromUserExchangeRequest возвращает [] если authUser.data отсутствует или _id пуст', () => {
      const stateWithoutData = {
        ...mockState,
        authUser: { ...mockState.authUser, data: null },
      };

      const stateWithEmptyId = {
        ...mockState,
        authUser: {
          ...mockState.authUser,
          data: { ...mockState.authUser.data!, _id: '' },
        },
      };

      expect(selectFromUserExchangeRequest(stateWithoutData)).toEqual([]);
      expect(selectFromUserExchangeRequest(stateWithEmptyId)).toEqual([]);
    });
  });

  describe('Базовые селекторы', () => {
    test('selectExchageRequests возвращает все заявки', () => {
      expect(selectExchageRequests(mockState)).toHaveLength(3);
    });

    test('selectToUserExchangeRequest возвращает заявки, где пользователь — получатель', () => {
      expect(selectToUserExchangeRequest(mockState)).toEqual([
        {
          id: '2',
          fromUserId: 'u2',
          fromUserName: 'B',
          toUserId: 'u1',
          isRead: true,
          createdAt: '',
        },
      ]);
    });

    test('selectFromUserExchangeRequest возвращает заявки, где пользователь — отправитель', () => {
      expect(selectFromUserExchangeRequest(mockState)).toEqual([
        {
          id: '1',
          fromUserId: 'u1',
          fromUserName: 'A',
          toUserId: 'u2',
          isRead: false,
          createdAt: '',
        },
        {
          id: '3',
          fromUserId: 'u1',
          fromUserName: 'A',
          toUserId: 'u3',
          isRead: false,
          createdAt: '',
        },
      ]);
    });
  });

  describe('Фильтрация по статусу прочтения', () => {
    test('selectNewRequests возвращает только непрочитанные заявки', () => {
      expect(selectNewRequests(mockState)).toEqual([
        {
          id: '1',
          fromUserId: 'u1',
          fromUserName: 'A',
          toUserId: 'u2',
          isRead: false,
          createdAt: '',
        },
        {
          id: '3',
          fromUserId: 'u1',
          fromUserName: 'A',
          toUserId: 'u3',
          isRead: false,
          createdAt: '',
        },
      ]);
    });

    test('selectViewedRequests возвращает только прочитанные заявки', () => {
      expect(selectViewedRequests(mockState)).toEqual([
        {
          id: '2',
          fromUserId: 'u2',
          fromUserName: 'B',
          toUserId: 'u1',
          isRead: true,
          createdAt: '',
        },
      ]);
    });

    test('selectHasUnreadRequests возвращает true, если есть непрочитанные заявки', () => {
      expect(selectHasUnreadRequests(mockState)).toBe(true);
    });

    test('selectHasUnreadRequests возвращает false, если все заявки прочитаны', () => {
      const state = {
        ...mockState,
        exchange: {
          requests: [
            {
              id: '1',
              fromUserId: 'u1',
              fromUserName: 'A',
              toUserId: 'u2',
              isRead: true,
              createdAt: '',
            },
          ],
        },
      };
      expect(selectHasUnreadRequests(state)).toBe(false);
    });
  });
});
