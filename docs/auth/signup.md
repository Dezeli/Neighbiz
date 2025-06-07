# 회원가입 API

## ✅ POST `/auth/signup/`

이메일 인증 후 사용자 회원가입을 진행합니다.

### Request

```json
{
  "username": "exampleuser",
  "name": "홍길동",
  "email": "user@example.com",
  "phone_number": "01012345678",
  "password": "password123",
  "image_url": "https://bucket.s3.amazonaws.com/auth/images/abc.jpg"
}
```

### Response 201 (성공)

```json
{
  "success": true,
  "message": "회원가입 성공",
  "data": null
}
```

### Response 400 (실패 예시)

```json
{
  "success": false,
  "message": "입력값 오류",
  "data": {
    "email": ["이메일 인증이 완료되지 않았습니다."],
    "username": ["이미 사용 중인 사용자명입니다."]
  }
}
```
