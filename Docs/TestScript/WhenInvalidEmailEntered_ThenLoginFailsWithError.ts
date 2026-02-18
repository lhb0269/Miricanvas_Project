/**
 * TC-EMAIL-006: 잘못된 이메일 주소로 로그인 실패
 *
 * @description
 * 미리캔버스에서 존재하지 않는 이메일과 임의의 비밀번호를 사용하여 로그인 실패를 검증하는 테스트
 *
 * @testCase
 * - Precondition: 로그인 다이얼로그 열림, 이메일 로그인 폼 표시 상태
 * - Action: 잘못된 이메일/비밀번호 입력 후 로그인 시도
 * - Expected: 에러 메시지 표시, URL 변경 없음, 다이얼로그 유지
 *
 * @pattern AAA (Arrange-Act-Assert)
 * @principle FIRST (Fast, Isolated, Repeatable, Self-validating, Timely)
 */

import { chromium, Browser, Page } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

// ============================================================================
// 테스트 설정 및 상수
// ============================================================================

const TEST_CONFIG = {
  // 테스트 대상 URL
  baseUrl: 'https://www.miricanvas.com/ko',

  // 테스트용 잘못된 계정 정보
  invalidCredentials: {
    email: 'invalid@test.com',
    password: 'testpassword123'
  },

  // 타임아웃 설정
  timeouts: {
    navigation: 10000,
    elementVisible: 5000,
    errorMessageVisible: 5000
  },

  // 스크린샷 저장 경로
  screenshotDir: 'C:\\Miricanvas_Project\\Docs\\Report\\Screenshots',
  reportDir: 'C:\\Miricanvas_Project\\Docs\\Report'
};

// ============================================================================
// CSS 셀렉터 정의
// ============================================================================

const SELECTORS = {
  // 로그인 관련 셀렉터
  header: {
    loginButton: "button:has-text('로그인'):visible"
  },

  loginDialog: {
    container: "div[role='dialog']",
    emailButton: "button:has-text('이메일')",
    emailInput: "input[name='email']",
    passwordInput: "input[name='password']",
    submitButton: "form button:has-text('로그인')",
    // 에러 메시지는 #text 노드이므로 부모 컨테이너로 찾음
    errorMessageContainer: ".sc-80ee1dde-1.hquGUb.sc-b888c254-0.dveCft",
    // 이메일 입력 필드의 부모 컨테이너
    emailInputContainer: "form > div:nth-child(1) > div[data-f='StyledDiv-3ec0']"
  }
};

// ============================================================================
// 테스트 결과 인터페이스
// ============================================================================

interface TestResult {
  testId: string;
  testName: string;
  status: 'PASS' | 'FAIL';
  startTime: Date;
  endTime: Date;
  duration: number;
  steps: StepResult[];
  errors: string[];
  screenshots: string[];
}

interface StepResult {
  stepNumber: number;
  description: string;
  status: 'PASS' | 'FAIL';
  timestamp: Date;
  error?: string;
}

// ============================================================================
// 유틸리티 함수
// ============================================================================

/**
 * 타임스탬프 생성 함수
 */
function getTimestamp(): string {
  const now = new Date();
  return now.toISOString().replace(/[:.]/g, '-');
}

/**
 * 콘솔 로그 포맷팅 함수
 */
function log(message: string, level: 'INFO' | 'ERROR' | 'SUCCESS' = 'INFO'): void {
  const timestamp = new Date().toISOString();
  const prefix = {
    INFO: '[INFO]',
    ERROR: '[ERROR]',
    SUCCESS: '[SUCCESS]'
  }[level];

  console.log(`${timestamp} ${prefix} ${message}`);
}

/**
 * 테스트 결과 보고서 생성
 */
function generateReport(result: TestResult): string {
  const passRate = (result.steps.filter(s => s.status === 'PASS').length / result.steps.length * 100).toFixed(2);

  let report = `
# 테스트 실행 결과 보고서

## 테스트 정보
- **Test ID**: ${result.testId}
- **Test Name**: ${result.testName}
- **Overall Status**: ${result.status}
- **Start Time**: ${result.startTime.toISOString()}
- **End Time**: ${result.endTime.toISOString()}
- **Duration**: ${result.duration}ms (${(result.duration / 1000).toFixed(2)}초)

## 실행 결과 요약
- **Total Steps**: ${result.steps.length}
- **Passed**: ${result.steps.filter(s => s.status === 'PASS').length}
- **Failed**: ${result.steps.filter(s => s.status === 'FAIL').length}
- **Pass Rate**: ${passRate}%

## 단계별 실행 결과

`;

  result.steps.forEach(step => {
    const statusIcon = step.status === 'PASS' ? '✅' : '❌';
    report += `### Step ${step.stepNumber}: ${step.description}
- Status: ${statusIcon} ${step.status}
- Timestamp: ${step.timestamp.toISOString()}
${step.error ? `- Error: ${step.error}\n` : ''}
`;
  });

  if (result.errors.length > 0) {
    report += `\n## 에러 로그\n\n`;
    result.errors.forEach((error, index) => {
      report += `${index + 1}. ${error}\n`;
    });
  }

  if (result.screenshots.length > 0) {
    report += `\n## 스크린샷\n\n`;
    result.screenshots.forEach((screenshot, index) => {
      report += `${index + 1}. ${screenshot}\n`;
    });
  }

  report += `\n## 개선점 및 권장사항\n\n`;

  if (result.status === 'FAIL') {
    report += `- 실패한 단계를 중심으로 원인 분석 필요\n`;
    report += `- 에러 메시지 셀렉터 안정성 재검토 필요\n`;
    report += `- 로그인 실패 시 표시되는 에러 메시지 포맷 변경 가능성 확인\n`;
    report += `- 네트워크 지연, 요소 로딩 타이밍 이슈 확인\n`;
  } else {
    report += `- 모든 테스트 단계가 성공적으로 완료되었습니다.\n`;
    report += `- 로그인 실패 케이스가 올바르게 처리되는 것을 확인했습니다.\n`;
    report += `- 에러 메시지 표시가 사용자에게 명확하게 전달되는지 검토\n`;
    report += `- 다양한 잘못된 입력 패턴에 대한 추가 테스트 고려\n`;
  }

  return report;
}

// ============================================================================
// 메인 테스트 실행 함수
// ============================================================================

async function runTest(): Promise<TestResult> {
  const testResult: TestResult = {
    testId: 'TC-EMAIL-006',
    testName: '잘못된 이메일 주소로 로그인 실패',
    status: 'PASS',
    startTime: new Date(),
    endTime: new Date(),
    duration: 0,
    steps: [],
    errors: [],
    screenshots: []
  };

  let browser: Browser | null = null;
  let page: Page | null = null;

  try {
    log('='.repeat(80));
    log('테스트 시작: TC-EMAIL-006 - 잘못된 이메일 주소로 로그인 실패');
    log('='.repeat(80));

    // ========================================================================
    // ARRANGE (준비): 테스트 환경 설정
    // ========================================================================

    log('ARRANGE: 브라우저 초기화 및 로그인 다이얼로그 열기');

    // Step 0: 브라우저 시작 및 메인 페이지 이동
    const stepResult0: StepResult = {
      stepNumber: 0,
      description: 'Precondition - 브라우저 시작 및 메인 페이지 접속',
      status: 'PASS',
      timestamp: new Date()
    };

    try {
      log('브라우저 시작 중...');
      browser = await chromium.launch({ headless: false });
      page = await browser.newPage();

      log(`메인 페이지 접속: ${TEST_CONFIG.baseUrl}`);
      await page.goto(TEST_CONFIG.baseUrl, { waitUntil: 'networkidle', timeout: TEST_CONFIG.timeouts.navigation });

      // 페이지 로드 후 추가 대기
      await page.waitForTimeout(2000);

      testResult.steps.push(stepResult0);
      log('✓ Precondition Step 0 완료', 'SUCCESS');
    } catch (error) {
      stepResult0.status = 'FAIL';
      stepResult0.error = error instanceof Error ? error.message : String(error);
      testResult.errors.push(`Step 0 실패: ${stepResult0.error}`);
      testResult.status = 'FAIL';
      throw error;
    }

    // Step 0-1: 로그인 버튼 클릭하여 다이얼로그 열기
    const stepResult01: StepResult = {
      stepNumber: 0.1,
      description: 'Precondition - 메인 페이지 우측 상단 "로그인" 버튼 클릭',
      status: 'PASS',
      timestamp: new Date()
    };

    try {
      log('Precondition: 로그인 버튼 클릭 시도');
      await page.click(SELECTORS.header.loginButton);

      testResult.steps.push(stepResult01);
      log('✓ Precondition Step 0.1 완료: 로그인 버튼 클릭됨', 'SUCCESS');
    } catch (error) {
      stepResult01.status = 'FAIL';
      stepResult01.error = error instanceof Error ? error.message : String(error);
      testResult.errors.push(`Step 0.1 실패: ${stepResult01.error}`);
      testResult.status = 'FAIL';
      log(`✗ Step 0.1 실패: ${stepResult01.error}`, 'ERROR');
      throw error;
    }

    // Step 0-2: 이메일 로그인 버튼 클릭
    const stepResult02: StepResult = {
      stepNumber: 0.2,
      description: 'Precondition - 로그인 다이얼로그에서 "이메일로 시작하기" 버튼 클릭',
      status: 'PASS',
      timestamp: new Date()
    };

    try {
      log('Precondition: 이메일 로그인 버튼 클릭 시도');
      await page.waitForSelector(SELECTORS.loginDialog.emailButton, { timeout: TEST_CONFIG.timeouts.elementVisible });
      await page.click(SELECTORS.loginDialog.emailButton);

      testResult.steps.push(stepResult02);
      log('✓ Precondition Step 0.2 완료: 이메일 로그인 버튼 클릭됨', 'SUCCESS');
    } catch (error) {
      stepResult02.status = 'FAIL';
      stepResult02.error = error instanceof Error ? error.message : String(error);
      testResult.errors.push(`Step 0.2 실패: ${stepResult02.error}`);
      testResult.status = 'FAIL';
      log(`✗ Step 0.2 실패: ${stepResult02.error}`, 'ERROR');
      throw error;
    }

    // ========================================================================
    // ACT (실행): 잘못된 정보로 로그인 시도
    // ========================================================================

    log('ACT: 잘못된 이메일/비밀번호로 로그인 시도');

    // Step 1: 잘못된 이메일 입력
    const stepResult1: StepResult = {
      stepNumber: 1,
      description: `이메일 입력 필드에 존재하지 않는 이메일 ${TEST_CONFIG.invalidCredentials.email} 입력`,
      status: 'PASS',
      timestamp: new Date()
    };

    try {
      log('Step 1: 잘못된 이메일 입력 시도');
      await page.waitForSelector(SELECTORS.loginDialog.emailInput, { timeout: TEST_CONFIG.timeouts.elementVisible });
      await page.fill(SELECTORS.loginDialog.emailInput, TEST_CONFIG.invalidCredentials.email);

      testResult.steps.push(stepResult1);
      log(`✓ Step 1 완료: 잘못된 이메일 입력됨 (${TEST_CONFIG.invalidCredentials.email})`, 'SUCCESS');
    } catch (error) {
      stepResult1.status = 'FAIL';
      stepResult1.error = error instanceof Error ? error.message : String(error);
      testResult.errors.push(`Step 1 실패: ${stepResult1.error}`);
      testResult.status = 'FAIL';
      log(`✗ Step 1 실패: ${stepResult1.error}`, 'ERROR');
      throw error;
    }

    // Step 2: 임의의 비밀번호 입력
    const stepResult2: StepResult = {
      stepNumber: 2,
      description: `비밀번호 입력 필드에 임의의 비밀번호 ${TEST_CONFIG.invalidCredentials.password} 입력`,
      status: 'PASS',
      timestamp: new Date()
    };

    try {
      log('Step 2: 임의의 비밀번호 입력 시도');
      await page.waitForSelector(SELECTORS.loginDialog.passwordInput, { timeout: TEST_CONFIG.timeouts.elementVisible });
      await page.fill(SELECTORS.loginDialog.passwordInput, TEST_CONFIG.invalidCredentials.password);

      testResult.steps.push(stepResult2);
      log('✓ Step 2 완료: 비밀번호 입력됨', 'SUCCESS');
    } catch (error) {
      stepResult2.status = 'FAIL';
      stepResult2.error = error instanceof Error ? error.message : String(error);
      testResult.errors.push(`Step 2 실패: ${stepResult2.error}`);
      testResult.status = 'FAIL';
      log(`✗ Step 2 실패: ${stepResult2.error}`, 'ERROR');
      throw error;
    }

    // 로그인 시도 전 스크린샷 캡처
    const beforeLoginScreenshot = `${TEST_CONFIG.screenshotDir}\\before-invalid-login-${getTimestamp()}.png`;
    log(`스크린샷 캡처: ${beforeLoginScreenshot}`);
    await page.screenshot({ path: beforeLoginScreenshot, fullPage: true });
    testResult.screenshots.push(beforeLoginScreenshot);

    // Step 3: 로그인 버튼 클릭
    const stepResult3: StepResult = {
      stepNumber: 3,
      description: '"로그인" 버튼 클릭',
      status: 'PASS',
      timestamp: new Date()
    };

    try {
      log('Step 3: 로그인 제출 버튼 클릭 시도');

      // 로그인 버튼이 활성화될 때까지 대기
      await page.waitForSelector(`${SELECTORS.loginDialog.submitButton}:not([aria-disabled="true"])`, {
        timeout: TEST_CONFIG.timeouts.elementVisible
      });

      await page.click(SELECTORS.loginDialog.submitButton);

      testResult.steps.push(stepResult3);
      log('✓ Step 3 완료: 로그인 버튼 클릭됨', 'SUCCESS');
    } catch (error) {
      stepResult3.status = 'FAIL';
      stepResult3.error = error instanceof Error ? error.message : String(error);
      testResult.errors.push(`Step 3 실패: ${stepResult3.error}`);
      testResult.status = 'FAIL';
      log(`✗ Step 3 실패: ${stepResult3.error}`, 'ERROR');
      throw error;
    }

    // Step 4: 5초 대기
    const stepResult4: StepResult = {
      stepNumber: 4,
      description: '5초 대기 후 결과 확인',
      status: 'PASS',
      timestamp: new Date()
    };

    try {
      log('Step 4: 5초 대기 중...');
      await page.waitForTimeout(5000);

      testResult.steps.push(stepResult4);
      log('✓ Step 4 완료: 5초 대기 완료', 'SUCCESS');
    } catch (error) {
      stepResult4.status = 'FAIL';
      stepResult4.error = error instanceof Error ? error.message : String(error);
      testResult.errors.push(`Step 4 실패: ${stepResult4.error}`);
      testResult.status = 'FAIL';
      log(`✗ Step 4 실패: ${stepResult4.error}`, 'ERROR');
      throw error;
    }

    // ========================================================================
    // ASSERT (검증): 로그인 실패 확인
    // ========================================================================

    log('ASSERT: 로그인 실패 검증 시작');

    // Assert 1: URL이 변경되지 않았는지 확인
    const assertResult1: StepResult = {
      stepNumber: 5,
      description: 'URL이 변경되지 않음 (https://www.miricanvas.com/ko 유지)',
      status: 'PASS',
      timestamp: new Date()
    };

    try {
      log('Assert 1: URL 유지 확인');
      const currentUrl = page.url();
      log(`현재 URL: ${currentUrl}`);

      if (currentUrl !== TEST_CONFIG.baseUrl) {
        throw new Error(`URL이 예상과 다릅니다. 예상: ${TEST_CONFIG.baseUrl}, 실제: ${currentUrl}`);
      }

      testResult.steps.push(assertResult1);
      log(`✓ Assert 1 통과: URL이 변경되지 않음 (${TEST_CONFIG.baseUrl} 유지)`, 'SUCCESS');
    } catch (error) {
      assertResult1.status = 'FAIL';
      assertResult1.error = error instanceof Error ? error.message : String(error);
      testResult.errors.push(`Assert 1 실패: ${assertResult1.error}`);
      testResult.status = 'FAIL';
      log(`✗ Assert 1 실패: ${assertResult1.error}`, 'ERROR');
    }

    // Assert 2: 에러 메시지 표시 확인
    const assertResult2: StepResult = {
      stepNumber: 6,
      description: '에러 메시지 표시 확인 ("존재하지 않는 이메일입니다")',
      status: 'PASS',
      timestamp: new Date()
    };

    try {
      log('Assert 2: 에러 메시지 표시 확인');

      // 에러 메시지 컨테이너 대기
      const errorMessageContainer = await page.waitForSelector(SELECTORS.loginDialog.errorMessageContainer, {
        timeout: TEST_CONFIG.timeouts.errorMessageVisible,
        state: 'visible'
      });

      if (!errorMessageContainer) {
        throw new Error('에러 메시지 컨테이너가 표시되지 않았습니다.');
      }

      // 에러 메시지 텍스트 추출 (#text 노드이므로 부모 컨테이너의 textContent로 확인)
      const errorText = await errorMessageContainer.textContent();
      log(`에러 메시지 발견: "${errorText}"`);

      // "존재하지 않는 이메일입니다" 텍스트 확인
      if (!errorText || !errorText.includes('존재하지 않는 이메일입니다')) {
        throw new Error(`에러 메시지 텍스트가 올바르지 않습니다. 실제: "${errorText}"`);
      }

      log(`✓ 에러 메시지 확인: "존재하지 않는 이메일입니다"`);

      // 이메일 입력 컨테이너 클래스 변경 확인 (sc-267d8ce6-0 ejTrKt -> sc-267d8ce6-0 gGTyzN)
      const emailInputContainerLocator = page.locator(SELECTORS.loginDialog.emailInputContainer);
      const emailContainerClass = await emailInputContainerLocator.getAttribute('class');
      log(`이메일 컨테이너 클래스: "${emailContainerClass}"`);

      if (!emailContainerClass || !emailContainerClass.includes('gGTyzN')) {
        throw new Error(`이메일 컨테이너 클래스가 에러 상태로 변경되지 않았습니다. 실제: "${emailContainerClass}"`);
      }

      log('✓ 이메일 입력 컨테이너 클래스 변경 확인됨 (sc-267d8ce6-0 gGTyzN)');

      testResult.steps.push(assertResult2);
      log(`✓ Assert 2 통과: 에러 메시지 표시됨`, 'SUCCESS');
    } catch (error) {
      assertResult2.status = 'FAIL';
      assertResult2.error = error instanceof Error ? error.message : String(error);
      testResult.errors.push(`Assert 2 실패: ${assertResult2.error}`);
      testResult.status = 'FAIL';
      log(`✗ Assert 2 실패: ${assertResult2.error}`, 'ERROR');

      // 에러 메시지 찾기 실패 시 디버깅 정보 출력
      try {
        // 에러 메시지 컨테이너 찾기
        const containers = await page.$$eval('.sc-80ee1dde-1', elements =>
          elements.map(el => ({
            tag: el.tagName,
            class: el.className,
            text: el.textContent?.substring(0, 100)
          }))
        );
        log(`sc-80ee1dde-1 클래스를 가진 요소들: ${JSON.stringify(containers, null, 2)}`);
      } catch (debugError) {
        log('디버깅 정보 추출 실패', 'ERROR');
      }
    }

    // Assert 3: 로그인 다이얼로그가 닫히지 않았는지 확인
    const assertResult3: StepResult = {
      stepNumber: 7,
      description: '로그인 다이얼로그가 닫히지 않음',
      status: 'PASS',
      timestamp: new Date()
    };

    try {
      log('Assert 3: 로그인 다이얼로그 유지 확인');
      const dialogVisible = await page.isVisible(SELECTORS.loginDialog.emailInput);

      if (!dialogVisible) {
        throw new Error('로그인 다이얼로그가 닫혔습니다. 로그인 실패 시 다이얼로그가 유지되어야 합니다.');
      }

      testResult.steps.push(assertResult3);
      log('✓ Assert 3 통과: 로그인 다이얼로그가 유지됨', 'SUCCESS');
    } catch (error) {
      assertResult3.status = 'FAIL';
      assertResult3.error = error instanceof Error ? error.message : String(error);
      testResult.errors.push(`Assert 3 실패: ${assertResult3.error}`);
      testResult.status = 'FAIL';
      log(`✗ Assert 3 실패: ${assertResult3.error}`, 'ERROR');
    }

    // Assert 4: 입력 필드가 활성 상태로 유지되는지 확인
    const assertResult4: StepResult = {
      stepNumber: 8,
      description: '입력 필드가 활성 상태로 유지',
      status: 'PASS',
      timestamp: new Date()
    };

    try {
      log('Assert 4: 입력 필드 활성 상태 확인');

      // 이메일 입력 필드 활성화 확인
      const emailInputEnabled = await page.isEnabled(SELECTORS.loginDialog.emailInput);
      if (!emailInputEnabled) {
        throw new Error('이메일 입력 필드가 비활성화되었습니다.');
      }

      // 비밀번호 입력 필드 활성화 확인
      const passwordInputEnabled = await page.isEnabled(SELECTORS.loginDialog.passwordInput);
      if (!passwordInputEnabled) {
        throw new Error('비밀번호 입력 필드가 비활성화되었습니다.');
      }

      testResult.steps.push(assertResult4);
      log('✓ Assert 4 통과: 모든 입력 필드가 활성 상태로 유지됨', 'SUCCESS');
    } catch (error) {
      assertResult4.status = 'FAIL';
      assertResult4.error = error instanceof Error ? error.message : String(error);
      testResult.errors.push(`Assert 4 실패: ${assertResult4.error}`);
      testResult.status = 'FAIL';
      log(`✗ Assert 4 실패: ${assertResult4.error}`, 'ERROR');
    }

    // 로그인 실패 후 스크린샷 캡처
    const afterLoginFailScreenshot = `${TEST_CONFIG.screenshotDir}\\after-invalid-login-fail-${getTimestamp()}.png`;
    log(`스크린샷 캡처: ${afterLoginFailScreenshot}`);
    await page.screenshot({ path: afterLoginFailScreenshot, fullPage: true });
    testResult.screenshots.push(afterLoginFailScreenshot);

    log('='.repeat(80));
    log('테스트 완료: 로그인 실패 검증 완료', 'SUCCESS');
    log('='.repeat(80));

  } catch (error) {
    testResult.status = 'FAIL';
    const errorMessage = error instanceof Error ? error.message : String(error);
    testResult.errors.push(`테스트 실행 중 예외 발생: ${errorMessage}`);
    log(`테스트 실패: ${errorMessage}`, 'ERROR');

    // 실패 시 추가 스크린샷 캡처
    if (page) {
      try {
        const errorScreenshot = `${TEST_CONFIG.screenshotDir}\\error-${getTimestamp()}.png`;
        await page.screenshot({ path: errorScreenshot, fullPage: true });
        testResult.screenshots.push(errorScreenshot);
        log(`에러 스크린샷 캡처: ${errorScreenshot}`);
      } catch (screenshotError) {
        log('에러 스크린샷 캡처 실패', 'ERROR');
      }
    }
  } finally {
    // 브라우저 종료
    if (browser) {
      log('브라우저 종료 중...');
      await browser.close();
    }

    // 테스트 종료 시간 및 소요 시간 기록
    testResult.endTime = new Date();
    testResult.duration = testResult.endTime.getTime() - testResult.startTime.getTime();
  }

  return testResult;
}

// ============================================================================
// 테스트 실행 및 보고서 생성
// ============================================================================

(async () => {
  try {
    // 스크린샷 및 보고서 디렉토리 생성
    if (!fs.existsSync(TEST_CONFIG.screenshotDir)) {
      fs.mkdirSync(TEST_CONFIG.screenshotDir, { recursive: true });
    }
    if (!fs.existsSync(TEST_CONFIG.reportDir)) {
      fs.mkdirSync(TEST_CONFIG.reportDir, { recursive: true });
    }

    // 테스트 실행
    const result = await runTest();

    // 보고서 생성
    const report = generateReport(result);
    const reportPath = `${TEST_CONFIG.reportDir}\\TC-EMAIL-006-Report-${getTimestamp()}.md`;

    // 보고서를 파일로 저장
    fs.writeFileSync(reportPath, report, 'utf-8');

    log(`보고서 생성 완료: ${reportPath}`);
    console.log('\n' + report);

    // 테스트 결과 반환
    process.exit(result.status === 'PASS' ? 0 : 1);
  } catch (error) {
    log(`테스트 실행 중 치명적 오류 발생: ${error}`, 'ERROR');
    process.exit(1);
  }
})();
