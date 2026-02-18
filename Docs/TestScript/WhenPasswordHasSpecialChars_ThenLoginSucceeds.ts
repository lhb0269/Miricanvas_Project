/**
 * Test Case: TC-EMAIL-014
 * Test Name: WhenPasswordHasSpecialChars_ThenLoginSucceeds
 * Description: 특수문자가 포함된 비밀번호 입력 처리
 *
 * Test Steps:
 * 1. 미리캔버스 홈페이지 접속
 * 2. 로그인 다이얼로그 열기
 * 3. 이메일 입력 필드에 lhb0269@naver.com 입력
 * 4. 비밀번호 입력 필드에 특수문자가 포함된 비밀번호 입력 (gksqlc9784!)
 * 5. 로그인 버튼 클릭
 *
 * Expected Result:
 * - 특수문자가 정상적으로 처리됨
 * - 올바른 비밀번호인 경우 로그인 성공
 * - 특수문자로 인한 입력 오류 발생하지 않음
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
    workspaceElements: 15000,
  },
  testData: {
    email: "lhb0269@naver.com",
    password: "gksqlc9784!", // 특수문자 ! 포함
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
  },
  workspace: {
    expectedUrl: "https://www.miricanvas.com/workspace/drive",
    userProfileIcon: "div[class*='user_profile_icon']",
    searchBox: "input[placeholder='검색']",
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
  const filename = `TC-EMAIL-014-${name}-${timestamp}.png`;
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
    log("=== TC-EMAIL-014: 특수문자가 포함된 비밀번호 입력 처리 테스트 시작 ===");

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
    // 이메일 입력
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

    log("이메일 입력 중...", { email: TEST_CONFIG.testData.email });
    await emailInput.fill(TEST_CONFIG.testData.email);
    await page.waitForTimeout(500);

    // 비밀번호 입력 (특수문자 포함)
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

    log("특수문자 포함 비밀번호 입력 중...", {
      password: "****",
      note: "특수문자 ! 포함",
    });
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
    // URL 변경 대기
    log("URL 변경 대기 중...");
    await page.waitForURL(
      (url) => url.href.includes("/workspace/drive"),
      { timeout: TEST_CONFIG.timeouts.urlChangeWait }
    );

    const currentUrl = page.url();
    log("URL 변경 확인", { url: currentUrl });

    if (!currentUrl.includes("/workspace/drive")) {
      throw new Error(
        `로그인 실패: URL이 워크스페이스로 변경되지 않았습니다. 현재 URL: ${currentUrl}`
      );
    }

    log("✅ URL 변경 확인 성공", {
      expected: SELECTORS.workspace.expectedUrl,
      actual: currentUrl,
    });

    await takeScreenshot(page, "07-workspace-loaded");

    // 워크스페이스 UI 요소 확인
    log("워크스페이스 UI 요소 확인 중...");

    const profileIconVisible = await page
      .waitForSelector(SELECTORS.workspace.userProfileIcon, {
        timeout: TEST_CONFIG.timeouts.workspaceElements,
        state: "visible",
      })
      .then(() => true)
      .catch(() => false);

    if (profileIconVisible) {
      log("✅ 워크스페이스 UI 요소 확인 성공");
    }

    await takeScreenshot(page, "08-workspace-ui-verified", true);

    log("\n=== ✅ TC-EMAIL-014 테스트 성공 ===", {
      totalSteps: stepCounter,
      result: "PASS",
      specialCharHandling: "정상",
      loginSuccess: true,
      workspaceLoaded: true,
    });
  } catch (error) {
    log("❌ TC-EMAIL-014 테스트 실패", {
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
