import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 페이지 로드 시 세션 스토리지에서 로그인 상태 확인
    const token = sessionStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);


  const login = () => {
    setIsLoggedIn(true);
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate("/");
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
        logout();
        navigate('/');
      } else {
        console.error('카카오 로그아웃 실패', response.status);
      }
    } catch (error) {
      console.error('카카오 로그아웃 에러', error);
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