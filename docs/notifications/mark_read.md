# 📩 알림 읽음 처리 API

## ✅ PATCH `/notifications/{notification_id}/read/`

특정 알림을 읽음 상태로 변경합니다. 일반적으로 마우스 오버 시 자동 처리됩니다.

### 🔸 Path Parameter

* `notification_id` (int): 읽음 처리할 알림의 ID

### 🔹 Response 200 (성공)

```json
{
  "success": true,
  "message": "알림을 읽음 처리했습니다.",
  "data": {}
}
```

### 🔹 Response 404 (실패)

```json
{
  "success": false,
  "message": "해당 알림이 존재하지 않습니다.",
  "data": {}
}
```

### 🔖 설명

* 이 API는 일반적으로 프론트에서 마우스 오버 이벤트 시 호출됩니다.
* 수신자가 아닌 경우 접근할 수 없습니다.
