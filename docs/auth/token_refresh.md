# 🔄 토큰 갱신 API

## ♻️ POST `/auth/token/refresh/`

Refresh 토큰을 이용하여 새로운 Access 토큰을 발급받습니다.

### 🔸 Request

```json
{
  "refresh": "JWT_REFRESH_TOKEN"
}
```

### 🔹 Response 200 (성공)

```json
{
  "access": "NEW_ACCESS_TOKEN"
}
```

### 🔹 Response 401 (실패)

```json
{
  "code": "token_not_valid",
  "detail": "Token is invalid or expired",
  "messages": [
    {
      "token_class": "RefreshToken",
      "token_type": "refresh",
      "message": "Token is invalid or expired"
    }
  ]
}
```

### 🔖 설명

* 유효한 Refresh 토큰만 허용됩니다.
* 실패 시 토큰 만료, 위조 등의 원인을 응답으로 알려줍니다.
