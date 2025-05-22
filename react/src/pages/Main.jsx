import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  padding: 40px 20px;
  background: linear-gradient(to right, #f8fafc, #e2e8f0);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: 'Pretendard', sans-serif;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 2rem;
  text-align: center;
`;

const LogoutButton = styled.button`
  padding: 12px 24px;
  background-color: #2563eb;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #1d4ed8;
  }
`;

function Main() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/');
  };

  return (
    <Container>
      <Title>메인 페이지 (로그인된 사용자만 접근 가능)</Title>
      <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
    </Container>
  );
}

export default Main;
