import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../lib/axios';

function ResetPasswordConfirm() {
  const [params] = useSearchParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const uid = params.get('uid');
  const token = params.get('token');
  const navigate = useNavigate();

  useEffect(() => {
    const validateLink = async () => {
      setValidating(true);
      try {
        await api.get('/auth/reset-password-validate/', {
          params: { uid, token },
        });
        setValidating(false);
      } catch (err) {
        const msg =
          err.response?.data?.message || '링크가 만료되었거나 유효하지 않습니다.';
        setError(msg);
        setValidating(false);
      }
    };

    if (!uid || !token) {
      setError('잘못된 접근입니다.');
      setValidating(false);
    } else {
      validateLink();
    }
  }, [uid, token]);

  const handleReset = async () => {
    if (!newPassword.trim()) {
      setError('새 비밀번호를 입력해주세요.');
      return;
    }

    if (newPassword.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setError('');
    setMessage('');
    setLoading(true);

    try {
      await api.post('/auth/reset-password-confirm/', {
        uid,
        token,
        new_password: newPassword,
      });
      setMessage('비밀번호가 성공적으로 변경되었습니다.');
      setError('');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      const msg =
        err.response?.data?.message || '비밀번호 재설정에 실패했습니다.';
      setError(msg);
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleReset();
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="reset-confirm-container">
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

          .reset-confirm-container {
            min-height: 100vh;
            display: flex;
            background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
            position: relative;
            overflow: hidden;
          }

          .reset-confirm-container::before {
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

          .reset-confirm-sidebar {
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

          .reset-confirm-sidebar::before {
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
            content: '🔒';
            margin-right: 0.75rem;
            font-size: 1.1rem;
          }

          .reset-confirm-main {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            position: relative;
            z-index: 2;
          }

          .reset-confirm-card {
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

          .reset-confirm-card::before {
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

          .reset-confirm-header {
            text-align: center;
            margin-bottom: 2.5rem;
          }

          .reset-confirm-title {
            font-size: 1.875rem;
            font-weight: 700;
            color: #111827;
            margin-bottom: 0.5rem;
            letter-spacing: -0.01em;
          }

          .reset-confirm-subtitle {
            color: #6b7280;
            font-size: 1rem;
            font-weight: 400;
            line-height: 1.5;
          }

          .loading-state {
            text-align: center;
            padding: 2rem 0;
          }

          .loading-spinner-large {
            width: 40px;
            height: 40px;
            border: 3px solid #e5e7eb;
            border-radius: 50%;
            border-top-color: #374151;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
          }

          .loading-text {
            color: #6b7280;
            font-size: 0.9rem;
          }

          .error-state {
            text-align: center;
            padding: 2rem 0;
          }

          .error-icon {
            width: 64px;
            height: 64px;
            background: #fef2f2;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1rem;
            color: #dc2626;
          }

          .error-title {
            font-size: 1.25rem;
            font-weight: 600;
            color: #dc2626;
            margin-bottom: 0.5rem;
          }

          .error-text {
            color: #6b7280;
            line-height: 1.5;
          }

          .reset-confirm-form {
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
            padding-right: 2.5rem;
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

          .password-requirements {
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            padding: 0.75rem;
            margin-top: 0.5rem;
          }

          .requirements-title {
            font-size: 0.8rem;
            font-weight: 600;
            color: #374151;
            margin-bottom: 0.5rem;
          }

          .requirements-list {
            list-style: none;
            font-size: 0.75rem;
          }

          .requirements-list li {
            color: #6b7280;
            margin-bottom: 0.25rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .requirements-list li.valid {
            color: #16a34a;
          }

          .requirements-list li::before {
            content: '•';
            color: #d1d5db;
          }

          .requirements-list li.valid::before {
            content: '✓';
            color: #16a34a;
            font-weight: bold;
          }

          .reset-confirm-button {
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

          .reset-confirm-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
            transition: left 0.5s ease;
          }

          .reset-confirm-button:hover:not(:disabled) {
            background: linear-gradient(135deg, #4b5563 0%, #6b7280 100%);
            transform: translateY(-1px);
            box-shadow: 0 8px 25px rgba(55, 65, 81, 0.3);
          }

          .reset-confirm-button:hover::before {
            left: 100%;
          }

          .reset-confirm-button:disabled {
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
            margin-bottom: 1rem;
          }

          .success-redirect {
            color: #15803d;
            font-size: 0.8rem;
            font-style: italic;
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
            .reset-confirm-sidebar {
              display: none;
            }

            .reset-confirm-main {
              flex: none;
              width: 100%;
            }
          }

          @media (max-width: 768px) {
            .reset-confirm-main {
              padding: 1rem;
            }

            .reset-confirm-card {
              padding: 2rem 1.5rem;
            }

            .back-button {
              top: 1rem;
              left: 1rem;
            }
          }

          @media (max-width: 480px) {
            .reset-confirm-card {
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
      <div className="reset-confirm-sidebar">
        <div className="sidebar-content">
          <div className="sidebar-logo">
            Neigh<span>viz</span>
          </div>
          <h2 className="sidebar-title">
            새로운 비밀번호로<br />
            보안 강화
          </h2>
          <p className="sidebar-description">
            강력한 비밀번호를 설정하여 계정의 보안을 한층 더 강화하세요.
          </p>
          <ul className="sidebar-features">
            <li>안전한 비밀번호 가이드 제공</li>
            <li>실시간 보안 강도 체크</li>
            <li>즉시 새 비밀번호로 로그인 가능</li>
            <li>계정 보안 완전 복구</li>
          </ul>
        </div>
        <div className="company-info">
          © 2024 Neighviz. All rights reserved.
        </div>
      </div>

      {/* Main Reset Password Confirm Area */}
      <div className="reset-confirm-main">
        <div className="reset-confirm-card">
          {validating ? (
            <div className="loading-state">
              <div className="loading-spinner-large"></div>
              <div className="loading-text">링크 유효성을 확인하고 있습니다...</div>
            </div>
          ) : error ? (
            <div className="error-state">
              <div className="error-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="32" height="32">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="error-title">링크 오류</div>
              <div className="error-text">{error}</div>
            </div>
          ) : (
            <>
              <div className="reset-confirm-header">
                <h1 className="reset-confirm-title">새 비밀번호 설정</h1>
                <p className="reset-confirm-subtitle">
                  계정 보안을 위해 강력한 비밀번호를 설정해주세요
                </p>
              </div>

              <div className="reset-confirm-form">
                <div className="form-group">
                  <label htmlFor="newPassword" className="form-label">
                    새 비밀번호
                  </label>
                  <div className="input-wrapper">
                    <input
                      id="newPassword"
                      type={showPassword ? 'text' : 'password'}
                      className={`form-input ${error && !newPassword.trim() ? 'error' : message ? 'success' : ''}`}
                      placeholder="새 비밀번호를 입력하세요"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      onKeyPress={handleKeyPress}
                      autoComplete="new-password"
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
                  {newPassword && (
                    <div className="password-requirements">
                      <div className="requirements-title">비밀번호 요구사항</div>
                      <ul className="requirements-list">
                        <li className={newPassword.length >= 6 ? 'valid' : ''}>
                          최소 6자 이상
                        </li>
                        <li className={/[A-Z]/.test(newPassword) ? 'valid' : ''}>
                          대문자 포함 (권장)
                        </li>
                        <li className={/[0-9]/.test(newPassword) ? 'valid' : ''}>
                          숫자 포함 (권장)
                        </li>
                        <li className={/[!@#$%^&*]/.test(newPassword) ? 'valid' : ''}>
                          특수문자 포함 (권장)
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">
                    비밀번호 확인
                  </label>
                  <div className="input-wrapper">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      className={`form-input ${error && newPassword !== confirmPassword ? 'error' : confirmPassword && newPassword === confirmPassword ? 'success' : ''}`}
                      placeholder="비밀번호를 다시 입력하세요"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onKeyPress={handleKeyPress}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={toggleConfirmPasswordVisibility}
                    >
                      {showConfirmPassword ? (
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
                    <div className="success-title">비밀번호 변경 완료!</div>
                    <div className="success-text">{message}</div>
                    <div className="success-redirect">잠시 후 로그인 페이지로 이동합니다...</div>
                  </div>
                )}

                <button 
                  className="reset-confirm-button" 
                  onClick={handleReset}
                  disabled={loading || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                >
                  {loading && <div className="loading-spinner" />}
                  {loading ? '비밀번호 변경 중...' : '비밀번호 변경 완료'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordConfirm;