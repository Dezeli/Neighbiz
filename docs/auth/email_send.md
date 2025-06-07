# 📧 이메일 인증 코드 전송 API

## 🔼 POST `/auth/email-verify/send/`

회원가입 전, 이메일로 인증 코드를 전송합니다.

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
  "message": "이메일로 인증 코드를 전송했습니다.",
  "data": null
}
```

### 🔹 Response 400 (실패)

```json
{
  "success": false,
  "message": "입력값 오류",
  "data": {
    "email": ["이미 가입된 이메일입니다."]
  }
}
```

### 🔖 설명

* 이메일 형식 검증이 이루어집니다.
* 이미 등록된 이메일일 경우 오류로 응답합니다.
* 인증 코드는 별도 만료 시간이 설정되어 있으며, 재전송 가능합니다.
