import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  padding: 0 20px;
  background: linear-gradient(to right, #f8fafc, #e2e8f0);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: 'Pretendard', sans-serif;

  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 1rem;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #4b5563;
  text-align: center;
  max-width: 480px;
  line-height: 1.6;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
`;

const Button = styled(Link)`
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 6px;
  text-decoration: none;
  text-align: center;
  min-width: 120px;
  transition: all 0.2s ease;
`;

const SignupButton = styled(Button)`
  background-color: #2563eb;
  color: white;

  &:hover {
    background-color: #1d4ed8;
  }
`;

const LoginButton = styled(Button)`
  border: 2px solid #2563eb;
  color: #2563eb;

  &:hover {
    background-color: #e0f2fe;
  }
`;

function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      navigate('/main', { replace: true });
    }
  }, []);

  return (
    <Container>
      <Title>Neighviz에 오신 것을 환영합니다</Title>
      <Subtitle>
        검증된 사업자 간 제휴를 빠르고 신뢰 있게 연결합니다.
        <br />
        지금 Neighviz에서 제휴 파트너를 만나보세요.
      </Subtitle>
      <ButtonGroup>
        <SignupButton to="/signup">회원가입</SignupButton>
        <LoginButton to="/login">로그인</LoginButton>
      </ButtonGroup>
    </Container>
  );
}

export default Landing;
