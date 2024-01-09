import React from 'react';
import '../styles/KakaoLoginButton.scss';
import KakaoLogin from 'react-kakao-login';
import { useAuth } from '../contexts/AuthContext';
import {API_BASE_URL as BASE, KakaoLoginUser} from '../config/host-config'
import { useNavigate } from 'react-router-dom';


const KakaoLoginButton = () => {

  const navigate = useNavigate();

  const API_BASE_URL = BASE + KakaoLoginUser;

  const { login } = useAuth();
    
  const KAKAO_API_KEY = process.env.REACT_APP_KAKAO_API_KEY;

  const responseKaKao = async (result) => {
    try {
      // 클라이언트에서 받은 카카오 코드
      console.log(result);

      console.log(result.profile.id);
      console.log(result.profile.properties.nickname);

      const code = result.code;

      console.log(code);
  
      // 서버로 전송할 데이터
      const queryString = `?code=${code}`;
  
      // 서버로 데이터 전송
      const response = await fetch(API_BASE_URL + queryString , {
        method: 'GET',  
        
      });
  
      if (response.ok) {
        const userData = await response.json();
        console.log('백엔드 응답:', userData);
  
        const token = userData.token;
  
        sessionStorage.setItem('accesstoken', token);
  
        // 여기에서 필요한 처리를 수행하세요.
        login();
        navigate('/');
      } else {
        console.error('백엔드 요청 실패:', response.status);
      }
    } catch (error) {
      console.error('백엔드 요청 에러:', error);
    }
  };


  return (
    <KakaoLogin
      token={KAKAO_API_KEY}
      onSuccess={responseKaKao}
      onFail={(err) => console.error(err)}
      onLogout={() => console.info('logout')}
      className="custom-kakao-button"
    >
      <img
        className="kakao-login-icon"
        src="/kakao-login-button.jpg" // 이미지의 경로를 public 폴더를 기준으로 설정
        alt="Kakao Login"
      />
    </KakaoLogin>
  );
};

export default KakaoLoginButton;