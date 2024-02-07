import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.scss';
import {API_BASE_URL as BASE, LoginUser} from '../config/host-config'
import KakaoLoginButton from '../components/KakaoLoginButton';
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

  const handleSubmit = (e) => {
    e.preventDefault(); // 기본 제출 이벤트 방지
    handleLogin(); // 로그인 핸들러 호출
  };

  const goToSignUpPage = () => {
    navigate('/signup');
  };

  return (
    <div className="Login">
      <h2>로그인</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <div className="input-row">
            <label htmlFor="login-username">아이디:</label>
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
        <button type="submit">
          로그인
        </button>
        <button type="button" onClick={goToSignUpPage}>
          회원가입
        </button>
      </form>
      <KakaoLoginButton />
    </div>
  );
}

export default Login;