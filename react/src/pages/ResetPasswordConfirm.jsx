import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  text-align: center;
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

function ResetPasswordConfirm() {
  const [params] = useSearchParams();
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const uid = params.get('uid');
  const token = params.get('token');

  useEffect(() => {
    const validateLink = async () => {
      try {
        await api.get('/auth/reset-password-validate/', {
          params: { uid, token },
        });
      } catch (err) {
        const msg =
          err.response?.data?.message || '링크가 만료되었거나 유효하지 않습니다.';
        setError(msg);
      }
    };

    if (!uid || !token) {
      setError('잘못된 접근입니다.');
    } else {
      validateLink();
    }
  }, [uid, token]);

  const handleReset = async () => {
    try {
      await api.post('/auth/reset-password-confirm/', {
        uid,
        token,
        new_password: newPassword,
      });
      setMessage('비밀번호가 성공적으로 변경되었습니다.');
      setError('');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      const msg =
        err.response?.data?.message || '비밀번호 재설정에 실패했습니다.';
      setError(msg);
      setMessage('');
    }
  };

  return (
    <Container>
      <Title>비밀번호 재설정</Title>
      {error ? (
        <Text type="error">{error}</Text>
      ) : (
        <Form>
          <Input
            type="password"
            placeholder="새 비밀번호"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Button onClick={handleReset}>비밀번호 변경</Button>
          {message && <Text type="success">{message}</Text>}
        </Form>
      )}
    </Container>
  );
}

export default ResetPasswordConfirm;
