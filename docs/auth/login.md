# 🔐 로그인 API

## ✅ POST `/auth/login/`

로그인 후 JWT 토큰을 발급받습니다.

### 🔸 Request

```json
{
  "username": "exampleuser",
  "password": "password123"
}
```

### 🔹 Response 200 (성공)

```json
{
  "success": true,
  "message": "로그인에 성공했습니다.",
  "data": {
    "access": "JWT_ACCESS_TOKEN",
    "refresh": "JWT_REFRESH_TOKEN",
    "username": "exampleuser",
    "role": "user",
    "is_verified": true
  }
}
```

### 🔹 Response 401 (실패)

```json
{
  "success": false,
  "message": "아이디 또는 비밀번호가 올바르지 않습니다.",
  "data": null
}
```

### 🔖 설명

* 로그인 성공 시 `access`, `refresh` 토큰이 발급됩니다.
* `is_verified`는 이메일 인증 여부입니다.
* 토큰은 이후 인증된 요청 시 `Authorization: Bearer <access_token>` 헤더로 사용합니다.
