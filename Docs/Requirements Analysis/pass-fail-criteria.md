# 미리캔버스 로그인 자동화 테스트 Pass/Fail 기준

## 문서 정보
- **작성일**: 2026-02-11
- **대상**: 미리캔버스 로그인 기능
- **URL**: https://www.miricanvas.com/ko

---

## 1. 로그인 방식 분류

### 1.1 소셜 로그인 (팝업 방식)
**대상 플랫폼:**
- 네이버
- 구글
- 카카오
- 페이스북
- 웨일
- 애플

**특징:**
- 각 플랫폼별 새 창(팝업)이 열림
- 팝업 창에서 해당 플랫폼의 로그인 페이지로 이동
- 팝업에서 로그인 완료 후 원래 창으로 돌아옴

**기술적 구현:**
- Playwright의 `page.waitForEvent('popup')` 사용
- 팝업 컨텍스트에서 로그인 수행
- 팝업 닫힘 이벤트 대기

### 1.2 이메일 로그인 (다이얼로그 방식)
**대상:**
- 이메일/비밀번호 로그인

**특징:**
- 새 창이 열리지 않음
- 동일한 다이얼로그 내에서 이메일/비밀번호 입력 필드 표시
- 일반적인 form 제출 방식

---

## 2. 로그인 성공 기준 (PASS)

### 2.1 주요 성공 기준
✅ **URL 변경 확인**
- 로그인 성공 시 `https://www.miricanvas.com/workspace/drive`로 리다이렉트
- URL이 위 주소와 정확히 일치하면 **PASS**

### 2.2 부가 검증 포인트 (선택사항)
- HTTP 상태 코드: 200 OK
- 페이지 로드 완료 확인
- 로그인 다이얼로그 닫힘 확인

### 2.3 Playwright 구현 예시
```typescript
// 로그인 성공 확인
await page.waitForURL('https://www.miricanvas.com/workspace/drive', {
  timeout: 10000
});

// URL이 정확히 일치하는지 검증
const currentURL = page.url();
if (currentURL === 'https://www.miricanvas.com/workspace/drive') {
  console.log('✅ PASS: 로그인 성공');
} else {
  console.log('❌ FAIL: 예상 URL로 리다이렉트되지 않음');
}
```

---

## 3. 로그인 실패 시나리오 (FAIL)

### 3.1 잘못된 계정 정보
**시나리오:**
- 잘못된 이메일/비밀번호 입력
- 존재하지 않는 계정

**예상 동작:**
- URL이 `https://www.miricanvas.com/workspace/drive`로 변경되지 않음
- 에러 메시지 표시 (다이얼로그 내)
- 로그인 다이얼로그가 닫히지 않음

**검증 방법:**
```typescript
// 5초 대기 후에도 URL이 변경되지 않으면 실패로 간주
await page.waitForTimeout(5000);
const currentURL = page.url();
if (currentURL !== 'https://www.miricanvas.com/workspace/drive') {
  console.log('✅ PASS: 잘못된 정보로 로그인 실패 (예상된 동작)');
}
```

### 3.2 빈 입력값
**시나리오:**
- 이메일 또는 비밀번호 미입력
- 둘 다 미입력

**예상 동작:**
- 입력 필드 유효성 검사 오류 표시
- 로그인 버튼 비활성화 또는 제출 불가
- URL 변경 없음

### 3.3 로그인 취소
**시나리오:**
- 로그인 다이얼로그에서 닫기(X) 버튼 클릭
- 소셜 로그인 팝업에서 취소 버튼 클릭

**예상 동작:**
- 다이얼로그/팝업 닫힘
- 원래 페이지(`https://www.miricanvas.com/ko`)로 유지
- URL 변경 없음

### 3.4 네트워크 오류
**시나리오:**
- 타임아웃 발생
- 네트워크 연결 실패

**예상 동작:**
- 에러 메시지 표시
- URL 변경 없음
- 재시도 가능 상태 유지

---

## 4. 응답 시간 기준

### 4.1 성능 기준
- **로그인 버튼 클릭 → workspace/drive 페이지 로드**: 10초 이내
- **페이지 완전 로드**: 15초 이내

### 4.2 타임아웃 설정
```typescript
// 로그인 대기 타임아웃: 10초
await page.waitForURL('https://www.miricanvas.com/workspace/drive', {
  timeout: 10000
});

// 페이지 로드 대기 타임아웃: 15초
await page.waitForLoadState('networkidle', {
  timeout: 15000
});
```

---

## 5. 에러 메시지 검증

### 5.1 이메일 로그인 실패 시
**검증 항목:**
- 에러 메시지가 다이얼로그 내에 표시되는지 확인
- 에러 메시지 내용이 사용자에게 명확한지 확인

**구현 방법:**
```typescript
// 에러 메시지 존재 확인
const errorMessage = await page.locator('[role="alert"]').textContent();
if (errorMessage) {
  console.log(`에러 메시지 표시됨: ${errorMessage}`);
}
```

### 5.2 소셜 로그인 실패 시
**검증 항목:**
- 팝업이 닫힌 후 원래 페이지에 에러 메시지 표시
- 다이얼로그 상태 유지 확인

---

## 6. Pass/Fail 판정 흐름도

```
시작
  ↓
로그인 시도
  ↓
10초 이내 URL 변경?
  ├─ Yes → workspace/drive로 변경?
  │          ├─ Yes → ✅ PASS
  │          └─ No  → ❌ FAIL (잘못된 URL)
  └─ No → 에러 메시지 표시?
             ├─ Yes → ✅ PASS (예상된 실패)
             └─ No  → ❌ FAIL (타임아웃)
```

---

## 7. 테스트 케이스별 Pass/Fail 기준 요약

| 테스트 케이스 | Pass 기준 | Fail 기준 |
|-------------|----------|----------|
| 유효한 계정으로 로그인 | URL이 `workspace/drive`로 변경 | URL 변경 없음 또는 타임아웃 |
| 잘못된 계정 정보로 로그인 | 에러 메시지 표시 & URL 변경 없음 | 로그인 성공 또는 에러 없이 실패 |
| 빈 입력값으로 로그인 | 유효성 검사 오류 표시 | 제출 가능 또는 에러 없음 |
| 존재하지 않는 계정 | 에러 메시지 표시 & URL 변경 없음 | 로그인 성공 |
| 로그인 다이얼로그 닫기 | 다이얼로그 닫힘 & URL 유지 | 예기치 않은 동작 |
| 소셜 로그인 팝업 취소 | 팝업 닫힘 & URL 유지 | 예기치 않은 동작 |

---

## 8. 주의사항

### 8.1 동적 CSS 클래스
- 미리캔버스는 동적 CSS 클래스를 사용하는 것으로 보임 (`sc-c4d7baee-0`, `sc-c406f275-0` 등)
- 이러한 클래스명은 빌드마다 변경될 수 있음
- **권장:** `role`, `name`, `aria-label` 등의 안정적인 속성 사용
- **대안:** data 속성이나 의미있는 선택자 사용

### 8.2 팝업 블로커
- 테스트 실행 시 브라우저 팝업 블로커가 비활성화되어야 함
- Playwright는 기본적으로 팝업을 허용함

### 8.3 세션 관리
- 각 테스트는 독립적으로 실행되어야 함
- 테스트 간 쿠키/세션 정리 필요
- `context.clearCookies()` 사용 권장

---

## 9. 결론

**핵심 Pass/Fail 기준:**
- ✅ **PASS**: 로그인 성공 시 URL이 `https://www.miricanvas.com/workspace/drive`로 변경
- ❌ **FAIL**: 10초 이내에 위 URL로 변경되지 않음

이 단순하고 명확한 기준을 통해 로그인 성공 여부를 객관적으로 판단할 수 있습니다.
