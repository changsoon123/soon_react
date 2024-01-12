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

      sessionStorage.setItem(result.response.access_token);
  
      // 서버로 데이터 전송
      const response = await fetch(API_BASE_URL ,{
        method: 'POST', // 수정: GET에서 POST로 변경
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: result.profile.id,
          nickname: result.profile.properties.nickname,
        }),
      });
  
      if (response.ok) {
        const userData = await response.json();
        console.log('백엔드 응답:', userData);

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