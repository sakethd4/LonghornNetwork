import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Friends from './pages/Friends';
import Roommates from './pages/Roommates';
import Internships from './pages/Internships';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/roommates" element={<Roommates />} />
        <Route path="/internships" element={<Internships />} />
      </Routes>
    </div>
  );
}

export default App;
