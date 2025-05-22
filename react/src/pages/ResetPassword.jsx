import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import api from '../lib/axios';

const Container = styled.div`
  min-height: 100vh;
  padding: 40px 20px;
  background: linear-gradient(to right, #f8fafc, #e2e8f0);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
  background-color: white;

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
  transition: 0.2s;

  &:hover {
    background-color: #1d4ed8;
  }
`;

const Text = styled.p`
  font-size: 0.95rem;
  color: ${({ type }) =>
    type === 'error' ? 'red' : type === 'success' ? 'green' : '#374151'};
  margin-top: 0.5rem;
  text-align: center;
`;

function ResetPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      navigate('/main', { replace: true });
    }
  }, []);

  const handleSend = async () => {
    try {
      const res = await api.post('/auth/reset-password-request/', {
        email: email,
      });
      setMessage(res.data.message);
      setError('');
    } catch (err) {
      const msg = err.response?.data?.message || '비밀번호 재설정 요청 실패';
      setError(msg);
      setMessage('');
    }
  };

  return (
    <Container>
      <Title>비밀번호 재설정</Title>
      <Form>
        <Input
          type="email"
          placeholder="이메일 주소"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button onClick={handleSend}>재설정 링크 전송</Button>
        {message && <Text type="success">{message}</Text>}
        {error && <Text type="error">{error}</Text>}
      </Form>
    </Container>
  );
}

export default ResetPassword;
