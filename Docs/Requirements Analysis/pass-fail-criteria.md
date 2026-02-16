# 미리캔버스 로그인 자동화 테스트 Pass/Fail 기준

## 문서 정보
- **작성일**: 2026-02-11
- **대상**: 미리캔버스 로그인 기능
- **URL**: https://www.miricanvas.com/ko

---

## ⚠️ 중요: 테스트 제한사항

### 보안 및 개인정보 보호
본 프로젝트에서는 **보안 이슈 및 개인정보 유출 가능성**으로 인해 다음과 같은 제한사항이 있습니다:

#### ✅ 테스트 가능 (실제 계정 제공)
- **이메일 로그인만 실제 테스트 가능**
- 제공된 테스트 계정:
  - Email: `lhb0269@naver.com`
  - Password: `gksqlc9784!`

#### ⚠️ 테스트 제한 (구현만 가능, 실행 불가)
- **소셜 로그인** (네이버, 구글, 카카오, 페이스북, 웨일, 애플)
  - CSS 셀렉터 식별 및 자동화 스크립트 구현은 완료
  - 유효한 계정 정보 미제공으로 **실제 로그인 테스트 불가**
  - 스크립트는 구현되어 있으나 **실행 시 로그인 실패 예상**

#### 📝 문서화 및 구현 방침
1. **모든 로그인 방식**에 대해 CSS 셀렉터 및 자동화 스크립트 작성
2. **이메일 로그인**만 실제 테스트 케이스 실행 및 검증
3. **소셜 로그인**은 구현 코드만 제공, 향후 계정 제공 시 즉시 테스트 가능한 상태로 준비
4. 테스트 문서에 "실행 가능 여부" 명시 필요

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
✅ **1단계: URL 변경 확인**
- 로그인 성공 시 `https://www.miricanvas.com/workspace/drive`로 리다이렉트
- URL이 위 주소와 정확히 일치해야 함

✅ **2단계: Workspace 페이지 주요 UI 요소 존재 확인**

로그인 성공 후 다음 6개 요소가 모두 존재해야 **PASS**:

#### 2.1.1 유저 프로필 아이콘
```css
div[class='WorkspaceAsideMenuBarView__TeamSelectContainer-sc-ca1e8066-4 pZNET team_select_container team_select_container--has_team_menu'] div[class='user_profile_icon']
```
**용도:** 사용자 계정 정보 표시

#### 2.1.2 검색 텍스트 박스
```css
input[placeholder='검색']
```
**용도:** 디자인/템플릿 검색 기능

#### 2.1.3 템플릿 보러가기 버튼
```css
div[class$='WorkspaceTemplateButtonView__Container-sc-60c1e03-0 gEPHoE']
```
**용도:** 템플릿 페이지 이동

#### 2.1.4 새 디자인 만들기 버튼
```css
div[class$='workspace_new_design_button_view']
```
**용도:** 새 디자인 생성

#### 2.1.5 알림 버튼
```css
div[class$='workspace_notification_button_view']
```
**용도:** 알림 확인

#### 2.1.6 프로필 홀더 버튼
```css
div[class$='WorkspaceHeaderVC__ProfilePhotoPlaceholderViewContainer-sc-685879eb-0 gqfMqk']
```
**용도:** 프로필 메뉴 접근

### 2.2 Pass 판정 로직
```
IF (URL === 'https://www.miricanvas.com/workspace/drive')
  AND (유저 프로필 아이콘 존재)
  AND (검색 텍스트 박스 존재)
  AND (템플릿 보러가기 버튼 존재)
  AND (새 디자인 만들기 버튼 존재)
  AND (알림 버튼 존재)
  AND (프로필 홀더 버튼 존재)
THEN
  ✅ PASS: 로그인 성공
ELSE
  ❌ FAIL: 로그인 실패 또는 불완전한 페이지 로드
END IF
```

### 2.3 Playwright 구현 예시
```typescript
// 1단계: URL 변경 확인
await page.waitForURL('https://www.miricanvas.com/workspace/drive', {
  timeout: 10000
});

// URL 검증
const currentURL = page.url();
expect(currentURL).toBe('https://www.miricanvas.com/workspace/drive');

// 2단계: 주요 UI 요소 존재 확인
const elements = {
  userProfileIcon: page.locator("div[class='user_profile_icon']"),
  searchBox: page.locator("input[placeholder='검색']"),
  templateButton: page.locator("div[class$='WorkspaceTemplateButtonView__Container-sc-60c1e03-0 gEPHoE']"),
  newDesignButton: page.locator("div[class$='workspace_new_design_button_view']"),
  notificationButton: page.locator("div[class$='workspace_notification_button_view']"),
  profileHolder: page.locator("div[class$='WorkspaceHeaderVC__ProfilePhotoPlaceholderViewContainer-sc-685879eb-0 gqfMqk']")
};

// 모든 요소가 표시될 때까지 대기 (각각 5초 타임아웃)
await Promise.all([
  elements.userProfileIcon.waitFor({ state: 'visible', timeout: 5000 }),
  elements.searchBox.waitFor({ state: 'visible', timeout: 5000 }),
  elements.templateButton.waitFor({ state: 'visible', timeout: 5000 }),
  elements.newDesignButton.waitFor({ state: 'visible', timeout: 5000 }),
  elements.notificationButton.waitFor({ state: 'visible', timeout: 5000 }),
  elements.profileHolder.waitFor({ state: 'visible', timeout: 5000 })
]);

// 모든 요소가 존재하는지 확인
const allElementsVisible = await Promise.all([
  elements.userProfileIcon.isVisible(),
  elements.searchBox.isVisible(),
  elements.templateButton.isVisible(),
  elements.newDesignButton.isVisible(),
  elements.notificationButton.isVisible(),
  elements.profileHolder.isVisible()
]);

if (allElementsVisible.every(visible => visible === true)) {
  console.log('✅ PASS: 로그인 성공 - 모든 필수 요소 확인됨');
} else {
  console.log('❌ FAIL: 일부 필수 요소가 누락됨');
  allElementsVisible.forEach((visible, index) => {
    const elementNames = ['유저 프로필 아이콘', '검색 박스', '템플릿 버튼', '새 디자인 버튼', '알림 버튼', '프로필 홀더'];
    if (!visible) {
      console.log(`  ❌ ${elementNames[index]} 누락`);
    }
  });
}
```

### 2.4 대체 셀렉터 (동적 클래스 대응)

**참고:** 미리캔버스는 동적 CSS 클래스를 사용하므로, 클래스명이 변경될 경우 다음 대체 셀렉터를 사용:

```typescript
// 유저 프로필 아이콘 - 클래스 부분 매칭
page.locator("div[class*='user_profile_icon']")

// 검색 박스 - placeholder 기반 (가장 안정적)
page.locator("input[placeholder='검색']")

// 템플릿 버튼 - 텍스트 기반
page.locator("div:has-text('템플릿')")

// 새 디자인 버튼 - 클래스 부분 매칭
page.locator("div[class*='workspace_new_design_button']")

// 알림 버튼 - 클래스 부분 매칭
page.locator("div[class*='workspace_notification_button']")

// 프로필 홀더 - role 또는 aria 속성 사용 (있다면)
page.locator("[role='button'][aria-label*='프로필']")
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
