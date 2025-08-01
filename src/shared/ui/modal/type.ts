export type TModalUIProps = {
  type?: 'confirmation' | 'info'; // Тип модального окна
  title: string; // Обязательный заголовок
  description?: string; // Описание (опционально)
  image?: string; // URL изображения (только для confirmation)
  onClose: () => void; // Обработчик закрытия
  children?: React.ReactNode; // Дочерний контент (только для info)
  className?: string; // Дополнительные классы для стилизации
};
