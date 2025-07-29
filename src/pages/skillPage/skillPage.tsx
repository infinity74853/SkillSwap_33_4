import SkillCard from '@/widgets/skillCard/skillCard';
import styles from './skillPage.module.css';

export interface Skill {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  imagePreview: string | string[];
}

const SkillPage: React.FC = () => {
  const mockSkills: Skill[] = [
    {
      id: '1',
      title: 'Игра на барабанах',
      category: 'Творчество и искусство / Музыка и звук',
      description:
        'Привет! Я играю на барабанах уже больше 10 лет — от репетиций в гараже до выступлений на сцене с живыми группами. Научу основам техники (и как не отбить себе пальцы), играть любимые ритмы и разбирать песни, импровизировать и звучать уверенно даже без паритуры',
      image:
        '../src/app/assets/static/images/authUserProfileImages/706f87d20b14825dacb3f1b32ca9fb7be905f467.jpg',
      imagePreview: [
        'https://i1.poltava.to/uploads/2021/09/2021-09-25/image1.jpg',
        'https://b0bcebf4-d767-420b-9f5a-cccfc5015c46.selstorage.ru/iblock/472/03hqhsxyo79gldivild8evlkezaf1vzm.jpg',
        'https://st4.depositphotos.com/22740078/25330/i/450/depositphotos_253309794-stock-photo-playing-the-drum-cut-out.jpg',
        'https://st.depositphotos.com/1034582/3737/i/450/depositphotos_37377787-stock-photo-man-playing-the-drums.jpg',
      ],
    },
    {
      id: '2',
      title: 'Игра на пианино',
      category: 'Творчество и искусство / Музыка и звук',
      description:
        'Привет! Я играю на пианино уже больше 10 лет — от репетиций в гараже до выступлений на сцене с живыми группами. Научу основам техники (и как не отбить себе пальцы), играть любимые ритмы и разбирать песни, импровизировать и звучать уверенно даже без паритуры',
      image:
        'https://st.depositphotos.com/2377011/4484/i/450/depositphotos_44848059-stock-photo-child-hands-playing-piano.jpg',
      imagePreview: [
        'https://i.pinimg.com/474x/9a/c5/3b/9ac53b29af38bb1ab3ecdc2c30c6f969.jpg',
        'https://shkolamuzyki.ru/images/kak-nauchitsa-igrat-na-pianino-vzroslomu-01.jpg',
        'https://st.depositphotos.com/1079647/3021/i/450/depositphotos_30217295-stock-photo-playing-piano.jpg',
      ],
    },
  ];

  return (
    <div className={styles.skillPage}>
      <div className={styles.userOffer}>
        <div className={styles.userInfo}>Заглушка</div>
        <SkillCard skill={mockSkills[0]} />
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
