import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/axios';

function Signup() {
  const [form, setForm] = useState({
    username: '',
    name: '',
    email: '',
    phone_number: '',
    password: '',
    image_url: '',
  });
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [emailMsg, setEmailMsg] = useState('');
  const [codeMsg, setCodeMsg] = useState('');
  const [uploadMsg, setUploadMsg] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [codeLoading, setCodeLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      navigate('/main', { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    if (!form.username.trim() || !form.email.trim() || !form.password.trim()) {
      setError('필수 정보를 모두 입력해주세요.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/signup/', form);
      setSuccessMsg(res.data.message);
      setError('');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      const msg = err.response?.data?.message || '회원가입 실패';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmailCode = async () => {
    if (!form.email.trim()) {
      setEmailMsg('이메일을 입력해주세요.');
      return;
    }

    setEmailLoading(true);
    try {
      const res = await api.post('/auth/email-verify/send/', {
        email: form.email,
      });
      setEmailMsg(res.data.message);
    } catch (err) {
      const msg = err.response?.data?.message || '이메일 인증 요청 실패';
      setEmailMsg(msg);
    } finally {
      setEmailLoading(false);
    }
  };

  const handleConfirmEmailCode = async () => {
    if (!code.trim()) {
      setCodeMsg('인증코드를 입력해주세요.');
      return;
    }

    setCodeLoading(true);
    try {
      const res = await api.post('/auth/email-verify/confirm/', {
        email: form.email,
        code: code,
      });
      setCodeMsg(res.data.message);
    } catch (err) {
      const msg = err.response?.data?.message || '인증 코드 확인 실패';
      setCodeMsg(msg);
    } finally {
      setCodeLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadMsg('이미지 업로드 중...');
      const res = await api.post('/auth/image-upload/', {
        filename: file.name,
        content_type: file.type,
      });

      const { upload_url, image_url } = res.data.data;

      await fetch(upload_url, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      });

      setForm((prev) => ({ ...prev, image_url }));
      setPreviewUrl(image_url);
      setUploadMsg('이미지 업로드 완료!');
    } catch (err) {
      setUploadMsg('이미지 업로드 실패');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="signup-container">
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

          .signup-container {
            min-height: 100vh;
            display: flex;
            background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
            position: relative;
            overflow: hidden;
          }

          .signup-container::before {
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

          .signup-sidebar {
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

          .signup-sidebar::before {
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

          .sidebar-steps {
            list-style: none;
            text-align: left;
          }

          .sidebar-steps li {
            color: #e2e8f0;
            margin-bottom: 0.75rem;
            display: flex;
            align-items: center;
            font-size: 0.95rem;
          }

          .sidebar-steps li::before {
            content: '';
            width: 8px;
            height: 8px;
            background: #10b981;
            border-radius: 50%;
            margin-right: 0.75rem;
            flex-shrink: 0;
          }

          .signup-main {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            position: relative;
            z-index: 2;
          }

          .signup-card {
            background: white;
            border-radius: 16px;
            box-shadow: 
              0 4px 6px -1px rgba(0, 0, 0, 0.1),
              0 2px 4px -1px rgba(0, 0, 0, 0.06),
              0 0 0 1px rgba(0, 0, 0, 0.05);
            padding: 3rem 2.5rem;
            width: 100%;
            max-width: 480px;
            position: relative;
            max-height: 90vh;
            overflow-y: auto;
          }

          .signup-card::before {
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

          .signup-header {
            text-align: center;
            margin-bottom: 2rem;
          }

          .signup-title {
            font-size: 1.875rem;
            font-weight: 700;
            color: #111827;
            margin-bottom: 0.5rem;
            letter-spacing: -0.01em;
          }

          .signup-subtitle {
            color: #6b7280;
            font-size: 1rem;
            font-weight: 400;
          }

          .signup-form {
            space-y: 1.5rem;
          }

          .form-group {
            margin-bottom: 1.5rem;
          }

          .form-group.inline {
            display: flex;
            gap: 0.75rem;
            align-items: flex-end;
          }

          .form-group.inline > .input-wrapper {
            flex: 1;
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

          .file-input-wrapper {
            position: relative;
            overflow: hidden;
            display: inline-block;
            width: 100%;
          }

          .file-input {
            position: absolute;
            left: -9999px;
          }

          .file-input-label {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            padding: 0.875rem 1rem;
            border: 1.5px dashed #d1d5db;
            border-radius: 8px;
            background: #f9fafb;
            cursor: pointer;
            transition: all 0.2s ease;
            font-size: 0.9rem;
            color: #6b7280;
          }

          .file-input-label:hover {
            border-color: #374151;
            background: #f3f4f6;
          }

          .file-input-label svg {
            width: 18px;
            height: 18px;
          }

          .image-preview {
            margin-top: 1rem;
            text-align: center;
          }

          .image-preview img {
            max-width: 150px;
            max-height: 150px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }

          .primary-button {
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

          .primary-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
            transition: left 0.5s ease;
          }

          .primary-button:hover:not(:disabled) {
            background: linear-gradient(135deg, #4b5563 0%, #6b7280 100%);
            transform: translateY(-1px);
            box-shadow: 0 8px 25px rgba(55, 65, 81, 0.3);
          }

          .primary-button:hover::before {
            left: 100%;
          }

          .primary-button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
          }

          .secondary-button {
            padding: 0.75rem 1.25rem;
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
            white-space: nowrap;
            min-width: 120px;
          }

          .secondary-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(55, 65, 81, 0.05), transparent);
            transition: left 0.3s ease;
          }

          .secondary-button:hover:not(:disabled) {
            border-color: #374151;
            color: #374151;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }

          .secondary-button:hover::before {
            left: 100%;
          }

          .secondary-button:disabled {
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

          .loading-spinner.dark {
            border: 2px solid rgba(107, 114, 128, 0.3);
            border-top-color: #6b7280;
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

          .message.info {
            background: #f0f9ff;
            border: 1px solid #bae6fd;
            color: #0284c7;
          }

          .message svg {
            width: 16px;
            height: 16px;
            flex-shrink: 0;
          }

          .signup-footer {
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

          .login-link {
            background: none;
            border: none;
            color: #374151;
            font-weight: 600;
            cursor: pointer;
            text-decoration: none;
            transition: color 0.2s ease;
            font-size: 0.875rem;
          }

          .login-link:hover {
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
            .signup-sidebar {
              display: none;
            }

            .signup-main {
              flex: none;
              width: 100%;
            }
          }

          @media (max-width: 768px) {
            .signup-main {
              padding: 1rem;
            }

            .signup-card {
              padding: 2rem 1.5rem;
            }

            .back-button {
              top: 1rem;
              left: 1rem;
            }

            .form-group.inline {
              flex-direction: column;
              gap: 1rem;
            }

            .form-group.inline > .input-wrapper {
              flex: none;
            }

            .secondary-button {
              width: 100%;
            }
          }

          @media (max-width: 480px) {
            .signup-card {
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
      <div className="signup-sidebar">
        <div className="sidebar-content">
          <div className="sidebar-logo">
            Neigh<span>viz</span>
          </div>
          <h2 className="sidebar-title">
            빠른 가입으로<br />
            파트너십 시작하기
          </h2>
          <p className="sidebar-description">
            몇 분만 투자하여 수천 개의 검증된 비즈니스 파트너와 연결되세요.
          </p>
          <ul className="sidebar-steps">
            <li>기본 정보 입력 및 이메일 인증</li>
            <li>프로필 이미지 업로드 (선택사항)</li>
            <li>즉시 파트너 매칭 서비스 이용 가능</li>
            <li>24/7 고객지원 서비스 제공</li>
          </ul>
        </div>
        <div className="company-info">
          © 2024 Neighviz. All rights reserved.
        </div>
      </div>

      {/* Main Signup Area */}
      <div className="signup-main">
        <div className="signup-card">
          <div className="signup-header">
            <h1 className="signup-title">회원가입</h1>
            <p className="signup-subtitle">Neighviz 계정을 생성하여 서비스를 시작하세요</p>
          </div>

          <div className="signup-form">
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                아이디 *
              </label>
              <div className="input-wrapper">
                <input
                  id="username"
                  name="username"
                  type="text"
                  className="form-input"
                  placeholder="아이디를 입력하세요"
                  value={form.username}
                  onChange={handleChange}
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="name" className="form-label">
                이름 *
              </label>
              <div className="input-wrapper">
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="form-input"
                  placeholder="이름을 입력하세요"
                  value={form.name}
                  onChange={handleChange}
                  autoComplete="name"
                />
              </div>
            </div>

            <div className="form-group inline">
              <div className="input-wrapper">
                <label htmlFor="email" className="form-label">
                  이메일 *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-input"
                  placeholder="이메일을 입력하세요"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>
              <button 
                className="secondary-button"
                onClick={handleSendEmailCode}
                disabled={emailLoading}
              >
                {emailLoading ? (
                  <div className="loading-spinner dark"></div>
                ) : (
                  '인증코드 전송'
                )}
              </button>
            </div>

            {emailMsg && (
              <div className={`message ${emailMsg.includes('성공') ? 'success' : 'info'}`}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {emailMsg}
              </div>
            )}

            <div className="form-group inline">
              <div className="input-wrapper">
                <label htmlFor="code" className="form-label">
                  인증코드
                </label>
                <input
                  id="code"
                  type="text"
                  className="form-input"
                  placeholder="인증코드를 입력하세요"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>
              <button 
                className="secondary-button"
                onClick={handleConfirmEmailCode}
                disabled={codeLoading}
              >
                {codeLoading ? (
                  <div className="loading-spinner dark"></div>
                ) : (
                  '인증코드 확인'
                )}
              </button>
            </div>

            {codeMsg && (
              <div className={`message ${codeMsg.includes('성공') ? 'success' : 'error'}`}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {codeMsg}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="phone_number" className="form-label">
                전화번호
              </label>
              <div className="input-wrapper">
                <input
                  id="phone_number"
                  name="phone_number"
                  type="tel"
                  className="form-input"
                  placeholder="전화번호를 입력하세요"
                  value={form.phone_number}
                  onChange={handleChange}
                  autoComplete="tel"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                비밀번호 *
              </label>
              <div className="input-wrapper">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="비밀번호를 입력하세요"
                  value={form.password}
                  onChange={handleChange}
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
            </div>

            <div className="form-group">
              <label className="form-label">
                프로필 이미지 (선택사항)
              </label>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="file-input"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="file-input-label">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  이미지 선택하기
                </label>
              </div>
              
              {uploadMsg && (
                <div className={`message ${uploadMsg.includes('완료') ? 'success' : uploadMsg.includes('중') ? 'info' : 'error'}`}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {uploadMsg}
                </div>
              )}
              
              {previewUrl && (
                <div className="image-preview">
                  <img src={previewUrl} alt="프로필 미리보기" />
                </div>
              )}
            </div>

            {error && (
              <div className="message error">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            {successMsg && (
              <div className="message success">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {successMsg}
              </div>
            )}

            <button 
              className="primary-button" 
              onClick={handleSignup}
              disabled={loading}
            >
              {loading && <div className="loading-spinner" />}
              {loading ? '가입 처리 중...' : '회원가입 완료'}
            </button>

            <div className="signup-footer">
              <p className="footer-text">이미 계정이 있으신가요?</p>
              <button 
                className="login-link"
                onClick={() => navigate('/login')}
              >
                로그인하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;