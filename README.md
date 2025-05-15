# 🛂 Neighviz API 문서 (MVP)

모든 API는 `https://your-domain.com/api/v1/` 하위에서 동작합니다.
응답은 아래의 공통 포맷을 따릅니다.

```json
// 성공 시
{
  "success": true,
  "message": "성공 메시지",
  "data": { ... }
}

// 실패 시
{
  "success": false,
  "message": "오류 메시지",
  "data": {
    "필드명": ["오류 설명"]
  }
}
```

---

## 📚 목차

* [회원가입](#회원가입)
* [로그인](#로그인)
* [토큰 갱신](#토큰-갱신)
* [이메일 인증 코드 전송](#이메일-인증-코드-전송)
* [이메일 인증 확인](#이메일-인증-확인)
* [비밀번호 재설정 요청](#비밀번호-재설정-요청)
* [비밀번호 재설정 링크 확인](#비밀번호-재설정-링크-확인)
* [비밀번호 재설정 완료](#비밀번호-재설정-완료)
* [아이디 찾기](#아이디-찾기)
* [Presigned 이미지 업로드](#presigned-이미지-업로드)

---

## 회원가입

### ✅ POST `/auth/signup/`

* 회원가입 (이메일 인증 후 가능)

**Request**

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

**Response 201 (성공)**

```json
{
  "success": true,
  "message": "회원가입 성공",
  "data": null
}
```

**Response 400 (실패 예시)**

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

## 로그인

### 🔁 POST `/auth/login/`

* 로그인 후 JWT 토큰 발급

**Request**

```json
{
  "username": "exampleuser",
  "password": "password123"
}
```

**Response 200 (성공)**

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

**Response 401 (실패)**

```json
{
  "success": false,
  "message": "아이디 또는 비밀번호가 올바르지 않습니다.",
  "data": null
}
```

## 토큰 갱신

### ♻️ POST `/auth/token/refresh/`

* Refresh 토큰으로 Access 토큰 갱신

**Request**

```json
{
  "refresh": "JWT_REFRESH_TOKEN"
}
```

**Response 200 (성공)**

```json
{
  "access": "NEW_ACCESS_TOKEN"
}
```

**Response 401 (실패)**

```json
{
  "code": "token_not_valid",
  "detail": "Token is invalid or expired",
  "messages": [...]
}
```

## 이메일 인증 코드 전송

### 🔼 POST `/auth/email-verify/send/`

* 인증 코드 이메일 전송 (회원가입 전)

**Request**

```json
{
  "email": "user@example.com"
}
```

**Response 200 (성공)**

```json
{
  "success": true,
  "message": "이메일로 인증 코드를 전송했습니다.",
  "data": null
}
```

**Response 400 (실패)**

```json
{
  "success": false,
  "message": "입력값 오류",
  "data": {
    "email": ["이미 가입된 이메일입니다."]
  }
}
```

## 이메일 인증 확인

### 🔽 POST `/auth/email-verify/confirm/`

* 인증 코드 확인

**Request**

```json
{
  "email": "user@example.com",
  "code": "123456"
}
```

**Response 200 (성공)**

```json
{
  "success": true,
  "message": "이메일 인증이 완료되었습니다.",
  "data": null
}
```

**Response 400 (실패)**

```json
{
  "success": false,
  "message": "입력값 오류",
  "data": {
    "code": ["인증 코드가 일치하지 않습니다."]
  }
}
```

## 비밀번호 재설정 요청

### 🔐 POST `/auth/reset-password-request/`

* 비밀번호 재설정 링크 이메일로 전송

**Request**

```json
{
  "email": "user@example.com"
}
```

**Response 200 (성공)**

```json
{
  "success": true,
  "message": "비밀번호 재설정 링크를 이메일로 전송했습니다.",
  "data": null
}
```

**Response 400 (실패)**

```json
{
  "success": false,
  "message": "입력값 오류",
  "data": {
    "email": ["해당 이메일로 등록된 사용자가 없습니다."]
  }
}
```

## 비밀번호 재설정 링크 확인

### 🔎 GET `/auth/reset-password-validate/?uid=...&token=...`

* 전송된 링크 유효성 검사 (프론트에서 GET 요청)

**Response 200 (성공)**

```json
{
  "success": true,
  "message": "유효한 링크입니다.",
  "data": null
}
```

**Response 400 (실패)**

```json
{
  "success": false,
  "message": "유효하지 않은 링크입니다.",
  "data": {
    "token": ["만료되었거나 유효하지 않은 토큰입니다."]
  }
}
```

## 비밀번호 재설정 완료

### 🔄 POST `/auth/reset-password-confirm/`

* 새 비밀번호 입력으로 재설정 완료

**Request**

```json
{
  "uid": "encoded_uid",
  "token": "reset_token",
  "new_password": "newpassword123"
}
```

**Response 200 (성공)**

```json
{
  "success": true,
  "message": "비밀번호가 성공적으로 변경되었습니다.",
  "data": null
}
```

**Response 400 (실패)**

```json
{
  "success": false,
  "message": "입력값 오류",
  "data": {
    "token": ["만료되었거나 유효하지 않은 토큰입니다."]
  }
}
```

## 아이디 찾기

### POST `/auth/find-id/`

* 전화번호 + 이메일 기반으로 마스킹된 username 반환

**Request**

```json
{
  "email": "user@example.com",
  "phone_number": "01012345678"
}
```

**Response 200 (성공)**

```json
{
  "success": true,
  "message": "일치하는 계정이 확인되었습니다.",
  "data": {
    "username": "exa****r"
  }
}
```

**Response 400 (실패)**

```json
{
  "success": false,
  "message": "입력값 오류",
  "data": {
    "non_field_errors": ["일치하는 사용자가 없습니다."]
  }
}
```

## Presigned 이미지 업로드

### POST `/auth/image-upload/`

* S3 Presigned URL 발급 (프론트에서 직접 이미지 업로드)

**Request**

```json
{
  "filename": "selfie.png",
  "content_type": "image/png"
}
```

**Response 200 (성공)**

```json
{
  "success": true,
  "message": "Presigned URL 생성 성공",
  "data": {
    "upload_url": "https://bucket.s3.amazonaws.com/auth/images/...",
    "image_url": "https://bucket.s3.amazonaws.com/auth/images/..."
  }
}
```

**Response 400 (실패)**

```json
{
  "success": false,
  "message": "입력값 오류",
  "data": {
    "content_type": ["지원하지 않는 형식입니다."]
  }
}
```
