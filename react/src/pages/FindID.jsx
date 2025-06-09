import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import api from '../lib/axios';
import { extractFirstError } from '../utils/error';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f9fafb;
`;

const Card = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.25rem;
  font-weight: 600;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  &:disabled {
    background-color: #93c5fd;
    cursor: not-allowed;
  }
`;

const Message = styled.p`
  margin-top: 1rem;
  color: ${({ type }) => (type === 'error' ? 'red' : 'green')};
  font-weight: 500;
  text-align: center;
`;

function FindID() {
  const [form, setForm] = useState({
    email: '',
    phone_number: '',
  });
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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

  const handleFind = async () => {
    if (!form.email.trim()) {
      setError('이메일을 입력해주세요.');
      return;
    }
    if (!form.phone_number.trim()) {
      setError('전화번호를 입력해주세요.');
      return;
    }

    setError('');
    setResult('');
    setLoading(true);

    try {
      const res = await api.post('/auth/find-id/', form);
      setResult(`당신의 아이디: ${res.data.data.username}`);
    } catch (err) {
      setError(extractFirstError(err, '아이디 찾기 실패'));
      setResult('');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleFind();
    }
  };

  return (
    <Container>
      <Card>
        <Title>아이디 찾기</Title>
        <Label>이메일</Label>
        <Input name="email" value={form.email} onChange={handleChange} onKeyPress={handleKeyPress} />
        <Label>전화번호</Label>
        <Input name="phone_number" value={form.phone_number} onChange={handleChange} onKeyPress={handleKeyPress} />
        <Button onClick={handleFind} disabled={loading}>
          {loading ? '처리 중...' : '아이디 찾기'}
        </Button>
        {error && <Message type="error">{error}</Message>}
        {result && <Message type="success">{result}</Message>}
      </Card>
    </Container>
  );
}

export default FindID;
