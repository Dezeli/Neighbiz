import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/axios';

function ResetPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      navigate('/main', { replace: true });
    }
  }, []);

  const handleSend = async () => {
    if (!email.trim()) {
      setError('이메일 주소를 입력해주세요.');
      return;
    }

    if (!email.includes('@')) {
      setError('올바른 이메일 형식을 입력해주세요.');
      return;
    }

    setError('');
    setMessage('');
    setLoading(true);

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
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="reset-container">
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

          .reset-container {
            min-height: 100vh;
            display: flex;
            background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
            position: relative;
            overflow: hidden;
          }

          .reset-container::before {
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

          .reset-sidebar {
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

          .reset-sidebar::before {
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
            content: '🔐';
            margin-right: 0.75rem;
            font-size: 1.1rem;
          }

          .reset-main {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            position: relative;
            z-index: 2;
          }

          .reset-card {
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

          .reset-card::before {
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

          .reset-header {
            text-align: center;
            margin-bottom: 2.5rem;
          }

          .reset-title {
            font-size: 1.875rem;
            font-weight: 700;
            color: #111827;
            margin-bottom: 0.5rem;
            letter-spacing: -0.01em;
          }

          .reset-subtitle {
            color: #6b7280;
            font-size: 1rem;
            font-weight: 400;
            line-height: 1.5;
          }

          .reset-form {
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

          .form-input.success {
            border-color: #10b981;
            box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
          }

          .reset-button {
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

          .reset-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
            transition: left 0.5s ease;
          }

          .reset-button:hover:not(:disabled) {
            background: linear-gradient(135deg, #4b5563 0%, #6b7280 100%);
            transform: translateY(-1px);
            box-shadow: 0 8px 25px rgba(55, 65, 81, 0.3);
          }

          .reset-button:hover::before {
            left: 100%;
          }

          .reset-button:disabled {
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

          .message {
            padding: 0.75rem 1rem;
            border-radius: 6px;
            font-size: 0.875rem;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-top: 0.75rem;
          }

          .message.error {
            background: #fef2f2;
            border: 1px solid #fecaca;
            color: #dc2626;
          }

          .message.success {
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
            color: #16a34a;
          }

          .message svg {
            width: 16px;
            height: 16px;
            flex-shrink: 0;
          }

          .success-card {
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
            border-radius: 8px;
            padding: 1.5rem;
            margin-top: 1rem;
            text-align: center;
          }

          .success-icon {
            width: 48px;
            height: 48px;
            background: #10b981;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1rem;
            color: white;
          }

          .success-title {
            font-size: 1.125rem;
            font-weight: 600;
            color: #166534;
            margin-bottom: 0.5rem;
          }

          .success-text {
            color: #15803d;
            line-height: 1.5;
            font-size: 0.875rem;
          }

          .info-box {
            background: #f0f9ff;
            border: 1px solid #bae6fd;
            border-radius: 8px;
            padding: 1rem;
            margin-top: 1rem;
          }

          .info-title {
            font-size: 0.875rem;
            font-weight: 600;
            color: #0c4a6e;
            margin-bottom: 0.5rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .info-text {
            color: #0369a1;
            font-size: 0.8rem;
            line-height: 1.4;
          }

          .reset-footer {
            text-align: center;
            margin-top: 2rem;
            padding-top: 1.5rem;
            border-top: 1px solid #f3f4f6;
          }

          .footer-text {
            color: #6b7280;
            font-size: 0.875rem;
            margin-bottom: 1rem;
          }

          .footer-links {
            display: flex;
            justify-content: center;
            gap: 1rem;
            flex-wrap: wrap;
          }

          .footer-link {
            background: none;
            border: none;
            color: #374151;
            font-weight: 500;
            cursor: pointer;
            text-decoration: none;
            transition: color 0.2s ease;
            font-size: 0.875rem;
            padding: 0.5rem 0;
          }

          .footer-link:hover {
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
            .reset-sidebar {
              display: none;
            }

            .reset-main {
              flex: none;
              width: 100%;
            }
          }

          @media (max-width: 768px) {
            .reset-main {
              padding: 1rem;
            }

            .reset-card {
              padding: 2rem 1.5rem;
            }

            .back-button {
              top: 1rem;
              left: 1rem;
            }

            .footer-links {
              flex-direction: column;
              gap: 0.5rem;
            }
          }

          @media (max-width: 480px) {
            .reset-card {
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
      <button className="back-button" onClick={() => navigate('/login')}>
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Left Sidebar */}
      <div className="reset-sidebar">
        <div className="sidebar-content">
          <div className="sidebar-logo">
            Neigh<span>viz</span>
          </div>
          <h2 className="sidebar-title">
            안전한 비밀번호<br />
            재설정
          </h2>
          <p className="sidebar-description">
            이메일 인증을 통해 안전하게 비밀번호를 재설정할 수 있습니다.
          </p>
          <ul className="sidebar-features">
            <li>이메일로 안전한 재설정 링크 전송</li>
            <li>암호화된 보안 프로세스</li>
            <li>즉시 새 비밀번호 설정 가능</li>
            <li>계정 보안 강화</li>
          </ul>
        </div>
        <div className="company-info">
          © 2024 Neighviz. All rights reserved.
        </div>
      </div>

      {/* Main Reset Password Area */}
      <div className="reset-main">
        <div className="reset-card">
          <div className="reset-header">
            <h1 className="reset-title">비밀번호 재설정</h1>
            <p className="reset-subtitle">
              가입 시 사용한 이메일 주소를 입력하면<br />
              비밀번호 재설정 링크를 보내드립니다
            </p>
          </div>

          <div className="reset-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                이메일 주소
              </label>
              <div className="input-wrapper">
                <input
                  id="email"
                  type="email"
                  className={`form-input ${error && !email.trim() ? 'error' : message ? 'success' : ''}`}
                  placeholder="가입 시 사용한 이메일을 입력하세요"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  autoComplete="email"
                />
              </div>
            </div>

            {error && (
              <div className="message error">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            {message && (
              <div className="success-card">
                <div className="success-icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="success-title">이메일이 전송되었습니다!</div>
                <div className="success-text">{message}</div>
              </div>
            )}

            <button 
              className="reset-button" 
              onClick={handleSend}
              disabled={loading}
            >
              {loading && <div className="loading-spinner" />}
              {loading ? '링크 전송 중...' : '재설정 링크 전송'}
            </button>

            {!message && (
              <div className="info-box">
                <div className="info-title">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  이메일이 오지 않나요?
                </div>
                <div className="info-text">
                  • 스팸 메일함을 확인해보세요<br />
                  • 입력한 이메일 주소가 정확한지 확인해보세요<br />
                  • 몇 분 후에 다시 시도해보세요
                </div>
              </div>
            )}
          </div>

          <div className="reset-footer">
            <p className="footer-text">다른 도움이 필요하신가요?</p>
            <div className="footer-links">
              <button 
                className="footer-link"
                onClick={() => navigate('/login')}
              >
                로그인하기
              </button>
              <button 
                className="footer-link"
                onClick={() => navigate('/find-id')}
              >
                아이디 찾기
              </button>
              <button 
                className="footer-link"
                onClick={() => navigate('/signup')}
              >
                회원가입
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;