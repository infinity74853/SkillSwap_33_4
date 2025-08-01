import styles from './sameOffers.module.css';

const SameOffers: React.FC = () => {
  return (
    <div className={styles.sameOffers}>
      <h3>Похожие предложения</h3>
      <div className={styles.cards}>
        <div className="userCard">Карточка 1</div>
        <div className="userCard">Карточка 2</div>
        <div className="userCard">Карточка 3</div>
        <div className="userCard">Карточка 4</div>
      </div>
    </div>
  );
};

export default SameOffers;
