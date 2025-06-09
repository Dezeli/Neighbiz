# 🏪 가게 등록 API

## ✅ POST `/stores/`

사용자가 본인의 가게 정보를 등록합니다. 이 API는 최초 1회만 사용할 수 있으며, 이후 수정 기능은 별도로 제공될 수 있습니다.

### 🔸 Request

```json
{
  "name": "디저트카페",
  "store_categories": [1, 3]
}
```

### 🔹 Response 201 (성공)

```json
{
  "success": true,
  "message": "가게 등록이 완료되었습니다.",
  "data": {
    "id": 1,
    "name": "디저트카페"
  }
}
```

### 🔹 Response 400 (실패)

```json
{
  "success": false,
  "message": "입력값 오류",
  "data": {
    "store_categories": ["최소 1개 이상 선택해야 합니다."]
  }
}
```

### 🔖 설명

* `store_categories`는 고정된 ID 리스트 중 하나 이상 선택해야 합니다.
* 이미 가게를 등록한 사용자가 다시 요청할 경우 409 Conflict 등의 응답을 반환할 수 있습니다.
