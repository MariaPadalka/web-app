// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login/Login';
import Registration from './components/Registration/Registration';
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<Registration />} />
          {/* Інші маршрути, якщо потрібно */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
