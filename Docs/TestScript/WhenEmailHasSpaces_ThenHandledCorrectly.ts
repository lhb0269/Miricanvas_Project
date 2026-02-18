/**
 * Test Case: TC-EMAIL-013
 * Test Name: WhenEmailHasSpaces_ThenHandledCorrectly
 * Description: 이메일에 공백 포함 시 처리 확인
 *
 * Test Steps:
 * 1. 미리캔버스 홈페이지 접속
 * 2. 로그인 다이얼로그 열기
 * 3. 이메일 입력 필드에 앞/뒤 공백이 포함된 이메일 입력 (예:  lhb0269@naver.com )
 * 4. 비밀번호 입력
 * 5. 로그인 버튼 클릭
 *
 * Expected Result:
 * - 공백이 자동으로 제거되고 로그인 성공하거나
 * - 공백으로 인해 로그인 실패 시 적절한 에러 메시지 표시
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
    urlChangeWait: 10000,
  },
  testData: {
    emailWithSpaces: " lhb0269@naver.com ", // 앞뒤 공백 포함
    password: "gksqlc9784!",
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
    errorMessage: ".sc-80ee1dde-1.hquGUb.sc-b888c254-0.dveCft",
  },
  workspace: {
    expectedUrl: "https://www.miricanvas.com/workspace/drive",
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
  const filename = `TC-EMAIL-013-${name}-${timestamp}.png`;
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
    log("=== TC-EMAIL-013: 이메일에 공백 포함 시 처리 확인 테스트 시작 ===");

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
    // 이메일 입력 (공백 포함)
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

    log("공백 포함 이메일 입력 중...", {
      email: TEST_CONFIG.testData.emailWithSpaces,
      note: "앞뒤 공백 포함",
    });
    await emailInput.fill(TEST_CONFIG.testData.emailWithSpaces);
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
    await takeScreenshot(page, "05-credentials-entered");

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
    await takeScreenshot(page, "06-login-button-clicked");

    // ========== Assert: 결과 검증 ==========
    // URL 변경 대기 (성공/실패 판단)
    log("로그인 결과 대기 중...");
    await page.waitForTimeout(5000);

    const currentUrl = page.url();
    log("현재 URL 확인", { url: currentUrl });

    if (currentUrl.includes("/workspace/drive")) {
      // 로그인 성공 - 공백이 자동으로 제거됨
      log("✅ 로그인 성공: 공백이 자동으로 제거되어 로그인됨");
      await takeScreenshot(page, "07-login-success-workspace", true);

      log("\n=== ✅ TC-EMAIL-013 테스트 성공 ===", {
        totalSteps: stepCounter,
        result: "PASS",
        behavior: "공백 자동 제거 후 로그인 성공",
        finalUrl: currentUrl,
      });
    } else {
      // 로그인 실패 - 에러 메시지 확인
      log("로그인 실패: 에러 메시지 확인 중...");

      const errorVisible = await page.isVisible(SELECTORS.loginDialog.errorMessage);

      if (errorVisible) {
        const errorElement = await page.waitForSelector(
          SELECTORS.loginDialog.errorMessage
        );
        const errorText = await errorElement.textContent();
        log("✅ 에러 메시지 표시됨", { errorMessage: errorText });
        await takeScreenshot(page, "07-login-failed-error", true);

        log("\n=== ✅ TC-EMAIL-013 테스트 성공 ===", {
          totalSteps: stepCounter,
          result: "PASS",
          behavior: "공백으로 인한 로그인 실패 (에러 메시지 표시)",
          errorMessage: errorText,
        });
      } else {
        throw new Error("로그인 실패했으나 에러 메시지가 표시되지 않았습니다.");
      }
    }
  } catch (error) {
    log("❌ TC-EMAIL-013 테스트 실패", {
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
