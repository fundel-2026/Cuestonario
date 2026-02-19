import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SurveyProvider } from './context/SurveyContext';
import SurveyView from './views/SurveyView';
import DashboardView from './views/DashboardView';

function App() {
  return (
    <SurveyProvider>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<Navigate to="/survey" replace />} />
            <Route path="/survey" element={<SurveyView />} />
            <Route path="/dashboard" element={<DashboardView />} />
          </Routes>
        </div>
      </Router>
    </SurveyProvider>
  );
}

export default App;
