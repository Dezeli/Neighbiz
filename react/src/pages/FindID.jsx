import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/axios';

function FindID() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    phone_number: '',
  });
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      navigate('/main', { replace: true });
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFind = async () => {
    try {
      const res = await api.post('/auth/find-id/', form);
      setResult(`당신의 아이디: ${res.data.data.username}`);
      setError('');
    } catch (err) {
      const msg = err.response?.data?.message || '아이디 찾기 실패';
      setError(msg);
      setResult('');
    }
  };

  return (
    <div>
      <h1>아이디 찾기</h1>
      <input
        name="email"
        placeholder="이메일"
        onChange={handleChange}
      />
      <input
        name="phone_number"
        placeholder="전화번호"
        onChange={handleChange}
      />
      <button onClick={handleFind}>아이디 찾기</button>
      {result && <p style={{ color: 'green' }}>{result}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default FindID;
