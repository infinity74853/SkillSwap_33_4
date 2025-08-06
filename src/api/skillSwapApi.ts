import { Skill } from '@/entities/skill/model/types';
import { User } from '@/entities/user/model/types';
import { TServerResponse } from '@/shared/utils/api';
import { getCookie } from '@/shared/utils/cookies';

const URL = import.meta.env.VITE_SKILLSWAP_API_URL;

const checkResponse = <T>(res: Response): Promise<T> =>
  res.ok ? res.json() : res.json().then(err => Promise.reject(err));

const assertSuccess = <T>(response: { success: boolean; data: T }, errorText: string) => {
  if (!response.success) throw new Error(errorText);
  return response.data;
};

type SkillResponse = ServerResponse<{
  data: Skill[];
}>;

type UsersResponse = ServerResponse<{
  data: User[];
}>;

type AuthResponse = ServerResponse<{
  data: { accessToken: string; refreshToken: string };
}>;

export const getSkillsApi = async () => {
  const res = await fetch(`${URL}/api/skills`);
  const checkedRes = await checkResponse<SkillResponse>(res);
  return assertSuccess(checkedRes, 'Не удалось получить навыки');
};

export const getUsersApi = async () => {
  const res = await fetch(`${URL}/api/users/all`);
  const checkedRes = await checkResponse<UsersResponse>(res);
  return assertSuccess(checkedRes, 'Не удалось получить данные о пользователях');
};

export type LoginData = {
  email: string;
  password: string;
};

export const loginUserApi = async (data: LoginData) => {
  const res = await fetch(`${URL}/api/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(data),
  });
  const checkedRes = await checkResponse<AuthResponse>(res);
  return assertSuccess(checkedRes, 'Не удалось залогиниться');
};

// Добавляем тип для обновления профиля
export type TUpdateProfileData = {
  name: string;
  birthdate: string;
  gender: 'Мужской' | 'Женский';
  city: string;
  description: string;
  avatar?: string;
};

export type TUpdateProfileResponse = TServerResponse<{
  user: User;
}>;

// Добавляем метод для обновления профиля
export const updateProfileApi = (data: TUpdateProfileData): Promise<TUpdateProfileResponse> => {
  return fetch(`${URL}/api/profile`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken') || '',
    },
    body: JSON.stringify(data),
  }).then(res => checkResponse<TUpdateProfileResponse>(res));
};

export type ServerResponse<T> = {
  success: boolean;
  data: T;
};
