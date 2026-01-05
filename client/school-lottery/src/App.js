import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UploadPage from './pages/UploadPage';
import LotteryPage from './pages/LotteryPage';
import WinnerPage from './pages/WinnerPage';
import './App.css';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UploadPage />} />
        <Route path="/lottery/:filename" element={<LotteryPage />} />
        <Route path="/winner/:winnerName" element={<WinnerPage />} />
      </Routes>
    </Router>
  );
}
