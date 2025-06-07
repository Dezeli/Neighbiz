# 🔔 Notifications API

`/api/v1/notifications/` 하위에서 제공되는 알림 관련 API입니다. 제휴 요청 생성, 알림 목록 조회, 읽음 처리 등의 기능을 포함합니다.

| 기능                              | 메서드  | 엔드포인트                                    |
| ------------------------------- | ---- | ---------------------------------------- |
| [제휴 요청 생성](partner_request.md)  | POST | `/api/v1/notifications/partner-request/` |
| [알림 목록 조회](list.md)             | GET  | `/api/v1/notifications/mypage/`          |
| [읽음 처리](mark_read.md)           | POST | `/api/v1/notifications/mark-read/`       |
| [안 읽은 알림 수 조회](unread_count.md) | GET  | `/api/v1/notifications/unread-count/`    |