import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import EmvaPage from './EmvaPage';
import SyktyvkarPage from './SyktyvkarPage';
import ComplaintsPage from './ComplaintsPage';
import InitiativesPage from './InitiativesPage';
import AboutPetitionPage from './AboutPetitionPage';
import RegistrationPage from './RegistrationPage'

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
        <Route path="/petitions/:cityName" element={<ComplaintsPage />} />
        <Route path="/initiatives/:cityName" element={<InitiativesPage />} />
        <Route path="/petition/:petitionId" element={<AboutPetitionPage />} />
        <Route path="/registration" element={<RegistrationPage />} />
        {/* <Route path="/ukhta" element={<UkhtaPage />} /> */}
        {/* <Route path="/pechora" element={<PechoraPage />} /> */}
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
