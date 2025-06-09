# 🔑 비밀번호 재설정 요청 API

## 📨 POST `/auth/reset-password-request/`

비밀번호 재설정을 위한 링크를 이메일로 전송합니다.

### 🔸 Request

```json
{
  "email": "user@example.com"
}
```

### 🔹 Response 200 (성공)

```json
{
  "success": true,
  "message": "비밀번호 재설정 링크를 이메일로 전송했습니다.",
  "data": null
}
```

### 🔹 Response 400 (실패)

```json
{
  "success": false,
  "message": "입력값 오류",
  "data": {
    "email": ["등록되지 않은 이메일입니다."]
  }
}
```

### 🔖 설명

* 이메일로 전송되는 링크는 일정 시간 동안만 유효합니다.
* 해당 링크는 비밀번호 재설정 폼 페이지로 연결됩니다.
* 이메일이 유효하지 않거나 등록되지 않은 경우 오류가 발생합니다.
