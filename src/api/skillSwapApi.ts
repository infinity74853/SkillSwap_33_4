import { TSkill, TUser } from '@/types/types';

const URL = import.meta.env.VITE_SKILLSWAP_API_URL;

const checkResponse = <T>(res: Response): Promise<T> =>
  res.ok ? res.json() : res.json().then(err => Promise.reject(err));

type TServerResponse<T> = {
  success: boolean;
} & T;

type TRefreshResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
}>;

type TSkillResponse = TServerResponse<{
  data: TSkill[];
}>;

type TUsersResponse = TServerResponse<{
  data: TUser[];
}>;

type TAuthResponse = TServerResponse<{
  accessToken: string;
  refreshToken: string;
}>;

export const getSkillsApi = () => {
  fetch(`${URL}/api/skills`)
    .then(res => checkResponse<TSkillResponse>(res))
    .then(data => {
      if (data?.success) {
        return data.data;
      } else return Promise.reject(data);
    });
};

export const getUsersApi = () => {
  fetch(`${URL}/api/users/all`)
    .then(res => checkResponse<TUsersResponse>(res))
    .then(data => {
      if (data?.success) {
        return data.data;
      } else return Promise.reject(data);
    });
};

export type TLoginData = {
  email: string;
  password: string;
};

export const loginUserApi = (data: TLoginData) => {
  fetch(`${URL}/api/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(data),
  })
    .then(res => checkResponse<TAuthResponse>(res))
    .then(data => {
      if (data?.success) {
        return data;
      } else return Promise.reject(data);
    });
};
