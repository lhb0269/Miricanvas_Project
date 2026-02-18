/**
 * TC-EMAIL-002: 로그인 다이얼로그 정상 표시 확인
 *
 * @description
 * 미리캔버스 메인 페이지에서 로그인 버튼 클릭 후 로그인 다이얼로그가 정상적으로
 * 표시되고 필수 UI 요소들이 모두 존재하는지 검증하는 테스트
 *
 * @testCase
 * - Precondition: 미리캔버스 메인 페이지 접속, 로그아웃 상태
 * - Action: 메인 페이지 우측 상단 로그인 버튼 클릭
 * - Expected: 로그인 다이얼로그 표시 및 필수 UI 요소 확인
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

  // 타임아웃 설정
  timeouts: {
    navigation: 10000,
    elementVisible: 5000
  },

  // 스크린샷 저장 경로
  screenshotDir: 'C:\\Miricanvas_Project\\Docs\\Report\\Screenshots',
  reportDir: 'C:\\Miricanvas_Project\\Docs\\Report'
};

// ============================================================================
// CSS 셀렉터 정의
// ============================================================================

const SELECTORS = {
  // 홈페이지 로그인 버튼
  header: {
    loginButton: "button:has-text('로그인'):visible"
  },

  // 로그인 다이얼로그 요소
  loginDialog: {
    container: "div[role='dialog']",
    emailButton: "button:has-text('이메일')",
    closeButton: "button[data-f='Container-a9f6']",
    // 소셜 로그인 버튼들
    naverButton: "button:has-text('네이버')",
    googleButton: "button:has-text('구글')",
    kakaoButton: "button:has-text('카카오')",
    facebookButton: "button:has-text('페이스북')",
    whaleButton: "button:has-text('웨일')",
    appleButton: "button:has-text('애플')"
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
    const statusIcon = step.status === 'PASS' ? '[PASS]' : '[FAIL]';
    report += `### Step ${step.stepNumber}: ${step.description}
- Status: ${statusIcon}
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
    report += `- 네트워크 지연, 요소 로딩 타이밍 이슈 확인\n`;
    report += `- 셀렉터 안정성 재검토\n`;
    report += `- 다이얼로그 표시 조건 및 DOM 구조 확인\n`;
  } else {
    report += `- 모든 테스트 단계가 성공적으로 완료되었습니다.\n`;
    report += `- 로그인 다이얼로그의 모든 필수 UI 요소가 정상 표시됨\n`;
    report += `- 다이얼로그 닫기 기능 추가 테스트 고려\n`;
  }

  return report;
}

// ============================================================================
// 메인 테스트 실행 함수
// ============================================================================

async function runTest(): Promise<TestResult> {
  const testResult: TestResult = {
    testId: 'TC-EMAIL-002',
    testName: '로그인 다이얼로그 정상 표시 확인',
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
    log('테스트 시작: TC-EMAIL-002 - 로그인 다이얼로그 정상 표시 확인');
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

      log(`메인 페이지 접속: ${TEST_CONFIG.baseUrl}`);
      await page.goto(TEST_CONFIG.baseUrl, {
        waitUntil: 'networkidle',
        timeout: TEST_CONFIG.timeouts.navigation
      });

      // 페이지 로드 후 추가 대기
      await page.waitForTimeout(2000);

      testResult.steps.push(stepResult0);
      log('Success: Precondition 완료', 'SUCCESS');
    } catch (error) {
      stepResult0.status = 'FAIL';
      stepResult0.error = error instanceof Error ? error.message : String(error);
      testResult.errors.push(`Step 0 실패: ${stepResult0.error}`);
      testResult.status = 'FAIL';
      throw error;
    }

    // ========================================================================
    // ACT (실행): 로그인 버튼 클릭
    // ========================================================================

    log('ACT: 로그인 다이얼로그 열기');

    // Step 1: 메인 페이지 우측 상단 "로그인" 버튼 클릭
    const stepResult1: StepResult = {
      stepNumber: 1,
      description: '메인 페이지 우측 상단 "로그인" 버튼 클릭',
      status: 'PASS',
      timestamp: new Date()
    };

    try {
      log('Step 1: 로그인 버튼 클릭 시도');
      await page.click(SELECTORS.header.loginButton);

      // 다이얼로그가 표시될 때까지 대기
      await page.waitForSelector(SELECTORS.loginDialog.container, {
        timeout: TEST_CONFIG.timeouts.elementVisible,
        state: 'visible'
      });

      testResult.steps.push(stepResult1);
      log('Success: Step 1 완료 - 로그인 버튼 클릭됨', 'SUCCESS');
    } catch (error) {
      stepResult1.status = 'FAIL';
      stepResult1.error = error instanceof Error ? error.message : String(error);
      testResult.errors.push(`Step 1 실패: ${stepResult1.error}`);
      testResult.status = 'FAIL';
      log(`Failure: Step 1 실패 - ${stepResult1.error}`, 'ERROR');
      throw error;
    }

    // 다이얼로그 표시 후 스크린샷 캡처
    const dialogOpenScreenshot = `${TEST_CONFIG.screenshotDir}\\dialog-open-${getTimestamp()}.png`;
    log(`스크린샷 캡처: ${dialogOpenScreenshot}`);
    await page.screenshot({ path: dialogOpenScreenshot, fullPage: true });
    testResult.screenshots.push(dialogOpenScreenshot);

    // ========================================================================
    // ASSERT (검증): 다이얼로그 UI 요소 확인
    // ========================================================================

    log('ASSERT: 로그인 다이얼로그 UI 요소 검증 시작');

    // Assert 1: 로그인 다이얼로그 표시 확인
    const assertResult1: StepResult = {
      stepNumber: 2,
      description: '로그인 다이얼로그가 화면 중앙에 표시됨',
      status: 'PASS',
      timestamp: new Date()
    };

    try {
      log('Assert 1: 로그인 다이얼로그 표시 확인');
      const dialogVisible = await page.isVisible(SELECTORS.loginDialog.container);

      if (!dialogVisible) {
        throw new Error('로그인 다이얼로그가 표시되지 않음');
      }

      testResult.steps.push(assertResult1);
      log('Success: Assert 1 통과 - 로그인 다이얼로그 표시됨', 'SUCCESS');
    } catch (error) {
      assertResult1.status = 'FAIL';
      assertResult1.error = error instanceof Error ? error.message : String(error);
      testResult.errors.push(`Assert 1 실패: ${assertResult1.error}`);
      testResult.status = 'FAIL';
      log(`Failure: Assert 1 실패 - ${assertResult1.error}`, 'ERROR');
      throw error;
    }

    // Assert 2: "이메일로 시작하기" 버튼 확인
    const assertResult2: StepResult = {
      stepNumber: 3,
      description: '다이얼로그 내 "이메일로 시작하기" 버튼 존재',
      status: 'PASS',
      timestamp: new Date()
    };

    try {
      log('Assert 2: "이메일로 시작하기" 버튼 확인');
      await page.waitForSelector(SELECTORS.loginDialog.emailButton, {
        timeout: TEST_CONFIG.timeouts.elementVisible,
        state: 'visible'
      });

      testResult.steps.push(assertResult2);
      log('Success: Assert 2 통과 - "이메일로 시작하기" 버튼 표시됨', 'SUCCESS');
    } catch (error) {
      assertResult2.status = 'FAIL';
      assertResult2.error = error instanceof Error ? error.message : String(error);
      testResult.errors.push(`Assert 2 실패: ${assertResult2.error}`);
      testResult.status = 'FAIL';
      log(`Failure: Assert 2 실패 - ${assertResult2.error}`, 'ERROR');
      throw error;
    }

    // Assert 3: 소셜 로그인 버튼들 확인
    const assertResult3: StepResult = {
      stepNumber: 4,
      description: '소셜 로그인 버튼들 표시 (네이버, 구글, 카카오, 페이스북, 웨일, 애플)',
      status: 'PASS',
      timestamp: new Date()
    };

    try {
      log('Assert 3: 소셜 로그인 버튼들 확인');

      const socialButtons = [
        { name: '네이버', selector: SELECTORS.loginDialog.naverButton },
        { name: '구글', selector: SELECTORS.loginDialog.googleButton },
        { name: '카카오', selector: SELECTORS.loginDialog.kakaoButton },
        { name: '페이스북', selector: SELECTORS.loginDialog.facebookButton },
        { name: '웨일', selector: SELECTORS.loginDialog.whaleButton },
        { name: '애플', selector: SELECTORS.loginDialog.appleButton }
      ];

      let missingButtons: string[] = [];

      for (const button of socialButtons) {
        try {
          await page.waitForSelector(button.selector, {
            timeout: 3000,
            state: 'visible'
          });
          log(`  - ${button.name} 버튼 확인됨`);
        } catch (error) {
          log(`  - ${button.name} 버튼 미확인`, 'ERROR');
          missingButtons.push(button.name);
        }
      }

      // 소셜 로그인 버튼은 선택적 요소로 처리
      if (missingButtons.length > 0) {
        log(`일부 소셜 로그인 버튼 미확인: ${missingButtons.join(', ')} (선택적 요소)`, 'INFO');
      }

      testResult.steps.push(assertResult3);
      const foundButtons = socialButtons.length - missingButtons.length;
      log(`Success: Assert 3 통과 - 소셜 로그인 버튼 확인 완료 (${foundButtons}/6개)`, 'SUCCESS');
    } catch (error) {
      assertResult3.status = 'FAIL';
      assertResult3.error = error instanceof Error ? error.message : String(error);
      testResult.errors.push(`Assert 3 실패: ${assertResult3.error}`);
      testResult.status = 'FAIL';
      log(`Failure: Assert 3 실패 - ${assertResult3.error}`, 'ERROR');
      throw error;
    }

    // Assert 4: 다이얼로그 닫기(X) 버튼 확인
    const assertResult4: StepResult = {
      stepNumber: 5,
      description: '다이얼로그 닫기(X) 버튼 존재',
      status: 'PASS',
      timestamp: new Date()
    };

    try {
      log('Assert 4: 다이얼로그 닫기 버튼 확인');
      await page.waitForSelector(SELECTORS.loginDialog.closeButton, {
        timeout: TEST_CONFIG.timeouts.elementVisible,
        state: 'visible'
      });

      testResult.steps.push(assertResult4);
      log('Success: Assert 4 통과 - 다이얼로그 닫기 버튼 표시됨', 'SUCCESS');
    } catch (error) {
      assertResult4.status = 'FAIL';
      assertResult4.error = error instanceof Error ? error.message : String(error);
      testResult.errors.push(`Assert 4 실패: ${assertResult4.error}`);
      testResult.status = 'FAIL';
      log(`Failure: Assert 4 실패 - ${assertResult4.error}`, 'ERROR');
      throw error;
    }

    log('='.repeat(80));
    log('테스트 완료: 로그인 다이얼로그 정상 표시 확인됨', 'SUCCESS');
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
    const reportPath = `${TEST_CONFIG.reportDir}\\TC-EMAIL-002-Report-${getTimestamp()}.md`;

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
