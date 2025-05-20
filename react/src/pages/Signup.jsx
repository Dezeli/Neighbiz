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
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      navigate('/main', { replace: true });
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    try {
      const res = await api.post('/auth/signup/', form);
      setSuccessMsg(res.data.message);
      setError('');
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (err) {
      const msg = err.response?.data?.message || '회원가입 실패';
      setError(msg);
    }
  };

  const handleSendEmailCode = async () => {
    try {
      const res = await api.post('/auth/email-verify/send/', {
        email: form.email,
      });
      setEmailMsg(res.data.message);
    } catch (err) {
      const msg = err.response?.data?.message || '이메일 인증 요청 실패';
      setEmailMsg(msg);
    }
  };

  const handleConfirmEmailCode = async () => {
    try {
      const res = await api.post('/auth/email-verify/confirm/', {
        email: form.email,
        code: code,
      });
      setCodeMsg(res.data.message);
    } catch (err) {
      const msg = err.response?.data?.message || '인증 코드 확인 실패';
      setCodeMsg(msg);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
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

  return (
    <div>
      <h1>회원가입</h1>
      <input name="username" placeholder="아이디" onChange={handleChange} />
      <input name="name" placeholder="이름" onChange={handleChange} />

      <input name="email" placeholder="이메일" onChange={handleChange} />
      <button onClick={handleSendEmailCode}>인증코드 전송</button>
      {emailMsg && <p>{emailMsg}</p>}

      <input
        placeholder="인증코드 입력"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button onClick={handleConfirmEmailCode}>인증코드 확인</button>
      {codeMsg && <p>{codeMsg}</p>}

      <input name="phone_number" placeholder="전화번호" onChange={handleChange} />
      <input name="password" type="password" placeholder="비밀번호" onChange={handleChange} />

      {/* ✅ 이미지 업로드 */}
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {uploadMsg && <p>{uploadMsg}</p>}
      {previewUrl && <img src={previewUrl} alt="미리보기" width={120} />}

      <button onClick={handleSignup}>가입하기</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMsg && <p style={{ color: 'green' }}>{successMsg}</p>}
    </div>
  );
}

export default Signup;
