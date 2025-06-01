import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Main from './pages/Main';
import PostCreate from './pages/PostCreate';
import PostDetail from './pages/PostDetail';
import FindID from './pages/FindID';
import ResetPassword from './pages/ResetPassword';
import ResetPasswordConfirm from './pages/ResetPasswordConfirm';
import useAuthCheck from './hooks/useAuthCheck';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { authChecked, user } = useAuthCheck();

  if (!authChecked) return <div>로딩 중...</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/find-id" element={<FindID />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-password-confirm" element={<ResetPasswordConfirm />} />

        {/* 보호된 페이지들 */}
        <Route
          path="/main"
          element={
            <ProtectedRoute>
              <Main user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/post/create"
          element={
            <ProtectedRoute>
              <PostCreate user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/post/:id"
          element={
            <ProtectedRoute>
              <PostDetail user={user} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
