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
* [현재 로그인 사용자 정보 조회](#현재-로그인-사용자-정보-조회)
* [게시글 작성](#게시글-작성)
* [게시글 상세 조회](#게시글-상세-조회)
* [카테고리 목록](#카테고리-목록)
* [Presigned 이미지 업로드 (게시글용)](#presigned-이미지-업로드-게시글용)
* [가게 등록](#가게-등록)
* [내 가게 정보 조회](#내-가게-정보-조회)
* [마이페이지 정보 조회](#마이페이지-정보-조회)
* [제휴 요청 생성](#제휴-요청-생성)
* [알림 목록 조회](#알림-목록-조회)
* [알림 읽음 처리](#알림-읽음-처리)
* [안읽은 알림 개수 조회](#안읽은-알림-개수-조회)

---


# Users API

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


## 현재 로그인 사용자 정보 조회
### GET `/auth/me/`

* 로그인된 사용자의 정보를 조회.

**Request**
* Headers
```http
Authorization: Bearer <access_token>
```
**Response 200 (성공)**
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
**Response 401 (토큰 오류)**
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

# 📬 Posts API

## 게시글 작성

### ✅ POST `/posts/`

* 게시글을 생성합니다. Presigned URL 방식으로 이미지 업로드를 먼저 수행해야 합니다.

**Request**

```json
{
  "title": "제휴하고 싶은 가게입니다!",
  "description": "신선한 디저트를 만드는 카페입니다.",
  "store_name": "디저트카페",
  "address": "서울시 강남구 ...",
  "phone_number": "01012345678",
  "available_time": "10:00~18:00",
  "extra_message": "연락 기다리겠습니다!",
  "store_categories": [1, 3],
  "images": [
    "https://bucket.s3.amazonaws.com/post/images/abc.jpg"
  ]
}
```

**Response 201 (성공)**

```json
{
  "success": true,
  "message": "게시글이 성공적으로 등록되었습니다.",
  "data": {
    "id": 3,
    "title": "제휴하고 싶은 가게입니다!"
  }
}
```

---

## 게시글 상세 조회

### 🔎 GET `/posts/{id}/`

* 게시글 상세 정보를 조회합니다.

**Response 200 (성공)**

```json
{
  "success": true,
  "message": "게시글 정보를 불러왔습니다.",
  "data": {
    "id": 3,
    "title": "제휴하고 싶은 가게입니다!",
    "description": "신선한 디저트를 만드는 카페입니다.",
    "store_name": "디저트카페",
    "address": "서울시 강남구 ...",
    "phone_number": "01012345678",
    "available_time": "10:00~18:00",
    "extra_message": "연락 기다리겠습니다!",
    "images": ["https://..."],
    "partnership_categories": ["카페", "기타"]
  }
}
```

---

## 카테고리 목록

### 📂 GET `/posts/categories/`

**Response 200**

```json
{
  "success": true,
  "message": "카테고리 목록을 불러왔습니다.",
  "data": [
    {"id": 1, "name": "카페"},
    {"id": 2, "name": "음식점"},
    {"id": 3, "name": "기타"}
  ]
}
```

---

## Presigned 이미지 업로드 (게시글용)

### 🔼 POST `/posts/image-upload/`

**Request**

```json
{
  "filename": "post_img.jpg",
  "content_type": "image/jpeg"
}
```

**Response 200**

```json
{
  "success": true,
  "message": "Presigned URL 생성 성공",
  "data": {
    "upload_url": "https://bucket.s3.amazonaws.com/...",
    "image_url": "https://bucket.s3.amazonaws.com/..."
  }
}
```

---

# 🏪 Stores API

## 가게 등록

### ✅ POST `/stores/`

**Request**

```json
{
  "name": "디저트카페",
  "description": "신선한 디저트를 만드는 카페입니다.",
  "address": "서울시 강남구 ...",
  "phone_number": "01012345678",
  "available_time": "10:00~18:00",
  "categories": [1, 3]
}
```

**Response 201**

```json
{
  "success": true,
  "message": "가게 등록이 완료되었습니다.",
  "data": {
    "name": "디저트카페"
  }
}
```

---

## 내 가게 정보 조회

### 🔎 GET `/stores/me/`

**Response 200**

```json
{
  "success": true,
  "message": "가게 정보를 불러왔습니다.",
  "data": {
    "name": "디저트카페",
    "description": "신선한 디저트를 만드는 카페입니다.",
    "address": "서울시 강남구 ...",
    "phone_number": "01012345678",
    "available_time": "10:00~18:00",
    "categories": [
      {"id": 1, "name": "카페"},
      {"id": 3, "name": "기타"}
    ]
  }
}
```

---

## 마이페이지 정보 조회

### 📄 GET `/stores/mypage/`

**Response 200**

```json
{
  "success": true,
  "message": "마이페이지 데이터를 불러왔습니다.",
  "data": {
    "store": {
      "name": "디저트카페",
      "description": "신선한 디저트를 만드는 카페입니다.",
      "address": "서울시 강남구 ...",
      "phone_number": "01012345678",
      "available_time": "10:00~18:00",
      "categories": [
        {"id": 1, "name": "카페"},
        {"id": 3, "name": "기타"}
      ]
    },
    "my_posts": [
      {
        "id": 3,
        "title": "제휴하고 싶은 가게입니다!",
        "thumbnail_url": "https://...",
        "created_at": "2025-06-04T12:00:00Z"
      }
    ],
    "sent_requests": []
  }
}
```

---

# 🔔 Notifications API

## 제휴 요청 생성

### ✅ POST `/notifications/partner-request/`

**Request**

```json
{
  "post": 3,
  "message": "안녕하세요, 제휴 제안드립니다."
}
```

**Response 201**

```json
{
  "success": true,
  "message": "제휴 요청이 전송되었습니다.",
  "data": {
    "post": 3,
    "message": "안녕하세요, 제휴 제안드립니다."
  }
}
```

---

## 알림 목록 조회

### 🔔 GET `/notifications/`

**Response 200**

```json
{
  "success": true,
  "message": "알림 목록을 불러왔습니다.",
  "data": [
    {
      "id": 1,
      "sender_username": "철수",
      "message": "안녕하세요, 제휴 제안드립니다.",
      "post": 3,
      "is_read": false,
      "created_at": "2025-06-04T12:00:00Z"
    }
  ]
}
```

---

## 알림 읽음 처리

### 🟢 PATCH `/notifications/{id}/read/`

**Response 200**

```json
{
  "success": true,
  "message": "알림을 읽음 처리했습니다.",
  "data": null
}
```

---

## 안읽은 알림 개수 조회

### 🔢 GET `/notifications/unread-count/`

**Response 200**

```json
{
  "success": true,
  "message": "안읽은 알림 수를 반환합니다.",
  "data": {
    "unread_count": 3
  }
}
```
