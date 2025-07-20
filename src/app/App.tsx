import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './styles/index.css';
import TextTestComponent from '@/widgets/TestComponent/TestComponent';
import Catalog from '@/widgets/catalog/catalog';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TextTestComponent />} />
      </Routes>
      {/* Отображаем каталог в обход роутов, если нужно авторизоваться - пишем isAuthenticated={true} */}
      <Catalog isAuthenticated={false} />
    </BrowserRouter>
  );
}

export default App;
