import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import api from '../lib/axios';

const Container = styled.div`
  min-height: 100vh;
  padding: 0 20px;
  background: linear-gradient(to right, #f8fafc, #e2e8f0);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: 'Pretendard', sans-serif;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1.5rem;
`;

const Form = styled.div`
  width: 100%;
  max-width: 360px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Input = styled.input`
  padding: 12px 16px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #2563eb;
  }
`;

const Button = styled.button`
  padding: 12px;
  background-color: #2563eb;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background-color: #1d4ed8;
  }
`;

const SubButtonGroup = styled.div`
  margin-top: 1rem;
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
`;

const SubButton = styled.button`
  padding: 8px 14px;
  font-size: 0.9rem;
  border: 1px solid #94a3b8;
  background: white;
  color: #1e293b;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background: #f1f5f9;
  }
`;

const ErrorMsg = styled.p`
  color: red;
  font-size: 0.9rem;
  margin-top: 4px;
`;

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      navigate('/main', { replace: true });
    }
  }, []);

  const handleLogin = async () => {
    try {
      const res = await api.post('/auth/login/', { username, password });
      const { access, refresh } = res.data.data;
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      navigate('/main');
    } catch (err) {
      const msg = err.response?.data?.message || '로그인 실패';
      setError(msg);
    }
  };

  return (
    <Container>
      <Title>로그인</Title>
      <Form>
        <Input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="아이디"
        />
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
        />
        <Button onClick={handleLogin}>로그인</Button>
        {error && <ErrorMsg>{error}</ErrorMsg>}
      </Form>

      <SubButtonGroup>
        <SubButton onClick={() => navigate('/find-id')}>아이디 찾기</SubButton>
        <SubButton onClick={() => navigate('/reset-password')}>비밀번호 찾기</SubButton>
      </SubButtonGroup>
    </Container>
  );
}

export default Login;
