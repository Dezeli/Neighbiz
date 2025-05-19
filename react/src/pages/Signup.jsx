import React, { useState } from 'react';
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
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    try {
      const res = await api.post('/auth/signup/', form);
      setSuccessMsg(res.data.message);
      setError('');
    } catch (err) {
      const msg = err.response?.data?.message || '회원가입 실패';
      setError(msg);
    }
  };

  return (
    <div>
      <h1>회원가입</h1>
      <input name="username" placeholder="아이디" onChange={handleChange} />
      <input name="name" placeholder="이름" onChange={handleChange} />
      <input name="email" placeholder="이메일" onChange={handleChange} />
      <input name="phone_number" placeholder="전화번호" onChange={handleChange} />
      <input name="password" type="password" placeholder="비밀번호" onChange={handleChange} />
      <input name="image_url" placeholder="이미지 URL" onChange={handleChange} />
      <button onClick={handleSignup}>가입하기</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMsg && <p style={{ color: 'green' }}>{successMsg}</p>}
    </div>
  );
}

export default Signup;
