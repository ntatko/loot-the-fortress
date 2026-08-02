import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import './styles.css';
import HomeMenu from './components/modes/HomeMenu';
import Shop from './components/modes/Shop';
import Theft from './components/modes/Theft';
import Escape from './components/modes/Escape';
import World from './components/modes/World';
import { GamepadProvider } from './context/useGamepad';
import { InventoryProvider } from './context/useInventory';
import { WorldProvider } from './context/useWorld';

function App() {
  return (
    <div className="App">
      <GamepadProvider>
        <InventoryProvider>
          <WorldProvider>
            <Pages />
          </WorldProvider>
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
      <Route path="/world" element={<World />} />
      <Route path="/" element={<HomeMenu />} />
    </Routes>
  </BrowserRouter>
  )
}
