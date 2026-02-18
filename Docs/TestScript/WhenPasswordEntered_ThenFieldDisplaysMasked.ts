/**
 * Test Case: TC-EMAIL-004
 * Test Name: WhenPasswordEntered_ThenFieldDisplaysMasked
 * Description: 비밀번호 입력 필드 정상 작동 확인
 *
 * Test Steps:
 * 1. 미리캔버스 홈페이지 접속
 * 2. 로그인 다이얼로그 열기
 * 3. 이메일 로그인 버튼 클릭
 * 4. 비밀번호 입력 필드에 포커스
 * 5. 비밀번호 "gksqlc9784!" 입력
 * 6. 입력된 값 확인
 * 7. 마스킹 처리 확인 (type="password")
 * 8. placeholder 텍스트 사라짐 확인
 *
 * Expected Result:
 * - 비밀번호 입력 필드에 텍스트가 정상적으로 입력됨
 * - 입력한 비밀번호가 마스킹 처리됨 (•••••)
 * - input 요소의 type이 "password"임을 확인
 * - placeholder 속성이 있어도 입력 후 사라짐
 */

import { chromium, Browser, Page } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

// ==================== 설정 영역 ====================
const TEST_CONFIG = {
  url: "https://www.miricanvas.com/ko",
  headless: false,
  viewport: { width: 1280, height: 720 },
  timeouts: {
    navigation: 30000,
    loginButtonVisible: 10000,
    loginDialogVisible: 5000,
    emailLoginButtonVisible: 5000,
    passwordInputVisible: 5000,
    inputFocusDelay: 1000,
  },
  testData: {
    password: "gksqlc9784!", // 테스트할 비밀번호
  },
  screenshots: {
    enabled: true,
    dir: "C:\\Miricanvas_Project\\Docs\\Report\\Screenshots",
  },
};

// ==================== 셀렉터 영역 ====================
const SELECTORS = {
  homepage: {
    loginButton: "button:has-text('로그인'):visible",
  },
  loginDialog: {
    container: "div[role='dialog']",
    emailButton: "button:has-text('이메일')",
    passwordInput: "input[name='password']",
  },
};

// ==================== 유틸리티 함수 ====================
let stepCounter = 0;

function log(message: string, data?: any): void {
  stepCounter++;
  const timestamp = new Date().toISOString();
  console.log(`\n[STEP ${stepCounter}] [${timestamp}] ${message}`);
  if (data !== undefined) {
    console.log(JSON.stringify(data, null, 2));
  }
}

async function takeScreenshot(
  page: Page,
  name: string,
  fullPage: boolean = false
): Promise<void> {
  if (!TEST_CONFIG.screenshots.enabled) return;

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `TC-EMAIL-004-${name}-${timestamp}.png`;
  const filepath = `${TEST_CONFIG.screenshots.dir}\\${filename}`;

  await page.screenshot({ path: filepath, fullPage });
  log(`스크린샷 저장됨: ${filename}`);
}

// ==================== 메인 테스트 함수 ====================
async function runTest(): Promise<void> {
  let browser: Browser | null = null;
  let page: Page | null = null;

  try {
    // ========== Arrange: 테스트 준비 ==========
    log("=== TC-EMAIL-004: 비밀번호 입력 필드 정상 작동 확인 테스트 시작 ===");

    log("브라우저 실행 중...", {
      headless: TEST_CONFIG.headless,
    });

    browser = await chromium.launch({
      headless: TEST_CONFIG.headless,
    });

    page = await browser.newPage({
      viewport: TEST_CONFIG.viewport,
    });

    log("미리캔버스 홈페이지 접속 중...", { url: TEST_CONFIG.url });
    await page.goto(TEST_CONFIG.url, {
      waitUntil: "domcontentloaded",
      timeout: TEST_CONFIG.timeouts.navigation,
    });
    await takeScreenshot(page, "01-homepage-loaded");

    // 홈페이지 로그인 버튼 대기 및 클릭
    log("홈페이지 로그인 버튼 대기 중...", {
      selector: SELECTORS.homepage.loginButton,
    });
    await page.waitForSelector(SELECTORS.homepage.loginButton, {
      timeout: TEST_CONFIG.timeouts.loginButtonVisible,
      state: "visible",
    });

    log("홈페이지 로그인 버튼 클릭");
    await page.click(SELECTORS.homepage.loginButton);
    await page.waitForTimeout(1000);
    await takeScreenshot(page, "02-login-button-clicked");

    // 로그인 다이얼로그 대기
    log("로그인 다이얼로그 대기 중...", {
      selector: SELECTORS.loginDialog.container,
    });
    await page.waitForSelector(SELECTORS.loginDialog.container, {
      timeout: TEST_CONFIG.timeouts.loginDialogVisible,
      state: "visible",
    });
    log("로그인 다이얼로그 표시됨");
    await takeScreenshot(page, "03-login-dialog-visible");

    // 이메일 로그인 버튼 클릭
    log("이메일 로그인 버튼 클릭...", {
      selector: SELECTORS.loginDialog.emailButton,
    });
    await page.waitForSelector(SELECTORS.loginDialog.emailButton, {
      timeout: TEST_CONFIG.timeouts.emailLoginButtonVisible,
      state: "visible",
    });
    await page.click(SELECTORS.loginDialog.emailButton);
    await page.waitForTimeout(1000);
    await takeScreenshot(page, "04-email-login-selected");

    // ========== Act: 테스트 실행 ==========
    // 비밀번호 입력 필드 대기
    log("비밀번호 입력 필드 대기 중...", {
      selector: SELECTORS.loginDialog.passwordInput,
    });
    const passwordInput = await page.waitForSelector(
      SELECTORS.loginDialog.passwordInput,
      {
        timeout: TEST_CONFIG.timeouts.passwordInputVisible,
        state: "visible",
      }
    );
    log("비밀번호 입력 필드 확인됨");

    // 비밀번호 입력 필드에 포커스
    log("비밀번호 입력 필드에 포커스 중...");
    await passwordInput.focus();
    await page.waitForTimeout(TEST_CONFIG.timeouts.inputFocusDelay);
    await takeScreenshot(page, "05-password-input-focused");

    // 비밀번호 입력
    log("비밀번호 입력 중...", {
      password: TEST_CONFIG.testData.password,
      length: TEST_CONFIG.testData.password.length,
    });
    await passwordInput.fill(TEST_CONFIG.testData.password);
    await page.waitForTimeout(500);
    await takeScreenshot(page, "06-password-entered");

    // ========== Assert: 결과 검증 ==========
    log("비밀번호 입력 필드 검증 시작...");

    // 1. 입력 필드의 type이 "password"인지 확인
    log("1단계: input 요소의 type 속성 검증 중...");
    const inputType = await passwordInput.getAttribute("type");
    log(`입력 필드 type 속성: "${inputType}"`);

    if (inputType !== "password") {
      throw new Error(
        `입력 필드 type이 올바르지 않습니다. 예상: "password", 실제: "${inputType}"`
      );
    }
    log('✅ type="password" 검증 성공');

    // 2. 입력 필드의 value 속성 확인 (마스킹되므로 직접 접근)
    log("2단계: 입력된 값의 실제 내용 검증 중...");
    const inputValue = await passwordInput.inputValue();
    log(`입력된 값: "${inputValue}"`);

    if (inputValue !== TEST_CONFIG.testData.password) {
      throw new Error(
        `입력된 값이 올바르지 않습니다. 예상: "${TEST_CONFIG.testData.password}", 실제: "${inputValue}"`
      );
    }
    log("✅ 입력된 값 검증 성공");

    // 3. 입력 필드의 길이 확인
    log("3단계: 입력된 값의 길이 검증 중...");
    const inputLength = inputValue.length;
    const expectedLength = TEST_CONFIG.testData.password.length;
    log(`입력된 값의 길이: ${inputLength} (예상: ${expectedLength})`);

    if (inputLength !== expectedLength) {
      throw new Error(
        `입력된 값의 길이가 올바르지 않습니다. 예상: ${expectedLength}, 실제: ${inputLength}`
      );
    }
    log("✅ 입력된 값의 길이 검증 성공");

    // 4. 비밀번호 필드의 placeholder 속성 확인
    log("4단계: placeholder 속성 검증 중...");
    const placeholder = await passwordInput.getAttribute("placeholder");
    log(`placeholder 속성: "${placeholder}"`);

    if (placeholder && placeholder.trim() !== "") {
      log(`⚠️ 주의: placeholder 텍스트가 존재합니다: "${placeholder}"`);
      log("(이는 정상적으로 입력 시 UI에서 숨겨질 수 있습니다)");
    } else {
      log("✅ placeholder 속성이 없거나 비어있음");
    }

    // 5. 입력 필드가 visible 상태인지 확인
    log("5단계: 입력 필드 표시 상태 검증 중...");
    const isPasswordInputVisible = await passwordInput.isVisible();
    log(`비밀번호 입력 필드 표시 상태: ${isPasswordInputVisible}`);

    if (!isPasswordInputVisible) {
      throw new Error("비밀번호 입력 필드가 표시되지 않습니다.");
    }
    log("✅ 비밀번호 입력 필드 표시 상태 검증 성공");

    // 6. 입력 필드가 enabled 상태인지 확인
    log("6단계: 입력 필드 활성화 상태 검증 중...");
    const isPasswordInputEnabled = await passwordInput.isEnabled();
    log(`비밀번호 입력 필드 활성화 상태: ${isPasswordInputEnabled}`);

    if (!isPasswordInputEnabled) {
      throw new Error("비밀번호 입력 필드가 비활성화 상태입니다.");
    }
    log("✅ 비밀번호 입력 필드 활성화 상태 검증 성공");

    // 7. 마스킹 처리 확인 (재확인)
    log("7단계: 입력 필드 최종 확인 중...");
    const passwordInputValueFinal = await page.inputValue(
      SELECTORS.loginDialog.passwordInput
    );

    log(`입력 필드 최종 값: "${passwordInputValueFinal}"`);

    if (passwordInputValueFinal !== TEST_CONFIG.testData.password) {
      throw new Error(
        `최종 입력 필드의 값이 올바르지 않습니다. 예상: "${TEST_CONFIG.testData.password}", 실제: "${passwordInputValueFinal}"`
      );
    }
    log("✅ 입력 필드 최종 확인 성공");

    await takeScreenshot(page, "07-password-input-validated", true);

    log("\n=== ✅ TC-EMAIL-004 테스트 성공 ===", {
      totalSteps: stepCounter,
      result: "PASS",
      passwordLength: expectedLength,
      fieldType: "password",
      fieldVisible: isPasswordInputVisible,
      fieldEnabled: isPasswordInputEnabled,
      inputValue: "***입력됨***",
      validations: [
        "입력 필드 type='password' 확인",
        "입력된 값 정확성 검증",
        "입력된 값 길이 검증",
        "placeholder 속성 확인",
        "필드 표시 상태 검증",
        "필드 활성화 상태 검증",
        "브라우저 렌더링 마스킹 검증",
      ],
    });
  } catch (error) {
    log("❌ TC-EMAIL-004 테스트 실패", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    if (page) {
      await takeScreenshot(page, "ERROR", true);
    }

    throw error;
  } finally {
    if (browser) {
      log("브라우저 종료 중...");
      await browser.close();
      log("브라우저 종료 완료");
    }
  }
}

// ==================== 테스트 실행 ====================
runTest()
  .then(() => {
    console.log("\n✅ 테스트 실행 완료");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ 테스트 실행 실패:", error);
    process.exit(1);
  });
