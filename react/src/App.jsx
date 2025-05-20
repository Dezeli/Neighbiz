import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Main from './pages/Main';
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
        <Route
          path="/main"
          element={
            <ProtectedRoute>
              <Main user={user} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
