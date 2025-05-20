import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../lib/axios';

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
    <div>
      <h1>비밀번호 재설정</h1>
      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <>
          <input
            type="password"
            placeholder="새 비밀번호"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button onClick={handleReset}>비밀번호 변경</button>
          {message && <p style={{ color: 'green' }}>{message}</p>}
        </>
      )}
    </div>
  );
}

export default ResetPasswordConfirm;
