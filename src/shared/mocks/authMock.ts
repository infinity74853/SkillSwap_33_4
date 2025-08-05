import { CustomSkill } from '@/entities/skill/model/types';
import {
  TAuthResponse,
  TLoginData,
  TRefreshResponse,
  TServerResponse,
  TUserResponse,
} from '../utils/api';

const MOCK_USER = {
  _id: 'user_002',
  name: 'Дмитрий',
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
};

const MOCK_DELAY = 500;

const generateToken = () =>
  Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);

const setToStorage = (key: string, value: string) => localStorage.setItem(key, value);

const getFromStorage = (key: string) => localStorage.getItem(key);

const setCookie = (name: string, value: string) => {
  const maxAge = 60 * 60 * 24 * 7;
  document.cookie = `${name}=${value}; max-age=${maxAge}; path=/; samesite=lax`;
};

const getCookie = (name: string) => {
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

      if (!accessToken) {
        reject({ message: 'Unauthorized' });
        return;
      }

      resolve({
        success: true,
        user: MOCK_USER,
      });
    }, MOCK_DELAY);
  });
};

export const logoutApi = (): Promise<TServerResponse<object>> => {
  return new Promise(resolve => {
    setTimeout(() => {
      localStorage.removeItem('refreshToken');
      document.cookie = 'accessToken=; max-age=0; path=/';

      resolve({
        success: true,
      });
    }, MOCK_DELAY);
  });
};

export const loginUserApi = (data: TLoginData): Promise<TAuthResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (data.email === 'test@example.com' && data.password === 'password') {
        const accessToken = generateToken();
        const refreshToken = generateToken();

        setToStorage('refreshToken', refreshToken);
        setCookie('accessToken', accessToken);

        resolve({
          success: true,
          user: MOCK_USER,
          accessToken,
          refreshToken,
        });
      } else {
        reject({
          success: false,
          message: 'Invalid credentials',
        });
      }
    }, MOCK_DELAY);
  });
};