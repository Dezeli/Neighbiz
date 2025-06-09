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

* [Auth API](auth/index.md)
* [Posts API](posts/index.md)
* [Stores API](stores/index.md)
* [Notifications API](notifications/index.md)
