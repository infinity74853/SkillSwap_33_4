import { useRef, ChangeEvent, useState } from 'react';
import { useSelector } from '@/services/store/store';
import { userSliceSelectors } from '@/services/slices/authSlice';
import styles from './ProfileAvatar.module.css';

export function ProfileAvatar() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const user = useSelector(userSliceSelectors.selectUser);
  const [avatarPreview, setAvatarPreview] = useState(user?.image || '');
  const [error, setError] = useState('');

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      setError('Только изображения разрешены');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError('Максимальный размер файла 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = event => {
      if (event.target?.result) {
        setAvatarPreview(event.target.result as string);
        setError('');
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={styles.profileAvatarBlock}>
      <img
        src={avatarPreview || '/default-avatar.png'}
        alt="Аватар"
        className={styles.profileAvatar}
      />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAvatarChange}
        accept="image/*"
        style={{ display: 'none' }}
      />
      <button
        className={styles.profileEditPhotoBtn}
        onClick={() => fileInputRef.current?.click()}
        type="button"
      >
        <span className={styles.profileGalleryEdit} />
      </button>
      {error && <div className={styles.errorText}>{error}</div>}
    </div>
  );
}
