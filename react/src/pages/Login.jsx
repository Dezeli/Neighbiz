import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import api from '../lib/axios';
import { extractFirstError } from '../utils/error';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  align-items: center;
  justify-content: center;
`;

const Card = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-top: 0.5rem;
`;

const Label = styled.label`
  display: block;
  margin-top: 1rem;
  font-weight: 600;
`;

const Button = styled.button`
  width: 100%;
  margin-top: 1.5rem;
  padding: 0.75rem;
  background: #374151;
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const Message = styled.div`
  margin-top: 1rem;
  padding: 0.75rem;
  border-radius: 8px;
  color: ${({ type }) => (type === 'error' ? '#dc2626' : '#16a34a')};
  background-color: ${({ type }) => (type === 'error' ? '#fee2e2' : '#d1fae5')};
  font-weight: 500;
`;

function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) navigate('/main');
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    if (!form.username.trim()) {
      setError('아이디를 입력해주세요.');
      return;
    }
    if (!form.password.trim()) {
      setError('비밀번호를 입력해주세요.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login/', form);
      const { access, refresh } = res.data.data;
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      navigate('/main');
    } catch (err) {
      setError(extractFirstError(err, '로그인에 실패했습니다.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Card>
        <Title>로그인</Title>
        <Label htmlFor="username">아이디</Label>
        <Input
          id="username"
          name="username"
          value={form.username}
          onChange={handleChange}
        />
        <Label htmlFor="password">비밀번호</Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
        />
        {error && <Message type="error">{error}</Message>}
        <Button onClick={handleLogin} disabled={loading}>
          {loading ? '로그인 중...' : '로그인'}
        </Button>
      </Card>
    </Container>
  );
}

export default Login;
