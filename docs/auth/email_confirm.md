# ✅ 이메일 인증 확인 API

## 🔽 POST `/auth/email-verify/confirm/`

사용자가 받은 인증 코드를 입력하여 인증을 완료합니다.

### 🔸 Request

```json
{
  "email": "user@example.com",
  "code": "123456"
}
```

### 🔹 Response 200 (성공)

```json
{
  "success": true,
  "message": "이메일 인증이 완료되었습니다.",
  "data": null
}
```

### 🔹 Response 400 (실패)

```json
{
  "success": false,
  "message": "인증 실패",
  "data": {
    "code": ["인증 코드가 일치하지 않거나 만료되었습니다."]
  }
}
```

### 🔖 설명

* 인증 코드는 일정 시간이 지나면 만료됩니다.
* 인증 완료 후 해당 이메일은 다시 인증할 수 없습니다.
* 인증이 완료되지 않으면 회원가입이 불가능합니다.
