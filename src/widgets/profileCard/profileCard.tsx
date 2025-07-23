import React from 'react';
import styles from './profileCard.module.css';
import { Profile } from '@/entities/profile/model/types';

interface ProfileCardProps {
  profile: Profile;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => (
  <div className={styles.profileCard} onClick={() => {}}>
    <div className={styles.avatar}>
      {profile.avatar ? (
        <img src={profile.avatar} alt={profile.name} />
      ) : (
        <div className={styles.avatarPlaceholder} />
      )}
    </div>
    <h3 className={styles.profileName}>{profile.name}</h3>
    <div className={styles.skills}>
      <div className={styles.skillSection}>
        <h4>Может научить:</h4>
        <p>{profile.canTeach}</p>
      </div>
      <div className={styles.skillSection}>
        <h4>Хочет научиться:</h4>
        <p>{profile.wantToLearn}</p>
      </div>
    </div>
  </div>
);
