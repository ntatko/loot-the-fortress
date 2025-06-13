import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import './styles.css';
import HomeMenu from './components/modes/HomeMenu';
import Shop from './components/modes/Shop';
import Theft from './components/modes/Theft';
import Escape from './components/modes/Escape';
import { GamepadProvider } from './context/useGamepad';
import { InventoryProvider } from './context/useInventory';

function App() {
  return (
    <div className="App">
      <GamepadProvider>
        <InventoryProvider>
          <Pages />
        </InventoryProvider>
      </GamepadProvider>
    </div>
  );
}

export default App;

const Pages = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/theft" element={<Theft />} />
      <Route path="/inventory" element={<Shop />} />
      <Route path="/escape" element={<Escape />} />
      <Route path="/" element={<HomeMenu />} />
    </Routes>
  </BrowserRouter>
  )
}
