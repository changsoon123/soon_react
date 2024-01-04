import React, { useState } from 'react';
import '../styles/Login.scss';
import {API_BASE_URL as BASE, LoginUser} from '../config/host-config'

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const API_BASE_URL = BASE + LoginUser;

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
        // 로그인 성공
        console.log('로그인 성공');
      } else {
        // 로그인 실패
        console.log('로그인 실패');
      }
    } catch (error) {
      console.error('로그인 요청 에러', error);
    }
  };

  return (
    <div className="Login">
      <h2>로그인</h2>
      <form>
        <div className="input-container">
          <div className="input-row">
            <label htmlFor="login-username">이름:</label>
            <input
              type="text"
              id="login-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-row">
            <label htmlFor="login-password">비밀번호:</label>
            <input
              type="password"
              id="login-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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