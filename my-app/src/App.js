import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import { TestCaseProvider } from './context/TestCaseContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Friends from './pages/Friends';
import Roommates from './pages/Roommates';
import Internships from './pages/Internships';

function App() {
  const backgroundStyle = {
    '--home-bg': `url(${process.env.PUBLIC_URL}/campus-background.jpg)`,
    '--page-bg': `url(${process.env.PUBLIC_URL}/campus-background.jpg)`
  };

  return (
    <TestCaseProvider>
      <div className="App" style={backgroundStyle}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/roommates" element={<Roommates />} />
          <Route path="/internships" element={<Internships />} />
        </Routes>
      </div>
    </TestCaseProvider>
  );
}

export default App;
