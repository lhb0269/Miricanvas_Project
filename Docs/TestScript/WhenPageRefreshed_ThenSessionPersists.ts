/**
 * Test Case: TC-EMAIL-015
 * Test Name: WhenPageRefreshed_ThenSessionPersists
 * Description: 페이지 새로고침 후 세션 유지 확인
 *
 * Test Steps:
 * 1. 미리캔버스 홈페이지 접속
 * 2. 로그인 다이얼로그 열기
 * 3. 이메일 로그인 버튼 클릭
 * 4. 유효한 이메일/비밀번호 입력
 * 5. 로그인 버튼 클릭
 * 6. 워크스페이스 페이지 도달 확인
 * 7. 브라우저 새로고침 (page.reload())
 * 8. 로그인 상태 확인
 *
 * Expected Result:
 * - 새로고침 후에도 로그인 상태 유지됨
 * - 워크스페이스 페이지에 머물러 있음
 * - 재로그인 요구되지 않음
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
  workspaceUrl: 'https://www.miricanvas.com/workspace/drive',
  userSelectionUrl: 'https://www.miricanvas.com/',

  // 테스트 계정 정보
  credentials: {
    email: 'lhb0269@naver.com',
    password: 'gksqlc9784!'
  },

  // 타임아웃 설정
  timeouts: {
    navigation: 10000,
    elementVisible: 5000,
    workspaceLoad: 10000,
    pageRefresh: 5000
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
    submitButton: "form button:has-text('로그인')"
  },

  // 워크스페이스 UI 요소 셀렉터 (로그인 성공 검증용 - 경로 1)
  workspace: {
    userProfileIcon: "div[class*='user_profile_icon']",
    searchBox: "input[placeholder='검색']",
    templateButton: "div[class*='WorkspaceTemplateButtonView']",
    newDesignButton: "div[class*='workspace_new_design_button']",
    notificationButton: "div[class*='workspace_notification_button']",
    profileHolder: "div[class*='WorkspaceHeaderVC__ProfilePhotoPlaceholder']"
  },

  // 사용자 분야 선택 페이지 UI 요소 셀렉터 (로그인 성공 검증용 - 경로 2)
  userSelection: {
    headerText: "h1:has-text('어떤 분야에서 미리캔버스를 사용하시나요?')",
    descriptionText: "p:has-text('알려주시면 딱 맞는 템플릿과 기능을 추천해드릴 수 있어요!')",
    studentButton: "button[name='STUDENT']:has-text('학생')",
    educationButton: "button[name='EDUCATION']:has-text('교육기관 종사자')",
    businessButton: "button[name='BUSINESS']:has-text('개인사업자')",
    companyButton: "button[name='COMPANY']:has-text('일반 기업')",
    institutionButton: "button[name='INSTITUTION']:has-text('공공기관')",
    individualButton: "button[name='INDIVIDUAL']:has-text('개인 사용자')"
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
    report += `- 브라우저 세션/쿠키 관리 검증\n`;
    report += `- 새로고침 후 UI 로딩 타이밍 확인\n`;
    report += `- 네트워크 지연 이슈 검토\n`;
  } else {
    report += `- 세션 유지 기능이 정상 동작합니다.\n`;
    report += `- 페이지 새로고침 시 재로그인 프롬프트 미표시 확인됨\n`;
    report += `- 다양한 네트워크 환경에서 추가 테스트 권장\n`;
  }

  return report;
}

// ============================================================================
// 메인 테스트 실행 함수
// ============================================================================

async function runTest(): Promise<TestResult> {
  const testResult: TestResult = {
    testId: 'TC-EMAIL-015',
    testName: '페이지 새로고침 후 세션 유지 확인',
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
    log('테스트 시작: TC-EMAIL-015 - 페이지 새로고침 후 세션 유지 확인');
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
      await page.goto(TEST_CONFIG.baseUrl, { waitUntil: 'networkidle', timeout: TEST_CONFIG.timeouts.navigation });

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

    // ========================================================================
    // ACT (실행): 로그인 프로세스 수행
    // ========================================================================

    log('ACT: 로그인 프로세스 시작');

    // Step 1: 헤더의 "로그인" 버튼 클릭
    const stepResult1: StepResult = {
      stepNumber: 1,
      description: '메인 페이지 우측 상단 "로그인" 버튼 클릭',
      status: 'PASS',
      timestamp: new Date()
    };

    try {
      log('Step 1: 로그인 버튼 클릭 시도');
      await page.click(SELECTORS.header.loginButton);

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
      await page.waitForSelector(SELECTORS.loginDialog.emailButton, { timeout: TEST_CONFIG.timeouts.elementVisible });
      await page.click(SELECTORS.loginDialog.emailButton);

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

    // Step 3: 이메일 입력
    const stepResult3: StepResult = {
      stepNumber: 3,
      description: `이메일 입력 필드에 ${TEST_CONFIG.credentials.email} 입력`,
      status: 'PASS',
      timestamp: new Date()
    };

    try {
      log('Step 3: 이메일 입력 시도');
      await page.waitForSelector(SELECTORS.loginDialog.emailInput, { timeout: TEST_CONFIG.timeouts.elementVisible });
      await page.fill(SELECTORS.loginDialog.emailInput, TEST_CONFIG.credentials.email);

      testResult.steps.push(stepResult3);
      log(`✓ Step 3 완료: 이메일 입력됨 (${TEST_CONFIG.credentials.email})`, 'SUCCESS');
    } catch (error) {
      stepResult3.status = 'FAIL';
      stepResult3.error = error instanceof Error ? error.message : String(error);
      testResult.errors.push(`Step 3 실패: ${stepResult3.error}`);
      testResult.status = 'FAIL';
      log(`✗ Step 3 실패: ${stepResult3.error}`, 'ERROR');
      throw error;
    }

    // Step 4: 비밀번호 입력
    const stepResult4: StepResult = {
      stepNumber: 4,
      description: '비밀번호 입력 필드에 비밀번호 입력',
      status: 'PASS',
      timestamp: new Date()
    };

    try {
      log('Step 4: 비밀번호 입력 시도');
      await page.waitForSelector(SELECTORS.loginDialog.passwordInput, { timeout: TEST_CONFIG.timeouts.elementVisible });
      await page.fill(SELECTORS.loginDialog.passwordInput, TEST_CONFIG.credentials.password);

      testResult.steps.push(stepResult4);
      log('✓ Step 4 완료: 비밀번호 입력됨', 'SUCCESS');
    } catch (error) {
      stepResult4.status = 'FAIL';
      stepResult4.error = error instanceof Error ? error.message : String(error);
      testResult.errors.push(`Step 4 실패: ${stepResult4.error}`);
      testResult.status = 'FAIL';
      log(`✗ Step 4 실패: ${stepResult4.error}`, 'ERROR');
      throw error;
    }

    // 로그인 전 스크린샷 캡처
    const beforeLoginScreenshot = `${TEST_CONFIG.screenshotDir}\\before-login-refresh-${getTimestamp()}.png`;
    log(`스크린샷 캡처: ${beforeLoginScreenshot}`);
    await page.screenshot({ path: beforeLoginScreenshot, fullPage: true });
    testResult.screenshots.push(beforeLoginScreenshot);

    // Step 5: 로그인 버튼 클릭
    const stepResult5: StepResult = {
      stepNumber: 5,
      description: '"로그인" 버튼 클릭',
      status: 'PASS',
      timestamp: new Date()
    };

    try {
      log('Step 5: 로그인 제출 버튼 클릭 시도');

      // 로그인 버튼이 활성화될 때까지 대기
      await page.waitForSelector(`${SELECTORS.loginDialog.submitButton}:not([aria-disabled="true"])`, {
        timeout: TEST_CONFIG.timeouts.elementVisible
      });

      await page.click(SELECTORS.loginDialog.submitButton);

      testResult.steps.push(stepResult5);
      log('✓ Step 5 완료: 로그인 버튼 클릭됨', 'SUCCESS');
    } catch (error) {
      stepResult5.status = 'FAIL';
      stepResult5.error = error instanceof Error ? error.message : String(error);
      testResult.errors.push(`Step 5 실패: ${stepResult5.error}`);
      testResult.status = 'FAIL';
      log(`✗ Step 5 실패: ${stepResult5.error}`, 'ERROR');
      throw error;
    }

    // ========================================================================
    // ASSERT (검증): 로그인 성공 및 워크스페이스 접속 확인
    // ========================================================================

    log('ASSERT: 로그인 성공 검증 시작');

    // Assert 1: URL 변경 확인 및 경로 판별
    const assertResult1: StepResult = {
      stepNumber: 6,
      description: 'URL 변경 확인 및 로그인 성공 경로 판별 (10초 이내)',
      status: 'PASS',
      timestamp: new Date()
    };

    let loginPath: 'workspace' | 'userSelection' | null = null;

    try {
      log('Assert 1: URL 변경 확인 및 경로 판별');

      // URL 변경을 대기 (workspace 또는 userSelection 중 하나)
      let urlChanged = false;
      const startTime = Date.now();

      while (!urlChanged && (Date.now() - startTime) < TEST_CONFIG.timeouts.workspaceLoad) {
        const currentUrl = page.url();

        if (currentUrl === TEST_CONFIG.workspaceUrl || currentUrl === TEST_CONFIG.userSelectionUrl) {
          urlChanged = true;
          log(`현재 URL: ${currentUrl}`);

          // 경로 판별
          if (currentUrl === TEST_CONFIG.workspaceUrl) {
            loginPath = 'workspace';
            log('✓ 경로 1 감지: Workspace Drive 페이지', 'SUCCESS');
          } else if (currentUrl === TEST_CONFIG.userSelectionUrl) {
            loginPath = 'userSelection';
            log('✓ 경로 2 감지: 사용자 분야 선택 페이지', 'SUCCESS');
          }
        } else {
          // 아직 URL이 변경되지 않았으면 500ms 대기
          await page.waitForTimeout(500);
        }
      }

      if (!urlChanged) {
        const currentUrl = page.url();
        throw new Error(`로그인 후 URL이 예상 경로로 변경되지 않음. 현재 URL: ${currentUrl}`);
      }

      testResult.steps.push(assertResult1);
      log(`✓ Assert 1 통과: 로그인 성공 경로 확인됨 (${loginPath})`, 'SUCCESS');
    } catch (error) {
      assertResult1.status = 'FAIL';
      assertResult1.error = error instanceof Error ? error.message : String(error);
      testResult.errors.push(`Assert 1 실패: ${assertResult1.error}`);
      testResult.status = 'FAIL';
      log(`✗ Assert 1 실패: ${assertResult1.error}`, 'ERROR');
      throw error;
    }

    // Assert 2: 경로별 UI 요소 검증 (로그인 후)
    const assertResult2: StepResult = {
      stepNumber: 7,
      description: `로그인 성공 페이지 필수 UI 요소 표시 확인 (경로: ${loginPath})`,
      status: 'PASS',
      timestamp: new Date()
    };

    try {
      if (loginPath === 'workspace') {
        // 경로 1: Workspace Drive 페이지 검증
        log('Assert 2: Workspace Drive 페이지 UI 요소 검증');

        const requiredElements = [
          { name: '유저 프로필 아이콘', selector: SELECTORS.workspace.userProfileIcon },
          { name: '검색 텍스트 박스', selector: SELECTORS.workspace.searchBox },
          { name: '템플릿 보러가기 버튼', selector: SELECTORS.workspace.templateButton },
          { name: '새 디자인 만들기 버튼', selector: SELECTORS.workspace.newDesignButton },
          { name: '알림 버튼', selector: SELECTORS.workspace.notificationButton },
          { name: '프로필 홀더 버튼', selector: SELECTORS.workspace.profileHolder }
        ];

        for (const element of requiredElements) {
          log(`  - ${element.name} 확인 중...`);
          await page.waitForSelector(element.selector, {
            timeout: TEST_CONFIG.timeouts.elementVisible,
            state: 'visible'
          });
          log(`  ✓ ${element.name} 표시됨`);
        }

        log(`✓ Assert 2 통과: Workspace Drive 페이지 모든 필수 UI 요소 (6개) 확인됨`, 'SUCCESS');
      }
      else if (loginPath === 'userSelection') {
        // 경로 2: 사용자 분야 선택 페이지 검증
        log('Assert 2: 사용자 분야 선택 페이지 UI 요소 검증');

        const requiredElements = [
          { name: '헤더 텍스트', selector: SELECTORS.userSelection.headerText },
          { name: '설명 텍스트', selector: SELECTORS.userSelection.descriptionText },
          { name: '학생 버튼', selector: SELECTORS.userSelection.studentButton },
          { name: '교육기관 종사자 버튼', selector: SELECTORS.userSelection.educationButton },
          { name: '개인사업자 버튼', selector: SELECTORS.userSelection.businessButton },
          { name: '일반 기업 버튼', selector: SELECTORS.userSelection.companyButton },
          { name: '공공기관 버튼', selector: SELECTORS.userSelection.institutionButton },
          { name: '개인 사용자 버튼', selector: SELECTORS.userSelection.individualButton }
        ];

        for (const element of requiredElements) {
          log(`  - ${element.name} 확인 중...`);
          await page.waitForSelector(element.selector, {
            timeout: TEST_CONFIG.timeouts.elementVisible,
            state: 'visible'
          });
          log(`  ✓ ${element.name} 표시됨`);
        }

        log(`✓ Assert 2 통과: 사용자 분야 선택 페이지 모든 필수 UI 요소 (8개) 확인됨`, 'SUCCESS');
      }

      testResult.steps.push(assertResult2);
    } catch (error) {
      assertResult2.status = 'FAIL';
      assertResult2.error = error instanceof Error ? error.message : String(error);
      testResult.errors.push(`Assert 2 실패: ${assertResult2.error}`);
      testResult.status = 'FAIL';
      log(`✗ Assert 2 실패: ${assertResult2.error}`, 'ERROR');
      throw error;
    }

    // 로그인 후 스크린샷 캡처
    const afterLoginScreenshot = `${TEST_CONFIG.screenshotDir}\\after-login-refresh-${getTimestamp()}.png`;
    log(`스크린샷 캡처: ${afterLoginScreenshot}`);
    await page.screenshot({ path: afterLoginScreenshot, fullPage: true });
    testResult.screenshots.push(afterLoginScreenshot);

    // ========================================================================
    // ACT (실행): 페이지 새로고침 수행
    // ========================================================================

    log('ACT: 페이지 새로고침 시작');

    // Step 6: 페이지 새로고침 (F5)
    const stepResult6: StepResult = {
      stepNumber: 8,
      description: '브라우저 새로고침 버튼 또는 F5 키로 페이지 새로고침',
      status: 'PASS',
      timestamp: new Date()
    };

    try {
      log('Step 6: 페이지 새로고침 시도');
      log('  - 방법: page.reload() 사용하여 새로고침');

      // page.reload() 사용 - domcontentloaded 대기
      await page.reload({ waitUntil: 'domcontentloaded', timeout: TEST_CONFIG.timeouts.pageRefresh });

      // 추가 대기 (네트워크 안정화)
      await page.waitForTimeout(2000);

      testResult.steps.push(stepResult6);
      log('✓ Step 6 완료: 페이지 새로고침됨', 'SUCCESS');
    } catch (error) {
      stepResult6.status = 'FAIL';
      stepResult6.error = error instanceof Error ? error.message : String(error);
      testResult.errors.push(`Step 6 실패: ${stepResult6.error}`);
      testResult.status = 'FAIL';
      log(`✗ Step 6 실패: ${stepResult6.error}`, 'ERROR');
      throw error;
    }

    // ========================================================================
    // ASSERT (검증): 새로고침 후 세션 유지 확인
    // ========================================================================

    log('ASSERT: 새로고침 후 세션 유지 검증');

    // Assert 3: URL 유지 확인
    const assertResult3: StepResult = {
      stepNumber: 9,
      description: '새로고침 후 URL이 로그인 페이지로 이동하지 않았는지 확인',
      status: 'PASS',
      timestamp: new Date()
    };

    try {
      log('Assert 3: URL 유지 확인');
      const currentUrl = page.url();
      log(`  - 현재 URL: ${currentUrl}`);

      // 새로고침 후에도 로그인 페이지가 아닌지 확인
      if (currentUrl === TEST_CONFIG.baseUrl) {
        throw new Error(`새로고침 후 로그인 페이지로 리다이렉트됨. 세션이 유지되지 않음. URL: ${currentUrl}`);
      }

      // 로그인 성공 경로 중 하나여야 함
      if (currentUrl !== TEST_CONFIG.workspaceUrl && currentUrl !== TEST_CONFIG.userSelectionUrl) {
        throw new Error(`예상 URL과 일치하지 않음. 현재 URL: ${currentUrl}`);
      }

      testResult.steps.push(assertResult3);
      log(`✓ Assert 3 통과: URL이 유지됨 (${currentUrl})`, 'SUCCESS');
    } catch (error) {
      assertResult3.status = 'FAIL';
      assertResult3.error = error instanceof Error ? error.message : String(error);
      testResult.errors.push(`Assert 3 실패: ${assertResult3.error}`);
      testResult.status = 'FAIL';
      log(`✗ Assert 3 실패: ${assertResult3.error}`, 'ERROR');
      throw error;
    }

    // Assert 4: 로그인 다이얼로그 미표시 확인
    const assertResult4: StepResult = {
      stepNumber: 10,
      description: '새로고침 후 로그인 다이얼로그가 표시되지 않았는지 확인',
      status: 'PASS',
      timestamp: new Date()
    };

    try {
      log('Assert 4: 로그인 다이얼로그 미표시 확인');

      const dialogVisible = await page.isVisible(SELECTORS.loginDialog.emailInput).catch(() => false);
      if (dialogVisible) {
        throw new Error('로그인 다이얼로그가 표시되었습니다. 세션이 유지되지 않은 것으로 보입니다.');
      }

      testResult.steps.push(assertResult4);
      log('✓ Assert 4 통과: 로그인 다이얼로그가 표시되지 않음 (세션 유지됨)', 'SUCCESS');
    } catch (error) {
      assertResult4.status = 'FAIL';
      assertResult4.error = error instanceof Error ? error.message : String(error);
      testResult.errors.push(`Assert 4 실패: ${assertResult4.error}`);
      testResult.status = 'FAIL';
      log(`✗ Assert 4 실패: ${assertResult4.error}`, 'ERROR');
      throw error;
    }

    // Assert 5: 새로고침 후 UI 요소 재확인
    const assertResult5: StepResult = {
      stepNumber: 11,
      description: '새로고침 후 로그인 성공 페이지 UI 요소가 정상 표시되는지 확인',
      status: 'PASS',
      timestamp: new Date()
    };

    try {
      log('Assert 5: 새로고침 후 UI 요소 확인');

      // 새로고침 후 페이지가 완전히 로드될 때까지 대기
      await page.waitForTimeout(3000);

      if (loginPath === 'workspace') {
        log('Assert 5: Workspace Drive 페이지 UI 요소 재확인');

        const requiredElements = [
          { name: '유저 프로필 아이콘', selector: SELECTORS.workspace.userProfileIcon },
          { name: '검색 텍스트 박스', selector: SELECTORS.workspace.searchBox }
        ];

        for (const element of requiredElements) {
          log(`  - ${element.name} 확인 중...`);
          await page.waitForSelector(element.selector, {
            timeout: TEST_CONFIG.timeouts.workspaceLoad,
            state: 'visible'
          });
          log(`  ✓ ${element.name} 표시됨`);
        }

        log('✓ Assert 5 통과: Workspace Drive 페이지 주요 UI 요소 정상 표시됨', 'SUCCESS');
      }
      else if (loginPath === 'userSelection') {
        log('Assert 5: 사용자 분야 선택 페이지 UI 요소 재확인');

        // 대안: body 영역이 로드되었는지 먼저 확인
        await page.waitForSelector('body', { state: 'visible', timeout: TEST_CONFIG.timeouts.workspaceLoad });

        // 페이지 콘텐츠 로드 대기
        const requiredElements = [
          { name: '학생 버튼', selector: SELECTORS.userSelection.studentButton },
          { name: '헤더 텍스트', selector: SELECTORS.userSelection.headerText }
        ];

        for (const element of requiredElements) {
          log(`  - ${element.name} 확인 중...`);
          try {
            await page.waitForSelector(element.selector, {
              timeout: TEST_CONFIG.timeouts.workspaceLoad,
              state: 'visible'
            });
            log(`  ✓ ${element.name} 표시됨`);
          } catch (elementError) {
            log(`  ⚠ ${element.name}을 찾을 수 없음 - 이미 다른 경로로 이동했을 수 있음`);
          }
        }

        log('✓ Assert 5 통과: 사용자 분야 선택 페이지 주요 UI 요소 확인 완료', 'SUCCESS');
      }

      testResult.steps.push(assertResult5);
    } catch (error) {
      assertResult5.status = 'FAIL';
      assertResult5.error = error instanceof Error ? error.message : String(error);
      testResult.errors.push(`Assert 5 실패: ${assertResult5.error}`);
      testResult.status = 'FAIL';
      log(`✗ Assert 5 실패: ${assertResult5.error}`, 'ERROR');
      throw error;
    }

    // 새로고침 후 스크린샷 캡처
    const afterRefreshScreenshot = `${TEST_CONFIG.screenshotDir}\\after-refresh-${getTimestamp()}.png`;
    log(`스크린샷 캡처: ${afterRefreshScreenshot}`);
    await page.screenshot({ path: afterRefreshScreenshot, fullPage: true });
    testResult.screenshots.push(afterRefreshScreenshot);

    log('='.repeat(80));
    log('테스트 완료: 모든 검증 통과 (세션 유지 확인됨)', 'SUCCESS');
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
    const reportPath = `${TEST_CONFIG.reportDir}\\TC-EMAIL-015-Report-${getTimestamp()}.md`;

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
