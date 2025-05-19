// src/pages/Login.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    localStorage.setItem('token', 'mock-token');
    navigate('/main');
  };

  return (
    <div>
      <h1>로그인 페이지</h1>
      <button onClick={handleLogin}>로그인</button>
    </div>
  );
}

export default Login;
