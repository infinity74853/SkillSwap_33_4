import { useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { UserCard } from '../userCard/userCard';
import { RootState, useSelector } from '@/services/store/store';
import styles from './sameOffers.module.css';

const SameOffers: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const users = useSelector((state: RootState) => state.catalog.users);
  const currentUser = users.find(u => u._id === id);

  const sliderRef = useRef<HTMLDivElement>(null);

  // --- Состояние видимости стрелок ---
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // --- Проверка положения прокрутки ---
  const checkArrows = () => {
    const slider = sliderRef.current;
    if (!slider) return;

    const isAtStart = slider.scrollLeft === 0;
    const isAtEnd = slider.scrollWidth - slider.scrollLeft - slider.clientWidth < 1;

    setShowLeftArrow(!isAtStart);
    setShowRightArrow(!isAtEnd);
  };

  // --- Прокрутка ---
  const scrollLeft = () => {
    sliderRef.current?.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    sliderRef.current?.scrollBy({ left: 300, behavior: 'smooth' });
  };

  // --- Подключаем проверку после рендера ---
  useEffect(() => {
    checkArrows(); // инициализация

    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener('scroll', checkArrows);
      const resizeObserver = new ResizeObserver(checkArrows);
      resizeObserver.observe(slider);

      return () => {
        slider.removeEventListener('scroll', checkArrows);
        resizeObserver.unobserve(slider);
      };
    }
  }, []);

  // --- Ранний return после хуков ---
  if (!currentUser || !currentUser.canTeach) {
    return <div className={styles.userInfo}>Пользователь не найден</div>;
  }

  const { category, subcategory } = currentUser.canTeach;

  const similarUsers = users
    .filter(user => {
      if (user._id === currentUser._id) return false;
      if (!user.canTeach) return false;
      const teaches = user.canTeach;
      return teaches.category === category || teaches.subcategory === subcategory;
    })
    .sort((a, b) => {
      const aScore =
        (a.canTeach?.subcategory === subcategory ? 2 : 0) +
        (a.canTeach?.category === category ? 1 : 0);
      const bScore =
        (b.canTeach?.subcategory === subcategory ? 2 : 0) +
        (b.canTeach?.category === category ? 1 : 0);
      return bScore - aScore;
    });

  if (similarUsers.length === 0) {
    return <div className={styles.userInfo}>Нет похожих предложений</div>;
  }

  return (
    <div className={styles.sameOffers}>
      <h3>Похожие предложения</h3>

      <div className={styles.sliderContainer}>
        {/* Левая стрелка — показывается только при прокрутке вправо */}
        {showLeftArrow && (
          <button
            type="button"
            className={styles.arrowLeft}
            onClick={scrollLeft}
            aria-label="Прокрутить влево"
          >
            <img
              src="../src/app/assets/static/images/icons/arrow-chevron-left.svg"
              alt=""
              aria-hidden="true"
            />
          </button>
        )}

        {/* Слайдер */}
        <div ref={sliderRef} className={styles.cardsSlider}>
          <div className={styles.cards}>
            {similarUsers.map(user => (
              <div className={styles.cardWrapper} key={user._id}>
                <UserCard {...user} />
              </div>
            ))}
          </div>
        </div>

        {/* Правая стрелка — показывается, пока не докрутили до конца */}
        {showRightArrow && (
          <button
            type="button"
            className={styles.arrowRight}
            onClick={scrollRight}
            aria-label="Прокрутить вправо"
          >
            <img
              src="../src/app/assets/static/images/icons/arrow-chevron-right.svg"
              alt=""
              aria-hidden="true"
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default SameOffers;
