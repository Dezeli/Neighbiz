import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import api from '../lib/axios';

const Container = styled.div`
  min-height: 100vh;
  padding: 40px 20px;
  background: linear-gradient(to right, #f8fafc, #e2e8f0);
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Pretendard', sans-serif;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1.5rem;
`;

const Form = styled.div`
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Input = styled.input`
  padding: 12px 16px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
  background-color: white;

  &:focus {
    border-color: #2563eb;
  }
`;

const Button = styled.button`
  padding: 12px;
  background-color: #2563eb;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background-color: #1d4ed8;
  }
`;

const SubButton = styled(Button)`
  background-color: white;
  color: #2563eb;
  border: 1.5px solid #2563eb;

  &:hover {
    background-color: #eff6ff;
  }
`;

const Text = styled.p`
  font-size: 0.9rem;
  color: ${({ type }) =>
    type === 'error' ? 'red' : type === 'success' ? 'green' : '#374151'};
  margin: 4px 0;
`;

const ImagePreview = styled.img`
  margin-top: 8px;
  width: 120px;
  border-radius: 6px;
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
    <Container>
      <Title>회원가입</Title>
      <Form>
        <Input name="username" placeholder="아이디" onChange={handleChange} />
        <Input name="name" placeholder="이름" onChange={handleChange} />
        <Input name="email" placeholder="이메일" onChange={handleChange} />
        <SubButton onClick={handleSendEmailCode}>인증코드 전송</SubButton>
        {emailMsg && <Text>{emailMsg}</Text>}

        <Input
          placeholder="인증코드 입력"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <SubButton onClick={handleConfirmEmailCode}>인증코드 확인</SubButton>
        {codeMsg && <Text>{codeMsg}</Text>}

        <Input name="phone_number" placeholder="전화번호" onChange={handleChange} />
        <Input name="password" type="password" placeholder="비밀번호" onChange={handleChange} />
        <Input type="file" accept="image/*" onChange={handleImageUpload} />
        {uploadMsg && <Text>{uploadMsg}</Text>}
        {previewUrl && <ImagePreview src={previewUrl} alt="미리보기" />}

        <Button onClick={handleSignup}>가입하기</Button>
        {error && <Text type="error">{error}</Text>}
        {successMsg && <Text type="success">{successMsg}</Text>}
      </Form>
    </Container>
  );
}

export default Signup;
