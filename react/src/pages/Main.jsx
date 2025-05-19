import React from 'react';
import { useNavigate } from 'react-router-dom';

function Main() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div>
      <h1>메인 페이지 (로그인된 사용자만 접근 가능)</h1>
      <button onClick={handleLogout}>로그아웃</button>
    </div>
  );
}

export default Main;
