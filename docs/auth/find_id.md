# ✅ 아이디 찾기 API

## 🔍 POST `/auth/find-id/`

전화번호와 이메일을 입력하면 해당 사용자 계정의 아이디(username)을 마스킹된 형태로 반환합니다.

### 🔸 Request

```json
{
  "email": "user@example.com",
  "phone_number": "01012345678"
}
```

### 🔹 Response 200 (성공)

```json
{
  "success": true,
  "message": "일치하는 계정이 확인되었습니다.",
  "data": {
    "username": "exa****r"
  }
}
```

### 🔹 Response 400 (실패)

```json
{
  "success": false,
  "message": "입력값 오류",
  "data": {
    "non_field_errors": ["일치하는 사용자가 없습니다."]
  }
}
```

### 🔖 설명

* 이메일과 전화번호 모두 일치하는 경우에만 계정 정보를 반환합니다.
* 반환되는 username은 개인정보 보호를 위해 일부가 마스킹 처리됩니다.
