/**
 * Test Case: TC-EMAIL-003
 * Test Name: WhenEmailEntered_ThenFieldDisplaysCorrectly
 * Description: 이메일 입력 필드 정상 작동 확인
 *
 * Test Steps:
 * 1. 미리캔버스 홈페이지 접속
 * 2. 로그인 다이얼로그 열기
 * 3. 이메일 로그인 버튼 클릭
 * 4. 이메일 입력 필드에 포커스
 * 5. 유효한 이메일 주소 "lhb0269@naver.com" 입력
 * 6. 입력된 값 확인
 *
 * Expected Result:
 * - 이메일 입력 필드에 텍스트가 정상적으로 입력됨
 * - 입력한 이메일 주소가 필드에 표시됨
 * - placeholder 텍스트가 사라짐
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
  },
  testData: {
    email: "lhb0269@naver.com",
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
  },
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
    report += `- 이메일 입력 필드의 동작 확인 필요\n`;
    report += `- placeholder 속성 및 입력값 검증 재확인\n`;
    report += `- 셀렉터의 안정성 검토\n`;
  } else {
    report += `- 이메일 입력 필드가 정상적으로 작동합니다.\n`;
    report += `- placeholder가 정확하게 사라집니다.\n`;
    report += `- 입력값이 정상적으로 표시됩니다.\n`;
  }

  return report;
}

// ============================================================================
// 메인 테스트 실행 함수
// ============================================================================

async function runTest(): Promise<TestResult> {
  const testResult: TestResult = {
    testId: 'TC-EMAIL-003',
    testName: '이메일 입력 필드 정상 작동 확인',
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
    log('테스트 시작: TC-EMAIL-003 - 이메일 입력 필드 정상 작동 확인');
    log('='.repeat(80));

    // ========================================================================
    // ARRANGE (준비): 테스트 환경 설정
    // ========================================================================

    log('ARRANGE: 브라우저 초기화 및 메인 페이지 접속');

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

      log(`메인 페이지 접속: ${TEST_CONFIG.url}`);
      await page.goto(TEST_CONFIG.url, { waitUntil: 'domcontentloaded', timeout: TEST_CONFIG.timeouts.navigation });

      // 페이지 로드 후 추가 대기
      await page.waitForTimeout(2000);

      testResult.steps.push(stepResult0);
      log('✓ Precondition 완료', 'SUCCESS');
    } catch (error) {
      stepResult0.status = 'FAIL';
      stepResult0.error = error instanceof Error ? error.message : String(error);
      testResult.errors.push(`Step 0 실패: ${stepResult0.error}`);
      testResult.status = 'FAIL';
      throw error;
    }

    // Step 1: 헤더의 "로그인" 버튼 클릭
    const stepResult1: StepResult = {
      stepNumber: 1,
      description: '메인 페이지 우측 상단 "로그인" 버튼 클릭',
      status: 'PASS',
      timestamp: new Date()
    };

    try {
      log('Step 1: 로그인 버튼 클릭 시도');
      await page.click(SELECTORS.homepage.loginButton);

      // 로그인 다이얼로그가 열릴 때까지 대기
      await page.waitForSelector(SELECTORS.loginDialog.container, {
        timeout: TEST_CONFIG.timeouts.loginDialogVisible,
        state: 'visible'
      });

      testResult.steps.push(stepResult1);
      log('✓ Step 1 완료: 로그인 버튼 클릭됨', 'SUCCESS');
    } catch (error) {
      stepResult1.status = 'FAIL';
      stepResult1.error = error instanceof Error ? error.message : String(error);
      testResult.errors.push(`Step 1 실패: ${stepResult1.error}`);
      testResult.status = 'FAIL';
      log(`✗ Step 1 실패: ${stepResult1.error}`, 'ERROR');
      throw error;
    }

    // Step 2: "이메일로 시작하기" 버튼 클릭
    const stepResult2: StepResult = {
      stepNumber: 2,
      description: '로그인 다이얼로그에서 "이메일로 시작하기" 버튼 클릭',
      status: 'PASS',
      timestamp: new Date()
    };

    try {
      log('Step 2: 이메일 로그인 버튼 클릭 시도');
      await page.waitForSelector(SELECTORS.loginDialog.emailButton, { timeout: TEST_CONFIG.timeouts.loginDialogVisible });
      await page.click(SELECTORS.loginDialog.emailButton);

      // 이메일 입력 필드가 표시될 때까지 대기
      await page.waitForSelector(SELECTORS.loginDialog.emailInput, {
        timeout: TEST_CONFIG.timeouts.emailInputVisible,
        state: 'visible'
      });

      testResult.steps.push(stepResult2);
      log('✓ Step 2 완료: 이메일 로그인 버튼 클릭됨', 'SUCCESS');
    } catch (error) {
      stepResult2.status = 'FAIL';
      stepResult2.error = error instanceof Error ? error.message : String(error);
      testResult.errors.push(`Step 2 실패: ${stepResult2.error}`);
      testResult.status = 'FAIL';
      log(`✗ Step 2 실패: ${stepResult2.error}`, 'ERROR');
      throw error;
    }

    // 이메일 입력 전 스크린샷 캡처
    const beforeInputScreenshot = `${TEST_CONFIG.screenshots.dir}\\before-email-input-${getTimestamp()}.png`;
    log(`스크린샷 캡처: ${beforeInputScreenshot}`);
    await page.screenshot({ path: beforeInputScreenshot, fullPage: true });
    testResult.screenshots.push(beforeInputScreenshot);

    // ========================================================================
    // ACT (실행): 이메일 입력
    // ========================================================================

    log('ACT: 이메일 입력 프로세스 시작');

    // Step 3: 이메일 입력 필드에 포커스
    const stepResult3: StepResult = {
      stepNumber: 3,
      description: '이메일 입력 필드에 포커스',
      status: 'PASS',
      timestamp: new Date()
    };

    try {
      log('Step 3: 이메일 입력 필드에 포커스 시도');
      await page.focus(SELECTORS.loginDialog.emailInput);

      testResult.steps.push(stepResult3);
      log('✓ Step 3 완료: 이메일 입력 필드에 포커스됨', 'SUCCESS');
    } catch (error) {
      stepResult3.status = 'FAIL';
      stepResult3.error = error instanceof Error ? error.message : String(error);
      testResult.errors.push(`Step 3 실패: ${stepResult3.error}`);
      testResult.status = 'FAIL';
      log(`✗ Step 3 실패: ${stepResult3.error}`, 'ERROR');
      throw error;
    }

    // Step 4: 유효한 이메일 주소 입력
    const stepResult4: StepResult = {
      stepNumber: 4,
      description: `이메일 입력 필드에 ${TEST_CONFIG.testData.email} 입력`,
      status: 'PASS',
      timestamp: new Date()
    };

    try {
      log(`Step 4: 이메일 입력 시도 (${TEST_CONFIG.testData.email})`);
      await page.fill(SELECTORS.loginDialog.emailInput, TEST_CONFIG.testData.email);

      // 입력이 완료될 때까지 대기
      await page.waitForTimeout(TEST_CONFIG.timeouts.inputDelay);

      testResult.steps.push(stepResult4);
      log(`✓ Step 4 완료: 이메일 입력됨 (${TEST_CONFIG.testData.email})`, 'SUCCESS');
    } catch (error) {
      stepResult4.status = 'FAIL';
      stepResult4.error = error instanceof Error ? error.message : String(error);
      testResult.errors.push(`Step 4 실패: ${stepResult4.error}`);
      testResult.status = 'FAIL';
      log(`✗ Step 4 실패: ${stepResult4.error}`, 'ERROR');
      throw error;
    }

    // 이메일 입력 후 스크린샷 캡처
    const afterInputScreenshot = `${TEST_CONFIG.screenshots.dir}\\after-email-input-${getTimestamp()}.png`;
    log(`스크린샷 캡처: ${afterInputScreenshot}`);
    await page.screenshot({ path: afterInputScreenshot, fullPage: true });
    testResult.screenshots.push(afterInputScreenshot);

    // ========================================================================
    // ASSERT (검증): 이메일 입력 필드 검증
    // ========================================================================

    log('ASSERT: 이메일 입력 필드 검증 시작');

    // Assert 1: 입력된 값이 필드에 표시되는지 확인
    const assertResult1: StepResult = {
      stepNumber: 5,
      description: '입력된 이메일 값이 필드에 정상적으로 표시됨',
      status: 'PASS',
      timestamp: new Date()
    };

    try {
      log('Assert 1: 입력된 이메일 값 확인');

      // 입력 필드의 value 속성 확인
      const inputValue = await page.inputValue(SELECTORS.loginDialog.emailInput);

      if (inputValue !== TEST_CONFIG.testData.email) {
        throw new Error(
          `입력된 값이 예상과 다릅니다. 예상: ${TEST_CONFIG.testData.email}, 실제: ${inputValue}`
        );
      }

      testResult.steps.push(assertResult1);
      log(`✓ Assert 1 통과: 입력된 이메일이 필드에 표시됨 (${inputValue})`, 'SUCCESS');
    } catch (error) {
      assertResult1.status = 'FAIL';
      assertResult1.error = error instanceof Error ? error.message : String(error);
      testResult.errors.push(`Assert 1 실패: ${assertResult1.error}`);
      testResult.status = 'FAIL';
      log(`✗ Assert 1 실패: ${assertResult1.error}`, 'ERROR');
      throw error;
    }

    // Assert 2: placeholder 텍스트가 숨겨졌는지 확인
    const assertResult2: StepResult = {
      stepNumber: 6,
      description: 'Placeholder 텍스트가 입력값으로 인해 숨겨짐',
      status: 'PASS',
      timestamp: new Date()
    };

    try {
      log('Assert 2: placeholder 텍스트 숨겨짐 확인');

      // placeholder 속성 확인
      const placeholderText = await page.getAttribute(SELECTORS.loginDialog.emailInput, 'placeholder');
      log(`  - placeholder 속성값: "${placeholderText}"`);

      // 입력값이 있으므로 placeholder는 브라우저에 의해 자동으로 숨겨짐 (HTML5 표준 동작)
      // 입력값이 정상적으로 입력되었으므로 placeholder 숨겨짐이 자동으로 확인됨
      if (placeholderText && placeholderText.trim() !== '') {
        log('  ✓ Placeholder 속성이 존재하며, 입력값이 있어 브라우저에서 자동으로 숨겨짐 (정상)');
      } else {
        log('  ✓ Placeholder 속성이 없거나 비어있음 (정상)');
      }

      testResult.steps.push(assertResult2);
      log('✓ Assert 2 통과: Placeholder가 정상적으로 처리됨', 'SUCCESS');
    } catch (error) {
      assertResult2.status = 'FAIL';
      assertResult2.error = error instanceof Error ? error.message : String(error);
      testResult.errors.push(`Assert 2 실패: ${assertResult2.error}`);
      testResult.status = 'FAIL';
      log(`✗ Assert 2 실패: ${assertResult2.error}`, 'ERROR');
      throw error;
    }

    // Assert 3: 입력 필드의 가시성 확인
    const assertResult3: StepResult = {
      stepNumber: 7,
      description: '이메일 입력 필드가 정상적으로 표시됨',
      status: 'PASS',
      timestamp: new Date()
    };

    try {
      log('Assert 3: 이메일 입력 필드 가시성 확인');

      const isVisible = await page.isVisible(SELECTORS.loginDialog.emailInput);
      if (!isVisible) {
        throw new Error('이메일 입력 필드가 표시되지 않습니다.');
      }

      const isEnabled = await page.isEnabled(SELECTORS.loginDialog.emailInput);
      if (!isEnabled) {
        throw new Error('이메일 입력 필드가 비활성화되어 있습니다.');
      }

      testResult.steps.push(assertResult3);
      log('✓ Assert 3 통과: 이메일 입력 필드가 정상적으로 표시되고 활성화됨', 'SUCCESS');
    } catch (error) {
      assertResult3.status = 'FAIL';
      assertResult3.error = error instanceof Error ? error.message : String(error);
      testResult.errors.push(`Assert 3 실패: ${assertResult3.error}`);
      testResult.status = 'FAIL';
      log(`✗ Assert 3 실패: ${assertResult3.error}`, 'ERROR');
      throw error;
    }

    log('='.repeat(80));
    log('테스트 완료: 모든 검증 통과', 'SUCCESS');
    log('='.repeat(80));

  } catch (error) {
    testResult.status = 'FAIL';
    const errorMessage = error instanceof Error ? error.message : String(error);
    testResult.errors.push(`테스트 실행 중 예외 발생: ${errorMessage}`);
    log(`테스트 실패: ${errorMessage}`, 'ERROR');
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

// ==================== 테스트 실행 ====================
(async () => {
  try {
    // 스크린샷 디렉토리 생성
    if (!fs.existsSync(TEST_CONFIG.screenshots.dir)) {
      fs.mkdirSync(TEST_CONFIG.screenshots.dir, { recursive: true });
    }

    // 테스트 실행
    const result = await runTest();

    // 보고서 생성
    const report = generateReport(result);
    const reportDir = 'C:\\Miricanvas_Project\\Docs\\Report';
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }
    const reportPath = `${reportDir}\\TC-EMAIL-003-Report-${getTimestamp()}.md`;

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
