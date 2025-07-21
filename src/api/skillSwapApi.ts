import { Skill } from '@/entities/skill/model/types';
import { User } from '@/entities/user/model/types';

const URL = import.meta.env.VITE_SKILLSWAP_API_URL;

const checkResponse = <T>(res: Response): Promise<T> =>
  res.ok ? res.json() : res.json().then(err => Promise.reject(err));

const assertSuccess = <T>(response: { success: boolean; data: T }, errorText: string) => {
  if (!response.success) throw new Error(errorText);
  return response.data;
};

type ServerResponse<T> = {
  success: boolean;
} & T;

type SkillResponse = ServerResponse<{
  data: Skill;
}>;

type UsersResponse = ServerResponse<{
  data: User[];
}>;

type AuthResponse = ServerResponse<{
  data: { accessToken: string; refreshToken: string };
}>;

export const getSkillsApi = () =>
  fetch(`${URL}/api/skills`)
    .then(res => checkResponse<SkillResponse>(res))
    .then(res => assertSuccess(res, 'Не удалось получить навыки'));

export const getUsersApi = () =>
  fetch(`${URL}/api/users/all`)
    .then(res => checkResponse<UsersResponse>(res))
    .then(res => assertSuccess(res, 'Не удалось получить данные о пользователях'));

export type LoginData = {
  email: string;
  password: string;
};

export const loginUserApi = (data: LoginData) =>
  fetch(`${URL}/api/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(data),
  })
    .then(res => checkResponse<AuthResponse>(res))
    .then(res => assertSuccess(res, 'Не удалось залогиниться'));
