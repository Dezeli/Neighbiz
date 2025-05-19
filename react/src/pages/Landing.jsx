import React from 'react';
import { Link } from 'react-router-dom';

function Landing() {
  return (
    <div>
      <h1>랜딩 페이지</h1>
      <Link to="/login">로그인</Link> | <Link to="/signup">회원가입</Link>
    </div>
  );
}

export default Landing;
