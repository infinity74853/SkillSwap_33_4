import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './styles/index.css';
import TextTestComponent from '@/widgets/TestComponent/TestComponent';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TextTestComponent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
