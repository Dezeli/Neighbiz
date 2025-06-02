import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

function StoreCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    description: '',
    address: '',
    phone_number: '',
    available_time: '',
    categories: [],
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/posts/categories/')
      .then(res => setCategories(res.data.data))
      .catch(() => setCategories([]));
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleCategoryToggle = (id) => {
    setForm(prev => {
      const exists = prev.categories.includes(id);
      const updated = exists
        ? prev.categories.filter(cat => cat !== id)
        : [...prev.categories, id];
      return { ...prev, categories: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/stores/', form);
      navigate('/main');  // 또는 /mypage
    } catch (err) {
      setError(err.response?.data?.message || '가게 등록에 실패했습니다.');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">가게 정보 등록</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="상호명" value={form.name} onChange={handleChange} required />
        <textarea name="description" placeholder="가게 소개" value={form.description} onChange={handleChange} />
        <input name="address" placeholder="주소" value={form.address} onChange={handleChange} required />
        <input name="phone_number" placeholder="매장 연락처" value={form.phone_number} onChange={handleChange} required />
        <input name="available_time" placeholder="연락 가능 시간 (예: 10:00~18:00)" value={form.available_time} onChange={handleChange} required />

        <div>
          <p className="mb-1 font-semibold">희망 제휴 카테고리</p>
          {categories.map(cat => (
            <label key={cat.id} className="block">
              <input
                type="checkbox"
                checked={form.categories.includes(cat.id)}
                onChange={() => handleCategoryToggle(cat.id)}
              />
              <span className="ml-2">{cat.name}</span>
            </label>
          ))}
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          등록하기
        </button>
      </form>
    </div>
  );
}

export default StoreCreate;
