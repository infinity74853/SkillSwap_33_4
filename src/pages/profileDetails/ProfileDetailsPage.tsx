import { useLocation } from 'react-router-dom';
import styles from './ProfileDetailsPage.module.css';
import { ProfileSidebar } from './components/ProfileSidebar/ProfileSidebar';
import { ProfileAvatar } from './components/ProfileAvatar/ProfileAvatar';
import { ProfileForm } from './components/ProfileForm/ProfileForm';

export default function ProfileDetailsPage() {
  const location = useLocation();

  return (
    <div className={styles.profileWrapper}>
      <div className={styles.profileContent}>
        <ProfileSidebar currentPath={location.pathname} />
        <main className={styles.profileMain}>
          <ProfileAvatar />
          <ProfileForm />
        </main>
      </div>
    </div>
  );
}
