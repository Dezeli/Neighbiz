import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/axios';

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
    <div>
      <h1>비밀번호 재설정</h1>
      <input
        type="email"
        placeholder="이메일 주소"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleSend}>재설정 링크 전송</button>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default ResetPassword;
