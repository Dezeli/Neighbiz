import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import api from '../lib/axios';
import { extractFirstError } from '../utils/error';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Pretendard:wght@300;400;500;600;700;800;900&display=swap');
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    line-height: 1.6;
    color: #1a1a1a;
    background: #f8fafc;
  }
`;

// Animations
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

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
  100% {
    transform: scale(1);
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

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

// Main Container
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%);
  padding: 2rem 1rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 20% 80%, rgba(26, 26, 26, 0.03) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(74, 85, 104, 0.03) 0%, transparent 50%);
    pointer-events: none;
  }

  @media (max-width: 768px) {
    padding: 1rem 0.5rem;
  }
`;

// Header Section
const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
  z-index: 2;
  animation: ${fadeInUp} 0.8s ease;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 4px;
    background: linear-gradient(135deg, #1a1a1a, #374151);
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #64748b;
  margin-top: 1rem;
  font-weight: 500;
`;

// Form Container
const FormContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
  animation: ${fadeInUp} 0.8s ease 0.2s both;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: linear-gradient(135deg, #1a1a1a, #374151, #4a5568);
  }
`;

const Form = styled.form`
  padding: 3rem 2.5rem;

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
  }
`;

// Form Sections
const FormSection = styled.div`
  margin-bottom: 2.5rem;
  animation: ${slideInLeft} 0.6s ease ${props => props.delay || '0s'} both;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: '';
    width: 4px;
    height: 20px;
    background: linear-gradient(135deg, #1a1a1a, #374151);
    border-radius: 2px;
  }
`;

// Input Styles
const InputGroup = styled.div`
  margin-bottom: 1.5rem;
  position: relative;
`;

const Label = styled.label`
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  transition: color 0.2s ease;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1.25rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  color: #1a1a1a;
  background: white;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #1a1a1a;
    box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.1);
    transform: translateY(-1px);
  }

  &:hover {
    border-color: #9ca3af;
  }

  &::placeholder {
    color: #9ca3af;
    font-weight: 400;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem 1.25rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  color: #1a1a1a;
  background: white;
  transition: all 0.3s ease;
  resize: vertical;
  min-height: 120px;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: #1a1a1a;
    box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.1);
    transform: translateY(-1px);
  }

  &:hover {
    border-color: #9ca3af;
  }

  &::placeholder {
    color: #9ca3af;
    font-weight: 400;
  }
`;

// File Upload
const FileUploadContainer = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
`;

const FileInput = styled.input`
  position: absolute;
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  z-index: -1;
`;

const FileUploadLabel = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f9fafb;
  min-height: 120px;

  &:hover {
    border-color: #1a1a1a;
    background: #f3f4f6;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const FileUploadIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: #6b7280;
`;

const FileUploadText = styled.div`
  text-align: center;
  color: #6b7280;
  font-weight: 500;
  
  strong {
    color: #1a1a1a;
    font-weight: 700;
  }
`;

const FileUploadHint = styled.div`
  font-size: 0.8rem;
  color: #9ca3af;
  margin-top: 0.5rem;
`;

const ImagePreviewContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const ImagePreview = styled.div`
  position: relative;
  aspect-ratio: 1;
  background: #f3f4f6;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #e5e7eb;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }
`;

// Category Selection
const CategoryContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 0.75rem;
  margin-top: 1rem;
`;

const CategoryButton = styled.button`
  padding: 0.75rem 1rem;
  border: 2px solid ${props => props.selected ? '#1a1a1a' : '#e5e7eb'};
  border-radius: 8px;
  background: ${props => props.selected 
    ? 'linear-gradient(135deg, #1a1a1a, #374151)' 
    : 'white'};
  color: ${props => props.selected ? 'white' : '#64748b'};
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transition: left 0.5s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    border-color: #1a1a1a;
    
    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0);
  }

  &:hover:not([disabled]) {
    ${props => !props.selected && `
      background: #f8fafc;
      color: #1a1a1a;
    `}
  }
`;

// Submit Button
const SubmitButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding-top: 2rem;
  border-top: 2px solid #f1f5f9;
  margin-top: 2rem;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const SubmitButton = styled.button`
  padding: 1rem 2.5rem;
  background: linear-gradient(135deg, #1a1a1a, #374151);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  min-width: 160px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transition: left 0.5s ease;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
    background: linear-gradient(135deg, #000000, #1a1a1a);
    
    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const CancelButton = styled.button`
  padding: 1rem 2.5rem;
  background: rgba(255, 255, 255, 0.8);
  color: #64748b;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 160px;

  &:hover {
    background: white;
    border-color: #1a1a1a;
    color: #1a1a1a;
    transform: translateY(-1px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }
`;

// Loading Spinner
const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  margin-right: 0.5rem;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const FloatingElement = styled.div`
  position: absolute;
  width: ${props => props.size || '20px'};
  height: ${props => props.size || '20px'};
  background: ${props => props.color || 'rgba(26, 26, 26, 0.05)'};
  border-radius: 50%;
  top: ${props => props.top || '50%'};
  left: ${props => props.left || '50%'};
  animation: ${float} ${props => props.duration || '3s'} ease-in-out infinite;
  animation-delay: ${props => props.delay || '0s'};
  pointer-events: none;
`;

function PostCreate() {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedStoreCategories, setSelectedStoreCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    store_name: '',
    description: '',
    address: '',
    phone_number: '',
    available_time: '',
    extra_message: '',
  });

  useEffect(() => {
    const init = async () => {
      try {
        await api.get('/stores/me/');
      } catch {
        navigate('/store/create');
        return;
      }

      try {
        const res = await api.get('/posts/categories/');
        setCategories(res.data.data);
      } catch (err) {
        setError(extractFirstError(err) || '카테고리 불러오기에 실패했습니다.');
      }
    };
    init();
  }, [navigate]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    setImages(files);
    const previewUrls = files.map(file => URL.createObjectURL(file));
    setImagePreviewUrls(previewUrls);
  };

  const toggleCategory = (catId) => {
    setSelectedCategories(prev =>
      prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
    );
  };

  const toggleStoreCategory = (catId) => {
    setSelectedStoreCategories(prev =>
      prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
    );
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    if (window.confirm('작성 중인 내용이 사라집니다. 정말 취소하시겠습니까?')) {
      navigate('/main');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const requiredFields = {
      title: '제목을 입력해주세요.',
      store_name: '가게명을 입력해주세요.',
      description: '가게 소개를 입력해주세요.',
      address: '주소를 입력해주세요.',
      phone_number: '전화번호를 입력해주세요.',
      available_time: '연락 가능 시간을 입력해주세요.',
    };

    for (const field in requiredFields) {
      if (!form[field]?.trim()) {
        setError(requiredFields[field]);
        return;
      }
    }

    if (images.length === 0) {
      setError('이미지는 최소 1장 이상 업로드해야 합니다.');
      return;
    }

    if (images.length > 5) {
      setError('이미지는 최대 5장까지만 업로드할 수 있습니다.');
      return;
    }

    if (selectedCategories.length === 0) {
      setError('제휴 카테고리를 최소 1개 이상 선택해주세요.');
      return;
    }

    if (selectedStoreCategories.length === 0) {
      setError('사업장 카테고리를 최소 1개 이상 선택해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const uploadUrls = await Promise.all(
        images.map(file =>
          api.post('/posts/image-upload/', {
            filename: file.name,
            content_type: file.type,
          })
        )
      );
      const uploadLinks = uploadUrls.map(res => res.data.data);

      await Promise.all(
        images.map((file, i) =>
          fetch(uploadLinks[i].upload_url, {
            method: 'PUT',
            body: file,
            headers: { 'Content-Type': file.type },
          })
        )
      );

      const imageData = uploadLinks.map((link, index) => ({
        image_url: link.image_url,
        is_thumbnail: index === 0,
      }));

      await api.post('/posts/', {
        ...form,
        images: imageData,
        store_categories: selectedStoreCategories,
        partnership_categories: selectedCategories,
      });

      alert('게시글이 성공적으로 등록되었습니다!');
      navigate('/main');
    } catch (err) {
      console.error('게시글 등록 실패:', err);
      setError(extractFirstError(err) || '업로드에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div style={{ padding: 20 }}>
      <h1>게시글 작성</h1>
      <form onSubmit={handleSubmit}>
        <input name="title" value={form.title} onChange={handleChange} placeholder="제목" />
        <input name="store_name" value={form.store_name} onChange={handleChange} placeholder="사업장 이름" />
        <input name="description" value={form.description} onChange={handleChange} placeholder="설명" />
        <input name="address" value={form.address} onChange={handleChange} placeholder="주소" />
        <input name="phone_number" value={form.phone_number} onChange={handleChange} placeholder="전화번호" />
        <input name="available_time" value={form.available_time} onChange={handleChange} placeholder="연락 가능 시간" />
        <textarea name="extra_message" value={form.extra_message} onChange={handleChange} placeholder="추가 메시지" />

        <input type="file" accept="image/*" multiple onChange={handleFileChange} />

        <h2>사업장 카테고리 선택</h2>
        {categories.map(cat => (
          <button
            type="button"
            key={`store-${cat.id}`}
            onClick={() => toggleStoreCategory(cat.id)}
            style={{
              margin: '4px',
              backgroundColor: selectedStoreCategories.includes(cat.id) ? '#d1fae5' : '#f3f4f6',
            }}
          >
            {selectedStoreCategories.includes(cat.id) ? '✅' : '⬜'} {cat.name}
          </button>
        ))}

        <h2>제휴 카테고리 선택</h2>
        {categories.map(cat => (
          <button
            type="button"
            key={`partnership-${cat.id}`}
            onClick={() => toggleCategory(cat.id)}
            style={{
              margin: '4px',
              backgroundColor: selectedCategories.includes(cat.id) ? '#e0f2fe' : '#f3f4f6',
            }}
          >
            {selectedCategories.includes(cat.id) ? '✅' : '⬜'} {cat.name}
          </button>
        ))}

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? '등록 중...' : '등록'}
        </button>
        <button type="button" onClick={handleCancel}>취소</button>
      </form>
    </div>
  );
}

export default PostCreate;
