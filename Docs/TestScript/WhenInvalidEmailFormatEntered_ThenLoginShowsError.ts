/**
 * Test Case: TC-EMAIL-011
 * Test Name: WhenInvalidEmailFormatEntered_ThenLoginShowsError
 * Description: 유효하지 않은 이메일 형식 입력 시 검증
 *
 * Test Steps:
 * 1. 미리캔버스 홈페이지 접속
 * 2. 로그인 다이얼로그 열기
 * 3. 이메일 필드에 잘못된 형식 입력 (예: notanemail)
 * 4. 비밀번호 필드에 임의의 값 입력
 * 5. 로그인 버튼 클릭
 * 6. "@를 포함한 이메일 주소를 입력해주세요." 에러 메시지 확인
 * 7. 에러 컨테이너 클래스 변경 확인 (.sc-267d8ce6-0.ejTrKt → .sc-267d8ce6-0.gGTyzN)
 *
 * Expected Result:
 * - 에러 메시지 표시: "@를 포함한 이메일 주소를 입력해주세요."
 * - 이메일 입력 컨테이너 클래스 변경: .sc-267d8ce6-0.ejTrKt → .sc-267d8ce6-0.gGTyzN
 * - 로그인 실패 (다이얼로그 유지)
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
    emailInputVisible: 5000,
    passwordInputVisible: 5000,
    loginSubmitButtonVisible: 5000,
    errorMessageVisible: 10000,
  },
  testData: {
    invalidEmail: "notanemail", // @ 없는 잘못된 이메일 형식
    password: "testpassword123",
  },
  screenshots: {
    enabled: true,
    dir: "C:\\Miricanvas_Project\\Docs\\Report\\Screenshots",
  },
};

// ==================== 셀렉터 영역 ====================
const SELECTORS = {
  homepage: {
    loginButton: "button:has-text('로그인'):visible"
  },
  loginDialog: {
    container: "div[role='dialog']",
    emailButton: "button:has-text('이메일')",
    emailInput: "input[name='email']",
    passwordInput: "input[name='password']",
    submitButton: "form button:has-text('로그인')",
    // 이메일 형식 에러 메시지 (span 요소)
    emailFormatErrorMessage: "span[data-f='StyledSpan-cc31']:has-text('@를 포함한 이메일 주소를 입력해주세요')",
    // 이메일 입력 필드의 부모 컨테이너
    emailInputContainer: "form > div:nth-child(1) > div[data-f='StyledDiv-3ec0']",
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
  const filename = `TC-EMAIL-011-${name}-${timestamp}.png`;
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
    log("=== TC-EMAIL-011: 유효하지 않은 이메일 형식 입력 시 검증 테스트 시작 ===");

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
    await page.click(SELECTORS.loginDialog.emailButton);
    await page.waitForTimeout(1000);
    await takeScreenshot(page, "04-email-login-selected");

    // ========== Act: 테스트 실행 ==========
    // 이메일 입력 (잘못된 형식)
    log("이메일 입력 필드 대기 중...", {
      selector: SELECTORS.loginDialog.emailInput,
    });
    const emailInput = await page.waitForSelector(
      SELECTORS.loginDialog.emailInput,
      {
        timeout: TEST_CONFIG.timeouts.emailInputVisible,
        state: "visible",
      }
    );

    log("잘못된 형식의 이메일 입력 중...", {
      email: TEST_CONFIG.testData.invalidEmail,
    });
    await emailInput.fill(TEST_CONFIG.testData.invalidEmail);
    await page.waitForTimeout(500);

    // 비밀번호 입력
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

    log("비밀번호 입력 중...", { password: "****" });
    await passwordInput.fill(TEST_CONFIG.testData.password);
    await page.waitForTimeout(500);
    await takeScreenshot(page, "05-invalid-email-and-password-entered");

    // 로그인 버튼 클릭
    log("로그인 버튼 대기 중...", {
      selector: SELECTORS.loginDialog.submitButton,
    });
    await page.waitForSelector(SELECTORS.loginDialog.submitButton, {
      timeout: TEST_CONFIG.timeouts.loginSubmitButtonVisible,
      state: "visible",
    });

    log("로그인 버튼 클릭");
    await page.click(SELECTORS.loginDialog.submitButton);
    await page.waitForTimeout(1500);
    await takeScreenshot(page, "06-login-button-clicked");

    // ========== Assert: 결과 검증 ==========
    log("이메일 형식 에러 메시지 확인 중...", {
      selector: SELECTORS.loginDialog.emailFormatErrorMessage,
      expectedText: "@를 포함한 이메일 주소를 입력해주세요.",
    });

    // 에러 메시지 대기 및 텍스트 확인
    const errorElement = await page.waitForSelector(
      SELECTORS.loginDialog.emailFormatErrorMessage,
      {
        timeout: TEST_CONFIG.timeouts.errorMessageVisible,
        state: "visible",
      }
    );

    const errorText = await errorElement.textContent();
    log(`에러 메시지 발견: "${errorText}"`);

    if (!errorText || !errorText.includes("@를 포함한 이메일 주소를 입력해주세요")) {
      throw new Error(
        `에러 메시지 텍스트가 올바르지 않습니다. 실제: "${errorText}"`
      );
    }

    log("✅ 이메일 형식 에러 메시지 검증 성공", {
      expected: "@를 포함한 이메일 주소를 입력해주세요.",
      actual: errorText,
    });

    // 이메일 입력 컨테이너 클래스 변경 확인
    log("이메일 입력 컨테이너 클래스 변경 확인 중...", {
      selector: SELECTORS.loginDialog.emailInputContainer,
      expectedClass: "sc-267d8ce6-0 gGTyzN",
    });

    const emailInputContainer = page.locator(SELECTORS.loginDialog.emailInputContainer);
    const emailContainerClass = await emailInputContainer.getAttribute('class');
    log(`이메일 컨테이너 클래스: "${emailContainerClass}"`);

    if (!emailContainerClass || !emailContainerClass.includes('gGTyzN')) {
      throw new Error(
        `이메일 컨테이너 클래스가 에러 상태로 변경되지 않았습니다. 실제: "${emailContainerClass}"`
      );
    }

    log("✅ 이메일 입력 컨테이너 클래스 변경 확인 성공", {
      expectedClass: "sc-267d8ce6-0 gGTyzN",
      actualClass: emailContainerClass,
    });

    await takeScreenshot(page, "07-error-message-displayed", true);

    // 로그인 다이얼로그가 여전히 표시되는지 확인
    const dialogStillVisible = await page.isVisible(
      SELECTORS.loginDialog.container
    );
    if (!dialogStillVisible) {
      throw new Error("로그인 다이얼로그가 닫혔습니다. 로그인이 실패해야 합니다.");
    }

    log("✅ 로그인 다이얼로그 유지 확인 성공 (로그인 실패)");

    log("\n=== ✅ TC-EMAIL-011 테스트 성공 ===", {
      totalSteps: stepCounter,
      result: "PASS",
      errorMessage: "@를 포함한 이메일 주소를 입력해주세요.",
      classChange: ".sc-267d8ce6-0.ejTrKt → .sc-267d8ce6-0.gGTyzN",
      loginStatus: "실패 (예상대로)",
    });
  } catch (error) {
    log("❌ TC-EMAIL-011 테스트 실패", {
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
