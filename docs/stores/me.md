# 🏪 내 가게 정보 조회 API

## 🔎 GET `/stores/me/`

현재 로그인한 사용자의 가게 정보를 조회합니다.

### 🔹 Response 200 (성공)

```json
{
  "success": true,
  "message": "가게 정보를 불러왔습니다.",
  "data": {
    "id": 1,
    "name": "디저트카페",
    "store_categories": [
      { "id": 1, "name": "카페" },
      { "id": 3, "name": "기타" }
    ]
  }
}
```

### 🔖 설명

* 인증된 사용자만 조회할 수 있으며, 해당 사용자의 가게 정보가 없는 경우 404 응답을 반환합니다.
* `store_categories`는 선택한 카테고리의 ID 및 이름을 함께 제공합니다.
