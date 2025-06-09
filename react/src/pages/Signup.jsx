import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import api from '../lib/axios';
import { extractFirstError } from '../utils/error';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  position: relative;
  overflow: hidden;
`;

const Sidebar = styled.div`
  flex: 1;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 4rem 3rem;
`;

const Main = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06),
    0 0 0 1px rgba(0, 0, 0, 0.05);
  padding: 3rem 2.5rem;
  width: 100%;
  max-width: 480px;
`;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #6b7280;
  font-size: 1rem;
`;

const Form = styled.div`
  margin-top: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1.5px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 400;
  color: #111827;
  background: white;
  &:focus {
    border-color: #374151;
    outline: none;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 0.875rem 1rem;
  background: linear-gradient(135deg, #374151 0%, #4b5563 100%);
  color: white;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 0.5rem;
  &:hover {
    background: linear-gradient(135deg, #4b5563 0%, #6b7280 100%);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Message = styled.div`
  padding: 0.75rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  margin-top: 0.75rem;
  color: ${({ type }) => (type === 'error' ? '#dc2626' : type === 'success' ? '#16a34a' : '#0284c7')};
  background: ${({ type }) =>
    type === 'error'
      ? '#fef2f2'
      : type === 'success'
      ? '#f0fdf4'
      : '#f0f9ff'};
  border: 1px solid
    ${({ type }) =>
      type === 'error'
        ? '#fecaca'
        : type === 'success'
        ? '#bbf7d0'
        : '#bae6fd'};
`;

function Signup() {
  const [form, setForm] = useState({
    username: '',
    name: '',
    email: '',
    phone_number: '',
    password: '',
    image_url: '',
  });
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      navigate('/main', { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    const requiredFields = {
      username: '아이디를 입력해주세요.',
      email: '이메일을 입력해주세요.',
      password: '비밀번호를 입력해주세요.',
    };

    for (const [field, message] of Object.entries(requiredFields)) {
      if (!form[field].trim()) {
        setError(message);
        return;
      }
    }

    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/signup/', form);
      setSuccessMsg(res.data.message);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(extractFirstError(err, '회원가입 중 오류가 발생했습니다.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Sidebar>
        <h1 style={{ color: 'white', fontSize: '2rem' }}>Neighviz</h1>
        <p style={{ color: 'white' }}>파트너십 시작하기</p>
      </Sidebar>
      <Main>
        <Card>
          <Title>회원가입</Title>
          <Subtitle>Neighviz 계정을 생성하세요</Subtitle>
          <Form>
            <FormGroup>
              <Label htmlFor="username">아이디 *</Label>
              <Input
                id="username"
                name="username"
                value={form.username}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="name">이름 *</Label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="email">이메일 *</Label>
              <Input
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="phone_number">전화번호</Label>
              <Input
                id="phone_number"
                name="phone_number"
                value={form.phone_number}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="password">비밀번호 *</Label>
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
              />
            </FormGroup>

            {error && <Message type="error">{error}</Message>}
            {successMsg && <Message type="success">{successMsg}</Message>}

            <Button onClick={handleSignup} disabled={loading}>
              {loading ? '가입 처리 중...' : '회원가입 완료'}
            </Button>
          </Form>
        </Card>
      </Main>
    </Container>
  );
}

export default Signup;