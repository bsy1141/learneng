# AGENTS.md — App.tsx 분리/구성 컨벤션

이 문서는 `src/App.tsx`에 집중된 책임을 **컴포넌트 단위**로 잘게 분리하기 위한 작업 컨벤션입니다. 이 저장소에서 작업하는 모든 에이전트/개발자는 이 규칙을 기준으로 구조를 유지해야 합니다.

## 1. 목적과 배경
- App.tsx의 복잡도 감소
- 책임 분리로 변경 안정성 강화
- UI/로직/데이터 흐름을 컴포넌트 기준으로 명확히 분리

## 2. 기본 원칙
- **한 파일/컴포넌트 = 한 책임**
- **컴포넌트 경계 유지**: 화면/섹션/패널/카드 등 단위로 응집
- **사이드이펙트 격리**: API 호출/외부 I/O는 services 또는 전용 로직 파일에서 수행
- App.tsx는 **레이아웃/탭 스위칭/컴포넌트 조립**만 담당

## 3. 폴더 구조 (컴포넌트 중심)
기능(feature) 단위로 묶지 않습니다. **UI 컴포넌트 단위**로 명확히 분리합니다.

- `src/components/` 화면/섹션/패널/카드 단위 컴포넌트
- `src/components/<ComponentName>/` 단일 컴포넌트 전용 폴더
  - `ComponentName.tsx`
  - `ComponentName.module.scss` (있다면)
  - `index.ts`
- `src/services/` 외부 I/O
- `src/utils/` 순수 함수/유틸
- `src/types/` 공용 타입(필요 시)

권장 구조 예시:
- `src/components/Flashcard/`
- `src/components/Header/`
- `src/components/TabBar/`
- `src/components/StatusBar/`
- `src/components/Panel/`

## 4. 파일/폴더 명명 규칙
- **컴포넌트**: `PascalCase` (`StatusBar.tsx`)
- **로직 파일**: `camelCase` (`loadSheet.ts`)
- **유틸**: `camelCase` (`normalizeStatus.ts`)
- **배럴**: `index.ts`에서 export
  - 배럴은 **컴포넌트 공개 API**만 export
  - 내부 전용 파일은 배럴에 포함하지 않음

## 5. 책임 분리 기준 (App.tsx 분해 가이드)
App.tsx는 아래만 담당합니다.
- 전체 레이아웃/헤더/푸터
- 탭 전환 상태
- 컴포넌트 조립

App.tsx에서 제거해야 하는 책임:
- 데이터 로딩/정리
- 도메인 로직 (완료 처리, 리뷰 추가 등)
- API 호출
- 상태 계산/필터링

예시 분리 방향:
- 헤더 영역 → `components/Header/`
- 탭 네비게이션 → `components/TabBar/`
- 시트 상태/카운트 → `components/StatusBar/`
- 메시지/에러 패널 → `components/Panel/`
- 플래시카드 UI → `components/Flashcard/`

## 6. 상태/데이터 흐름 규칙
- **상태는 가장 가까운 컴포넌트에 둔다**
- 복잡한 로직은 컴포넌트 내부가 아닌 **별도 로직 파일**로 이동
- **fetch/side-effect**는 `src/services/` + 로직 파일 조합으로 제한

예시 패턴:
- `services/sheets.ts`: 외부 API I/O
- `components/TodayPanel/logic.ts`: 시트 로딩/필터링/액션 정의

## 7. UI 컴포넌트 분리 규칙
- **Presentational vs Container** 명확히 구분
  - Presentational: props만 받고 렌더링
  - Container: 상태/액션 주입
- **재사용 기준**
  - 2개 이상의 화면/섹션에서 사용되면 `components/common/`으로 이동

## 8. 서비스 레이어 규칙
- `src/services/*.ts`는 **외부 I/O만** 수행
- 도메인 규칙/검증/상태 계산은 컴포넌트 전용 로직 파일로 이동
- 서비스는 UI나 React에 의존하지 않음

## 9. 변경 체크리스트
새 기능/변경 시 아래를 확인합니다.
- [ ] App.tsx에 도메인 로직이 들어가 있지 않은가?
- [ ] API 호출이 services + 로직 파일에만 존재하는가?
- [ ] 컴포넌트가 역할 단위로 분리되어 있는가?
- [ ] 배럴은 공개 API만 export하는가?

App.tsx에 추가하면 안 되는 항목:
- 네트워크 요청
- 데이터 필터링/정렬 로직
- 상태 계산 로직
- 비즈니스 규칙

## 10. 예시 분해 시나리오 (현재 App.tsx 기준)
- 헤더/탭/상태/패널 UI → 각각 컴포넌트로 분리
- 로딩/에러/메시지 처리 → Panel 컴포넌트로 분리
- 플래시카드 로직/표시 → Flashcard 컴포넌트로 유지 또는 세분화
- 시트 로딩/업데이트 로직 → 컴포넌트 전용 로직 파일로 이동

이 문서는 리팩터링 방향을 고정하기 위한 컨벤션이며, 실제 분해 작업 시 이 기준을 준수합니다.
