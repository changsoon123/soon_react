import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.scss';
import {API_BASE_URL as BASE, LoginUser} from '../config/host-config'
import { useAuth } from '../contexts/AuthContext'; 

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const API_BASE_URL = BASE + LoginUser;

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    
    try {
      const response = await fetch(API_BASE_URL , {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();

        // 서버로부터 받은 토큰을 추출
        const token = responseData.token;

        sessionStorage.setItem('token', token);

        // 로그인 성공
        console.log('로그인 성공');
        login();
        navigate('/');
      } else {
        // 로그인 실패
        console.log('로그인 실패');
      }
    } catch (error) {
      console.error('로그인 요청 에러', error);
    }
  };

  const handleKeyPress = (e) => {
    // 엔터 키를 누를 때만 로그인 처리
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="Login">
      <h2>로그인</h2>
      <form>
        <div className="input-container">
          <div className="input-row">
            <label htmlFor="login-username">아이디:</label>
            <input
              type="text"
              id="login-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
          <div className="input-row">
            <label htmlFor="login-password">비밀번호:</label>
            <input
              type="password"
              id="login-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
        </div>
        <button type="button" onClick={handleLogin}>
          로그인
        </button>
      </form>
    </div>
  );
}

export default Login;