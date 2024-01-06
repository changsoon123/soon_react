import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import '../styles/SignUp.scss';
import { API_BASE_URL as BASE, USER, CheckField } from '../config/host-config';

function SignUp() {
  const API_BASE_URL = BASE + USER;
  const API_CHECK_BASE_URL = BASE + CheckField;


  const validationSchema = yup.object().shape({
    username: yup.string()
      .required('아이디를 입력하세요.')
      .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$/, '아이디는 최소 5자 이상이어야 합니다. 영어, 숫자를 조합하세요.'),
    password: yup.string()
      .required('비밀번호를 입력하세요.')
      .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, '비밀번호는 최소 8자 이상이어야 합니다. 영어, 숫자를 조합하세요.'),
    email: yup.string()
      .required('이메일을 입력하세요.')
      .matches(/^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$/, '올바른 이메일 주소를 입력하세요.'),
    phoneNumber: yup.string()
      .required('전화번호를 입력하세요.')
      .matches(/^\d{3}-\d{3,4}-\d{4}$/, '올바른 전화번호 형식을 입력하세요.'),
    nickname: yup.string()
      .required('닉네임을 입력하세요.')
      .matches(/^[A-Za-z0-9가-힣]{2,}$/, '닉네임은 최소 2자 이상이어야 합니다.'),
  });

  const { control, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema),
  });

  // 중복 검사를 위한 상태 변수들
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);
  const [isEmailAvailable, setIsEmailAvailable] = useState(true);
  const [isPhoneNumberAvailable, setIsPhoneNumberAvailable] = useState(true);
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(true);
  
  

  const checkAvailability = async (fieldName, value, setIsAvailable) => {
    try {
      
      // 서버에 중복 검사 요청
      const response = await fetch(API_CHECK_BASE_URL + `/${fieldName}/${value}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      });
  
      if (!response.ok) {
        setIsAvailable(false);
        console.error(`중복 검사 에러 (${fieldName}): 서버 응답이 실패했습니다.`);
        return;
      }
  
      const data = await response.json();
      setIsAvailable(data.isAvailable);
  
      // React Hook Form의 setValue 함수를 사용하여 필드 값을 업데이트하고, 해당 필드의 onChange 이벤트를 트리거
      setValue(fieldName, value, { shouldValidate: true });
    } catch (error) {
      console.error(`중복 검사 에러 (${fieldName}):`, error);
    }
  };

  const handleBlur = async (fieldName, value) => {
    if (value.trim() !== '') {
    switch (fieldName) {
      case 'username':
        checkAvailability(fieldName, value, setIsUsernameAvailable);
        break;
      case 'email':
        checkAvailability(fieldName, value, setIsEmailAvailable);
        break;
      case 'phoneNumber':
        checkAvailability(fieldName, value, setIsPhoneNumberAvailable);
        break;
      case 'nickname':
        checkAvailability(fieldName, value, setIsNicknameAvailable);
        break;
      default:
        break;
      }
    } 
  };

  const onSubmit = async (data) => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // 회원가입 성공
        console.log('회원가입 성공');
      } else {
        // 회원가입 실패
        console.log(response)
        const responseData = await response.json();
        console.log('서버에서 반환한 에러:', responseData.message);
      }
    } catch (error) {
      console.error('회원가입 요청 에러', error);
    }
  };

  return (
    <div className="SignUp">
      <h2>회원 가입</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="input-container">
          <div className="input-row">
            <label htmlFor="username">아이디:</label>
            <Controller
              name="username"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <>
                  <input
                    type="text"
                    id="username"
                    placeholder="영문과 숫자를 조합하여 5자 이상"
                    {...field}
                    onBlur={(e) => handleBlur('username', e.target.value)}
                    onChange={(e) => {
                      const fieldValue = e.target.value;
                      field.onChange(e.target.value);
                      setValue('username', e.target.value, { shouldValidate: true });
                      if (fieldValue.trim() !== '') {
                        checkAvailability('username', fieldValue, setIsUsernameAvailable);
                      }
                    }}
                  />
                  {errors.username && <span className="error-message">{errors.username.message}</span>}
                  {!isUsernameAvailable && <span className="error-message">이미 사용 중인 아이디입니다.</span>}
                </>
              )}
            />
          </div>
          <div className="input-row">
            <label htmlFor="password">비밀번호:</label>
            <Controller
              name="password"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <>
                  <input
                    type="password"
                    id="password"
                    placeholder="영문과 숫자를 조합하여 8자 이상"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      setValue('password', e.target.value, { shouldValidate: true });
                    }}
                  />
                  {errors.password && <span className="error-message">{errors.password.message}</span>}
                </>
              )}
            />
          </div>
          <div className="input-row">
            <label htmlFor="email">이메일:</label>
            <Controller
              name="email"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <>
                  <input
                    type="email"
                    id="email"
                    placeholder="올바른 이메일 주소를 입력하세요."
                    {...field}
                    onBlur={(e) => handleBlur('email', e.target.value)}
                    onChange={(e) => {
                      const fieldValue = e.target.value;
                      field.onChange(e.target.value);
                      setValue('email', e.target.value, { shouldValidate: true });
                      if (fieldValue.trim() !== '') {
                        checkAvailability('email', fieldValue, setIsUsernameAvailable);
                      }
                    }}
                  />
                  {errors.email && <span className="error-message">{errors.email.message}</span>}
                  {!isEmailAvailable && <span className="error-message">이미 사용 중인 이메일입니다.</span>}
                </>
              )}
            />
          </div>
          <div className="input-row">
            <label htmlFor="phoneNumber">전화번호:</label>
            <Controller
              name="phoneNumber"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <>
                  <input
                    type="tel"
                    id="phoneNumber"
                    placeholder="예: 010-1234-5678"
                    {...field}
                    onBlur={(e) => handleBlur('phoneNumber', e.target.value)}
                    onChange={(e) => {
                      const fieldValue = e.target.value;
                      field.onChange(e.target.value);
                      setValue('phoneNumber', e.target.value, { shouldValidate: true });
                      if (fieldValue.trim() !== '') {
                        checkAvailability('phoneNumber', fieldValue, setIsUsernameAvailable);
                      }
                    }}
                  />
                  {errors.phoneNumber && <span className="error-message">{errors.phoneNumber.message}</span>}
                  {!isPhoneNumberAvailable && <span className="error-message">이미 사용 중인 전화번호입니다.</span>}
                </>
              )}
            />
          </div>
          <div className="input-row">
            <label htmlFor="nickname">닉네임:</label>
            <Controller
              name="nickname"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <>
                  <input
                    type="text"
                    id="nickname"
                    placeholder="영문, 숫자, 한글 2자 이상"
                    {...field}
                    onBlur={(e) => handleBlur('nickname', e.target.value)}
                    onChange={(e) => {
                      const fieldValue = e.target.value;
                      field.onChange(e.target.value);
                      setValue('nickname', e.target.value, { shouldValidate: true });
                      if (fieldValue.trim() !== '') {
                        checkAvailability('nickname', fieldValue, setIsUsernameAvailable);
                      }
                    }}
                  />
                  {errors.nickname && <span className="error-message">{errors.nickname.message}</span>}
                  {!isNicknameAvailable && <span className="error-message">이미 사용 중인 닉네임입니다.</span>}
                </>
              )}
            />
          </div>
        </div>
        <button type="submit">가입하기</button>
      </form>
    </div>
  );
}

export default SignUp;