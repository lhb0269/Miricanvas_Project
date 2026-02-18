/**
 * Test Case: TC-EMAIL-012
 * Test Name: WhenCloseButtonClicked_ThenDialogCloses
 * Description: 로그인 다이얼로그 닫기 버튼 동작 확인
 *
 * Test Steps:
 * 1. 미리캔버스 홈페이지 접속
 * 2. 로그인 다이얼로그 열기
 * 3. 로그인 다이얼로그 우측 상단 닫기(X) 버튼 클릭
 * 4. 페이지 상태 확인
 *
 * Expected Result:
 * - 로그인 다이얼로그가 닫힘
 * - URL이 https://www.miricanvas.com/ko로 유지됨
 * - 메인 페이지로 돌아감
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
    dialogCloseWait: 2000,
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
    closeButton: "button[data-f='Container-a9f6']", // 닫기(X) 버튼
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
  const filename = `TC-EMAIL-012-${name}-${timestamp}.png`;
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
    log("=== TC-EMAIL-012: 로그인 다이얼로그 닫기 버튼 동작 확인 테스트 시작 ===");

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

    // ========== Act: 테스트 실행 ==========
    // 닫기 버튼 클릭
    log("닫기 버튼 클릭...", {
      selector: SELECTORS.loginDialog.closeButton,
    });
    await page.click(SELECTORS.loginDialog.closeButton);
    await page.waitForTimeout(TEST_CONFIG.timeouts.dialogCloseWait);
    await takeScreenshot(page, "04-close-button-clicked");

    // ========== Assert: 결과 검증 ==========
    // 다이얼로그가 닫혔는지 확인
    log("로그인 다이얼로그 닫힘 확인 중...");
    const dialogVisible = await page.isVisible(SELECTORS.loginDialog.container);

    if (dialogVisible) {
      throw new Error("로그인 다이얼로그가 여전히 표시되고 있습니다.");
    }

    log("✅ 로그인 다이얼로그 닫힘 확인 성공");

    // URL 확인
    const currentUrl = page.url();
    log("현재 URL 확인 중...", { url: currentUrl });

    if (!currentUrl.includes("miricanvas.com/ko")) {
      throw new Error(
        `URL이 예상과 다릅니다. 예상: https://www.miricanvas.com/ko, 실제: ${currentUrl}`
      );
    }

    log("✅ URL 확인 성공", {
      expected: "https://www.miricanvas.com/ko",
      actual: currentUrl,
    });

    await takeScreenshot(page, "05-dialog-closed-homepage", true);

    log("\n=== ✅ TC-EMAIL-012 테스트 성공 ===", {
      totalSteps: stepCounter,
      result: "PASS",
      dialogClosed: true,
      urlMaintained: true,
    });
  } catch (error) {
    log("❌ TC-EMAIL-012 테스트 실패", {
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
