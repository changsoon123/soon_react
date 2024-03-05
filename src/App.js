import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import BoardPage from './pages/BoardPage';
import BoardDetailPage from './pages/BoardDetailPage';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import CreateBoardPage from './pages/CreateBoardPage';
import './App.scss';

function App() {

  return (
    <Router>
      <AuthProvider>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/board" element={<BoardPage />} />
        <Route path="/board/:id" element={<BoardDetailPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create" element={<CreateBoardPage />} />
      </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;