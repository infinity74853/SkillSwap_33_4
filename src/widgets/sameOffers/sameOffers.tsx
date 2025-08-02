import { useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { RootState, useSelector } from '@/services/store/store';
import { UserCard } from '../userCard/userCard';
import arrowLeft from '@/app/assets/static/images/icons/arrow-chevron-left.svg';
import arrowRight from '@/app/assets/static/images/icons/arrow-chevron-right.svg';
import styles from './sameOffers.module.css';

const SameOffers: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const users = useSelector((state: RootState) => state.catalog.users);
  const currentUser = users.find(u => u._id === id);

  const sliderRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // === Получаем точный шаг прокрутки ===
  const getScrollStep = (): number => {
    if (!cardsContainerRef.current) return 348;

    const firstCard = cardsContainerRef.current.querySelector(`.${styles.cardWrapper}`);
    if (!firstCard) return 348;

    const cardRect = firstCard.getBoundingClientRect();
    const style = getComputedStyle(cardsContainerRef.current);
    const gap = parseFloat(style.columnGap) || 16;

    return Math.round(cardRect.width + gap); // округляем до целого
  };

  // === Проверка видимости стрелок ===
  const checkArrows = () => {
    const slider = sliderRef.current;
    if (!slider) return;

    // Используем порог, а не строго 0
    const isAtStart = slider.scrollLeft < 1;
    const isAtEnd = slider.scrollWidth - slider.scrollLeft - slider.clientWidth < 1;

    setShowLeftArrow(!isAtStart);
    setShowRightArrow(!isAtEnd);
  };

  // === Прокрутка с точным выравниванием ===
  const scroll = (direction: 'left' | 'right') => {
    const slider = sliderRef.current;
    if (!slider) return;

    const step = getScrollStep();

    // Текущая позиция
    let targetScrollLeft = slider.scrollLeft;

    if (direction === 'right') {
      targetScrollLeft = Math.ceil((targetScrollLeft + step) / step) * step;
    } else {
      targetScrollLeft = Math.floor((targetScrollLeft - step) / step) * step;
    }

    // Ограничиваем диапазон
    targetScrollLeft = Math.max(
      0,
      Math.min(targetScrollLeft, slider.scrollWidth - slider.clientWidth),
    );

    // Плавная прокрутка
    slider.scrollTo({
      left: targetScrollLeft,
      behavior: 'smooth',
    });

    // После завершения прокрутки — обновляем стрелки
    setTimeout(checkArrows, 300); // подождём завершения анимации
  };

  const scrollLeft = () => scroll('left');
  const scrollRight = () => scroll('right');

  // === Инициализация и отслеживание ===
  useEffect(() => {
    checkArrows();

    const slider = sliderRef.current;
    if (!slider) return;

    const handleScroll = () => {
      // Используем requestAnimationFrame для синхронизации с рендером
      requestAnimationFrame(checkArrows);
    };

    slider.addEventListener('scroll', handleScroll);
    const resizeObserver = new ResizeObserver(checkArrows);
    resizeObserver.observe(slider);

    return () => {
      slider.removeEventListener('scroll', handleScroll);
      resizeObserver.unobserve(slider);
    };
  }, []);

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
      <h2>Похожие предложения</h2>

      <div className={styles.sliderContainer}>
        {showLeftArrow && (
          <button
            type="button"
            className={styles.arrowLeft}
            onClick={scrollLeft}
            aria-label="Прокрутить влево"
          >
            <img src={arrowLeft} alt="" aria-hidden="true" />
          </button>
        )}

        <div ref={sliderRef} className={styles.cardsSlider}>
          <div ref={cardsContainerRef} className={styles.cards}>
            {similarUsers.map(user => (
              <div className={styles.cardWrapper} key={user._id}>
                <UserCard {...user} />
              </div>
            ))}
          </div>
        </div>

        {showRightArrow && (
          <button
            type="button"
            className={styles.arrowRight}
            onClick={scrollRight}
            aria-label="Прокрутить вправо"
          >
            <img src={arrowRight} alt="" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SameOffers;
