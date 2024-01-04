import React, { useState } from 'react';
import '../styles/SignUp.scss';
import {API_BASE_URL as BASE, USER} from '../config/host-config'

function SignUp() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const API_BASE_URL = BASE + USER;

  const handleSignUp = async () => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          email,
          phoneNumber,
        }),
      });

      if (response.ok) {
        // 회원가입 성공
        console.log('회원가입 성공');
      } else {
        // 회원가입 실패
        console.log('회원가입 실패');
      }
    } catch (error) {
      console.error('회원가입 요청 에러', error);
    }
  };

  return (
    <div className="SignUp">
      <h2>회원 가입</h2>
      <form>
        <div className="input-container">
          <div className="input-row">
            <label htmlFor="username">아이디:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-row">
            <label htmlFor="password">비밀번호:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="input-row">
            <label htmlFor="email">이메일:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-row">
            <label htmlFor="phoneNumber">전화번호:</label>
            <input
              type="tel"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
        </div>
        <button type="button" onClick={handleSignUp}>
          가입하기
        </button>
      </form>
    </div>
  );
}

export default SignUp;