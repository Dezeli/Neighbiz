import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1rem;
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

function ResetPasswordConfirm() {
  const [params] = useSearchParams();
  const uid = params.get('uid');
  const token = params.get('token');
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);

  useEffect(() => {
    const validateLink = async () => {
      setValidating(true);
      try {
        await api.get('/auth/reset-password-validate/', {
          params: { uid, token },
        });
      } catch (err) {
        setError(extractFirstError(err, '비밀번호 재설정 링크가 유효하지 않습니다.'));
      } finally {
        setValidating(false);
      }
    };

    if (!uid || !token) {
      setError('잘못된 접근입니다. 링크가 올바르지 않습니다.');
      setValidating(false);
    } else {
      validateLink();
    }
  }, [uid, token]);

  const handleReset = async () => {
    if (!newPassword.trim()) {
      setError('새 비밀번호를 입력해주세요.');
      return;
    }
    if (newPassword.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }
    if (!confirmPassword.trim()) {
      setError('비밀번호 확인란을 입력해주세요.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setError('');
    setMessage('');
    setLoading(true);

    try {
      await api.post('/auth/reset-password-confirm/', {
        uid,
        token,
        new_password: newPassword,
      });

      setMessage('비밀번호가 성공적으로 변경되었습니다.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(extractFirstError(err, '비밀번호 재설정에 실패했습니다.'));
    } finally {
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <Container>
        <Card>
          <p>링크 유효성 검사 중...</p>
        </Card>
      </Container>
    );
  }

  // 링크 오류 등으로 접근 불가
  if (error && !message) {
    return (
      <Container>
        <Card>
          <Message type="error">{error}</Message>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <Card>
        <Title>비밀번호 재설정</Title>

        <Label htmlFor="new-password">새 비밀번호</Label>
        <Input
          id="new-password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="6자 이상 입력"
        />

        <Label htmlFor="confirm-password">비밀번호 확인</Label>
        <Input
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="다시 한 번 입력"
        />

        {error && <Message type="error">{error}</Message>}
        {message && <Message type="success">{message}</Message>}

        <Button onClick={handleReset} disabled={loading}>
          {loading ? '처리 중...' : '비밀번호 변경 완료'}
        </Button>
      </Card>
    </Container>
  );
}

export default ResetPasswordConfirm;