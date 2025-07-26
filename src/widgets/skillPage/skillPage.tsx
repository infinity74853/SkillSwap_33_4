import styles from './skillPage.module.css';
import SkillCard from '../skillCard/skillCard';

export interface Skill {
  title: string;
  category: string;
  description: string;
  image: string;
  imagePreview: string;
}

const SkillPage: React.FC = () => {
  const skill: Skill = {
    title: 'Игра на барабанах',
    category: 'Творчество и искусство / Музыка и звук',
    description:
      'Привет! Я играю на барабанах уже больше 10 лет — от репетиций в гараже до выступлений на сцене с живыми группами. Научу основам техники (и как не отбить себе пальцы), играть любимые ритмы и разбирать песни, импровизировать и звучать уверенно даже без паритуры',
    image:
      '../src/app/assets/static/images/authUserProfileImages/706f87d20b14825dacb3f1b32ca9fb7be905f467.jpg',
    imagePreview:
      '../src/app/assets/static/images/authUserProfileImages/706f87d20b14825dacb3f1b32ca9fb7be905f467.jpg',
  };

  return (
    <div className={styles.skillPage}>
      <div className={styles.userOffer}>
        <div className={styles.userInfo}>Заглушка</div>
        <SkillCard skill={skill} />
      </div>
      <div className={styles.sameOffers}>
        <h3>Похожие предложения</h3>
        <div className={styles.cards}>
          <div className="userCard">Карточка 1</div>
          <div className="userCard">Карточка 2</div>
          <div className="userCard">Карточка 3</div>
          <div className="userCard">Карточка 4</div>
        </div>
      </div>
    </div>
  );
};

export default SkillPage;
