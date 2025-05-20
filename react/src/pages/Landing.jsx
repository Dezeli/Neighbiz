import React from 'react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      navigate('/main', { replace: true });
    }
  }, []);

  return (
    <div>
      <h1>👋 환영합니다!</h1>
      <p>로그인하지 않았다면 이 화면이 보입니다.</p>
      <Link to="/login">로그인</Link> | <Link to="/signup">회원가입</Link>
    </div>
  );
}

export default Landing;
