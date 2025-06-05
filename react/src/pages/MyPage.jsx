import React, { useEffect, useState } from 'react';
import api from '../lib/axios';
import { useNavigate } from 'react-router-dom';

function MyPage() {
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      try {
        await api.get('/stores/me/');
      } catch (err) {
        if (isMounted) {
          navigate('/store/create');
        }
        return;
      }

      try {
        const [storeRes, postsRes, categoryRes, notiRes] = await Promise.all([
          api.get('/stores/me/'),
          api.get('/posts/myposts/'),
          api.get('/posts/categories/'),
          api.get('/notifications/mypage/')
        ]);

        if (isMounted) {
          setStore(storeRes.data.data);
          setPosts(Array.isArray(postsRes.data.data) ? postsRes.data.data : []);
          setCategories(Array.isArray(categoryRes.data.data) ? categoryRes.data.data : []);
          setSentRequests(
            Array.isArray(notiRes.data.data?.sent_requests)
              ? notiRes.data.data.sent_requests
              : []
          );
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || '마이페이지 정보를 불러오지 못했습니다.');
        }
      }
    };

    init();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const getCategoryName = (id) => {
    const match = categories.find(cat => cat.id === id);
    return match ? match.name : null;
  };

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!store) {
    return <p className="text-gray-600">가게 정보를 불러오는 중입니다...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* 내 가게 정보 */}
      <section>
        <h2 className="text-xl font-bold mb-2">내 가게 정보</h2>
        <div className="border rounded p-4 bg-white">
          <p><strong>상호명:</strong> {store.name}</p>
          <p><strong>카테고리:</strong>{' '}
            {Array.isArray(store.categories) && store.categories.length > 0
              ? store.categories.map(id => getCategoryName(id)).filter(Boolean).join(', ')
              : '없음'}
          </p>
        </div>
      </section>

      {/* 내가 작성한 글 */}
      <section>
        <h2 className="text-xl font-bold mb-2">내가 작성한 글</h2>
        {posts.length === 0 ? (
          <p className="text-gray-500">아직 작성한 게시글이 없습니다.</p>
        ) : (
          <ul className="space-y-3">
            {posts.map(post => (
              <li
                key={post.id}
                onClick={() => navigate(`/post/${post.id}`)}
                className="cursor-pointer p-3 border rounded hover:bg-gray-50"
              >
                <p className="font-semibold">{post.title}</p>
                <p className="text-sm text-gray-500">
                  등록일: {new Date(post.created_at).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* 제휴 요청한 가게 */}
      <section>
        <h2 className="text-xl font-bold mb-2">제휴 요청한 가게</h2>
        {sentRequests.length === 0 ? (
          <p className="text-gray-500">아직 보낸 제휴 요청이 없습니다.</p>
        ) : (
          <ul className="space-y-3">
            {sentRequests.map(req => (
              <li
                key={req.id}
                onClick={() => navigate(`/post/${req.post}`)}
                className="cursor-pointer p-3 border rounded hover:bg-gray-50"
              >
                <p className="font-semibold">{req.post_title}</p>
                <p className="text-gray-600 text-sm mt-1">"{req.message}"</p>
                <p className="text-xs text-gray-500 mt-1">
                  보낸 날짜: {new Date(req.created_at).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* 글 작성하기 버튼 */}
      <div className="text-right">
        <button
          onClick={() => navigate('/post/create')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          글 작성하기
        </button>
      </div>
    </div>
  );
}

export default MyPage;
