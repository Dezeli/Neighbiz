# 🏪 마이페이지 정보 조회 API

## 🔎 GET `/stores/mypage/`

사용자의 가게 정보와 함께 작성한 게시글 목록, 제휴 요청 목록을 조회합니다.

### 🔹 Response 200 (성공)

```json
{
  "success": true,
  "message": "마이페이지 정보를 불러왔습니다.",
  "data": {
    "store": {
      "id": 1,
      "name": "디저트카페",
      "store_categories": [
        { "id": 1, "name": "카페" },
        { "id": 3, "name": "기타" }
      ]
    },
    "posts": [
      {
        "id": 5,
        "title": "제휴하고 싶어요!",
        "thumbnail": "https://bucket.s3.amazonaws.com/post/img1.jpg",
        "created_at": "2024-06-01T12:34:56Z"
      },
      ...
    ],
    "sent_requests": [
      {
        "id": 2,
        "post_id": 5,
        "receiver_store_name": "브런치하우스",
        "status": "요청됨",
        "message": "함께 이벤트 열어보고 싶어요!",
        "created_at": "2024-06-03T09:00:00Z"
      },
      ...
    ]
  }
}
```

### 🔖 설명

* `store`: 현재 로그인한 사용자의 가게 정보
* `posts`: 사용자가 작성한 게시글 목록 (썸네일 포함)
* `sent_requests`: 사용자가 보낸 제휴 요청 목록 (향후 확장 가능)
