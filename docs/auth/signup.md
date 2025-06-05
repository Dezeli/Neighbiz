# 🔐 회원가입 API

**POST /api/v1/auth/signup/**

이 API는 이메일과 비밀번호로 회원가입을 처리합니다.

## 요청 예시

```json
{
  "email": "test@example.com",
  "password": "securepassword"
}
```

## 응답 예시

```json
{
  "success": true,
  "message": "회원가입 성공",
  "data": {}
}
```
