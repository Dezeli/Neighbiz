# 📬 안 읽은 알림 수 조회 API

## 🔎 GET `/notifications/unread-count/`

현재 로그인한 사용자의 안 읽은 알림 개수를 반환합니다.

### 🔹 Response 200 (성공)

```json
{
  "success": true,
  "message": "안 읽은 알림 수 조회 성공",
  "data": {
    "unread_count": 3
  }
}
```

### 🔖 설명

* `unread_count`는 읽지 않은 알림의 총 개수를 나타냅니다.
* 이 API는 일반적으로 페이지 로딩 시 또는 상단 알림 아이콘에 뱃지를 표시할 때 사용됩니다.
