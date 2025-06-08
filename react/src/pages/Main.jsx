import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import api from '../lib/axios';
import defaultImage from '../assets/image.PNG';
import { extractFirstError } from '../utils/error';

function Main() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/');
  };

  const handleWrite = () => navigate('/post/create');
  const handleMyPage = () => navigate('/mypage');

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications/');
      setNotifications(res.data.data);
    } catch (err) {
      setError(extractFirstError(err, '알림 목록을 불러오지 못했습니다.'));
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get('/notifications/unread-count/');
      setUnreadCount(res.data.data.unread_count);
    } catch (err) {
      setError(extractFirstError(err, '알림 개수를 불러오지 못했습니다.'));
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read/`);
      setNotifications(prev => prev.map(n => (n.id === id ? { ...n, is_read: true } : n)));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      setError(extractFirstError(err, '알림 읽음 처리에 실패했습니다.'));
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
      } catch {
        navigate('/store/create');
        return;
      }

      try {
        const postRes = await api.get('/posts/');
        setPosts(postRes.data.data);
      } catch (err) {
        setError(extractFirstError(err, '게시글을 불러오지 못했습니다.'));
      } finally {
        setLoading(false);
      }

      try {
        const catRes = await api.get('/posts/categories/');
        setCategories(catRes.data.data);
      } catch (err) {
        setError(extractFirstError(err, '카테고리를 불러오지 못했습니다.'));
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

  return (
    <>
      <header>
        <h1>Neighviz</h1>
        <div>
          <button onClick={() => {
            fetchNotifications();
            setShowDropdown(!showDropdown);
          }}>
            알림 {unreadCount > 0 && '(!)'}
          </button>
          {showDropdown && (
            <div ref={dropdownRef}>
              <h4>알림</h4>
              {notifications.length === 0 ? (
                <p>알림이 없습니다.</p>
              ) : (
                notifications.map(n => (
                  <div
                    key={n.id}
                    style={{ fontWeight: n.is_read ? 'normal' : 'bold' }}
                    onMouseEnter={() => !n.is_read && markAsRead(n.id)}
                    onClick={() => navigate(`/post/${n.post}`)}
                  >
                    <p>{n.sender_username}님의 제안: {n.message}</p>
                    <small>{new Date(n.created_at).toLocaleString()}</small>
                  </div>
                ))
              )}
            </div>
          )}
          <button onClick={handleWrite}>제휴 글쓰기</button>
          <button onClick={handleMyPage}>마이페이지</button>
          <button onClick={handleLogout}>로그아웃</button>
        </div>
      </header>

      <main>
        <h2>제휴 파트너 찾기</h2>
        <p>검증된 사업자들과 함께 성장할 기회를 발견하세요</p>

        <section>
          <h3>카테고리</h3>
          {categoriesLoading ? (
            <p>로딩 중...</p>
          ) : (
            categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => toggleCategory(cat.name)}
                style={{
                  fontWeight: selectedCategories.includes(cat.name) ? 'bold' : 'normal'
                }}
              >
                {cat.name}
              </button>
            ))
          )}
        </section>

        {selectedCategories.length > 0 && (
          <p>선택된 카테고리: {selectedCategories.join(', ')}</p>
        )}

        <section>
          <h3>제휴 제안서 목록</h3>
          {loading ? (
            <p>불러오는 중...</p>
          ) : filteredPosts.length === 0 ? (
            <p>제안서가 없습니다.</p>
          ) : (
            <ul>
              {filteredPosts.map((post) => (
                <li key={post.id} onClick={() => navigate(`/post/${post.id}`)}>
                  <img
                    src={post.images?.[0]?.image_url || defaultImage}
                    alt="썸네일"
                    width="100"
                    onError={(e) => {
                      e.target.src = defaultImage;
                    }}
                  />
                  <div>
                    <strong>{post.title}</strong> - {post.store_name}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {error && <p style={{ color: 'red' }}>{error}</p>}
      </main>
    </>
  );
}

export default Main;
