import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/axios';
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import { extractFirstError } from '../utils/error';
import defaultImage from '../assets/image.PNG';


const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Pretendard', sans-serif;
    background-color: #f8fafc;
  }
`;

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
`;

const ContentWrapper = styled.div`
  animation: fadeIn 0.3s ease-in-out;
`;

const HeaderSection = styled.div`
  margin-bottom: 20px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #3b82f6;
  font-size: 0.95rem;
  cursor: pointer;
  margin-bottom: 10px;
`;

const PostTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 8px;
`;

const PostMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  color: #475569;
`;

const MetaItem = styled.div`
  &:before {
    content: '${props => props.icon || ''} ';
  }
`;

const ContentSection = styled.section`
  margin-bottom: 32px;
  animation: fadeIn 0.4s ease-in-out;
  animation-delay: ${props => props.delay || '0s'};
`;

const SectionTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
`;

const SectionContent = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
`;

const ImagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 12px;
`;

const ImageCard = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 10px;
`;

const StyledImage = styled.img`
  width: 100%;
  height: 160px;
  object-fit: cover;
`;

const ImageOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  width: 100%;
  padding: 4px 8px;
  font-size: 0.85rem;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
`;

const InfoCard = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px;
  background: #f9fafb;
`;

const InfoLabel = styled.div`
  font-size: 0.85rem;
  color: #64748b;
  margin-bottom: 4px;
`;

const InfoValue = styled.div`
  font-size: 1rem;
  font-weight: 500;
`;

const MessageSection = styled.div`
  padding: 8px;
`;

const MessageText = styled.p`
  font-size: 1rem;
  line-height: 1.5;
  color: #334155;
`;

const CategoriesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const CategoryTag = styled.span`
  background-color: #e0f2fe;
  color: #0369a1;
  font-size: 0.9rem;
  padding: 4px 8px;
  border-radius: 8px;

  &:before {
    content: '${props => props.icon || ''} ';
  }
`;

const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 10px;
  padding: 24px;
  max-width: 500px;
  width: 90%;
`;

const ModalTextarea = styled.textarea`
  width: 100%;
  height: 120px;
  padding: 12px;
  font-size: 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  resize: vertical;
`;

const ModalError = styled.div`
  color: red;
  font-size: 0.85rem;
  margin-top: 8px;
`;

const ModalActions = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const ModalButton = styled.button`
  background-color: ${props => (props.primary ? '#3b82f6' : '#e5e7eb')};
  color: ${props => (props.primary ? 'white' : '#1f2937')};
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  border: none;
  cursor: pointer;
`;

const ErrorContainer = styled.div`
  text-align: center;
  margin-top: 100px;
`;

const ErrorIcon = styled.div`
  font-size: 4rem;
  color: #ef4444;
`;

const ErrorText = styled.p`
  font-size: 1.2rem;
  color: #334155;
  margin: 16px 0;
`;

const ErrorButton = styled.button`
  background-color: #3b82f6;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  border: none;
`;

const LoadingContainer = styled.div`
  text-align: center;
  margin-top: 100px;
`;

const LoadingSpinner = styled.div`
  border: 4px solid #f3f4f6;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 0.8s linear infinite;
  margin: 0 auto;
`;

const LoadingText = styled.p`
  margin-top: 12px;
  font-size: 1rem;
  color: #64748b;
`;


function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [partnerMessage, setPartnerMessage] = useState('');
  const [partnerError, setPartnerError] = useState('');

  useEffect(() => {
    const init = async () => {
      try {
        await api.get('/stores/me/');
      } catch (err) {
        navigate('/store/create');
        return;
      }

      try {
        setLoading(true);
        const res = await api.get(`/posts/${id}/`);
        setPost(res.data.data);
        setError(null);
      } catch (err) {
        setError(extractFirstError(err, '존재하지 않는 게시글이거나 오류가 발생했습니다.'));
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [id, navigate]);

  const handlePartnerRequest = async () => {
    if (!partnerMessage.trim()) {
      setPartnerError('제휴 요청 메시지를 입력해주세요.');
      return;
    }

    try {
      await api.post('/notifications/partner-request/', {
        post: post.id,
        message: partnerMessage,
      });

      alert('제휴 요청이 전송되었습니다.');
      setIsModalOpen(false);
      setPartnerMessage('');
      setPartnerError('');
    } catch (err) {
      setPartnerError(extractFirstError(err, '제휴 요청 전송 중 문제가 발생했습니다.'));
    }
  };

  if (error) {
    return (
      <>
        <GlobalStyle />
        <Container>
          <ContentWrapper>
            <ErrorContainer>
              <ErrorIcon />
              <ErrorText>{error}</ErrorText>
              <ErrorButton onClick={() => navigate('/main')}>목록으로 돌아가기</ErrorButton>
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
          <HeaderSection>
            <BackButton onClick={() => navigate('/main')}>← 목록으로 돌아가기</BackButton>
            <PostTitle>{post.title}</PostTitle>
            <PostMeta>
              <MetaItem icon="🏪">가게명: {post.store_name}</MetaItem>
              <MetaItem icon="📍">위치: {post.address}</MetaItem>
              <MetaItem icon="📞">연락처: {post.phone_number}</MetaItem>
            </PostMeta>
          </HeaderSection>

          <ContentSection delay="0.1s">
            <SectionTitle>매장 이미지</SectionTitle>
            <SectionContent>
              <ImagesGrid>
                {(post.images.length > 0 ? post.images : [defaultImage]).map((url, i) => (
                  <ImageCard key={i} index={i}>
                    <StyledImage
                      src={url}
                      alt={`${post.store_name} 이미지 ${i + 1}`}
                      onError={(e) => (e.target.src = defaultImage)}
                    />
                    <ImageOverlay>매장 사진 {i + 1}</ImageOverlay>
                  </ImageCard>
                ))}
              </ImagesGrid>
            </SectionContent>
          </ContentSection>

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

          <ContentSection delay="0.3s">
            <SectionTitle>가게 소개</SectionTitle>
            <SectionContent>
              <MessageText>{post.description}</MessageText>
            </SectionContent>
          </ContentSection>

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

          <ContentSection delay="0.6s" style={{ textAlign: 'center' }}>
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

          <ContentSection delay="0.7s" style={{ textAlign: 'center' }}>
            <button onClick={() => setIsModalOpen(true)}>제휴 맺어요</button>
          </ContentSection>

          {isModalOpen && (
            <ModalWrapper>
              <ModalContent>
                <h3>제휴 요청 메시지</h3>
                <ModalTextarea
                  value={partnerMessage}
                  onChange={(e) => setPartnerMessage(e.target.value)}
                  placeholder="간단한 소개와 함께 제휴 목적을 입력해주세요"
                />
                {partnerError && <ModalError>{partnerError}</ModalError>}
                <ModalActions>
                  <ModalButton onClick={() => setIsModalOpen(false)}>취소</ModalButton>
                  <ModalButton onClick={handlePartnerRequest} primary>보내기</ModalButton>
                </ModalActions>
              </ModalContent>
            </ModalWrapper>
          )}
        </ContentWrapper>
      </Container>
    </>
  );
}

export default PostDetail;