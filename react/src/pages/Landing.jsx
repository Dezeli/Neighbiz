import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled, { keyframes, createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Pretendard:wght@300;400;500;600;700;800;900&display=swap');
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    line-height: 1.6;
    color: #1a1a1a;
    overflow-x: hidden;
  }

  html {
    scroll-behavior: smooth;
  }
`;

// Animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeInDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const gradientMove = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

// Main Container
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(-45deg, #1a1a1a, #2d3748, #4a5568, #6b7280);
  background-size: 400% 400%;
  animation: ${gradientMove} 20s ease infinite;
  position: relative;
  overflow: hidden;
`;

// Header
const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &.scrolled {
    background: rgba(255, 255, 255, 0.98);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;

  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 800;
  color: #1a1a1a;
  letter-spacing: -0.02em;
  
  span {
    color: #4a5568;
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 32px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled.a`
  color: #4a5568;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    color: #1a1a1a;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 2px;
    background: #1a1a1a;
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 100%;
  }
`;

// Hero Section
const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 100px 20px 50px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 1;
  }

  @media (max-width: 768px) {
    padding: 80px 16px 40px;
  }
`;

const HeroContent = styled.div`
  max-width: 1200px;
  width: 100%;
  text-align: center;
  position: relative;
  z-index: 2;
`;

const HeroTitle = styled.h1`
  font-size: 4rem;
  font-weight: 900;
  color: white;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  letter-spacing: -0.02em;
  animation: ${fadeInUp} 1s ease;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.9);
  max-width: 600px;
  margin: 0 auto 3rem;
  line-height: 1.6;
  animation: ${fadeInUp} 1s ease 0.2s both;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 2rem;
  }
`;

const HeroButtons = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
  animation: ${fadeInUp} 1s ease 0.4s both;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
  }
`;

const Button = styled(Link)`
  padding: 16px 32px;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 8px;
  text-decoration: none;
  text-align: center;
  min-width: 160px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  border: 2px solid transparent;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transition: left 0.5s ease;
  }

  &:hover::before {
    left: 100%;
  }

  @media (max-width: 480px) {
    min-width: 280px;
  }
`;

const PrimaryButton = styled(Button)`
  background: linear-gradient(135deg, #1a1a1a, #374151);
  color: white;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.4);
    background: linear-gradient(135deg, #000000, #1a1a1a);
  }

  &:active {
    transform: translateY(0);
  }
`;

const SecondaryButton = styled(Button)`
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-2px);
  }
`;

// Features Section
const FeaturesSection = styled.section`
  padding: 120px 20px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  position: relative;

  @media (max-width: 768px) {
    padding: 80px 16px;
  }
`;

const SectionContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-size: 2.8rem;
  font-weight: 800;
  text-align: center;
  color: #1a1a1a;
  margin-bottom: 1rem;
  animation: ${fadeInUp} 1s ease;

  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 1.2rem;
  color: #64748b;
  text-align: center;
  max-width: 600px;
  margin: 0 auto 4rem;
  animation: ${fadeInUp} 1s ease 0.2s both;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 3rem;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  margin-top: 4rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
`;

const FeatureCard = styled.div`
  background: white;
  padding: 40px 30px;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  animation: ${fadeInUp} 1s ease 0.3s both;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(135deg, #1a1a1a, #374151);
  }

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  }

  &:nth-child(1) {
    animation-delay: 0.1s;
  }

  &:nth-child(2) {
    animation-delay: 0.3s;
  }

  &:nth-child(3) {
    animation-delay: 0.5s;
  }
`;

const FeatureIcon = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  background: linear-gradient(135deg, #1a1a1a, #374151);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
  animation: ${float} 3s ease-in-out infinite;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 15px;
`;

const FeatureDescription = styled.p`
  color: #64748b;
  line-height: 1.6;
  font-size: 1rem;
`;

// Stats Section
const StatsSection = styled.section`
  padding: 100px 20px;
  background: linear-gradient(135deg, #1a1a1a, #374151);
  color: white;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
    background-size: 50px 50px;
    animation: ${float} 20s ease-in-out infinite;
  }

  @media (max-width: 768px) {
    padding: 80px 16px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const StatItem = styled.div`
  text-align: center;
  animation: ${fadeInUp} 1s ease 0.2s both;

  &:nth-child(1) { animation-delay: 0.1s; }
  &:nth-child(2) { animation-delay: 0.3s; }
  &:nth-child(3) { animation-delay: 0.5s; }
  &:nth-child(4) { animation-delay: 0.7s; }
`;

const StatNumber = styled.div`
  font-size: 3rem;
  font-weight: 900;
  margin-bottom: 10px;
  background: linear-gradient(45deg, #ffffff, #d1d5db);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${pulse} 2s ease-in-out infinite;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const StatLabel = styled.div`
  font-size: 1.1rem;
  opacity: 0.9;
  font-weight: 500;
`;

// How It Works Section
const HowItWorksSection = styled.section`
  padding: 120px 20px;
  background: white;
  position: relative;

  @media (max-width: 768px) {
    padding: 80px 16px;
  }
`;

const ProcessGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 50px;
  margin-top: 4rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const ProcessStep = styled.div`
  text-align: center;
  position: relative;
  animation: ${fadeInUp} 1s ease 0.2s both;

  &:nth-child(1) { animation-delay: 0.1s; }
  &:nth-child(2) { animation-delay: 0.3s; }
  &:nth-child(3) { animation-delay: 0.5s; }

  &::after {
    content: '';
    position: absolute;
    top: 40px;
    right: -25px;
    width: 50px;
    height: 2px;
    background: linear-gradient(135deg, #1a1a1a, #374151);
    display: ${props => props.isLast ? 'none' : 'block'};

    @media (max-width: 768px) {
      display: none;
    }
  }
`;

const StepNumber = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1a1a1a, #374151);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 auto 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
`;

const StepTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 15px;
`;

const StepDescription = styled.p`
  color: #64748b;
  line-height: 1.6;
`;

// Testimonials Section
const TestimonialsSection = styled.section`
  padding: 120px 20px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);

  @media (max-width: 768px) {
    padding: 80px 16px;
  }
`;

const TestimonialsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  margin-top: 4rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
`;

const TestimonialCard = styled.div`
  background: white;
  padding: 40px 30px;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  position: relative;
  animation: ${fadeInUp} 1s ease 0.2s both;

  &:nth-child(1) { animation-delay: 0.1s; }
  &:nth-child(2) { animation-delay: 0.3s; }
  &:nth-child(3) { animation-delay: 0.5s; }

  &::before {
    content: '"';
    position: absolute;
    top: -20px;
    left: 30px;
    font-size: 5rem;
    color: #9ca3af;
    font-family: serif;
    opacity: 0.5;
  }
`;

const TestimonialText = styled.p`
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 25px;
  font-style: italic;
`;

const TestimonialAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const AuthorAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1a1a1a, #374151);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
`;

const AuthorInfo = styled.div``;

const AuthorName = styled.div`
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 2px;
`;

const AuthorTitle = styled.div`
  color: #64748b;
  font-size: 0.9rem;
`;

// CTA Section
const CTASection = styled.section`
  padding: 100px 20px;
  background: linear-gradient(135deg, #111827, #1f2937);
  color: white;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
  }

  @media (max-width: 768px) {
    padding: 80px 16px;
  }
`;

const CTAContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
`;

const CTATitle = styled.h2`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  animation: ${fadeInUp} 1s ease;

  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const CTAText = styled.p`
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 3rem;
  line-height: 1.6;
  animation: ${fadeInUp} 1s ease 0.2s both;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
  animation: ${fadeInUp} 1s ease 0.4s both;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
  }
`;

// Footer
const Footer = styled.footer`
  background: #0f172a;
  color: white;
  padding: 60px 20px 20px;

  @media (max-width: 768px) {
    padding: 40px 16px 20px;
  }
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
`;

const FooterSection = styled.div``;

const FooterTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 20px;
  color: #9ca3af;
`;

const FooterText = styled.p`
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 15px;
`;

const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FooterLink = styled.a`
  color: #6b7280;
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: #9ca3af;
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid #374151;
  padding-top: 20px;
  text-align: center;
  color: #6b7280;
  font-size: 0.9rem;
`;

// Floating Elements
const FloatingElement = styled.div`
  position: absolute;
  width: ${props => props.size || '20px'};
  height: ${props => props.size || '20px'};
  background: ${props => props.color || 'rgba(255, 255, 255, 0.05)'};
  border-radius: 50%;
  top: ${props => props.top || '50%'};
  left: ${props => props.left || '50%'};
  animation: ${float} ${props => props.duration || '3s'} ease-in-out infinite;
  animation-delay: ${props => props.delay || '0s'};
`;

function Landing() {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (location.pathname === '/' && token) {
      navigate('/main', { replace: true });
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname, navigate]);

  return (
    <>
      <GlobalStyle />
      <Container>
        {/* Floating Elements */}
        <FloatingElement size="60px" top="10%" left="10%" duration="4s" delay="0s" />
        <FloatingElement size="40px" top="20%" left="80%" duration="3s" delay="1s" />
        <FloatingElement size="80px" top="60%" left="5%" duration="5s" delay="2s" />
        <FloatingElement size="30px" top="70%" left="90%" duration="3.5s" delay="0.5s" />
        <FloatingElement size="50px" top="30%" left="70%" duration="4.5s" delay="1.5s" />

        {/* Header */}
        <Header className={scrolled ? 'scrolled' : ''}>
          <HeaderContent>
            <Logo>
              Neigh<span>viz</span>
            </Logo>
            <Nav>
              <NavLink href="#features">서비스</NavLink>
              <NavLink href="#how-it-works">이용방법</NavLink>
              <NavLink href="#testimonials">후기</NavLink>
              <NavLink href="#contact">문의</NavLink>
            </Nav>
          </HeaderContent>
        </Header>

        {/* Hero Section */}
        <HeroSection>
          <HeroContent>
            <HeroTitle>Neighviz에 오신 것을<br />환영합니다</HeroTitle>
            <HeroSubtitle>
              검증된 사업자 간 제휴를 빠르고 신뢰 있게 연결합니다.<br />
              지금 Neighviz에서 제휴 파트너를 만나보세요.
            </HeroSubtitle>
            <HeroButtons>
              <PrimaryButton to="/signup">무료로 시작하기</PrimaryButton>
              <SecondaryButton to="/login">기존 계정으로 로그인</SecondaryButton>
            </HeroButtons>
          </HeroContent>
        </HeroSection>

        {/* Features Section */}
        <FeaturesSection id="features">
          <SectionContainer>
            <SectionTitle>왜 Neighviz를 선택해야 할까요?</SectionTitle>
            <SectionSubtitle>
              검증된 기술과 신뢰할 수 있는 시스템으로 더 나은 비즈니스 파트너십을 경험하세요
            </SectionSubtitle>
            <FeaturesGrid>
              <FeatureCard>
                <FeatureIcon>🤝</FeatureIcon>
                <FeatureTitle>검증된 사업자 매칭</FeatureTitle>
                <FeatureDescription>
                  엄격한 검증 프로세스를 통해 신뢰할 수 있는 사업자들만을 연결합니다. 
                  사업자등록증, 실적, 평점 등 다양한 기준으로 검증된 파트너와 만나세요.
                </FeatureDescription>
              </FeatureCard>
              <FeatureCard>
                <FeatureIcon>⚡</FeatureIcon>
                <FeatureTitle>빠른 매칭 시스템</FeatureTitle>
                <FeatureDescription>
                  AI 기반 매칭 알고리즘으로 귀하의 비즈니스에 최적화된 파트너를 
                  빠르게 찾아드립니다. 평균 24시간 이내 매칭 결과를 확인하세요.
                </FeatureDescription>
              </FeatureCard>
              <FeatureCard>
                <FeatureIcon>🔒</FeatureIcon>
                <FeatureTitle>안전한 거래 환경</FeatureTitle>
                <FeatureDescription>
                  블록체인 기반 스마트 컨트랙트와 에스크로 시스템으로 
                  안전하고 투명한 거래 환경을 제공합니다. 분쟁 해결 시스템도 완비되어 있습니다.
                </FeatureDescription>
              </FeatureCard>
            </FeaturesGrid>
          </SectionContainer>
        </FeaturesSection>

        {/* Stats Section */}
        <StatsSection>
          <SectionContainer>
            <StatsGrid>
              <StatItem>
                <StatNumber>15,000+</StatNumber>
                <StatLabel>검증된 사업자</StatLabel>
              </StatItem>
              <StatItem>
                <StatNumber>98%</StatNumber>
                <StatLabel>매칭 성공률</StatLabel>
              </StatItem>
              <StatItem>
                <StatNumber>4.9/5</StatNumber>
                <StatLabel>평균 만족도</StatLabel>
              </StatItem>
              <StatItem>
                <StatNumber>24시간</StatNumber>
                <StatLabel>평균 응답시간</StatLabel>
              </StatItem>
            </StatsGrid>
          </SectionContainer>
        </StatsSection>

        {/* How It Works Section */}
        <HowItWorksSection id="how-it-works">
          <SectionContainer>
            <SectionTitle>어떻게 이용하나요?</SectionTitle>
            <SectionSubtitle>
              간단한 3단계로 완벽한 비즈니스 파트너를 찾아보세요
            </SectionSubtitle>
            <ProcessGrid>
              <ProcessStep>
                <StepNumber>1</StepNumber>
                <StepTitle>프로필 등록</StepTitle>
                <StepDescription>
                  귀하의 사업 정보와 필요한 제휴 형태를 등록하세요. 
                  사업자등록증과 기본 정보만 있으면 5분 만에 완료됩니다.
                </StepDescription>
              </ProcessStep>
              <ProcessStep>
                <StepNumber>2</StepNumber>
                <StepTitle>AI 매칭</StepTitle>
                <StepDescription>
                  우리의 AI가 귀하의 비즈니스 모델과 목표에 가장 적합한 
                  파트너 후보들을 자동으로 선별하여 추천해드립니다.
                </StepDescription>
              </ProcessStep>
              <ProcessStep isLast>
                <StepNumber>3</StepNumber>
                <StepTitle>안전한 계약</StepTitle>
                <StepDescription>
                  관심 있는 파트너와 직접 소통하고, 플랫폼 내에서 
                  안전하게 계약을 진행하세요. 모든 과정이 투명하게 기록됩니다.
                </StepDescription>
              </ProcessStep>
            </ProcessGrid>
          </SectionContainer>
        </HowItWorksSection>

        {/* Testimonials Section */}
        <TestimonialsSection id="testimonials">
          <SectionContainer>
            <SectionTitle>고객 후기</SectionTitle>
            <SectionSubtitle>
              실제 사용자들의 생생한 경험담을 들어보세요
            </SectionSubtitle>
            <TestimonialsGrid>
              <TestimonialCard>
                <TestimonialText>
                  "Neighviz 덕분에 우리 카페 체인의 완벽한 공급업체를 찾을 수 있었습니다. 
                  검증된 업체들만 추천해주니 안심하고 거래할 수 있어요."
                </TestimonialText>
                <TestimonialAuthor>
                  <AuthorAvatar>김</AuthorAvatar>
                  <AuthorInfo>
                    <AuthorName>김민수</AuthorName>
                    <AuthorTitle>스타벅스 프랜차이즈 대표</AuthorTitle>
                  </AuthorInfo>
                </TestimonialAuthor>
              </TestimonialCard>
              <TestimonialCard>
                <TestimonialText>
                  "매칭 속도가 정말 빨라요. 등록한 당일에 5개 업체에서 연락이 왔고, 
                  그 중 하나와 성공적으로 파트너십을 맺을 수 있었습니다."
                </TestimonialText>
                <TestimonialAuthor>
                  <AuthorAvatar>이</AuthorAvatar>
                  <AuthorInfo>
                    <AuthorName>이지은</AuthorName>
                    <AuthorTitle>패션 스타트업 CEO</AuthorTitle>
                  </AuthorInfo>
                </TestimonialAuthor>
              </TestimonialCard>
              <TestimonialCard>
                <TestimonialText>
                  "안전한 거래 시스템이 인상적이에요. 에스크로와 스마트 컨트랙트로 
                  분쟁 걱정 없이 대규모 거래도 안심하고 진행할 수 있었습니다."
                </TestimonialText>
                <TestimonialAuthor>
                  <AuthorAvatar>박</AuthorAvatar>
                  <AuthorInfo>
                    <AuthorName>박준호</AuthorName>
                    <AuthorTitle>제조업체 구매팀장</AuthorTitle>
                  </AuthorInfo>
                </TestimonialAuthor>
              </TestimonialCard>
            </TestimonialsGrid>
          </SectionContainer>
        </TestimonialsSection>

        {/* Additional Features Section */}
        <FeaturesSection style={{background: 'white'}}>
          <SectionContainer>
            <SectionTitle>더 많은 기능들</SectionTitle>
            <SectionSubtitle>
              성공적인 비즈니스 파트너십을 위한 모든 도구가 준비되어 있습니다
            </SectionSubtitle>
            <FeaturesGrid>
              <FeatureCard>
                <FeatureIcon>📊</FeatureIcon>
                <FeatureTitle>실시간 분석 대시보드</FeatureTitle>
                <FeatureDescription>
                  매칭 현황, 거래 성과, 파트너 관계 등을 한눈에 볼 수 있는 
                  직관적인 대시보드를 제공합니다. 데이터 기반 의사결정을 도와드려요.
                </FeatureDescription>
              </FeatureCard>
              <FeatureCard>
                <FeatureIcon>💬</FeatureIcon>
                <FeatureTitle>통합 커뮤니케이션</FeatureTitle>
                <FeatureDescription>
                  채팅, 화상회의, 파일 공유 등 모든 소통 도구가 플랫폼 내에 
                  통합되어 있어 효율적인 협업이 가능합니다.
                </FeatureDescription>
              </FeatureCard>
              <FeatureCard>
                <FeatureIcon>🎯</FeatureIcon>
                <FeatureTitle>맞춤형 추천</FeatureTitle>
                <FeatureDescription>
                  머신러닝 알고리즘이 귀하의 거래 패턴과 선호도를 학습하여 
                  점점 더 정확한 파트너를 추천해드립니다.
                </FeatureDescription>
              </FeatureCard>
              <FeatureCard>
                <FeatureIcon>📱</FeatureIcon>
                <FeatureTitle>모바일 최적화</FeatureTitle>
                <FeatureDescription>
                  언제 어디서나 스마트폰으로 매칭 현황을 확인하고 
                  빠르게 응답할 수 있는 모바일 친화적 인터페이스를 제공합니다.
                </FeatureDescription>
              </FeatureCard>
              <FeatureCard>
                <FeatureIcon>🔐</FeatureIcon>
                <FeatureTitle>다단계 보안</FeatureTitle>
                <FeatureDescription>
                  2단계 인증, SSL 암호화, 정기적인 보안 감사를 통해 
                  귀하의 중요한 비즈니스 정보를 안전하게 보호합니다.
                </FeatureDescription>
              </FeatureCard>
              <FeatureCard>
                <FeatureIcon>📞</FeatureIcon>
                <FeatureTitle>24/7 고객지원</FeatureTitle>
                <FeatureDescription>
                  전담 고객지원팀이 24시간 대기하여 언제든지 도움을 드립니다. 
                  라이브 채팅, 이메일, 전화 등 다양한 채널로 지원받으세요.
                </FeatureDescription>
              </FeatureCard>
            </FeaturesGrid>
          </SectionContainer>
        </FeaturesSection>

        {/* Pricing Preview Section */}
        <StatsSection style={{background: 'linear-gradient(135deg, #374151, #111827)'}}>
          <SectionContainer>
            <SectionTitle style={{color: 'white', marginBottom: '3rem'}}>
              합리적인 가격으로 시작하세요
            </SectionTitle>
            <StatsGrid style={{maxWidth: '800px'}}>
              <StatItem>
                <StatNumber>무료</StatNumber>
                <StatLabel>기본 매칭 서비스</StatLabel>
              </StatItem>
              <StatItem>
                <StatNumber>3%</StatNumber>
                <StatLabel>성공 수수료만</StatLabel>
              </StatItem>
              <StatItem>
                <StatNumber>30일</StatNumber>
                <StatLabel>무료 체험</StatLabel>
              </StatItem>
            </StatsGrid>
          </SectionContainer>
        </StatsSection>

        {/* Industries Section */}
        <FeaturesSection>
          <SectionContainer>
            <SectionTitle>다양한 업계에서 활용</SectionTitle>
            <SectionSubtitle>
              어떤 업종이든 Neighviz에서 최적의 파트너를 찾을 수 있습니다
            </SectionSubtitle>
            <FeaturesGrid>
              <FeatureCard>
                <FeatureIcon>🏪</FeatureIcon>
                <FeatureTitle>소매/유통</FeatureTitle>
                <FeatureDescription>
                  공급업체, 물류업체, 마케팅 에이전시 등 
                  소매업에 필요한 모든 파트너를 연결해드립니다.
                </FeatureDescription>
              </FeatureCard>
              <FeatureCard>
                <FeatureIcon>🏭</FeatureIcon>
                <FeatureTitle>제조업</FeatureTitle>
                <FeatureDescription>
                  원자재 공급업체, OEM/ODM 파트너, 품질관리업체 등 
                  제조업 생태계 전반의 파트너를 매칭합니다.
                </FeatureDescription>
              </FeatureCard>
              <FeatureCard>
                <FeatureIcon>💻</FeatureIcon>
                <FeatureTitle>IT/테크</FeatureTitle>
                <FeatureDescription>
                  개발업체, 디자인 스튜디오, 마케팅 전문가 등 
                  디지털 프로젝트에 필요한 전문가를 찾아드립니다.
                </FeatureDescription>
              </FeatureCard>
              <FeatureCard>
                <FeatureIcon>🍽️</FeatureIcon>
                <FeatureTitle>식음료</FeatureTitle>
                <FeatureDescription>
                  식자재 공급업체, 포장재업체, 배달업체 등 
                  F&B 비즈니스의 모든 파트너를 연결해드립니다.
                </FeatureDescription>
              </FeatureCard>
              <FeatureCard>
                <FeatureIcon>🏥</FeatureIcon>
                <FeatureTitle>헬스케어</FeatureTitle>
                <FeatureDescription>
                  의료기기업체, 제약회사, 의료 서비스 제공업체 등 
                  헬스케어 전문 파트너를 매칭합니다.
                </FeatureDescription>
              </FeatureCard>
              <FeatureCard>
                <FeatureIcon>🎓</FeatureIcon>
                <FeatureTitle>교육</FeatureTitle>
                <FeatureDescription>
                  교육 콘텐츠 제작사, 플랫폼 개발업체, 마케팅 전문가 등 
                  에듀테크 생태계의 모든 파트너를 연결합니다.
                </FeatureDescription>
              </FeatureCard>
            </FeaturesGrid>
          </SectionContainer>
        </FeaturesSection>

        {/* CTA Section */}
        <CTASection id="contact">
          <CTAContent>
            <CTATitle>지금 바로 시작하세요</CTATitle>
            <CTAText>
              수천 개의 검증된 사업자들이 기다리고 있습니다.<br />
              완벽한 비즈니스 파트너를 찾는 여정을 지금 시작해보세요.
            </CTAText>
            <CTAButtons>
              <PrimaryButton to="/signup">무료로 가입하기</PrimaryButton>
              <SecondaryButton to="/login">데모 보기</SecondaryButton>
            </CTAButtons>
          </CTAContent>
        </CTASection>

        {/* Footer */}
        <Footer>
          <FooterContent>
            <FooterSection>
              <FooterTitle>Neighviz</FooterTitle>
              <FooterText>
                검증된 사업자 간 제휴를 연결하는 
                혁신적인 B2B 매칭 플랫폼입니다.
              </FooterText>
              <FooterText>
                📧 contact@neighviz.com<br />
                📞 1588-1234<br />
                🏢 서울시 강남구 테헤란로 123
              </FooterText>
            </FooterSection>
            <FooterSection>
              <FooterTitle>서비스</FooterTitle>
              <FooterLinks>
                <FooterLink href="#features">파트너 매칭</FooterLink>
                <FooterLink href="#features">스마트 컨트랙트</FooterLink>
                <FooterLink href="#features">거래 관리</FooterLink>
                <FooterLink href="#features">분석 리포트</FooterLink>
              </FooterLinks>
            </FooterSection>
            <FooterSection>
              <FooterTitle>회사</FooterTitle>
              <FooterLinks>
                <FooterLink href="#about">회사소개</FooterLink>
                <FooterLink href="#team">팀</FooterLink>
                <FooterLink href="#careers">채용</FooterLink>
                <FooterLink href="#news">뉴스</FooterLink>
              </FooterLinks>
            </FooterSection>
            <FooterSection>
              <FooterTitle>지원</FooterTitle>
              <FooterLinks>
                <FooterLink href="#help">도움말</FooterLink>
                <FooterLink href="#faq">FAQ</FooterLink>
                <FooterLink href="#contact">문의하기</FooterLink>
                <FooterLink href="#api">API 문서</FooterLink>
              </FooterLinks>
            </FooterSection>
          </FooterContent>
          <FooterBottom>
            © 2024 Neighviz. All rights reserved. | 
            <FooterLink href="#privacy" style={{marginLeft: '8px'}}>개인정보처리방침</FooterLink> | 
            <FooterLink href="#terms" style={{marginLeft: '8px'}}>이용약관</FooterLink>
          </FooterBottom>
        </Footer>
      </Container>
    </>
  );
}

export default Landing;