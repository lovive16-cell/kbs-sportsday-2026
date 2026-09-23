# 2026 KBS 가을 체육대회

톰과 제리 테마의 체육대회 안내 홈페이지 (GitHub Pages).

## 구조

- `index.html`, `style.css`, `main.js` — 공개 홈페이지
- `admin.html` — 초대장 생성기 (관리자 전용, 비밀번호로 잠겨 있고 홈페이지 메뉴에는 노출되지 않습니다)

## 초대장 관리자 비밀번호 변경

기본 비밀번호는 `tomjerry1024` 입니다. 바꾸려면:

1. 브라우저 콘솔에서 아래 실행:
   ```js
   crypto.subtle.digest('SHA-256', new TextEncoder().encode('새 비밀번호'))
     .then(buf => console.log(Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('')))
   ```
2. 출력된 값을 `admin.html`의 `PASS_HASH` 상수에 붙여넣고 커밋/푸시하세요.

이 비밀번호 잠금은 정적 사이트에서 캐주얼한 접근 제한용이며, 완전한 보안 인증은 아닙니다.
