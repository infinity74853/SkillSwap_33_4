import { describe, it, expect } from 'vitest';
import authSlice, { initialState } from '../authSlice';
import { RequestStatus } from '@/entities/auth/model/types';
import { User } from '@/entities/user/model/types';
import { userSliceActions } from '../authSlice';

const mockUser: User = {
  _id: '1',
  name: 'John',
  image: 'image-url',
  city: '',
  gender: 'male',
  birthdayDate: '1990-01-01',
  description: '',
  likes: [],
  canTeach: {
    name: 'JavaScript',
    description: 'Могу научить основам JS',
    image: ['https://example.com/js-icon.png'], // ✅ без пробелов
    category: 'Творчество и искусство',
    subcategory: 'Рисование и иллюстрация',
    subcategoryId: 'drawing',
    customSkillId: 'js-skill-1',
  },
  wantsToLearn: [
    {
      name: 'Английский разговорный',
      category: 'Иностранные языки',
      subcategory: 'Английский',
      subcategoryId: 'english',
      customSkillId: 'english-skill-1',
    },
  ],
  email: 'john@test.com',
  createdAt: new Date().toISOString(),
};

const mockAuthResponse = {
  user: mockUser,
  accessToken: 'token123',
  refreshToken: 'refresh123',
};

describe('authSlice', () => {
  it('should return the initial state', () => {
    const state = authSlice.reducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });

  describe('extraReducers', () => {
    it('should handle fetchUser.pending', () => {
      const action = {
        type: 'authUser/fetchUser/pending',
        meta: { requestId: '1', arg: undefined },
      };
      const state = authSlice.reducer(initialState, action);
      expect(state.authStatus).toBe(RequestStatus.Loading);
      expect(state.userCheck).toBe(false);
    });

    it('should handle fetchUser.fulfilled', () => {
      const action = {
        type: 'authUser/fetchUser/fulfilled',
        payload: {
          user: mockUser,
          tokens: {
            accessToken: 'test-access',
            refreshToken: 'test-refresh',
          },
        },
        meta: { requestId: '1', arg: undefined },
      };

      const state = authSlice.reducer(initialState, action);

      expect(state.data).toBeDefined();
      if (state.data) {
        expect(state.data._id).toBe('1');
        expect(state.data.name).toBe('John');
        expect(typeof state.data.image).toBe('string');

        // Проверяем canTeach
        expect(state.data.canTeach.name).toBe('JavaScript');
        expect(state.data.canTeach.description).toBe('Могу научить основам JS');
        expect(Array.isArray(state.data.canTeach.image)).toBe(true);
        expect(state.data.canTeach.image).toContain('https://example.com/js-icon.png');
        expect(state.data.canTeach.category).toBe('Творчество и искусство');
        expect(state.data.canTeach.subcategory).toBe('Рисование и иллюстрация');
        expect(state.data.canTeach.customSkillId).toBe('js-skill-1');

        // Проверяем wantsToLearn
        const want = state.data.wantsToLearn[0];
        expect(want.name).toBe('Английский разговорный');
        expect(want.category).toBe('Иностранные языки');
        expect(want.subcategory).toBe('Английский');
        expect(want.customSkillId).toBe('english-skill-1');
        expect(want).not.toHaveProperty('description');
        expect(want).not.toHaveProperty('image');
      }

      expect(state.authStatus).toBe(RequestStatus.Success);
      expect(state.userCheck).toBe(true);
    });

    it('should handle fetchUser.rejected', () => {
      const action = {
        type: 'authUser/fetchUser/rejected',
        error: { message: 'Error' },
        meta: { requestId: '1', arg: undefined },
      };
      const state = authSlice.reducer(initialState, action);
      expect(state.authStatus).toBe(RequestStatus.Failed);
      expect(state.userCheck).toBe(true);
      expect(state.data).toBeNull();
    });

    it('should handle loginUser.fulfilled', () => {
      const action = {
        type: 'authUser/loginUser/fulfilled',
        payload: mockAuthResponse,
        meta: { requestId: '1', arg: {} },
      };
      const state = authSlice.reducer(initialState, action);

      expect(state.data).toBeDefined();
      if (state.data) {
        expect(state.data._id).toBe('1');
        expect(state.data.name).toBe('John');

        expect(state.data.canTeach.name).toBe('JavaScript');
        expect(state.data.canTeach.description).toBe('Могу научить основам JS');
        expect(Array.isArray(state.data.canTeach.image)).toBe(true);
        expect(state.data.canTeach.image).toContain('https://example.com/js-icon.png');
        expect(state.data.canTeach.customSkillId).toBe('js-skill-1');
      }

      expect(state.authStatus).toBe(RequestStatus.Success);
      expect(state.userCheck).toBe(true);
    });

    it('should handle logoutUserApi.fulfilled', () => {
      const stateWithUser = {
        ...initialState,
        data: mockUser,
        authStatus: RequestStatus.Success,
        userCheck: true,
      };
      const action = {
        type: 'authUser/logoutUserApi/fulfilled',
        payload: undefined,
        meta: { requestId: '1', arg: undefined },
      };
      const state = authSlice.reducer(stateWithUser, action);
      expect(state.data).toBeNull();
      expect(state.authStatus).toBe(RequestStatus.Success);
      expect(state.userCheck).toBe(true);
    });
  });

  describe('reducers', () => {
    it('should handle setUserData', () => {
      const stateWithUser = {
        ...initialState,
        data: { ...mockUser, description: 'Old description', city: 'London' },
      };

      const action = userSliceActions.setUserData({
        description: 'Updated description',
        city: 'Moscow',
        name: 'John Updated',
      });

      const state = authSlice.reducer(stateWithUser, action);

      expect(state.data).toBeDefined();
      if (state.data) {
        expect(state.data.description).toBe('Updated description');
        expect(state.data.city).toBe('Moscow');
        expect(state.data.name).toBe('John Updated');
      }
    });

    it('should not modify state if data is null in setUserData', () => {
      const action = userSliceActions.setUserData({
        name: 'New Name',
        city: 'Tokyo',
      });

      const state = authSlice.reducer(initialState, action);

      expect(state.data).toBeNull();
    });

    it('should handle clearUserData', () => {
      const stateWithUser = {
        ...initialState,
        data: mockUser,
        authStatus: RequestStatus.Success,
        userCheck: true,
      };

      const action = userSliceActions.clearUserData();
      const state = authSlice.reducer(stateWithUser, action);

      expect(state.data).toBeNull();
      expect(state.authStatus).toBe(RequestStatus.Idle);
      expect(state.userCheck).toBe(false);
    });
  });
});
