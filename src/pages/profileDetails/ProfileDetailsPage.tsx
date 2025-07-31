import { useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './ProfileDetailsPage.module.css';
import { Header } from '@/widgets/Header/Header';
import { Footer } from '@/widgets/Footer/Footer';
import userPhoto from '@/app/assets/static/images/authUserProfileImages/user.jpg'; 
import RequestIcon from '@/shared/ui/icons/RequestIcon';
import MessageTextIcon from '@/shared/ui/icons/MessageTextIcon';
import LikeIcon from '@/shared/ui/icons/LikeIcon';
import IdeaIcon from '@/shared/ui/icons/IdeaIcon';
import UserIcon from '@/shared/ui/icons/UserIcon';
import CalendarIcon from '@/shared/ui/icons/CalendarIcon';
import ChevronIcon from '@/shared/ui/icons/ChevronIcon';
import EditIcon from '@/shared/ui/icons/EditIcon';

const sidebarItems = [
  { icon: 'request', text: 'Заявки', route: '/profile/requests' },
  { icon: 'message-text', text: 'Мои обмены', route: '/profile/exchanges' },
  { icon: 'like', text: 'Избранное', route: '/profile/favorites' },
  { icon: 'idea', text: 'Мои Навыки', route: '/profile/skills' },
  { icon: 'user', text: 'Личные данные', route: '/profile/details' },
];

export default function ProfileDetailsPage() {
  const location = useLocation();
  const dateInputRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState('Mariia@gmail.com');
  const [name, setName] = useState('Мария');
  const [birthDate, setBirthDate] = useState('1995-10-28');
  const [gender, setGender] = useState('female');
  const [city, setCity] = useState('Москва');
  const [about, setAbout] = useState('Люблю учиться новому, особенно если это можно делать за чаем и в пижаме. Всегда готова пообщаться и обменяться чем‑то интересным!');

  return (
    <div className={styles.profileWrapper}>
      <Header />
      <div className={styles.profileContent}>
        <aside className={styles.profileSidebar}>
          <div className={styles.profileSidebarItems}>
            {sidebarItems.map(item => {
              const isActive = location.pathname === item.route;
              return (
                <div
                  key={item.text}
                  className={isActive ? styles.profileSidebarItemActive : styles.profileSidebarItem}
                >
                  <span className={styles.profileSidebarIcon}>
                    {item.icon === 'request' ? (
                      <RequestIcon width={24} height={24} />
                    ) : item.icon === 'message-text' ? (
                      <MessageTextIcon width={24} height={24} />
                    ) : item.icon === 'like' ? (
                      <LikeIcon width={24} height={24} />
                    ) : item.icon === 'idea' ? (
                      <IdeaIcon width={24} height={24} />
                    ) : item.icon === 'user' ? (
                      <UserIcon width={24} height={24} />
                    ) : null}
                  </span>
                  {item.text}
                </div>
              );
            })}
          </div>
        </aside>
        <main className={styles.profileMain}>
          <div className={styles.profileAvatarBlock}>
            <img src={userPhoto} alt="Аватар" className={styles.profileAvatar} />
            <button className={styles.profileEditPhotoBtn}>
              <span className={styles.profileGalleryEdit}>
                <EditIcon width={24} height={24} />
              </span>
            </button>
          </div>
          <div className={styles.profileInputBlock}>
            <label>Почта</label>
            <div className={styles.profileEmailInputWrapper}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className={styles.profileEmailInput}
              />
              <span className={styles.profileEditIcon}>
                <EditIcon width={24} height={24} />
              </span>
            </div>
          </div>
          <button className={styles.profileChangePasswordBtn}>
            Изменить пароль
          </button>
          <form className={styles.profileForm}>
            <div className={styles.profileFormInputs}>
              <div className={styles.profileInputBlock}>
                <label>Имя</label>
                <div className={styles.profileEmailInputWrapper}>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className={styles.profileEmailInput}
                  />
                  <span className={styles.profileEditIcon}>
                    <EditIcon width={24} height={24} />
                  </span>
                </div>
              </div>
              <div className={styles.profileInputRow}>
                <div className={styles.profileInputBlock}>
                  <label>Дата рождения</label>
                  <div
                    className={styles.profileDateInputWrapper}
                    tabIndex={0}
                    role="button"
                    aria-label="Выбрать дату рождения"
                    onClick={() => dateInputRef.current && dateInputRef.current.showPicker && dateInputRef.current.showPicker()}
                    style={{cursor: 'pointer'}}>
                    <input
                      type="date"
                      ref={dateInputRef}
                      value={birthDate}
                      onChange={e => setBirthDate(e.target.value)}
                      className={styles.profileDateInput}
                    />
                    <span className={styles.profileCalendarIcon}>
                      <CalendarIcon width={24} height={24} />
                    </span>
                  </div>
                </div>
                <div className={styles.profileInputBlock}>
                  <label>Пол</label>
                  <div className={styles.profileGenderInputWrapper}>
                    <div className={styles.profileSelectInputWrapper}>
                      <select value={gender} onChange={e => setGender(e.target.value)} className={styles.profileInputHalf}>
                        <option value="female">Женский</option>
                        <option value="male">Мужской</option>
                      </select>
                    </div>
                    <span className={styles.profileChevronIcon}>
                      <ChevronIcon width={24} height={24} />
                    </span>
                  </div>
                </div>
              </div>
              <div className={styles.profileInputBlock}>
                <label>Город</label>
                <div className={styles.profileCityInputWrapper} style={{width: '100%', maxWidth: '100%'}}>
                  <div className={styles.profileSelectInputWrapper} style={{width: '100%'}}>
                    <select value={city} onChange={e => setCity(e.target.value)} style={{width: '100%'}}>
                      <option value="Москва">Москва</option>
                      <option value="Санкт-Петербург">Санкт-Петербург</option>
                      <option value="Екатеринбург">Екатеринбург</option>
                      <option value="Новосибирск">Новосибирск</option>
                    </select>
                  </div>
                  <span className={styles.profileChevronIcon}>
                    <ChevronIcon width={24} height={24} />
                  </span>
                </div>
              </div>
              <div className={styles.profileInputBlock}>
                <label>О себе</label>
                <div className={styles.profileAboutInputWrapper}>
                  <textarea
                    value={about}
                    onChange={e => setAbout(e.target.value)}
                    rows={5}
                    className={styles.profileAboutTextarea}
                  />
                  <span className={styles.profileAboutEditIcon}>
                    <EditIcon width={24} height={24} />
                  </span>
                </div>
              </div>
            </div>
            <button type="button" className={styles.profileSaveBtn} disabled>
              Сохранить
            </button>
          </form>
        </main>
      </div>
      <Footer />
    </div>
  );
}
