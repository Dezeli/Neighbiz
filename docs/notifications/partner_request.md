# 🤝 제휴 요청 생성 API

## ✅ POST `/notifications/partner-request/`

특정 게시글(Post)에 대해 제휴 요청을 생성합니다. 요청자는 해당 게시글의 작성자에게 제휴 의사를 전달하게 됩니다.

### 🔸 Request

```json
{
  "post": 5,
  "message": "함께 제휴해보는 건 어떨까요?"
}
```

### 🔹 Response 201 (성공)

```json
{
  "success": true,
  "message": "제휴 요청이 전송되었습니다.",
  "data": {
    "id": 12,
    "post": 5,
    "message": "함께 제휴해보는 건 어떨까요?",
    "status": "요청됨",
    "created_at": "2024-06-04T14:00:00Z"
  }
}
```

### 🔹 Response 400 (실패)

```json
{
  "success": false,
  "message": "이미 요청을 보낸 게시글입니다.",
  "data": {}
}
```

### 🔖 설명

* 같은 게시글(Post)에 대해 중복 제휴 요청을 보낼 수 없습니다.
* `message`는 필수이며 1자 이상 입력해야 합니다.
* 요청이 성공하면, 해당 게시글 작성자에게 알림이 전송됩니다.
