# ✅ 현재 로그인 사용자 정보 조회 API

## 👤 GET `/auth/me/`

현재 로그인한 사용자의 정보를 반환합니다.

### 📥 Request

* Header에 JWT Access Token 필요

```http
Authorization: Bearer <access_token>
```

### 📤 Response 200 (성공)

```json
{
  "success": true,
  "message": "현재 로그인한 사용자 정보입니다.",
  "data": {
    "id": 1,
    "username": "exampleuser",
    "name": "홍길동",
    "email": "user@example.com",
    "role": "user",
    "is_verified": true
  }
}
```

### 📤 Response 401 (실패 - 토큰 오류)

```json
{
  "success": false,
  "message": "Given token not valid for any token type",
  "data": {
    "detail": "Given token not valid for any token type",
    "code": "token_not_valid",
    "messages": [
      {
        "token_class": "AccessToken",
        "token_type": "access",
        "message": "Token is invalid"
      }
    ]
  }
}
```

### 🔖 설명

* 올바른 access token이 필요합니다.
* 유효하지 않거나 만료된 토큰인 경우 401 에러가 발생합니다.
