import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import './styles.css';
import HomeMenu from './components/modes/HomeMenu';
import Shop from './components/modes/Shop';
import Theft from './components/modes/Theft';
import Escape from './components/modes/Escape';
import { MatomoProvider, createInstance } from '@datapunt/matomo-tracker-react'

function App() {
  const instance = createInstance({
    urlBase: 'https://analytics.cloud.zipidy.org',
    siteId: 2,
  })

  return (
    <div className="App">
      <MatomoProvider instance={instance}>
        <BrowserRouter>
          <Routes>
            <Route path="/theft" element={<Theft />} />
            <Route path="/inventory" element={<Shop />} />
            <Route path="/escape" element={<Escape />} />
            <Route path="/" element={<HomeMenu />} />
          </Routes>
        </BrowserRouter>
      </MatomoProvider>
    </div>
  );
}

export default App;
