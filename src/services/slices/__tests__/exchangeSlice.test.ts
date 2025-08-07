import { describe, it, expect } from 'vitest';
import exchangeReducer from '../exchangeSlice';
import {
  addRequest,
  removeRequest,
  clearAllRequests,
  markAsRead,
  markAllAsRead,
} from '../exchangeSlice';

describe('exchangeSlice', () => {
  it('should return the initial state', () => {
    const state = exchangeReducer(undefined, { type: 'unknown' });
    expect(state).toEqual({
      requests: [
        {
          id: 1,
          fromUserName: 'Алексей',
          fromUserId: 'user_001',
          toUserId: 'user_002',
          createdAt: expect.any(String),
          isRead: false,
        },
        {
          id: 2,
          fromUserName: 'Мария',
          fromUserId: 'user_002',
          toUserId: 'user_001',
          createdAt: expect.any(String),
          isRead: false,
        },
      ],
    });
  });

  const getInitialState = () => exchangeReducer(undefined, { type: '@@INIT' });

  describe('addRequest', () => {
    it('should generate id, createdAt and isRead = false', () => {
      const payload = {
        fromUserName: 'Елена',
        fromUserId: 'user_003',
        toUserId: 'user_001',
      };

      const action = addRequest(payload);
      const state = exchangeReducer(getInitialState(), action);

      expect(state.requests).toHaveLength(3);
      const newRequest = state.requests[0];

      expect(newRequest.fromUserName).toBe('Елена');
      expect(newRequest.fromUserId).toBe('user_003');
      expect(newRequest.toUserId).toBe('user_001');
      expect(newRequest.id).toBeTypeOf('string');
      expect(newRequest.id).toMatch(/^req_\d+$/);
      expect(newRequest.createdAt).toBeDefined();
      expect(newRequest.isRead).toBe(false);
    });

    it('should add request to the top of the list', () => {
      const payload = {
        fromUserName: 'Елена',
        fromUserId: 'user_003',
        toUserId: 'user_001',
      };

      const action = addRequest(payload);
      const state = exchangeReducer(getInitialState(), action);

      expect(state.requests[0].fromUserName).toBe('Елена');
      expect(state.requests[1].fromUserName).toBe('Алексей');
    });
  });

  describe('removeRequest', () => {
    it('should remove request by id', () => {
      const action = removeRequest(1);
      const state = exchangeReducer(getInitialState(), action);

      expect(state.requests).toHaveLength(1);
      expect(state.requests[0].id).toBe(2);
    });

    it('should not mutate state if request not found', () => {
      const action = removeRequest(999);
      const state = exchangeReducer(getInitialState(), action);

      expect(state.requests).toHaveLength(2);
    });
  });

  describe('clearAllRequests', () => {
    it('should clear all requests', () => {
      const action = clearAllRequests();
      const state = exchangeReducer(getInitialState(), action);

      expect(state.requests).toHaveLength(0);
      expect(state.requests).toEqual([]);
    });
  });

  describe('markAsRead', () => {
    it('should mark a newly added request as read by string id', () => {
      const stateAfterAdd = exchangeReducer(
        getInitialState(),
        addRequest({
          fromUserName: 'Елена',
          fromUserId: 'user_003',
          toUserId: 'user_001',
        }),
      );

      const newRequest = stateAfterAdd.requests[0];
      expect(typeof newRequest.id).toBe('string');
      expect(newRequest.isRead).toBe(false);

      const stateAfterMark = exchangeReducer(stateAfterAdd, markAsRead(String(newRequest.id)));

      const updatedRequest = stateAfterMark.requests[0];
      expect(updatedRequest.isRead).toBe(true);
    });

    it('should not mutate state if request not found', () => {
      const stateBefore = getInitialState();
      const action = markAsRead('non-existent-id');
      const stateAfter = exchangeReducer(stateBefore, action);

      expect(stateAfter).toEqual(stateBefore);
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all requests as read', () => {
      const action = markAllAsRead();
      const state = exchangeReducer(getInitialState(), action);

      expect(state.requests.every(req => req.isRead)).toBe(true);
    });

    it('should not add or remove requests', () => {
      const action = markAllAsRead();
      const state = exchangeReducer(getInitialState(), action);

      expect(state.requests).toHaveLength(2);
      expect(state.requests.map(r => r.id)).toEqual([1, 2]);
    });
  });
});
