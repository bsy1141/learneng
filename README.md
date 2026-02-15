# 영어 인풋 강화 웹앱

Google Spreadsheets에 있는 단어 데이터를 불러와 플래시카드로 복습하고, AI 예문을 생성할 수 있는 웹앱입니다.

## 준비물

- Google Sheets API 키 (읽기용)
- Google Apps Script (쓰기용)
- 스프레드시트
- OpenAI API 키 (AI 예문 기능 사용 시)

## 환경 변수

`.env` 파일을 만들고 아래 값을 채워주세요.

```
VITE_GOOGLE_API_KEY=
VITE_SHEET_ID=
VITE_SHEET_TODAY=Today
VITE_SHEET_REVIEW=Review
APPS_SCRIPT_URL=
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o
```

## 설정 가이드

### 1. Google Sheets API 키 발급 (읽기용)

1. [Google Cloud Console](https://console.cloud.google.com/)에서 새 프로젝트 생성
2. "API 및 서비스" → "라이브러리"에서 "Google Sheets API" 활성화
3. "사용자 인증 정보" → "API 키 만들기"
4. API 키를 `VITE_GOOGLE_API_KEY`에 입력

### 2. Google Apps Script 만들기 (쓰기용)

복습 시트에 단어를 추가하려면 Apps Script가 필요합니다.

1. Google Sheets 열기 → 상단 메뉴에서 "확장 프로그램" → "Apps Script" 클릭
2. 다음 코드 복사해서 붙여넣기:

```javascript
function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const sheetName = data.sheet || "Review";
  const row = data.row || {};

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);

  const values = [
    row.word || "",
    row.meaning || "",
    row.example || "",
    Array.isArray(row.tags) ? row.tags.join(", ") : row.tags || "",
    row.level || "",
    row.lastReviewed || "",
    row.nextReview || "",
  ];

  sheet.appendRow(values);

  return ContentService.createTextOutput(
    JSON.stringify({ ok: true }),
  ).setMimeType(ContentService.MimeType.JSON);
}
```

3. 우측 상단 "배포" → "새 배포" 클릭
4. "유형 선택" (톱니바퀴 아이콘) → "웹 앱" 선택
5. 다음과 같이 설정:
   - 설명: `learneng API`
   - 실행 계정: **나**
   - 액세스 권한: **모든 사용자**
6. "배포" 클릭
7. **웹 앱 URL** 복사 (예: `https://script.google.com/macros/s/.../exec`)
8. `.env` 파일의 `APPS_SCRIPT_URL`에 URL 붙여넣기

### 3. 스프레드시트 설정

#### 스프레드시트 ID 가져오기

스프레드시트 URL에서 ID 부분을 복사하세요:

```
https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit
```

#### 시트 만들기

다음 2개의 시트를 만드세요:

- `Today` (오늘 학습할 단어)
- `Review` (복습 단어)

#### 컬럼 구조 (첫 번째 행)

각 시트에 다음 컬럼을 만드세요:

- `word` (단어)
- `meaning` (의미)
- `example` (예문)
- `tags` (태그)
- `level` (난이도)
- `lastReviewed` (마지막 복습일)
- `nextReview` (다음 복습일)

#### 공개 권한 설정

1. 우측 상단의 "공유" 버튼 클릭
2. "일반 액세스" → "링크가 있는 모든 사용자"로 변경
3. 권한: "뷰어"로 설정

### 4. OpenAI API 키 발급 (선택사항)

AI 예문 생성 기능을 사용하려면:

1. [OpenAI Platform](https://platform.openai.com/)에서 API 키 생성
2. `OPENAI_API_KEY`에 입력

## 실행

```bash
npm install
npm run dev
```

http://localhost:5173에서 앱이 실행됩니다!

## 배포

Vercel에 배포:

1. GitHub 저장소에 푸시
2. [Vercel](https://vercel.com/)에서 프로젝트 연결
3. 환경 변수 설정:
   - `VITE_GOOGLE_API_KEY` (API 키)
   - `VITE_SHEET_ID` (스프레드시트 ID)
   - `VITE_SHEET_TODAY=Today`
   - `VITE_SHEET_REVIEW=Review`
   - `APPS_SCRIPT_URL` (Apps Script 웹 앱 URL)
   - `OPENAI_API_KEY` (OpenAI API 키)
   - `OPENAI_MODEL=gpt-5`
4. 배포 완료!
