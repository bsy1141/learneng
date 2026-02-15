# 영어 인풋 강화 웹앱

Google Spreadsheets에 있는 단어 데이터를 불러와 플래시카드로 복습하고, AI 예문을 생성할 수 있는 웹앱입니다.

## 준비물

- Google Sheets API 키 (읽기용)
- Google Service Account (쓰기용)
- 스프레드시트
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
OPENAI_MODEL=gpt-4o
GOOGLE_SERVICE_ACCOUNT_JSON=
```

## 설정 가이드

### 1. Google Sheets API 키 발급 (읽기용)

1. [Google Cloud Console](https://console.cloud.google.com/)에서 새 프로젝트 생성
2. "API 및 서비스" → "라이브러리"에서 "Google Sheets API" 활성화
3. "사용자 인증 정보" → "API 키 만들기"
4. API 키를 `VITE_GOOGLE_API_KEY`에 입력

### 2. Google Service Account 생성 (쓰기용)

복습 시트에 단어를 추가하려면 서비스 계정이 필요합니다.

1. [Google Cloud Console](https://console.cloud.google.com/)에서 같은 프로젝트 선택
2. "IAM 및 관리자" → "서비스 계정" 클릭
3. "+ 서비스 계정 만들기" 클릭
4. 서비스 계정 이름 입력 (예: `learneng-sheets-writer`)
5. 역할은 선택하지 않고 "완료" 클릭
6. 생성된 서비스 계정 클릭 → "키" 탭 → "키 추가" → "새 키 만들기"
7. JSON 선택 → "만들기" → JSON 파일 다운로드
8. JSON 파일 내용 전체를 `GOOGLE_SERVICE_ACCOUNT_JSON`에 **한 줄로** 입력
   - 예: `{"type":"service_account","project_id":"...","private_key":"..."}`

### 3. 스프레드시트 공유

1. 다운로드한 JSON 파일에서 `client_email` 값 복사 (예: `xxx@xxx.iam.gserviceaccount.com`)
2. Google Sheets에서 "공유" 버튼 클릭
3. 복사한 이메일 주소 입력
4. 권한: "편집자"로 설정
5. "공유" 클릭

### 4. 스프레드시트 ID 가져오기

스프레드시트 URL에서 ID 부분을 복사하세요:
```
https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit
```

### 5. OpenAI API 키 발급 (선택사항)

AI 예문 생성 기능을 사용하려면:
1. [OpenAI Platform](https://platform.openai.com/)에서 API 키 생성
2. `OPENAI_API_KEY`에 입력

## 실행

### 프론트엔드만 (Google Sheets 읽기만)
```bash
npm install
npm run dev
```

### 전체 기능 (Sheets + API)
```bash
npm install -g vercel
npm run dev:vercel
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

Vercel에 배포:

1. GitHub 저장소 연결
2. 환경 변수 설정:
   - `VITE_GOOGLE_API_KEY` (API 키)
   - `VITE_SHEET_ID` (스프레드시트 ID)
   - `VITE_SHEET_MASTER=Master`
   - `VITE_SHEET_TODAY=Today`
   - `VITE_SHEET_REVIEW=Review`
   - `OPENAI_API_KEY` (OpenAI API 키)
   - `OPENAI_MODEL=gpt-4o`
   - `GOOGLE_SERVICE_ACCOUNT_JSON` (JSON 파일 전체 내용을 한 줄로)
3. 배포 완료!

**중요**: `GOOGLE_SERVICE_ACCOUNT_JSON`은 JSON 파일 내용을 **한 줄로** 입력해야 합니다.
