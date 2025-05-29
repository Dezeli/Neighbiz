import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/axios';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      navigate('/main', { replace: true });
    }

    const rememberedUsername = localStorage.getItem('rememberedUsername');
    if (rememberedUsername) {
      setUsername(rememberedUsername);
      setRememberMe(true);
    }
  }, [navigate]);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login/', { username, password });
      const { access, refresh } = res.data.data;
      
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      
      // Remember me functionality
      if (rememberMe) {
        localStorage.setItem('rememberedUsername', username);
      } else {
        localStorage.removeItem('rememberedUsername');
      }
      
      navigate('/main');
    } catch (err) {
      const msg = err.response?.data?.message || '로그인 실패';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.5;
            color: #1f2937;
            background-color: #f8fafc;
          }

          .login-container {
            min-height: 100vh;
            display: flex;
            background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
            position: relative;
            overflow: hidden;
          }

          .login-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: 
              radial-gradient(circle at 25% 25%, rgba(148, 163, 184, 0.1) 0%, transparent 25%),
              radial-gradient(circle at 75% 75%, rgba(100, 116, 139, 0.1) 0%, transparent 25%),
              linear-gradient(45deg, transparent 40%, rgba(203, 213, 225, 0.05) 50%, transparent 60%);
            z-index: 1;
          }

          .login-sidebar {
            flex: 1;
            background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 4rem 3rem;
            position: relative;
            overflow: hidden;
          }

          .login-sidebar::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: 
              linear-gradient(45deg, rgba(255, 255, 255, 0.02) 25%, transparent 25%),
              linear-gradient(-45deg, rgba(255, 255, 255, 0.02) 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, rgba(255, 255, 255, 0.02) 75%),
              linear-gradient(-45deg, transparent 75%, rgba(255, 255, 255, 0.02) 75%);
            background-size: 30px 30px;
            background-position: 0 0, 0 15px, 15px -15px, -15px 0px;
          }

          .sidebar-content {
            position: relative;
            z-index: 2;
            text-align: center;
            max-width: 400px;
          }

          .sidebar-logo {
            font-size: 2.5rem;
            font-weight: 800;
            color: white;
            margin-bottom: 1.5rem;
            letter-spacing: -0.02em;
          }

          .sidebar-logo span {
            color: #94a3b8;
          }

          .sidebar-title {
            font-size: 1.8rem;
            font-weight: 600;
            color: white;
            margin-bottom: 1rem;
            line-height: 1.3;
          }

          .sidebar-description {
            font-size: 1.1rem;
            color: #cbd5e1;
            line-height: 1.6;
            margin-bottom: 2rem;
          }

          .sidebar-features {
            list-style: none;
            text-align: left;
          }

          .sidebar-features li {
            color: #e2e8f0;
            margin-bottom: 0.75rem;
            display: flex;
            align-items: center;
            font-size: 0.95rem;
          }

          .sidebar-features li::before {
            content: '✓';
            color: #10b981;
            font-weight: bold;
            margin-right: 0.75rem;
            font-size: 1.1rem;
          }

          .login-main {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            position: relative;
            z-index: 2;
          }

          .login-card {
            background: white;
            border-radius: 16px;
            box-shadow: 
              0 4px 6px -1px rgba(0, 0, 0, 0.1),
              0 2px 4px -1px rgba(0, 0, 0, 0.06),
              0 0 0 1px rgba(0, 0, 0, 0.05);
            padding: 3rem 2.5rem;
            width: 100%;
            max-width: 420px;
            position: relative;
          }

          .login-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #374151 0%, #6b7280 50%, #374151 100%);
            border-radius: 16px 16px 0 0;
          }

          .back-button {
            position: absolute;
            top: 2rem;
            left: 2rem;
            background: rgba(255, 255, 255, 0.9);
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 0.75rem;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10;
            backdrop-filter: blur(8px);
          }

          .back-button:hover {
            background: white;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            transform: translateX(-2px);
          }

          .back-button svg {
            width: 20px;
            height: 20px;
            color: #6b7280;
          }

          .login-header {
            text-align: center;
            margin-bottom: 2.5rem;
          }

          .login-title {
            font-size: 1.875rem;
            font-weight: 700;
            color: #111827;
            margin-bottom: 0.5rem;
            letter-spacing: -0.01em;
          }

          .login-subtitle {
            color: #6b7280;
            font-size: 1rem;
            font-weight: 400;
          }

          .login-form {
            space-y: 1.5rem;
          }

          .form-group {
            margin-bottom: 1.5rem;
          }

          .form-label {
            display: block;
            font-size: 0.875rem;
            font-weight: 600;
            color: #374151;
            margin-bottom: 0.5rem;
          }

          .input-wrapper {
            position: relative;
          }

          .form-input {
            width: 100%;
            padding: 0.875rem 1rem;
            border: 1.5px solid #d1d5db;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 400;
            color: #111827;
            background: white;
            transition: all 0.2s ease;
            outline: none;
          }

          .form-input::placeholder {
            color: #9ca3af;
          }

          .form-input:focus {
            border-color: #374151;
            box-shadow: 0 0 0 3px rgba(55, 65, 81, 0.1);
          }

          .form-input:hover:not(:focus) {
            border-color: #9ca3af;
          }

          .form-input.error {
            border-color: #ef4444;
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
          }

          .password-toggle {
            position: absolute;
            right: 0.75rem;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            cursor: pointer;
            padding: 0.25rem;
            border-radius: 4px;
            transition: background-color 0.2s ease;
          }

          .password-toggle:hover {
            background: #f3f4f6;
          }

          .password-toggle svg {
            width: 18px;
            height: 18px;
            color: #6b7280;
          }

          .form-options {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin: 1.25rem 0;
          }

          .checkbox-wrapper {
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .checkbox-wrapper input[type="checkbox"] {
            width: 16px;
            height: 16px;
            accent-color: #374151;
          }

          .checkbox-wrapper label {
            font-size: 0.875rem;
            color: #6b7280;
            cursor: pointer;
          }

          .forgot-password {
            background: none;
            border: none;
            color: #374151;
            font-size: 0.875rem;
            font-weight: 500;
            cursor: pointer;
            text-decoration: none;
            transition: color 0.2s ease;
          }

          .forgot-password:hover {
            color: #111827;
            text-decoration: underline;
          }

          .login-button {
            width: 100%;
            padding: 0.875rem 1rem;
            background: linear-gradient(135deg, #374151 0%, #4b5563 100%);
            color: white;
            font-size: 1rem;
            font-weight: 600;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
            margin-top: 0.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            position: relative;
            overflow: hidden;
          }

          .login-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
            transition: left 0.5s ease;
          }

          .login-button:hover:not(:disabled) {
            background: linear-gradient(135deg, #4b5563 0%, #6b7280 100%);
            transform: translateY(-1px);
            box-shadow: 0 8px 25px rgba(55, 65, 81, 0.3);
          }

          .login-button:hover::before {
            left: 100%;
          }

          .login-button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
          }

          .loading-spinner {
            width: 18px;
            height: 18px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }

          .error-message {
            background: #fef2f2;
            border: 1px solid #fecaca;
            border-radius: 6px;
            padding: 0.75rem 1rem;
            color: #dc2626;
            font-size: 0.875rem;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-top: 0.75rem;
          }

          .error-message svg {
            width: 16px;
            height: 16px;
            flex-shrink: 0;
          }

          .divider {
            position: relative;
            text-align: center;
            margin: 2rem 0;
          }

          .divider::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 0;
            right: 0;
            height: 1px;
            background: #e5e7eb;
          }

          .divider span {
            background: white;
            color: #6b7280;
            padding: 0 1rem;
            font-size: 0.875rem;
            font-weight: 500;
            position: relative;
          }

          .sub-button-group {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
          }

          .sub-button {
            padding: 0.75rem 1.5rem;
            font-size: 0.875rem;
            font-weight: 500;
            border: 1.5px solid #e5e7eb;
            background: white;
            color: #6b7280;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
            position: relative;
            overflow: hidden;
          }

          .sub-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(55, 65, 81, 0.05), transparent);
            transition: left 0.3s ease;
          }

          .sub-button:hover {
            border-color: #374151;
            color: #374151;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }

          .sub-button:hover::before {
            left: 100%;
          }

          .social-login-section {
            margin-top: 1.5rem;
          }

          .social-button {
            width: 100%;
            padding: 0.75rem 1rem;
            border: 1.5px solid #e5e7eb;
            background: white;
            color: #374151;
            font-size: 0.9rem;
            font-weight: 500;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
            margin-bottom: 0.75rem;
            position: relative;
            overflow: hidden;
          }

          .social-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.03), transparent);
            transition: left 0.3s ease;
          }

          .social-button:hover {
            border-color: #d1d5db;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }

          .social-button:hover::before {
            left: 100%;
          }

          .social-button.kakao {
            background: #fee500;
            border-color: #fee500;
            color: #3c1e1e;
          }

          .social-button.kakao:hover {
            background: #fdd835;
            border-color: #fdd835;
          }

          .social-button svg,
          .social-button img {
            width: 18px;
            height: 18px;
          }

          .login-footer {
            text-align: center;
            margin-top: 2rem;
            padding-top: 1.5rem;
            border-top: 1px solid #f3f4f6;
          }

          .footer-text {
            color: #6b7280;
            font-size: 0.875rem;
            margin-bottom: 0.75rem;
          }

          .signup-link {
            background: none;
            border: none;
            color: #374151;
            font-weight: 600;
            cursor: pointer;
            text-decoration: none;
            transition: color 0.2s ease;
            font-size: 0.875rem;
          }

          .signup-link:hover {
            color: #111827;
            text-decoration: underline;
          }

          .company-info {
            position: absolute;
            bottom: 2rem;
            left: 3rem;
            color: #94a3b8;
            font-size: 0.8rem;
            z-index: 3;
          }

          .decorative-elements {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            pointer-events: none;
            z-index: 1;
          }

          .decorative-circle {
            position: absolute;
            border-radius: 50%;
            background: rgba(148, 163, 184, 0.05);
          }

          .decorative-circle:nth-child(1) {
            width: 200px;
            height: 200px;
            top: 10%;
            right: 10%;
            animation: float1 8s ease-in-out infinite;
          }

          .decorative-circle:nth-child(2) {
            width: 150px;
            height: 150px;
            bottom: 20%;
            left: 5%;
            animation: float2 6s ease-in-out infinite reverse;
          }

          .decorative-circle:nth-child(3) {
            width: 100px;
            height: 100px;
            top: 60%;
            right: 5%;
            animation: float1 10s ease-in-out infinite;
          }

          @keyframes float1 {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-20px);
            }
          }

          @keyframes float2 {
            0%, 100% {
              transform: translateY(0px) translateX(0px);
            }
            33% {
              transform: translateY(-10px) translateX(10px);
            }
            66% {
              transform: translateY(10px) translateX(-5px);
            }
          }

          @media (max-width: 1024px) {
            .login-sidebar {
              display: none;
            }

            .login-main {
              flex: none;
              width: 100%;
            }
          }

          @media (max-width: 768px) {
            .login-main {
              padding: 1rem;
            }

            .login-card {
              padding: 2rem 1.5rem;
            }

            .back-button {
              top: 1rem;
              left: 1rem;
            }

            .sub-button-group {
              flex-direction: column;
            }

            .sub-button {
              width: 100%;
            }
          }

          @media (max-width: 480px) {
            .login-card {
              padding: 1.5rem 1rem;
            }

            .sidebar-content {
              padding: 0 1rem;
            }

            .company-info {
              left: 1rem;
              bottom: 1rem;
            }
          }
        `}
      </style>

      {/* Decorative Elements */}
      <div className="decorative-elements">
        <div className="decorative-circle"></div>
        <div className="decorative-circle"></div>
        <div className="decorative-circle"></div>
      </div>

      {/* Back Button */}
      <button className="back-button" onClick={() => navigate('/')}>
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Left Sidebar */}
      <div className="login-sidebar">
        <div className="sidebar-content">
          <div className="sidebar-logo">
            Neigh<span>viz</span>
          </div>
          <h2 className="sidebar-title">
            신뢰할 수 있는<br />
            B2B 파트너십
          </h2>
          <p className="sidebar-description">
            검증된 사업자들과 안전하고 효율적인 비즈니스 제휴를 시작하세요.
          </p>
          <ul className="sidebar-features">
            <li>엄격한 사업자 검증 시스템</li>
            <li>AI 기반 스마트 매칭</li>
            <li>블록체인 기반 안전 거래</li>
            <li>실시간 거래 현황 모니터링</li>
            <li>전담 고객지원 서비스</li>
          </ul>
        </div>
        <div className="company-info">
          © 2024 Neighviz. All rights reserved.
        </div>
      </div>

      {/* Main Login Area */}
      <div className="login-main">
        <div className="login-card">
          <div className="login-header">
            <h1 className="login-title">로그인</h1>
            <p className="login-subtitle">계정에 로그인하여 서비스를 이용하세요</p>
          </div>

          <div className="login-form">
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                아이디
              </label>
              <div className="input-wrapper">
                <input
                  id="username"
                  type="text"
                  className={`form-input ${error && !username.trim() ? 'error' : ''}`}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="아이디를 입력하세요"
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                비밀번호
              </label>
              <div className="input-wrapper">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className={`form-input ${error && !password.trim() ? 'error' : ''}`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="비밀번호를 입력하세요"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464m1.414 1.414L8.464 8.464m1.414 1.414l4.242 4.242M8.464 8.464l1.414 1.414M8.464 8.464L4.929 4.93m3.535 3.535L4.93 4.929" />
                    </svg>
                  ) : (
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="form-options">
              <div className="checkbox-wrapper">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember">로그인 상태 유지</label>
              </div>
              <button 
                type="button" 
                className="forgot-password"
                onClick={() => navigate('/reset-password')}
              >
                비밀번호를 잊으셨나요?
              </button>
            </div>

            {error && (
              <div className="error-message">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            <button 
              className="login-button" 
              onClick={handleLogin}
              disabled={loading}
            >
              {loading && <div className="loading-spinner"></div>}
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </div>

          <div className="divider">
            <span>또는</span>
          </div>

          <div className="sub-button-group">
            <button 
              className="sub-button"
              onClick={() => navigate('/find-id')}
            >
              아이디 찾기
            </button>
            <button 
              className="sub-button"
              onClick={() => navigate('/reset-password')}
            >
              비밀번호 찾기
            </button>
          </div>

          <div className="social-login-section">
            <button className="social-button kakao">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3C6.477 3 2 6.477 2 10.5c0 2.442 1.17 4.617 3.015 6.09L4.01 20.515a.5.5 0 00.74.665l4.36-2.522C9.98 18.84 10.975 19 12 19c5.523 0 10-3.477 10-7.5S17.523 3 12 3z"/>
              </svg>
              카카오로 로그인
            </button>
            
            <button className="social-button">
              <svg viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google로 로그인
            </button>

            <button className="social-button">
              <svg viewBox="0 0 24 24" fill="#03C75A">
                <path d="M16.273 12.845L7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845z"/>
              </svg>
              네이버로 로그인
            </button>
          </div>

          <div className="login-footer">
            <p className="footer-text">아직 계정이 없으신가요?</p>
            <button 
              className="signup-link"
              onClick={() => navigate('/signup')}
            >
              회원가입하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;