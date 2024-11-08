/** @jsxImportSource @emotion/react */
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: fixed;
  transform: translate(-50%, -50%);
  padding: 10px;
  border: 1px solid;
  border-radius: 5px;
`;

const StyledButton = styled.button`
  padding: 10px;
  margin: 30px;
  cursor: pointer;

  &:disabled {
    background-color: #181818;
    cursor: not-allowed;
  }
`;

const Error = styled.div`
  color: red;
  font-size: 12px;
`;

const Input = styled.input<{ isError?: boolean }>`
  width: 60%;
  padding: 10px;
  margin-left: 10px;
  border: 1px solid ${({ isError }) => (isError ? 'red' : '#ccc')};
  border-radius: 5px;
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
`;

const Label = styled.label`
  width: 80px; /* 원하는 너비로 조정 */
  padding: 10px;
`;


const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [isPasswordValid, setIsPasswordValid] = useState(true);
    const navigate = useNavigate();
  
    const validateEmail = (email: string): boolean => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    };
  
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const emailValue = e.target.value;
      setEmail(emailValue);
      setIsEmailValid(validateEmail(emailValue));
    };
  
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const passwordValue = e.target.value;
      setPassword(passwordValue);
      setIsPasswordValid(passwordValue.length >= 8);
    };
  
    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
  
      if (isEmailValid && isPasswordValid) {
        try {
          // API 호출
          const response = await fetch('https://yourapi.com/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });
  
          // 응답 확인
          if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);  // 토큰 저장
            navigate('/');  // 루트 경로로 이동
          } else {
            alert('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
          }
        } catch (error) {
          console.error('로그인 중 에러 발생:', error);
          alert('서버에 문제가 발생했습니다. 나중에 다시 시도해주세요.');
        }
      } else {
        alert('이메일 또는 비밀번호가 올바르지 않습니다.');
      }
    };
  
    return (
      <LoginContainer>
        <form onSubmit={handleLogin}>
          <InputGroup>
            <label htmlFor="email">이메일</label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
            />
          </InputGroup>
          {!isEmailValid && <Error>이메일 형식이 올바르지 않습니다.</Error>}
          
          <InputGroup>
            <label htmlFor="password">비밀번호</label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
            />
          </InputGroup>
          {!isPasswordValid && <Error>비밀번호는 8자 이상이어야 합니다.</Error>}
  
          <StyledButton type="submit" disabled={!email || !password || !isEmailValid || !isPasswordValid}>
            로그인
          </StyledButton>
        </form>
      </LoginContainer>
    );
  };
export default Login;