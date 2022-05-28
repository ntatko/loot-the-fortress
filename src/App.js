import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import HomeMenu from './components/modes/HomeMenu';
import Shop from './components/modes/Shop';
import Theft from './components/modes/Theft';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/theft" element={<Theft />} />
          <Route path="/inventory" element={<Shop />} />
          <Route path="/" element={<HomeMenu />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
