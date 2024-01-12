import React, { createContext, useContext, useState } from 'react';
import {API_BASE_URL as BASE, KakaoLogout} from '../config/host-config'
import { useNavigate } from 'react-router-dom';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const API_BASE_URL = BASE + KakaoLogout;

  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = () => {
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  const kakaoLogout = async () => {
    
    const yourAccessToken = sessionStorage.getItem('accesstoken');

    try {
      const response = await fetch('https://kapi.kakao.com/v1/user/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${yourAccessToken}`, // 사용자의 액세스 토큰을 여기에 넣어주세요.
        },
      });
  
      if (response.ok) {
        console.log('카카오 로그아웃 성공');
        sessionStorage.removeItem('accesstoken');
        logout();
        // 서버 측 로그아웃 요청
        await handleServerLogout();
        navigate('/');
      } else {
        console.error('카카오 로그아웃 실패', response.status);
      }
    } catch (error) {
      console.error('카카오 로그아웃 에러', error);
    }
  };

  const handleServerLogout = async () => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log('서버 로그아웃 성공');
      } else {
        console.error('서버 로그아웃 실패', response.status);
      }
    } catch (error) {
      console.error('서버 로그아웃 에러', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, kakaoLogout}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};