import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './styles/index.css';
import TextTestComponent from '@/widgets/TestComponent/TestComponent';
import Catalog from '@/widgets/catalog/catalog';
import { FiltersPanel } from '@/shared/ui/filters-panel/filtersPanel';
import { skillsCategories } from '@/shared/lib/categories';
import { cities } from '@/shared/lib/cities';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TextTestComponent />} />
      </Routes>
      {/* Отображаем каталог в обход роутов, если нужно авторизоваться - пишем isAuthenticated={true} */}
      <FiltersPanel skillsCategories={skillsCategories} cities={cities} />
      <Catalog isAuthenticated={false} />
    </BrowserRouter>
  );
}

export default App;
