# ✅ 비밀번호 재설정 완료 API

## 🔄 POST `/auth/reset-password-confirm/`

전송받은 링크에 포함된 UID와 토큰을 통해 새로운 비밀번호를 설정합니다.

### 🔸 Request

```json
{
  "uid": "encoded_uid",
  "token": "reset_token",
  "new_password": "newpassword123"
}
```

### 🔹 Response 200 (성공)

```json
{
  "success": true,
  "message": "비밀번호가 성공적으로 변경되었습니다.",
  "data": null
}
```

### 🔹 Response 400 (실패)

```json
{
  "success": false,
  "message": "입력값 오류",
  "data": {
    "token": ["만료되었거나 유효하지 않은 토큰입니다."]
  }
}
```

### 🔖 설명

* 비밀번호는 백엔드에서 유효성 검사를 거쳐 저장됩니다.
* 토큰은 일정 시간이 지나면 만료되며, 한 번 사용 후에는 재사용이 불가합니다.
* 성공 시 즉시 로그인 가능하며, 이전 비밀번호는 더 이상 사용할 수 없습니다.
