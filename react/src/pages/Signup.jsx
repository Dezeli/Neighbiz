import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import api from '../lib/axios';
import { extractFirstError } from '../utils/error';

const GlobalStyle = createGlobalStyle`
 * {
   margin: 0;
   padding: 0;
   box-sizing: border-box;
 }

 body {
   font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
   line-height: 1.6;
   color: #1a1a1a;
   overflow-x: hidden;
 }

 html {
   scroll-behavior: smooth;
 }

 button {
   border: none;
   cursor: pointer;
   font-family: inherit;
 }

 a {
   text-decoration: none;
   color: inherit;
 }
`;

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

const fadeIn = keyframes`
 from {
   opacity: 0;
 }
 to {
   opacity: 1;
 }
`;

const float = keyframes`
 0%, 100% {
   transform: translateY(0px) rotate(0deg);
 }
 25% {
   transform: translateY(-20px) rotate(5deg);
 }
 50% {
   transform: translateY(-10px) rotate(-5deg);
 }
 75% {
   transform: translateY(-30px) rotate(3deg);
 }
`;

const gradientShift = keyframes`
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

const shimmer = keyframes`
 0% {
   background-position: -200px 0;
 }
 100% {
   background-position: calc(200px + 100%) 0;
 }
`;

const pulse = keyframes`
 0% {
   box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
 }
 70% {
   box-shadow: 0 0 0 20px rgba(59, 130, 246, 0);
 }
 100% {
   box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
 }
`;

const Container = styled.div`
 min-height: 100vh;
 display: flex;
 position: relative;
 background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
 background-size: 400% 400%;
 animation: ${gradientShift} 15s ease infinite;
 overflow: hidden;
`;

const FloatingElement = styled.div`
 position: absolute;
 width: ${props => props.size};
 height: ${props => props.size};
 background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.3));
 border-radius: 50%;
 backdrop-filter: blur(10px);
 border: 1px solid rgba(255,255,255,0.2);
 top: ${props => props.top};
 left: ${props => props.left};
 animation: ${float} ${props => props.duration} ease-in-out infinite;
 animation-delay: ${props => props.delay};
 z-index: 1;
`;

const Sidebar = styled.div`
 flex: 1;
 display: flex;
 flex-direction: column;
 justify-content: center;
 align-items: center;
 padding: 4rem 2rem;
 position: relative;
 z-index: 2;
 color: white;
 text-align: center;

 @media (max-width: 768px) {
   display: none;
 }
`;

const BrandSection = styled.div`
 animation: ${slideInLeft} 1s ease-out;
 max-width: 500px;
`;

const Logo = styled.div`
 font-size: 3rem;
 font-weight: 800;
 margin-bottom: 2rem;
 letter-spacing: -0.02em;
 text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);

 span {
   color: #fbbf24;
 }
`;

const BrandTitle = styled.h1`
 font-size: 2.5rem;
 font-weight: 800;
 margin-bottom: 1.5rem;
 line-height: 1.2;
 text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
`;

const BrandSubtitle = styled.p`
 font-size: 1.2rem;
 margin-bottom: 2rem;
 opacity: 0.9;
 line-height: 1.6;
 text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
`;

const SignupSteps = styled.div`
 display: flex;
 flex-direction: column;
 gap: 1.5rem;
 margin-top: 3rem;
`;

const StepItem = styled.div`
 display: flex;
 align-items: center;
 gap: 1.5rem;
 padding: 1.5rem;
 background: rgba(255, 255, 255, 0.1);
 backdrop-filter: blur(10px);
 border-radius: 16px;
 border: 1px solid rgba(255, 255, 255, 0.2);
 transition: all 0.3s ease;

 &:hover {
   background: rgba(255, 255, 255, 0.15);
   transform: translateY(-5px);
 }
`;

const StepNumber = styled.div`
 width: 50px;
 height: 50px;
 background: linear-gradient(135deg, #3b82f6, #1d4ed8);
 border-radius: 50%;
 display: flex;
 align-items: center;
 justify-content: center;
 font-weight: 800;
 font-size: 1.2rem;
 color: white;
 flex-shrink: 0;
 box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
`;

const StepContent = styled.div`
 flex: 1;
`;

const StepTitle = styled.h3`
 font-size: 1.1rem;
 font-weight: 700;
 margin-bottom: 0.5rem;
 color: white;
`;

const StepDescription = styled.p`
 font-size: 0.95rem;
 color: rgba(255, 255, 255, 0.8);
 line-height: 1.4;
`;

const BenefitsGrid = styled.div`
 display: grid;
 grid-template-columns: repeat(2, 1fr);
 gap: 1rem;
 margin-top: 2rem;
`;

const BenefitItem = styled.div`
 padding: 1rem;
 background: rgba(255, 255, 255, 0.08);
 border-radius: 12px;
 border: 1px solid rgba(255, 255, 255, 0.15);
 text-align: center;
 transition: all 0.3s ease;

 &:hover {
   background: rgba(255, 255, 255, 0.12);
   transform: scale(1.02);
 }
`;

const BenefitIcon = styled.div`
 font-size: 1.8rem;
 margin-bottom: 0.5rem;
`;

const BenefitText = styled.span`
 font-size: 0.9rem;
 color: rgba(255, 255, 255, 0.9);
 font-weight: 500;
`;

const Main = styled.div`
 flex: 1;
 display: flex;
 align-items: center;
 justify-content: center;
 padding: 2rem;
 position: relative;
 z-index: 2;

 @media (max-width: 768px) {
   flex: none;
   width: 100%;
   min-height: 100vh;
 }
`;

const Card = styled.div`
 background: rgba(255, 255, 255, 0.95);
 backdrop-filter: blur(20px);
 padding: 3rem;
 border-radius: 24px;
 box-shadow: 0 25px 60px rgba(0, 0, 0, 0.15);
 border: 1px solid rgba(255, 255, 255, 0.2);
 max-width: 500px;
 width: 100%;
 position: relative;
 overflow: hidden;
 animation: ${slideInRight} 1s ease-out;

 &::before {
   content: '';
   position: absolute;
   top: 0;
   left: 0;
   right: 0;
   height: 4px;
   background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899);
 }

 @media (max-width: 768px) {
   margin: 2rem;
   padding: 2rem;
   max-width: none;
 }
`;

const CardHeader = styled.div`
 text-align: center;
 margin-bottom: 2.5rem;
`;

const Title = styled.h2`
 font-size: 2rem;
 font-weight: 800;
 color: #1f2937;
 margin-bottom: 0.5rem;
 letter-spacing: -0.02em;
`;

const Subtitle = styled.p`
 color: #6b7280;
 font-size: 1rem;
 font-weight: 500;
`;

const Form = styled.div`
 display: flex;
 flex-direction: column;
 gap: 1.5rem;
`;

const FormRow = styled.div`
 display: grid;
 grid-template-columns: 1fr 1fr;
 gap: 1rem;

 @media (max-width: 640px) {
   grid-template-columns: 1fr;
 }
`;

const FormGroup = styled.div`
 position: relative;
`;

const Label = styled.label`
 display: block;
 font-weight: 600;
 color: #374151;
 margin-bottom: 0.5rem;
 font-size: 0.95rem;
 letter-spacing: -0.01em;

 .required {
   color: #ef4444;
   margin-left: 2px;
 }
`;

const InputWrapper = styled.div`
 position: relative;
`;

const Input = styled.input`
 width: 100%;
 padding: 1rem 1.25rem;
 border: 2px solid #e5e7eb;
 border-radius: 12px;
 font-size: 1rem;
 transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
 background: white;
 color: #1f2937;

 &:focus {
   outline: none;
   border-color: #3b82f6;
   box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
   transform: translateY(-1px);
 }

 &:hover {
   border-color: #d1d5db;
 }

 &::placeholder {
   color: #9ca3af;
 }

 &:disabled {
   background: #f9fafb;
   cursor: not-allowed;
   opacity: 0.6;
 }

 &.error {
   border-color: #ef4444;
   box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1);
 }

 &.success {
   border-color: #10b981;
   box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
 }
`;

const InputIcon = styled.div`
 position: absolute;
 right: 1rem;
 top: 50%;
 transform: translateY(-50%);
 color: #9ca3af;
 font-size: 1.2rem;
 pointer-events: none;
 transition: all 0.3s ease;

 &.clickable {
   pointer-events: auto;
   cursor: pointer;
   
   &:hover {
     color: #3b82f6;
     transform: translateY(-50%) scale(1.1);
   }
 }
`;

const ValidationHint = styled.div`
 font-size: 0.85rem;
 color: #6b7280;
 margin-top: 0.5rem;
 padding-left: 0.25rem;
 
 &.error {
   color: #ef4444;
 }
 
 &.success {
   color: #10b981;
 }
`;

const PasswordStrength = styled.div`
 margin-top: 0.75rem;
`;

const StrengthBar = styled.div`
 height: 4px;
 background: #e5e7eb;
 border-radius: 2px;
 overflow: hidden;
 margin-bottom: 0.5rem;
`;

const StrengthFill = styled.div`
 height: 100%;
 transition: all 0.3s ease;
 border-radius: 2px;
 width: ${props => props.strength * 25}%;
 background: ${props => {
   if (props.strength <= 1) return '#ef4444';
   if (props.strength <= 2) return '#f59e0b';
   if (props.strength <= 3) return '#eab308';
   return '#10b981';
 }};
`;

const StrengthText = styled.div`
 font-size: 0.8rem;
 color: ${props => {
   if (props.strength <= 1) return '#ef4444';
   if (props.strength <= 2) return '#f59e0b';
   if (props.strength <= 3) return '#eab308';
   return '#10b981';
 }};
 font-weight: 500;
`;

const CheckboxGroup = styled.div`
 display: flex;
 flex-direction: column;
 gap: 1rem;
 margin: 1.5rem 0;
 padding: 1.5rem;
 background: rgba(59, 130, 246, 0.03);
 border-radius: 12px;
 border: 1px solid rgba(59, 130, 246, 0.1);
`;

const CheckboxItem = styled.label`
 display: flex;
 align-items: flex-start;
 gap: 0.75rem;
 cursor: pointer;
 font-size: 0.95rem;
 line-height: 1.5;

 input[type="checkbox"] {
   width: 18px;
   height: 18px;
   accent-color: #3b82f6;
   cursor: pointer;
   margin-top: 2px;
 }

 .required {
   color: #ef4444;
   font-weight: 600;
 }

 a {
   color: #3b82f6;
   font-weight: 500;
   text-decoration: underline;
   
   &:hover {
     color: #1d4ed8;
   }
 }
`;

const Button = styled.button`
 width: 100%;
 padding: 1rem 1.5rem;
 background: linear-gradient(135deg, #3b82f6, #1d4ed8);
 color: white;
 font-weight: 600;
 font-size: 1.1rem;
 border: none;
 border-radius: 12px;
 cursor: pointer;
 transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
 position: relative;
 overflow: hidden;
 margin-top: 0.5rem;

 &::before {
   content: '';
   position: absolute;
   top: 0;
   left: -100%;
   width: 100%;
   height: 100%;
   background: linear-gradient(
     90deg,
     transparent,
     rgba(255, 255, 255, 0.2),
     transparent
   );
   transition: left 0.5s;
 }

 &:hover::before {
   left: 100%;
 }

 &:hover {
   transform: translateY(-2px);
   box-shadow: 0 15px 35px rgba(59, 130, 246, 0.4);
 }

 &:active {
   transform: translateY(0);
 }

 &:disabled {
   background: linear-gradient(135deg, #9ca3af, #6b7280);
   cursor: not-allowed;
   transform: none;
   box-shadow: none;

   &:hover::before {
     left: -100%;
   }
 }
`;

const LoadingSpinner = styled.div`
 display: inline-block;
 width: 20px;
 height: 20px;
 border: 2px solid rgba(255, 255, 255, 0.3);
 border-radius: 50%;
 border-top-color: white;
 animation: spin 0.8s ease-in-out infinite;
 margin-right: 0.5rem;

 @keyframes spin {
   to {
     transform: rotate(360deg);
   }
 }
`;

const Message = styled.div`
 padding: 1rem 1.25rem;
 border-radius: 12px;
 font-weight: 500;
 font-size: 0.95rem;
 animation: ${fadeIn} 0.3s ease-out;
 border: 1px solid;
 
 ${({ type }) => type === 'error' ? `
   color: #dc2626;
   background: linear-gradient(135deg, #fef2f2, #fee2e2);
   border-color: #fecaca;
 ` : `
   color: #16a34a;
   background: linear-gradient(135deg, #f0fdf4, #dcfce7);
   border-color: #bbf7d0;
 `}
`;

const SocialSignup = styled.div`
 display: flex;
 gap: 1rem;
 margin-top: 1.5rem;
`;

const SocialButton = styled.button`
 flex: 1;
 padding: 0.75rem;
 border: 2px solid #e5e7eb;
 border-radius: 12px;
 background: white;
 color: #374151;
 font-weight: 500;
 transition: all 0.3s ease;
 display: flex;
 align-items: center;
 justify-content: center;
 gap: 0.5rem;

 &:hover {
   border-color: #d1d5db;
   transform: translateY(-1px);
   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
 }
`;

const Divider = styled.div`
 display: flex;
 align-items: center;
 margin: 2rem 0;
 
 &::before,
 &::after {
   content: '';
   flex: 1;
   height: 1px;
   background: linear-gradient(90deg, transparent, #e5e7eb, transparent);
 }
 
 span {
   padding: 0 1rem;
   color: #9ca3af;
   font-size: 0.9rem;
   font-weight: 500;
 }
`;

const LoginLink = styled.div`
 text-align: center;
 margin-top: 2rem;
 padding-top: 2rem;
 border-top: 1px solid #e5e7eb;
`;

const LoginText = styled.p`
 color: #6b7280;
 font-size: 0.95rem;
 
 a {
   color: #3b82f6;
   font-weight: 600;
   transition: all 0.3s ease;
   
   &:hover {
     color: #1d4ed8;
     transform: translateY(-1px);
     display: inline-block;
   }
 }
`;

function Signup() {
 const [form, setForm] = useState({
   username: '',
   name: '',
   email: '',
   phone_number: '',
   password: '',
   image_url: '',
 });
 const [error, setError] = useState('');
 const [successMsg, setSuccessMsg] = useState('');
 const [loading, setLoading] = useState(false);
 const [showPassword, setShowPassword] = useState(false);
 const [passwordStrength, setPasswordStrength] = useState(0);
 const [agreements, setAgreements] = useState({
   terms: false,
   privacy: false,
   marketing: false
 });

 const navigate = useNavigate();

 useEffect(() => {
   const token = localStorage.getItem('accessToken');
   if (token) {
     navigate('/main', { replace: true });
   }
 }, [navigate]);

 const calculatePasswordStrength = (password) => {
   let strength = 0;
   if (password.length >= 8) strength++;
   if (/[a-z]/.test(password)) strength++;
   if (/[A-Z]/.test(password)) strength++;
   if (/[0-9]/.test(password)) strength++;
   if (/[^A-Za-z0-9]/.test(password)) strength++;
   return Math.min(strength, 4);
 };

 const handleChange = (e) => {
   const { name, value } = e.target;
   setForm({ ...form, [name]: value });
   
   if (name === 'password') {
     setPasswordStrength(calculatePasswordStrength(value));
   }
   
   if (error) setError('');
 };

 const handleAgreementChange = (name) => {
   setAgreements(prev => ({
     ...prev,
     [name]: !prev[name]
   }));
 };

 const getPasswordStrengthText = (strength) => {
   const texts = ['매우 약함', '약함', '보통', '강함', '매우 강함'];
   return texts[strength] || '매우 약함';
 };

 const handleSignup = async () => {
   const requiredFields = {
     username: '아이디를 입력해주세요.',
     name: '이름을 입력해주세요.',
     email: '이메일을 입력해주세요.',
     password: '비밀번호를 입력해주세요.',
   };

   for (const [field, message] of Object.entries(requiredFields)) {
     if (!form[field].trim()) {
       setError(message);
       return;
     }
   }

   if (!agreements.terms || !agreements.privacy) {
     setError('필수 약관에 동의해주세요.');
     return;
   }

   if (passwordStrength < 2) {
     setError('더 강한 비밀번호를 설정해주세요.');
     return;
   }

   setError('');
   setLoading(true);
   try {
     const res = await api.post('/auth/signup/', form);
     setSuccessMsg(res.data.message);
     setTimeout(() => {
       navigate('/login');
     }, 2000);
   } catch (err) {
     setError(extractFirstError(err, '회원가입 중 오류가 발생했습니다.'));
   } finally {
     setLoading(false);
   }
 };

 return (
   <>
     <GlobalStyle />
     <Container>
       {/* Floating Elements */}
       <FloatingElement size="80px" top="15%" left="8%" duration="6s" delay="0s" />
       <FloatingElement size="60px" top="25%" left="85%" duration="4s" delay="1s" />
       <FloatingElement size="40px" top="70%" left="10%" duration="5s" delay="2s" />
       <FloatingElement size="100px" top="60%" left="80%" duration="7s" delay="0.5s" />
       <FloatingElement size="50px" top="40%" left="5%" duration="4.5s" delay="1.5s" />
       <FloatingElement size="30px" top="80%" left="90%" duration="3.5s" delay="2.5s" />

       <Sidebar>
         <BrandSection>
           <Logo>
             Neigh<span>viz</span>
           </Logo>
           <BrandTitle>
             성공적인 비즈니스의<br />
             시작점이 되어드립니다
           </BrandTitle>
           <BrandSubtitle>
             간단한 회원가입으로 검증된 비즈니스 파트너들과<br />
             연결되어 새로운 기회를 만나보세요
           </BrandSubtitle>

           <SignupSteps>
             <StepItem>
               <StepNumber>1</StepNumber>
               <StepContent>
                 <StepTitle>계정 생성</StepTitle>
                 <StepDescription>기본 정보 입력으로 간편하게 시작</StepDescription>
               </StepContent>
             </StepItem>
             <StepItem>
               <StepNumber>2</StepNumber>
               <StepContent>
                 <StepTitle>사업자 인증</StepTitle>
                 <StepDescription>5단계 검증 시스템으로 신뢰성 확보</StepDescription>
               </StepContent>
             </StepItem>
             <StepItem>
               <StepNumber>3</StepNumber>
               <StepContent>
                 <StepTitle>매칭 시작</StepTitle>
                 <StepDescription>AI 분석을 통한 최적의 파트너 연결</StepDescription>
               </StepContent>
             </StepItem>
           </SignupSteps>

           <BenefitsGrid>
             <BenefitItem>
               <BenefitIcon>🚀</BenefitIcon>
               <BenefitText>빠른 매칭</BenefitText>
             </BenefitItem>
             <BenefitItem>
               <BenefitIcon>🔒</BenefitIcon>
               <BenefitText>안전한 거래</BenefitText>
             </BenefitItem>
             <BenefitItem>
               <BenefitIcon>📊</BenefitIcon>
               <BenefitText>성과 분석</BenefitText>
             </BenefitItem>
             <BenefitItem>
               <BenefitIcon>🎯</BenefitIcon>
               <BenefitText>정확한 타겟팅</BenefitText>
             </BenefitItem>
           </BenefitsGrid>
         </BrandSection>
       </Sidebar>

       <Main>
         <Card>
           <CardHeader>
             <Title>회원가입</Title>
             <Subtitle>Neighviz 파트너십 여정을 시작하세요</Subtitle>
           </CardHeader>

           <Form>
             <FormRow>
               <FormGroup>
                 <Label htmlFor="username">
                   아이디 <span className="required">*</span>
                 </Label>
                 <InputWrapper>
                   <Input
                     id="username"
                     name="username"
                     type="text"
                     placeholder="영문/숫자 조합"
                     value={form.username}
                     onChange={handleChange}
                     disabled={loading}
                   />
                 </InputWrapper>
                 <ValidationHint>4-20자 영문 소문자, 숫자 조합</ValidationHint>
               </FormGroup>

               <FormGroup>
                 <Label htmlFor="name">
                   이름 <span className="required">*</span>
                 </Label>
                 <InputWrapper>
                   <Input
                     id="name"
                     name="name"
                     type="text"
                     placeholder="실명을 입력하세요"
                     value={form.name}
                     onChange={handleChange}
                     disabled={loading}
                   />
                 </InputWrapper>
               </FormGroup>
             </FormRow>

             <FormGroup>
               <Label htmlFor="email">
                 이메일 <span className="required">*</span>
               </Label>
               <InputWrapper>
                 <Input
                   id="email"
                   name="email"
                   type="email"
                   placeholder="business@example.com"
                   value={form.email}
                   onChange={handleChange}
                   disabled={loading}
                 />
               </InputWrapper>
               <ValidationHint>사업 관련 이메일 주소를 권장합니다</ValidationHint>
             </FormGroup>

             <FormGroup>
               <Label htmlFor="phone_number">전화번호</Label>
               <InputWrapper>
                 <Input
                   id="phone_number"
                   name="phone_number"
                   type="tel"
                   placeholder="010-0000-0000"
                   value={form.phone_number}
                   onChange={handleChange}
                   disabled={loading}
                 />
               </InputWrapper>
             </FormGroup>

             <FormGroup>
               <Label htmlFor="password">
                 비밀번호 <span className="required">*</span>
               </Label>
               <InputWrapper>
                 <Input
                   id="password"
                   name="password"
                   type={showPassword ? 'text' : 'password'}
                   placeholder="안전한 비밀번호를 입력하세요"
                   value={form.password}
                   onChange={handleChange}
                   disabled={loading}
                 />
                 <InputIcon 
                   className="clickable"
                   onClick={() => setShowPassword(!showPassword)}
                 >
                   {showPassword ? '🙈' : '👁️'}
                 </InputIcon>
               </InputWrapper>
               <PasswordStrength>
                 <StrengthBar>
                   <StrengthFill strength={passwordStrength} />
                 </StrengthBar>
                 <StrengthText strength={passwordStrength}>
                   {getPasswordStrengthText(passwordStrength)}
                 </StrengthText>
               </PasswordStrength>
             </FormGroup>

             <CheckboxGroup>
               <CheckboxItem>
                 <input
                   type="checkbox"
                   checked={agreements.terms}
                   onChange={() => handleAgreementChange('terms')}
                 />
                 <span>
                   <span className="required">[필수]</span> <Link to="/terms">이용약관</Link>에 동의합니다
                 </span>
               </CheckboxItem>
               <CheckboxItem>
                 <input
                   type="checkbox"
                   checked={agreements.privacy}
                   onChange={() => handleAgreementChange('privacy')}
                 />
                 <span>
                   <span className="required">[필수]</span> <Link to="/privacy">개인정보 처리방침</Link>에 동의합니다
                 </span>
               </CheckboxItem>
               <CheckboxItem>
                 <input
                   type="checkbox"
                   checked={agreements.marketing}
                   onChange={() => handleAgreementChange('marketing')}
                 />
                 <span>[선택] 마케팅 정보 수신에 동의합니다</span>
               </CheckboxItem>
             </CheckboxGroup>

             {error && <Message type="error">{error}</Message>}
             {successMsg && <Message type="success">{successMsg}</Message>}

             <Button onClick={handleSignup} disabled={loading}>
               {loading && <LoadingSpinner />} 회원가입 완료
             </Button>

             <LoginLink>
               <LoginText>
                 이미 계정이 있으신가요? <Link to="/login">로그인하기</Link>
               </LoginText>
             </LoginLink>
           </Form>
         </Card>
       </Main>
     </Container>
   </>
 );
}

export default Signup;
