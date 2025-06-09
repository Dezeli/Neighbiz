# 🔔 알림 목록 조회 API

## 🔎 GET `/notifications/mypage/`

로그인한 사용자에게 도착한 알림 목록을 조회합니다.

### 🔹 Response 200 (성공)

```json
{
  "success": true,
  "message": "알림 목록 조회 성공",
  "data": [
    {
      "id": 1,
      "sender_name": "카페라떼",
      "post_title": "제휴 제안드립니다",
      "message": "같이 이벤트 해요!",
      "is_read": false,
      "created_at": "2024-06-05T09:30:00Z"
    },
    {
      "id": 2,
      "sender_name": "피자나라",
      "post_title": "할인 제안",
      "message": "공동 마케팅 어떠세요?",
      "is_read": true,
      "created_at": "2024-06-04T13:20:00Z"
    }
  ]
}
```

### 🔖 설명

* 알림은 최신순으로 정렬되어 반환됩니다.
* `is_read`는 읽음 여부를 나타냅니다.
* 각 알림은 해당 게시글(Post) 및 보낸 가게(sender)에 대한 정보를 함께 제공합니다.
