import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/axios';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
    <div>
      <h1>로그인</h1>
      <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="아이디" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호" />
      <button onClick={handleLogin}>로그인</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Login;
