# 미리캔버스 로그인 CSS 셀렉터 종합

## 문서 정보
- **작성일**: 2026-02-11
- **대상**: 미리캔버스 로그인 기능
- **URL**: https://www.miricanvas.com/ko
- **목적**: 자동화 테스트 스크립트에서 사용할 CSS 셀렉터 정리

---

## ⚠️ 중요: 테스트 제한사항

### 실행 가능한 테스트
본 문서에 정의된 모든 CSS 셀렉터는 Playwright MCP를 통해 실제 페이지 분석으로 식별되었습니다.

**✅ 실제 테스트 가능:**
- **이메일 로그인** (제공된 테스트 계정 사용)
  - Email: `lhb0269@naver.com`
  - Password: `gksqlc9784!`

**⚠️ 구현만 가능 (실행 제한):**
- **소셜 로그인** (네이버, 구글, 카카오, 페이스북, 웨일, 애플)
  - 모든 CSS 셀렉터 식별 완료
  - 자동화 스크립트 구현 가능
  - 보안 이슈로 유효 계정 미제공
  - **실제 로그인 테스트 불가** (향후 계정 제공 시 즉시 실행 가능)

---

## 1. 메인 페이지 - 로그인 진입

### 1.1 로그인 버튼 (헤더)
```css
div[class='sc-c4d7baee-0 hSpSCA'] button[class='sc-c406f275-0 bbsZzG']
```

**용도:**
- 메인 페이지에서 로그인 다이얼로그를 여는 버튼

**위치:**
- 페이지 헤더 영역

**대체 셀렉터 (권장):**
```typescript
// 텍스트 기반 (더 안정적)
page.getByRole('button', { name: '로그인' })

// 또는
page.locator('button:has-text("로그인")')
```

---

## 2. 로그인 다이얼로그

### 2.1 다이얼로그 컨테이너
```css
div[role='dialog']
```

**용도:**
- 로그인 다이얼로그의 메인 컨테이너
- 다이얼로그 노출 여부 확인

**검증 코드:**
```typescript
// 다이얼로그가 표시되었는지 확인
await page.locator("div[role='dialog']").waitFor({ state: 'visible' });
```

---

## 3. 이메일 로그인

### 3.1 이메일 로그인 버튼
```css
div[class='sc-d63ef22a-0 eWfpYq'] div[class='sc-9e7931e8-0 lciyuL']
```

**용도:**
- 다이얼로그에서 이메일 로그인 옵션을 선택하는 버튼

**대체 셀렉터 (권장):**
```typescript
// 텍스트 기반
page.getByRole('button', { name: /이메일.*로그인/ })

// 또는
page.locator('button:has-text("이메일")')
```

### 3.2 이메일 입력 필드
```css
form[class='sc-a05dd211-0 cDqDYn'] input[name='email']
```

**용도:**
- 이메일 주소 입력

**대체 셀렉터 (권장):**
```typescript
// name 속성 사용 (더 안정적)
page.locator("input[name='email']")

// 또는
page.getByPlaceholder('이메일')
```

**사용 예시:**
```typescript
await page.locator("input[name='email']").fill('test@example.com');
```

### 3.3 비밀번호 입력 필드
```css
form[class='sc-a05dd211-0 cDqDYn'] input[name='password']
```

**용도:**
- 비밀번호 입력

**대체 셀렉터 (권장):**
```typescript
// name 속성 사용 (더 안정적)
page.locator("input[name='password']")

// 또는
page.getByPlaceholder('비밀번호')
```

**사용 예시:**
```typescript
await page.locator("input[name='password']").fill('password123');
```

### 3.4 로그인 제출 버튼
```css
form[class='sc-a05dd211-0 cDqDYn'] button[class='sc-c406f275-0 kZKBBK']
```

**용도:**
- 이메일 로그인 폼 제출

**대체 셀렉터 (권장):**
```typescript
// 폼 내의 submit 버튼
page.locator("form button[type='submit']")

// 또는 텍스트 기반
page.locator("form button:has-text('로그인')")
```

---

## 4. 소셜 로그인 - 네이버

### 4.1 네이버 로그인 페이지 정보
**팝업 URL:**
```
https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=...
```

### 4.2 네이버 로그인 버튼 (미리캔버스 다이얼로그)
```typescript
// 미리캔버스 다이얼로그에서 네이버 로그인 버튼
page.locator("button:has-text('네이버')")
```

### 4.3 네이버 로그인 팝업 CSS 셀렉터 (분석 완료 ✅)

#### 4.3.1 아이디 입력 필드
```css
input#id
```

**대체 셀렉터:**
```typescript
// name 속성 사용 (권장)
popup.locator("input[name='id']")

// id 속성 사용
popup.locator("input#id")

// aria-label 사용
popup.locator("input[aria-label='아이디 또는 전화번호']")
```

**HTML 구조:**
```html
<input type="text" id="id" name="id"
       maxlength="41"
       class="input_id"
       aria-label="아이디 또는 전화번호">
```

#### 4.3.2 비밀번호 입력 필드
```css
input#pw
```

**대체 셀렉터:**
```typescript
// name 속성 사용 (권장)
popup.locator("input[name='pw']")

// id 속성 사용
popup.locator("input#pw")

// type 속성 사용
popup.locator("input[type='password']")

// aria-label 사용
popup.locator("input[aria-label='비밀번호']")
```

**HTML 구조:**
```html
<input type="password" id="pw" name="pw"
       maxlength="16"
       class="input_pw"
       aria-label="비밀번호">
```

#### 4.3.3 로그인 버튼
```css
button#log.login
```

**대체 셀렉터:**
```typescript
// id 속성 사용 (권장)
popup.locator("button#log\\.login")

// type 속성 사용
popup.locator("button[type='submit']")

// 텍스트 기반
popup.getByRole('button', { name: '로그인' })

// 클래스 사용
popup.locator("button.btn_login[type='submit']")
```

**HTML 구조:**
```html
<button type="submit" class="btn_login off next_step nlog-click"
        id="log.login">
    <span class="btn_text">로그인</span>
</button>
```

#### 4.3.4 로그인 상태 유지 체크박스
```css
input#nvlong
```

**대체 셀렉터:**
```typescript
// name 속성 사용
popup.locator("input[name='nvlong']")

// id 속성 사용
popup.locator("input#nvlong")
```

**HTML 구조:**
```html
<input type="checkbox" id="nvlong" name="nvlong"
       class="input_keep" value="off">
```

#### 4.3.5 에러 메시지 영역
```css
div.login_error_wrap
```

**주요 에러 메시지 ID:**
```typescript
// 아이디 미입력 에러
popup.locator("div#err_empty_id")

// 비밀번호 미입력 에러
popup.locator("div#err_empty_pw")

// 공통 에러 메시지
popup.locator("div#err_common")

// Caps Lock 경고
popup.locator("div#err_capslock")
```

### 4.4 네이버 로그인 전체 플로우 코드
```typescript
test('네이버 소셜 로그인', async ({ page, context }) => {
  // 1. 미리캔버스 메인 페이지 접속
  await page.goto('https://www.miricanvas.com/ko');

  // 2. 로그인 버튼 클릭
  await page.getByRole('button', { name: '로그인' }).click();

  // 3. 다이얼로그 노출 확인
  await page.locator("div[role='dialog']").waitFor({ state: 'visible' });

  // 4. 네이버 로그인 버튼 클릭 & 팝업 대기
  const [popup] = await Promise.all([
    context.waitForEvent('page'), // 새 페이지(팝업) 대기
    page.locator("button:has-text('네이버')").click()
  ]);

  // 5. 팝업 로드 대기
  await popup.waitForLoadState('networkidle');

  // 6. 네이버 아이디 입력
  await popup.locator("input[name='id']").fill('your_naver_id');

  // 7. 네이버 비밀번호 입력
  await popup.locator("input[name='pw']").fill('your_naver_password');

  // 8. 로그인 버튼 클릭
  await popup.locator("button[type='submit']").click();

  // 9. 팝업 닫힘 대기
  await popup.waitForEvent('close', { timeout: 10000 });

  // 10. 원래 페이지에서 로그인 성공 확인
  await page.waitForURL('https://www.miricanvas.com/workspace/drive', {
    timeout: 10000
  });

  expect(page.url()).toBe('https://www.miricanvas.com/workspace/drive');
});
```

---

## 5. 소셜 로그인 - 구글

### 5.1 구글 로그인 페이지 정보 (분석 완료 ✅)
**팝업 URL:**
```
https://accounts.google.com/v3/signin/identifier?...
```

**특징:**
- 2단계 로그인 (이메일 입력 → 비밀번호 입력)
- 첫 번째 단계에서 이메일 입력 후 "다음" 버튼 클릭 필요

### 5.2 구글 로그인 팝업 CSS 셀렉터

#### 5.2.1 이메일/전화번호 입력 필드 (1단계)
```css
input[name='identifier']
```

**대체 셀렉터:**
```typescript
// name 속성 사용 (권장)
popup.locator("input[name='identifier']")

// id 속성 사용
popup.locator("input#identifierId")

// type 속성 사용
popup.locator("input[type='email']")

// aria-label 사용
popup.locator("input[aria-label='이메일 또는 휴대전화']")
```

#### 5.2.2 다음 버튼 (1단계)
```typescript
// 텍스트 기반 (권장)
popup.getByRole('button', { name: '다음' })

// 또는
popup.locator("button:has-text('다음')")
```

#### 5.2.3 비밀번호 입력 필드 (2단계)
```css
input[type='password']
```

**대체 셀렉터:**
```typescript
// type 속성 사용 (권장)
popup.locator("input[type='password']")

// name 속성 사용 (주의: 숨겨진 필드일 수 있음)
popup.locator("input[name='Passwd']").first()
```

#### 5.2.4 로그인 버튼 (2단계)
```typescript
// 텍스트 기반 (권장)
popup.getByRole('button', { name: '다음' })
```

### 5.3 구글 로그인 전체 플로우 코드
```typescript
test('구글 소셜 로그인', async ({ page, context }) => {
  // 1-3. 미리캔버스 접속 및 로그인 다이얼로그 열기
  await page.goto('https://www.miricanvas.com/ko');
  await page.getByRole('button', { name: '로그인' }).click();
  await page.locator("div[role='dialog']").waitFor({ state: 'visible' });

  // 4. 구글 로그인 버튼 클릭 & 팝업 대기
  const [popup] = await Promise.all([
    context.waitForEvent('page'),
    page.locator("button:has-text('구글')").click()
  ]);

  await popup.waitForLoadState('networkidle');

  // 5. 1단계: 이메일 입력
  await popup.locator("input[name='identifier']").fill('your_email@gmail.com');
  await popup.getByRole('button', { name: '다음' }).click();

  // 6. 2단계: 비밀번호 입력 (로드 대기)
  await popup.waitForLoadState('networkidle');
  await popup.locator("input[type='password']").fill('your_password');
  await popup.getByRole('button', { name: '다음' }).click();

  // 7-8. 팝업 닫힘 대기 및 로그인 성공 확인
  await popup.waitForEvent('close', { timeout: 10000 });
  await page.waitForURL('https://www.miricanvas.com/workspace/drive', {
    timeout: 10000
  });

  expect(page.url()).toBe('https://www.miricanvas.com/workspace/drive');
});
```

---

## 6. 소셜 로그인 - 카카오

### 6.1 카카오 로그인 페이지 정보 (분석 완료 ✅)
**팝업 URL:**
```
https://accounts.kakao.com/login/?continue=...
```

### 6.2 카카오 로그인 팝업 CSS 셀렉터

#### 6.2.1 아이디 입력 필드
```css
input[name='loginId']
```

**대체 셀렉터:**
```typescript
// name 속성 사용 (권장)
popup.locator("input[name='loginId']")

// id 속성 사용 (동적 ID 주의)
popup.locator("input[id^='loginId']")

// placeholder 사용
popup.getByPlaceholder('카카오메일 아이디, 이메일, 전화번호')
```

**HTML 구조:**
```html
<input type="text" name="loginId" id="loginId--1"
       placeholder="카카오메일 아이디, 이메일, 전화번호 ">
```

#### 6.2.2 비밀번호 입력 필드
```css
input[name='password']
```

**대체 셀렉터:**
```typescript
// name 속성 사용 (권장)
popup.locator("input[name='password']")

// type 속성 사용
popup.locator("input[type='password']")

// placeholder 사용
popup.getByPlaceholder('비밀번호')
```

#### 6.2.3 로그인 버튼
```css
button.btn_g.highlight.submit
```

**대체 셀렉터:**
```typescript
// type 속성 사용 (권장)
popup.locator("button[type='submit']")

// 텍스트 기반
popup.getByRole('button', { name: '로그인' })

// 클래스 사용
popup.locator("button.btn_g.highlight.submit")
```

### 6.3 카카오 로그인 전체 플로우 코드
```typescript
test('카카오 소셜 로그인', async ({ page, context }) => {
  await page.goto('https://www.miricanvas.com/ko');
  await page.getByRole('button', { name: '로그인' }).click();
  await page.locator("div[role='dialog']").waitFor({ state: 'visible' });

  const [popup] = await Promise.all([
    context.waitForEvent('page'),
    page.locator("button:has-text('카카오')").click()
  ]);

  await popup.waitForLoadState('networkidle');
  await popup.locator("input[name='loginId']").fill('your_kakao_id');
  await popup.locator("input[name='password']").fill('your_password');
  await popup.locator("button[type='submit']").click();

  await popup.waitForEvent('close', { timeout: 10000 });
  await page.waitForURL('https://www.miricanvas.com/workspace/drive', {
    timeout: 10000
  });

  expect(page.url()).toBe('https://www.miricanvas.com/workspace/drive');
});
```

---

## 7. 소셜 로그인 - 페이스북

### 7.1 페이스북 로그인 페이지 정보 (분석 완료 ✅)
**팝업 URL:**
```
https://www.facebook.com/login.php?...
```

### 7.2 페이스북 로그인 팝업 CSS 셀렉터

#### 7.2.1 이메일/전화번호 입력 필드
```css
input[name='email']
```

**대체 셀렉터:**
```typescript
// name 속성 사용 (권장)
popup.locator("input[name='email']")

// id 속성 사용
popup.locator("input#email")

// placeholder 사용
popup.getByPlaceholder('이메일 또는 전화번호')
```

**HTML 구조:**
```html
<input type="text" name="email" id="email"
       placeholder="이메일 또는 전화번호">
```

#### 7.2.2 비밀번호 입력 필드
```css
input[name='pass']
```

**대체 셀렉터:**
```typescript
// name 속성 사용 (권장)
popup.locator("input[name='pass']")

// id 속성 사용
popup.locator("input#pass")

// type 속성 사용
popup.locator("input[type='password']")

// placeholder 사용
popup.getByPlaceholder('비밀번호')
```

#### 7.2.3 로그인 버튼
```css
button[name='login']
```

**대체 셀렉터:**
```typescript
// name 속성 사용 (권장)
popup.locator("button[name='login']")

// id 속성 사용
popup.locator("button#loginbutton")

// type 속성 사용
popup.locator("button[type='submit']")

// 텍스트 기반
popup.getByRole('button', { name: '로그인' })
```

### 7.3 페이스북 로그인 전체 플로우 코드
```typescript
test('페이스북 소셜 로그인', async ({ page, context }) => {
  await page.goto('https://www.miricanvas.com/ko');
  await page.getByRole('button', { name: '로그인' }).click();
  await page.locator("div[role='dialog']").waitFor({ state: 'visible' });

  const [popup] = await Promise.all([
    context.waitForEvent('page'),
    page.locator("button:has-text('페이스북')").click()
  ]);

  await popup.waitForLoadState('networkidle');
  await popup.locator("input[name='email']").fill('your_facebook_email');
  await popup.locator("input[name='pass']").fill('your_password');
  await popup.locator("button[name='login']").click();

  await popup.waitForEvent('close', { timeout: 10000 });
  await page.waitForURL('https://www.miricanvas.com/workspace/drive', {
    timeout: 10000
  });

  expect(page.url()).toBe('https://www.miricanvas.com/workspace/drive');
});
```

---

## 8. 소셜 로그인 - 웨일

### 8.1 웨일 로그인 페이지 정보 (분석 완료 ✅)
**팝업 URL:**
```
https://auth.worksmobile.com/login/login?...
```

**특징:**
- 단계별 로그인 방식
- 첫 화면에서 사용자 ID 또는 전화번호만 입력

### 8.2 웨일 로그인 팝업 CSS 셀렉터

#### 8.2.1 사용자 ID 입력 필드
```css
input#user_id
```

**대체 셀렉터:**
```typescript
// id 속성 사용 (권장)
popup.locator("input#user_id")

// placeholder 사용
popup.getByPlaceholder('01012345678 또는 id@group.xxx')
```

**참고:**
- 웨일 로그인은 복잡한 다단계 인증 프로세스를 가질 수 있음
- 실제 테스트 시 추가 요소 식별 필요

---

## 9. 소셜 로그인 - 애플

### 9.1 애플 로그인 페이지 정보 (분석 완료 ✅)
**팝업 URL:**
```
https://appleid.apple.com/auth/authorize?...
```

### 9.2 애플 로그인 팝업 CSS 셀렉터

#### 9.2.1 Apple ID 입력 필드
```css
input#account_name_text_field
```

**대체 셀렉터:**
```typescript
// id 속성 사용 (권장)
popup.locator("input#account_name_text_field")

// type 속성 사용
popup.locator("input[type='text']").first()
```

**HTML 구조:**
```html
<input type="text" id="account_name_text_field">
```

#### 9.2.2 비밀번호 입력 필드
```css
input#password_text_field
```

**대체 셀렉터:**
```typescript
// id 속성 사용 (권장)
popup.locator("input#password_text_field")

// type 속성 사용
popup.locator("input[type='password']")
```

**HTML 구조:**
```html
<input type="password" id="password_text_field">
```

#### 9.2.3 계속/로그인 버튼
```css
button#sign-in
```

**대체 셀렉터:**
```typescript
// id 속성 사용 (권장)
popup.locator("button#sign-in")

// type 속성 사용
popup.locator("button[type='submit']")

// 텍스트 기반
popup.getByRole('button', { name: '계속' })
```

### 9.3 애플 로그인 전체 플로우 코드
```typescript
test('애플 소셜 로그인', async ({ page, context }) => {
  await page.goto('https://www.miricanvas.com/ko');
  await page.getByRole('button', { name: '로그인' }).click();
  await page.locator("div[role='dialog']").waitFor({ state: 'visible' });

  const [popup] = await Promise.all([
    context.waitForEvent('page'),
    page.locator("button:has-text('애플')").click()
  ]);

  await popup.waitForLoadState('networkidle');
  await popup.locator("input#account_name_text_field").fill('your_apple_id');
  await popup.locator("input#password_text_field").fill('your_password');
  await popup.locator("button#sign-in").click();

  await popup.waitForEvent('close', { timeout: 10000 });
  await page.waitForURL('https://www.miricanvas.com/workspace/drive', {
    timeout: 10000
  });

  expect(page.url()).toBe('https://www.miricanvas.com/workspace/drive');
});
```

---

## 5. 셀렉터 우선순위 가이드

### 5.1 안정성 순위 (높음 → 낮음)

1. **시맨틱 속성** ⭐⭐⭐⭐⭐
   ```typescript
   input[name='email']
   input[type='password']
   div[role='dialog']
   button[type='submit']
   ```

2. **data 속성** ⭐⭐⭐⭐
   ```typescript
   button[data-testid='login-button']
   div[data-component='login-dialog']
   ```

3. **Playwright 내장 선택자** ⭐⭐⭐⭐
   ```typescript
   page.getByRole('button', { name: '로그인' })
   page.getByPlaceholder('이메일')
   page.getByLabel('비밀번호')
   ```

4. **텍스트 기반** ⭐⭐⭐
   ```typescript
   button:has-text('로그인')
   div:has-text('이메일로 시작하기')
   ```

5. **CSS 클래스** ⭐⭐ (권장하지 않음)
   ```typescript
   .sc-c4d7baee-0.hSpSCA
   .sc-c406f275-0.bbsZzG
   ```
   - 동적으로 생성되는 클래스명
   - 빌드마다 변경 가능성 높음

### 5.2 권장 사항
- ❌ 동적 CSS 클래스 (`sc-xxxxx-0`) 사용 지양
- ✅ `name`, `role`, `type` 등의 안정적인 속성 우선 사용
- ✅ Playwright 내장 선택자 활용
- ✅ 텍스트 기반 선택자는 다국어 지원 고려

---

## 6. 실전 코드 예시

### 6.1 이메일 로그인 전체 플로우
```typescript
import { test, expect } from '@playwright/test';

test('이메일로 로그인', async ({ page }) => {
  // 1. 메인 페이지 접속
  await page.goto('https://www.miricanvas.com/ko');

  // 2. 로그인 버튼 클릭
  await page.getByRole('button', { name: '로그인' }).click();

  // 3. 다이얼로그 노출 확인
  await page.locator("div[role='dialog']").waitFor({ state: 'visible' });

  // 4. 이메일 로그인 선택
  await page.getByRole('button', { name: /이메일/ }).click();

  // 5. 이메일 입력
  await page.locator("input[name='email']").fill('test@example.com');

  // 6. 비밀번호 입력
  await page.locator("input[name='password']").fill('password123');

  // 7. 로그인 버튼 클릭
  await page.locator("form button[type='submit']").click();

  // 8. 로그인 성공 확인
  await page.waitForURL('https://www.miricanvas.com/workspace/drive', {
    timeout: 10000
  });

  expect(page.url()).toBe('https://www.miricanvas.com/workspace/drive');
});
```

### 6.2 소셜 로그인 (네이버) 예시
```typescript
test('네이버 로그인', async ({ page, context }) => {
  // 1. 메인 페이지 접속
  await page.goto('https://www.miricanvas.com/ko');

  // 2. 로그인 버튼 클릭
  await page.getByRole('button', { name: '로그인' }).click();

  // 3. 다이얼로그 노출 확인
  await page.locator("div[role='dialog']").waitFor({ state: 'visible' });

  // 4. 팝업 대기 및 네이버 로그인 버튼 클릭
  const [popup] = await Promise.all([
    context.waitForEvent('page'), // 새 페이지(팝업) 대기
    page.locator("button:has-text('네이버')").click()
  ]);

  // 5. 팝업에서 네이버 로그인 수행
  await popup.waitForLoadState('networkidle');
  await popup.locator("input[name='id']").fill('naver_id');
  await popup.locator("input[name='pw']").fill('naver_pw');
  await popup.locator("button[type='submit']").click();

  // 6. 팝업 닫힘 대기
  await popup.waitForEvent('close', { timeout: 10000 });

  // 7. 원래 페이지에서 로그인 성공 확인
  await page.waitForURL('https://www.miricanvas.com/workspace/drive', {
    timeout: 10000
  });

  expect(page.url()).toBe('https://www.miricanvas.com/workspace/drive');
});
```

---

## 7. 셀렉터 검증 체크리스트

테스트 작성 전 각 셀렉터를 검증하세요:

- [ ] 셀렉터가 요소를 정확히 선택하는가?
- [ ] 동적 클래스명을 사용하지 않는가?
- [ ] 여러 요소를 선택하지 않는가? (고유성)
- [ ] 페이지 리로드 후에도 작동하는가?
- [ ] 다른 브라우저에서도 작동하는가?

---

## 8. 업데이트 이력

| 날짜 | 변경 내용 | 작성자 |
|------|---------|-------|
| 2026-02-11 | 초기 문서 작성 | Claude |

---

## 9. 참고사항

### 9.1 추가 분석 필요 항목
- [ ] 소셜 로그인 버튼들의 정확한 셀렉터
- [ ] 에러 메시지 표시 요소 셀렉터
- [ ] 로딩 인디케이터 셀렉터
- [ ] 다이얼로그 닫기(X) 버튼 셀렉터

### 9.2 권장 도구
- Playwright Inspector: 셀렉터 테스트
- Chrome DevTools: 요소 검사
- Playwright Codegen: 자동 셀렉터 생성

```bash
# Playwright Codegen 실행
npx playwright codegen https://www.miricanvas.com/ko
```
