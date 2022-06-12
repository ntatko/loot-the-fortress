import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import './styles.css';
import HomeMenu from './components/modes/HomeMenu';
import Shop from './components/modes/Shop';
import Theft from './components/modes/Theft';
import Escape from './components/modes/Escape';
import { MatomoProvider, createInstance, useMatomo } from '@jonkoops/matomo-tracker-react'

function App() {
  const instance = createInstance({
    urlBase: 'https://analytics.cloud.zipidy.org/',
    trackerUrl: 'https://analytics.cloud.zipidy.org/matomo.php',
    siteId: '2',
    linkTracking: false,
    heartBeat: { // optional, enabled by default
      active: true, // optional, default value: true
      seconds: 10 // optional, default value: `15
    }  
  })

  return (
    <div className="App">
      <MatomoProvider instance={instance}>
       <Pages />
      </MatomoProvider>
    </div>
  );
}

export default App;

const Pages = () => {
  const { enableLinkTracking } = useMatomo()
  enableLinkTracking()

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
