# ✅ 비밀번호 재설정 링크 확인 API

## 🔎 GET `/auth/reset-password-validate/?uid=...&token=...`

전송된 비밀번호 재설정 링크의 유효성을 검증합니다. 프론트엔드는 이 링크를 통해 유효한 경우에만 비밀번호 입력 폼을 표시해야 합니다.

### 🔸 Request

* URL 쿼리 파라미터로 `uid`, `token`을 전달합니다.

예:

```
/auth/reset-password-validate/?uid=abc123&token=xyz456
```

### 🔹 Response 200 (성공)

```json
{
  "success": true,
  "message": "유효한 링크입니다.",
  "data": null
}
```

### 🔹 Response 400 (실패)

```json
{
  "success": false,
  "message": "유효하지 않은 링크입니다.",
  "data": {
    "token": ["만료되었거나 유효하지 않은 토큰입니다."]
  }
}
```

### 🔖 설명

* 이 API는 GET 방식이며, 사용자가 클릭한 이메일의 링크로 자동 접근됩니다.
* 유효하지 않은 경우, 사용자에게 비밀번호 재설정 페이지 대신 오류 메시지를 표시해야 합니다.
