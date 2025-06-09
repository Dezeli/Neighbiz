# 📬 Posts API

`/api/v1/posts/` 하위에서 제공되는 게시글 관련 API입니다. 게시글 등록, 상세 조회, 카테고리 불러오기, 이미지 업로드 등의 기능을 포함합니다.

| 기능                                   | 메서드  | 엔드포인트                         |
| ------------------------------------ | ---- | ----------------------------- |
| [게시글 작성](create.md)                  | POST | `/api/v1/posts/`              |
| [게시글 상세 조회](detail.md)               | GET  | `/api/v1/posts/{id}/`         |
| [카테고리 목록 조회](categories.md)          | GET  | `/api/v1/posts/categories/`   |
| [Presigned 이미지 업로드](image_upload.md) | POST | `/api/v1/posts/image-upload/` |
