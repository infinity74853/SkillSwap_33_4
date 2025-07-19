import { BrowserRouter, Routes } from 'react-router-dom';
import './styles/index.css';
import Catalog from '@/widgets/Catalog/Catalog';

function App() {
  return (
    <BrowserRouter>
      <Routes></Routes>
      {/* Отображаем каталог в обход роутов, если нужно авторизоваться - пишем isAuthenticated={true} */}
      <Catalog isAuthenticated={false} />
    </BrowserRouter>
  );
}

export default App;
