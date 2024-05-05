import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import EmvaPage from './EmvaPage';
import SyktyvkarPage from './SyktyvkarPage';
// import UkhtaPage from './UkhtaPage';
// import PechoraPage from './PechoraPage';
// import NotFoundPage from './NotFoundPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route path="/emva" element={<EmvaPage />} />
        <Route path="/syktyvkar" element={<SyktyvkarPage />} />
        {/* <Route path="/syktyvkar" element={<SyktyvkarPage />} /> */}
        {/* <Route path="/ukhta" element={<UkhtaPage />} /> */}
        {/* <Route path="/pechora" element={<PechoraPage />} /> */}
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
