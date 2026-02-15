# 영어 인풋 강화 웹앱

Google Spreadsheets에 있는 단어 데이터를 불러와 플래시카드로 복습하고, AI 예문을 생성할 수 있는 웹앱입니다.

## 준비물

- Google Sheets API 키
- 공개 읽기 권한이 있는 스프레드시트
- OpenAI API 키 (AI 예문 기능 사용 시)

## 환경 변수

`.env` 파일을 만들고 아래 값을 채워주세요.

```
VITE_GOOGLE_API_KEY=
VITE_SHEET_ID=
VITE_SHEET_MASTER=Master
VITE_SHEET_TODAY=Today
VITE_SHEET_REVIEW=Review
OPENAI_API_KEY=
OPENAI_MODEL=gpt-5
```

## 실행

```
npm install
npm run dev
```

## 스프레드시트 컬럼 예시

- `word`
- `meaning`
- `example`
- `tags`
- `level`
- `lastReviewed`
- `nextReview`

첫 행은 헤더로 사용됩니다.

## 배포

Vercel에 연결 후 환경변수를 설정하면 바로 배포할 수 있습니다.

