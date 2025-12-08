import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link 
          to="/" 
          className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}
        >
          Home
        </Link>
        <Link 
          to="/chat" 
          className={location.pathname === '/chat' ? 'nav-link active' : 'nav-link'}
        >
          Chat
        </Link>
        <Link 
          to="/friends" 
          className={location.pathname === '/friends' ? 'nav-link active' : 'nav-link'}
        >
          Friends
        </Link>
        <Link 
          to="/roommates" 
          className={location.pathname === '/roommates' ? 'nav-link active' : 'nav-link'}
        >
          Roommates
        </Link>
        <Link 
          to="/internships" 
          className={location.pathname === '/internships' ? 'nav-link active' : 'nav-link'}
        >
          Internships
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;

