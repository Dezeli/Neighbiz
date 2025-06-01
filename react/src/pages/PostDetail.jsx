import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
    background-color: #f8fafc;
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

const fadeInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const fadeInScale = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
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

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Main Container
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 0;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 300px;
    background: linear-gradient(135deg, #1a1a1a, #374151);
    z-index: 0;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    padding: 20px 16px;
  }
`;

// Header Section
const HeaderSection = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 40px;
  margin-bottom: 30px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: ${fadeInUp} 0.8s ease;

  @media (max-width: 768px) {
    padding: 24px;
    margin-bottom: 20px;
  }
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #374151, #1a1a1a);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 24px;
  font-family: 'Pretendard', sans-serif;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
    background: linear-gradient(135deg, #1a1a1a, #000000);
  }

  &:active {
    transform: translateY(0);
  }

  &::before {
    content: '←';
    font-size: 1.1rem;
  }
`;

const PostTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  color: #1a1a1a;
  line-height: 1.3;
  margin-bottom: 16px;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.6rem;
  }
`;

const PostMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 500;

  &::before {
    content: '${props => props.icon || '•'}';
    color: #374151;
    font-weight: bold;
  }
`;

// Content Sections
const ContentSection = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  animation: ${fadeInUp} 0.8s ease;
  animation-delay: ${props => props.delay || '0s'};
  animation-fill-mode: both;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
  }

  @media (max-width: 768px) {
    padding: 24px;
    margin-bottom: 16px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.4rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  letter-spacing: -0.01em;

  &::before {
    content: '';
    width: 4px;
    height: 24px;
    background: linear-gradient(135deg, #374151, #1a1a1a);
    border-radius: 2px;
  }
`;

const SectionContent = styled.div`
  color: #4a5568;
  font-size: 1rem;
  line-height: 1.7;
`;

// Images Section
const ImagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 16px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const ImageCard = styled.div`
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background: #f1f5f9;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  animation: ${fadeInScale} 0.6s ease;
  animation-delay: ${props => (props.index * 0.1)}s;
  animation-fill-mode: both;

  &:hover {
    transform: scale(1.03);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
  }
`;

const StyledImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: white;
  padding: 16px;
  font-size: 0.85rem;
  font-weight: 500;
  opacity: 0;
  transition: opacity 0.3s ease;

  ${ImageCard}:hover & {
    opacity: 1;
  }
`;

// Info Grid
const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-top: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const InfoCard = styled.div`
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  border: 1px solid #e2e8f0;
  padding: 24px;
  border-radius: 12px;
  transition: all 0.3s ease;
  animation: ${slideIn} 0.6s ease;
  animation-delay: ${props => (props.index * 0.1)}s;
  animation-fill-mode: both;

  &:hover {
    background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
`;

const InfoLabel = styled.div`
  font-size: 0.85rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
`;

const InfoValue = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1.4;
`;

// Categories
const CategoriesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 20px;
`;

const CategoryTag = styled.span`
  background: linear-gradient(135deg, #374151, #1a1a1a);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
  animation: ${fadeInLeft} 0.6s ease;
  animation-delay: ${props => (props.index * 0.1)}s;
  animation-fill-mode: both;

  &:hover {
    transform: scale(1.05);
    background: linear-gradient(135deg, #1a1a1a, #000000);
  }

  &::before {
    content: '${props => props.icon || '#'}';
    font-size: 0.8rem;
  }
`;

// Message Section
const MessageSection = styled.div`
  background: linear-gradient(135deg, #f8fafc, #ffffff);
  border-left: 4px solid #374151;
  padding: 24px;
  margin-top: 20px;
  border-radius: 0 12px 12px 0;
  font-style: italic;
  position: relative;
  animation: ${fadeInUp} 0.8s ease 0.4s both;

  &::before {
    content: '"';
    position: absolute;
    top: -10px;
    left: 20px;
    font-size: 3rem;
    color: #9ca3af;
    font-family: serif;
    opacity: 0.3;
  }
`;

const MessageText = styled.p`
  font-size: 1.1rem;
  line-height: 1.7;
  color: #374151;
  margin: 0;
  padding-left: 20px;
`;

// Loading and Error States
const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 20px;
`;

const LoadingSpinner = styled.div`
  width: 60px;
  height: 60px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #374151;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: #64748b;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 24px;
  text-align: center;
  padding: 40px;
`;

const ErrorIcon = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  animation: ${pulse} 2s ease-in-out infinite;

  &::before {
    content: '⚠';
  }
`;

const ErrorText = styled.p`
  font-size: 1.2rem;
  color: #64748b;
  max-width: 500px;
  line-height: 1.6;
  margin-bottom: 20px;
`;

const ErrorButton = styled.button`
  background: linear-gradient(135deg, #374151, #1a1a1a);
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Pretendard', sans-serif;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
    background: linear-gradient(135deg, #1a1a1a, #000000);
  }
`;

// Skeleton Loading Components
const SkeletonBox = styled.div`
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 2s infinite;
  border-radius: 8px;
  height: ${props => props.height || '20px'};
  width: ${props => props.width || '100%'};
  margin-bottom: ${props => props.marginBottom || '12px'};
`;

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/posts/${id}/`)
      .then(res => {
        setPost(res.data.data);
        setError(null);
      })
      .catch(err => {
        console.error('게시글 불러오기 실패:', err);
        setError('존재하지 않는 게시글이거나 오류가 발생했습니다.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (error) {
    return (
      <>
        <GlobalStyle />
        <Container>
          <ContentWrapper>
            <ErrorContainer>
              <ErrorIcon />
              <ErrorText>{error}</ErrorText>
              <ErrorButton onClick={() => navigate('/main')}>
                목록으로 돌아가기
              </ErrorButton>
            </ErrorContainer>
          </ContentWrapper>
        </Container>
      </>
    );
  }

  if (loading || !post) {
    return (
      <>
        <GlobalStyle />
        <Container>
          <ContentWrapper>
            <LoadingContainer>
              <LoadingSpinner />
              <LoadingText>게시글을 불러오는 중...</LoadingText>
            </LoadingContainer>
          </ContentWrapper>
        </Container>
      </>
    );
  }

  return (
    <>
      <GlobalStyle />
      <Container>
        <ContentWrapper>
          {/* Header Section */}
          <HeaderSection>
            <BackButton onClick={() => navigate('/main')}>
              목록으로 돌아가기
            </BackButton>
            <PostTitle>{post.title}</PostTitle>
            <PostMeta>
              <MetaItem icon="🏪">가게명: {post.store_name}</MetaItem>
              <MetaItem icon="📍">위치: {post.address}</MetaItem>
              <MetaItem icon="📞">연락처: {post.phone_number}</MetaItem>
            </PostMeta>
          </HeaderSection>

          {/* Images Section */}
          <ContentSection delay="0.1s">
            <SectionTitle>매장 이미지</SectionTitle>
            <SectionContent>
              <ImagesGrid>
                {(post.images.length > 0 ? post.images : [defaultImage]).map((url, i) => (
                  <ImageCard key={i} index={i}>
                    <StyledImage
                      src={url}
                      alt={`${post.store_name} 이미지 ${i + 1}`}
                      onError={(e) => {
                        e.target.src = defaultImage;
                      }}
                    />
                    <ImageOverlay>
                      매장 사진 {i + 1}
                    </ImageOverlay>
                  </ImageCard>
                ))}
              </ImagesGrid>
            </SectionContent>
          </ContentSection>

          {/* Store Information */}
          <ContentSection delay="0.2s">
            <SectionTitle>가게 정보</SectionTitle>
            <SectionContent>
              <InfoGrid>
                <InfoCard index={0}>
                  <InfoLabel>가게 이름</InfoLabel>
                  <InfoValue>{post.store_name}</InfoValue>
                </InfoCard>
                <InfoCard index={1}>
                  <InfoLabel>주소</InfoLabel>
                  <InfoValue>{post.address}</InfoValue>
                </InfoCard>
                <InfoCard index={2}>
                  <InfoLabel>전화번호</InfoLabel>
                  <InfoValue>{post.phone_number}</InfoValue>
                </InfoCard>
                <InfoCard index={3}>
                  <InfoLabel>연락 가능 시간</InfoLabel>
                  <InfoValue>{post.available_time}</InfoValue>
                </InfoCard>
              </InfoGrid>
            </SectionContent>
          </ContentSection>

          {/* Store Description */}
          <ContentSection delay="0.3s">
            <SectionTitle>가게 소개</SectionTitle>
            <SectionContent>
              <p style={{ 
                fontSize: '1.1rem', 
                lineHeight: '1.8', 
                color: '#374151',
                whiteSpace: 'pre-line'
              }}>
                {post.description}
              </p>
            </SectionContent>
          </ContentSection>

          {/* Partnership Categories */}
          <ContentSection delay="0.4s">
            <SectionTitle>제휴 희망 카테고리</SectionTitle>
            <SectionContent>
              <CategoriesList>
                {post.partnership_categories.map((cat, i) => (
                  <CategoryTag key={i} index={i} icon="🤝">
                    {cat.name}
                  </CategoryTag>
                ))}
              </CategoriesList>
            </SectionContent>
          </ContentSection>

          {/* Extra Message */}
          {post.extra_message && (
            <ContentSection delay="0.5s">
              <SectionTitle>사업주의 한마디</SectionTitle>
              <SectionContent>
                <MessageSection>
                  <MessageText>{post.extra_message}</MessageText>
                </MessageSection>
              </SectionContent>
            </ContentSection>
          )}

          {/* Action Section */}
          <ContentSection delay="0.6s" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)' }}>
            <SectionTitle style={{ justifyContent: 'center' }}>문의하기</SectionTitle>
            <SectionContent>
              <p style={{ marginBottom: '24px', fontSize: '1.1rem', color: '#64748b' }}>
                이 매장과 제휴를 원하신다면 아래 연락처로 직접 문의해주세요.
              </p>
              <InfoGrid style={{ maxWidth: '600px', margin: '0 auto' }}>
                <InfoCard>
                  <InfoLabel>📞 전화 문의</InfoLabel>
                  <InfoValue>{post.phone_number}</InfoValue>
                </InfoCard>
                <InfoCard>
                  <InfoLabel>⏰ 연락 시간</InfoLabel>
                  <InfoValue>{post.available_time}</InfoValue>
                </InfoCard>
              </InfoGrid>
            </SectionContent>
          </ContentSection>
        </ContentWrapper>
      </Container>
    </>
  );
}

export default PostDetail;