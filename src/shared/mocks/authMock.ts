import { CustomSkill } from '@/entities/skill/model/types';
import {
  TAuthResponse,
  TLoginData,
  TRefreshResponse,
  TServerResponse,
  TUserResponse,
} from '../utils/api';
import { User } from '@/entities/user/model/types';

const MOCK_USER: User = {
  _id: 'user_002',
  name: 'Дмитрий',
  gender: 'male',
  image: 'https://example.com/avatars/dmitry.jpg',
  city: 'Санкт-Петербург',
  birthdayDate: '1988-07-22',
  description: 'Фотограф с 10-летним опытом, специализация - портретная съемка',
  likes: ['фотография', 'искусство', 'преподавание'],
  createdAt: new Date(2023, 2, 18).toString(),
  canTeach: {
    category: 'Творчество и искусство',
    subcategory: 'Фотография',
    subcategoryId: 'art_photo_001',
    name: 'Основы портретной фотографии',
    description: 'Научу работать с естественным светом и строить композицию',
    image: ['https://example.com/skills/photo1.jpg', 'https://example.com/skills/photo2.jpg'],
    customSkillId: 'skill_photo_001',
  } as CustomSkill,
  wantsToLearn: [
    {
      category: 'Бизнес и карьера',
      subcategory: 'Личный бренд',
      subcategoryId: 'bus_brand_001',
      name: 'Продвижение в Instagram',
      customSkillId: 'want_brand_001',
    } as Omit<CustomSkill, 'description' | 'image'>,
    {
      category: 'Здоровье и лайфстайл',
      subcategory: 'Йога и медитация',
      subcategoryId: 'health_yoga_001',
      name: 'Йога для спины',
      customSkillId: 'want_yoga_001',
    } as Omit<CustomSkill, 'description' | 'image'>,
    {
      category: 'Иностранные языки',
      subcategory: 'Английский',
      subcategoryId: 'lang_eng_001',
      name: 'Деловой английский',
      customSkillId: 'want_lang_001',
    } as Omit<CustomSkill, 'description' | 'image'>,
  ],
} as User;

const MOCK_DELAY = 500;

export const generateToken = () =>
  Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);

export const setToStorage = (key: string, value: string) => localStorage.setItem(key, value);

export const getFromStorage = (key: string) => localStorage.getItem(key);

export const setCookie = (name: string, value: string) => {
  const maxAge = 60 * 60 * 24 * 7;
  document.cookie = `${name}=${value}; max-age=${maxAge}; path=/; samesite=lax`;
};

export const getCookie = (name: string) => {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match?.[2] || null;
};

export const refreshToken = (): Promise<TRefreshResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const refreshToken = getFromStorage('refreshToken');

      if (!refreshToken) {
        reject({ success: false, message: 'Token not found' });
        return;
      }

      const newAccessToken = generateToken();
      const newRefreshToken = generateToken();

      setToStorage('refreshToken', newRefreshToken);
      setCookie('accessToken', newAccessToken);

      resolve({
        success: true,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    }, MOCK_DELAY);
  });
};

export const getUserApi = (): Promise<TUserResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const accessToken = getCookie('accessToken');
      const refreshToken = getFromStorage('refreshToken');
      const currentUser = localStorage.getItem('currentUser');

      if (accessToken && refreshToken && currentUser) {
        resolve({
          success: true,
          user: JSON.parse(currentUser),
        });
      } else {
        reject({ message: 'Не авторизован' });
      }
    }, MOCK_DELAY);
  });
};

export const logoutApi = (): Promise<TServerResponse<object>> => {
  return new Promise(resolve => {
    setTimeout(() => {
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('currentUser');
      document.cookie = 'accessToken=; max-age=0; path=/';

      resolve({ success: true });
    }, MOCK_DELAY);
  });
};

export const loginUserApi = (data: TLoginData): Promise<TAuthResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('users') || '{}');
      const userRecord = users[data.email];

      if (data.email === 'test@example.com' && data.password === 'password') {
        const accessToken = generateToken();
        const refreshToken = generateToken();

        setToStorage('refreshToken', refreshToken);
        setCookie('accessToken', accessToken);
        localStorage.setItem('currentUser', JSON.stringify(MOCK_USER));

        resolve({
          success: true,
          user: MOCK_USER,
          accessToken,
          refreshToken,
        });
      } else if (userRecord && userRecord.password === data.password) {
        const accessToken = generateToken();
        const refreshToken = generateToken();

        setToStorage('refreshToken', refreshToken);
        setCookie('accessToken', accessToken);
        localStorage.setItem('currentUser', JSON.stringify(userRecord.userData));

        resolve({
          success: true,
          user: userRecord.userData,
          accessToken,
          refreshToken,
        });
      } else {
        reject({
          success: false,
          message: 'Неверные учетные данные',
        });
      }
    }, MOCK_DELAY);
  });
};
