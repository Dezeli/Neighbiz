# 🖼️ 게시글 이미지 Presigned 업로드 API

## 🔼 POST `/posts/image-upload/`

게시글 작성 시 사용할 이미지를 S3에 업로드하기 위해 Presigned URL을 발급받습니다.

### 🔸 Request

```json
{
  "filename": "post_img.jpg",
  "content_type": "image/jpeg"
}
```

### 🔹 Response 200 (성공)

```json
{
  "success": true,
  "message": "Presigned URL 생성 성공",
  "data": {
    "upload_url": "https://bucket.s3.amazonaws.com/...",
    "image_url": "https://bucket.s3.amazonaws.com/..."
  }
}
```

### 🔹 Response 400 (실패)

```json
{
  "success": false,
  "message": "입력값 오류",
  "data": {
    "content_type": ["지원하지 않는 형식입니다."]
  }
}
```

### 🔖 설명

* 발급받은 `upload_url`로 프론트에서 직접 이미지를 업로드합니다.
* 업로드 완료 후 `image_url` 값을 게시글 생성 API에 전달해야 합니다.
* 파일 이름은 UUID 등으로 충돌 없이 관리되어야 하며, 최대 용량 및 형식 제한은 서버에서 검증합니다.
