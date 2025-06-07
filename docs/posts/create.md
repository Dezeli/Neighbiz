# ✅ 게시글 작성 API

## ✅ POST `/posts/`

사용자가 제휴를 원하는 가게 정보를 입력하여 게시글을 생성합니다.

> 🔸 **주의**: 이미지 업로드는 사전에 Presigned URL을 통해 별도로 진행해야 하며, 업로드된 이미지 URL을 함께 전송해야 합니다.

### 🔸 Request

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

### 🔹 Response 201 (성공)

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

### 🔖 설명

* `store_categories`는 여러 개 선택 가능하며, 고정된 카테고리 ID 리스트 중에서 선택합니다.
* 최소 하나 이상의 이미지를 업로드해야 하며, 최대 5장까지 지원합니다.
* 썸네일은 첫 번째 이미지 기준으로 설정됩니다.
