import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import api from '../lib/axios';
import defaultImage from '../assets/image.PNG';


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
    overflow-x: hidden;
  }

  html {
    scroll-behavior: smooth;
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

const fadeInDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(50px);
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

const gradientMove = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

// Main Container
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  position: relative;
`;

// Header
const Header = styled.header`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
`;

const HeaderContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;

  @media (max-width: 768px) {
    padding: 0 16px;
    height: 70px;
  }
`;

const Logo = styled.div`
  font-size: 1.8rem;
  font-weight: 900;
  color: #1a1a1a;
  letter-spacing: -0.02em;
  animation: ${fadeInDown} 0.8s ease;
  
  span {
    color: #4a5568;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  animation: ${fadeInDown} 0.8s ease 0.2s both;

  @media (max-width: 480px) {
    gap: 12px;
  }
`;

const HeaderButton = styled.button`
  padding: 12px 24px;
  font-size: 0.95rem;
  font-weight: 600;
  border-radius: 8px;
  border: none;
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

  &:hover::before {
    left: 100%;
  }

  @media (max-width: 480px) {
    padding: 10px 16px;
    font-size: 0.9rem;
  }
`;

const WriteButton = styled(HeaderButton)`
  background: linear-gradient(135deg, #1a1a1a, #374151);
  color: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
    background: linear-gradient(135deg, #000000, #1a1a1a);
  }

  &:active {
    transform: translateY(0);
  }
`;

const LogoutButton = styled(HeaderButton)`
  background: rgba(255, 255, 255, 0.8);
  color: #4a5568;
  border: 1px solid rgba(74, 85, 104, 0.2);

  &:hover {
    background: rgba(255, 255, 255, 1);
    color: #1a1a1a;
    border-color: rgba(74, 85, 104, 0.3);
    transform: translateY(-1px);
  }
`;

// Main Content
const MainContent = styled.main`
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 24px;
  animation: ${fadeInUp} 0.8s ease 0.3s both;

  @media (max-width: 768px) {
    padding: 24px 16px;
  }
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  color: #1a1a1a;
  margin-bottom: 12px;
  letter-spacing: -0.02em;
  animation: ${slideInLeft} 0.8s ease;

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.6rem;
  }
`;

const PageSubtitle = styled.p`
  font-size: 1.1rem;
  color: #64748b;
  margin-bottom: 40px;
  animation: ${slideInLeft} 0.8s ease 0.1s both;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 32px;
  }
`;

// Category Section
const CategorySection = styled.section`
  background: white;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.04);
  animation: ${fadeInUp} 0.8s ease 0.4s both;

  @media (max-width: 768px) {
    padding: 24px;
    margin-bottom: 32px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: '🏷️';
    font-size: 1.2rem;
  }

  @media (max-width: 768px) {
    font-size: 1.3rem;
    margin-bottom: 16px;
  }
`;

const CategoryContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;

  @media (max-width: 480px) {
    gap: 8px;
  }
`;

const CategoryButton = styled.button`
  padding: 12px 20px;
  font-size: 0.9rem;
  font-weight: 500;
  border-radius: 24px;
  border: 2px solid ${props => props.selected ? '#1a1a1a' : 'rgba(74, 85, 104, 0.2)'};
  background: ${props => props.selected 
    ? 'linear-gradient(135deg, #1a1a1a, #374151)' 
    : 'rgba(255, 255, 255, 0.8)'};
  color: ${props => props.selected ? 'white' : '#4a5568'};
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

  &:hover::before {
    left: 100%;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    ${props => !props.selected && `
      background: white;
      border-color: rgba(74, 85, 104, 0.3);
    `}
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 480px) {
    padding: 10px 16px;
    font-size: 0.85rem;
  }
`;

// Posts Section
const PostsSection = styled.section`
  animation: ${fadeInUp} 0.8s ease 0.5s both;
`;

const PostsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

const PostsTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: '📋';
    font-size: 1.2rem;
  }

  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

const PostsCount = styled.span`
  background: linear-gradient(135deg, #1a1a1a, #374151);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const PostsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const PostCard = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.04);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  animation: ${fadeInUp} 0.6s ease ${props => props.index * 0.1}s both;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(26, 26, 26, 0) 0%, rgba(26, 26, 26, 0.05) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);

    &::before {
      opacity: 1;
    }
  }

  &:active {
    transform: translateY(-4px) scale(1.01);
  }
`;

const PostImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 220px;
  overflow: hidden;
  background: linear-gradient(135deg, #f1f5f9, #e2e8f0);

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.3));
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  ${PostCard}:hover &::after {
    opacity: 1;
  }
`;

const PostImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${PostCard}:hover & {
    transform: scale(1.1);
  }
`;

const PostContent = styled.div`
  padding: 24px;

  @media (max-width: 480px) {
    padding: 20px;
  }
`;

const PostTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

const PostStore = styled.p`
  font-size: 0.95rem;
  color: #64748b;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 6px;

  &::before {
    content: '🏪';
    font-size: 0.9rem;
  }
`;

const PostMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
`;

const PostCategories = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const CategoryTag = styled.span`
  background: linear-gradient(135deg, rgba(26, 26, 26, 0.05), rgba(55, 65, 81, 0.05));
  color: #4a5568;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid rgba(74, 85, 104, 0.1);
`;

const PostStatus = styled.div`
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
`;

// Empty State
const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.04);
  animation: ${fadeInUp} 0.8s ease;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.5;
  animation: ${float} 3s ease-in-out infinite;
`;

const EmptyTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
`;

const EmptyText = styled.p`
  color: #64748b;
  font-size: 1rem;
  line-height: 1.6;
`;

// Loading States
const LoadingCard = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.04);
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

const LoadingImage = styled.div`
  width: 100%;
  height: 220px;
  background: linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 50%, #f1f5f9 100%);
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s ease-in-out infinite;
`;

const LoadingContent = styled.div`
  padding: 24px;
`;

const LoadingLine = styled.div`
  height: ${props => props.height || '16px'};
  background: linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 50%, #f1f5f9 100%);
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s ease-in-out infinite;
  border-radius: 8px;
  margin-bottom: ${props => props.marginBottom || '12px'};
  width: ${props => props.width || '100%'};
`;

// Floating Action Button
const FloatingButton = styled.button`
  position: fixed;
  bottom: 32px;
  right: 32px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1a1a1a, #374151);
  color: white;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  z-index: 999;
  animation: ${float} 3s ease-in-out infinite;

  &:hover {
    transform: scale(1.1) translateY(-2px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    bottom: 24px;
    right: 24px;
    width: 56px;
    height: 56px;
    font-size: 1.3rem;
  }
`;

// Custom Scrollbar
const ScrollContainer = styled.div`
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #1a1a1a, #374151);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #000000, #1a1a1a);
  }
`;

function Main() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/');
  };

  const handleWrite = () => {
    navigate('/post/create');
  };

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications/');
      setNotifications(res.data.data);
    } catch (err) {
      console.error('알림 목록 불러오기 실패:', err);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get('/notifications/unread-count/');
      setUnreadCount(res.data.data.unread_count);
    } catch (err) {
      console.error('알림 개수 불러오기 실패:', err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read/`);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('알림 읽음 처리 실패:', err);
    }
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        await api.get('/stores/me/');
      } catch (err) {
        navigate('/store/create');
        return;
      }

      try {
        const postRes = await api.get('/posts/');
        setPosts(postRes.data.data);
      } catch (err) {
        console.error('게시글 불러오기 실패:', err);
      } finally {
        setLoading(false);
      }

      try {
        const catRes = await api.get('/posts/categories/');
        setCategories(catRes.data.data);
      } catch (err) {
        console.error('카테고리 불러오기 실패:', err);
      } finally {
        setCategoriesLoading(false);
      }

      fetchUnreadCount();
    };

    init();
  }, [navigate]);

  const toggleCategory = (categoryName) => {
    setSelectedCategories(prev =>
      prev.includes(categoryName)
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  const filteredPosts = selectedCategories.length === 0
    ? posts
    : posts.filter(post =>
        post.partnership_categories.some(cat => selectedCategories.includes(cat.name))
      );

  const renderLoadingCards = () => {
    return Array.from({ length: 6 }).map((_, index) => (
      <LoadingCard key={index}>
        <LoadingImage />
        <LoadingContent>
          <LoadingLine height="20px" width="80%" marginBottom="12px" />
          <LoadingLine height="16px" width="60%" marginBottom="16px" />
          <LoadingLine height="12px" width="100%" marginBottom="8px" />
          <LoadingLine height="12px" width="40%" />
        </LoadingContent>
      </LoadingCard>
    ));
  };

  return (
    <>
      <GlobalStyle />
      <ScrollContainer>
        <Container>
          <Header>
            <HeaderContent>
              <Logo>
                Neigh<span>viz</span>
              </Logo>
              <HeaderActions>
                <div style={{ position: 'relative', marginRight: '12px' }}>
                  <button onClick={() => {
                    fetchNotifications();
                    setShowDropdown(!showDropdown);
                  }}>
                    🔔
                    {unreadCount > 0 && <span style={{ color: 'red', marginLeft: 4 }}>!</span>}
                  </button>
                  {showDropdown && (
                    <div ref={dropdownRef} style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      background: '#fff',
                      border: '1px solid #ddd',
                      padding: '12px',
                      width: '280px',
                      maxHeight: '300px',
                      overflowY: 'auto',
                      zIndex: 1000
                    }}>
                      <p style={{ marginBottom: '8px', fontWeight: 'bold' }}>알림</p>
                      {notifications.length === 0 ? (
                        <p>알림이 없습니다.</p>
                      ) : (
                        notifications.map(n => (
                          <div
                            key={n.id}
                            style={{
                              fontWeight: n.is_read ? 'normal' : 'bold',
                              marginBottom: '10px',
                              cursor: 'pointer'
                            }}
                            onMouseEnter={() => !n.is_read && markAsRead(n.id)}
                            onClick={() => navigate(`/post/${n.post}`)}
                          >
                            <div>{n.sender_username}님의 제안: {n.message}</div>
                            <div style={{ fontSize: '0.8rem', color: '#888' }}>
                              {new Date(n.created_at).toLocaleString()}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
                <WriteButton onClick={handleWrite}>
                  ✏️ 제휴 글쓰기
                </WriteButton>
                <LogoutButton onClick={handleLogout}>
                  🚪 로그아웃
                </LogoutButton>
              </HeaderActions>
            </HeaderContent>
          </Header>

          <MainContent>
            <PageTitle>제휴 파트너 찾기</PageTitle>
            <PageSubtitle>
              검증된 사업자들과 함께 성장할 수 있는 최적의 제휴 기회를 발견하세요
            </PageSubtitle>

            <CategorySection>
              <SectionTitle>업종별 카테고리</SectionTitle>
              <CategoryContainer>
                {categoriesLoading ? (
                  Array.from({ length: 8 }).map((_, index) => (
                    <LoadingLine 
                      key={index} 
                      height="44px" 
                      width="120px" 
                      marginBottom="0"
                      style={{ borderRadius: '24px' }}
                    />
                  ))
                ) : (
                  categories.map((cat) => (
                    <CategoryButton
                      key={cat.id}
                      selected={selectedCategories.includes(cat.name)}
                      onClick={() => toggleCategory(cat.name)}
                    >
                      {cat.name}
                    </CategoryButton>
                  ))
                )}
              </CategoryContainer>
              {selectedCategories.length > 0 && (
                <div style={{ marginTop: '16px', fontSize: '0.9rem', color: '#64748b' }}>
                  선택된 카테고리: {selectedCategories.join(', ')}
                </div>
              )}
            </CategorySection>

            <PostsSection>
              <PostsHeader>
                <PostsTitle>제휴 제안서</PostsTitle>
                <PostsCount>
                  총 {filteredPosts.length}개의 제안서
                </PostsCount>
              </PostsHeader>

              <PostsGrid>
                {loading ? (
                  renderLoadingCards()
                ) : filteredPosts.length === 0 ? (
                  <div style={{ gridColumn: '1 / -1' }}>
                    <EmptyState>
                      <EmptyIcon>📭</EmptyIcon>
                      <EmptyTitle>
                        {selectedCategories.length > 0 
                          ? '선택한 카테고리에 해당하는 제안서가 없습니다' 
                          : '등록된 제안서가 없습니다'}
                      </EmptyTitle>
                      <EmptyText>
                        {selectedCategories.length > 0 
                          ? '다른 카테고리를 선택하거나 필터를 초기화해보세요' 
                          : '첫 번째 제휴 제안서를 작성해보세요!'}
                      </EmptyText>
                    </EmptyState>
                  </div>
                ) : (
                  filteredPosts.map((post, index) => (
                    <PostCard
                      key={post.id}
                      index={index}
                      onClick={() => navigate(`/post/${post.id}`)}
                    >
                      <PostImageContainer>
                        <PostImage
                          src={
                            post.images && Array.isArray(post.images) && post.images.length > 0
                              ? post.images[0]
                              : defaultImage
                          }
                          alt={`${post.title} 썸네일`}
                          onError={(e) => {
                            e.target.src = defaultImage;
                          }}
                        />
                      </PostImageContainer>
                      <PostContent>
                        <PostTitle>{post.title}</PostTitle>
                        <PostStore>{post.store_name}</PostStore>
                        <PostMeta>
                          <PostCategories>
                            {post.partnership_categories && post.partnership_categories.slice(0, 2).map((cat, idx) => (
                              <CategoryTag key={idx}>
                                {cat.name}
                              </CategoryTag>
                            ))}
                            {post.partnership_categories && post.partnership_categories.length > 2 && (
                              <CategoryTag>
                                +{post.partnership_categories.length - 2}
                              </CategoryTag>
                            )}
                          </PostCategories>
                          <PostStatus>활성</PostStatus>
                        </PostMeta>
                      </PostContent>
                    </PostCard>
                  ))
                )}
              </PostsGrid>
            </PostsSection>
          </MainContent>

          <FloatingButton 
            onClick={handleWrite}
            title="새 제휴 제안서 작성"
          >
            ✏️
          </FloatingButton>
        </Container>
      </ScrollContainer>
    </>
  );
}

export default Main;