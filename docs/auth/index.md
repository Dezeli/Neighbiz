# 🔐 Auth API

`/auth/` 하위에서 동작하는 인증 관련 API 목록입니다.

| 기능                                       | 메서드  | 어느특화                             |
| ---------------------------------------- | ---- | -------------------------------- |
| [회원가입](signup.md)                        | POST | `/auth/signup/`                  |
| [로그인](login.md)                          | POST | `/auth/login/`                   |
| [토큰 감사](token_refresh.md)                | POST | `/auth/token/refresh/`           |
| [이메일 인증 코드 전송](email_send.md)            | POST | `/auth/email-verify/send/`       |
| [이메일 인증 확인](email_confirm.md)            | POST | `/auth/email-verify/confirm/`    |
| [비밀번호 재설정 요청](reset_password_request.md) | POST | `/auth/reset-password-request/`  |
| [비밀번호 링크 확인](reset_password_validate.md) | GET  | `/auth/reset-password-validate/` |
| [비밀번호 재설정 완료](reset_password_confirm.md) | POST | `/auth/reset-password-confirm/`  |
| [아이디 찾기](find_id.md)                     | POST | `/auth/find-id/`                 |
| [현재 로그인 사용자 정보 조회](me.md)                | GET  | `/auth/me/`                      |
