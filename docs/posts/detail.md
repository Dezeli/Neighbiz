# 🔍 게시글 상세 조회 API

## 🔎 GET `/posts/{id}/`

특정 게시글의 상세 정보를 조회합니다.

### 🔸 Path Parameter

* `id`: 조회할 게시글의 고유 ID (예: `/posts/3/`)

### 🔹 Response 200 (성공)

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
    "images": [
      "https://bucket.s3.amazonaws.com/post/images/abc.jpg"
    ],
    "partnership_categories": [
      "카페",
      "기타"
    ]
  }
}
```

### 🔖 설명

* 인증된 사용자만 조회할 수 있습니다.
* 존재하지 않는 ID에 접근할 경우 404 응답이 반환됩니다.
* `partnership_categories`는 선택한 카테고리 이름 배열로 제공됩니다.
