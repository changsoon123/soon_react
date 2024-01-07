import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.scss';
import { useAuth } from '../contexts/AuthContext'; // 새로운 컨텍스트 파일 추가

function Header() {
  const { isLoggedIn, logout } = useAuth(); // useAuth 훅 사용

  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/signup">Sign Up</Link>
          </li>
          <li className="login-logout">
            {isLoggedIn ? (
              <button onClick={logout}>Logout</button>
            ) : (
              <Link to="/login">Login</Link>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;