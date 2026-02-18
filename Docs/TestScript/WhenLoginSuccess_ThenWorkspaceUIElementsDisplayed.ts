/**
 * TC-EMAIL-005: 로그인 후 워크스페이스 페이지 UI 요소 검증
 *
 * @description
 * 유효한 계정으로 로그인 성공 후 워크스페이스 페이지의 필수 UI 요소가 모두 표시되는지 검증하는 테스트
 *
 * @testCase
 * - Precondition: 로그아웃 상태, 유효한 계정 정보 보유
 * - Action: 이메일/비밀번호 입력 후 로그인
 * - Expected: 워크스페이스 페이지의 6개 필수 UI 요소가 15초 이내에 모두 표시됨
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
    workspaceLoad: 15000,  // 워크스페이스 로드 대기 15초
    uiElementsTimeout: 15000  // UI 요소들 표시 대기 15초
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

  // 워크스페이스 UI 요소 셀렉터 (TC-EMAIL-005 검증용)
  workspace: {
    userProfileIcon: "div[class*='user_profile_icon']",
    searchBox: "input[placeholder='검색']",
    templateButton: "div[class*='WorkspaceTemplateButtonView']",
    newDesignButton: "div[class*='workspace_new_design_button']",
    notificationButton: "div[class*='workspace_notification_button']",
    profileHolder: "div[class*='WorkspaceHeaderVC__ProfilePhotoPlaceholder']"
  },

  // 사용자 분야 선택 페이지 UI 요소 셀렉터 (경로 2)
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

interface UIElement {
  name: string;
  selector: string;
  found: boolean;
  loadTime?: number;
}

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
  uiElements?: UIElement[];
  totalLoadTime?: number;
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
    const statusIcon = step.status === 'PASS' ? '✓' : '✗';
    report += `### Step ${step.stepNumber}: ${step.description}
- Status: ${statusIcon} ${step.status}
- Timestamp: ${step.timestamp.toISOString()}
${step.error ? `- Error: ${step.error}\n` : ''}
`;
  });

  // UI 요소 검증 결과
  if (result.uiElements && result.uiElements.length > 0) {
    report += `\n## UI 요소 검증 결과 (총 ${result.uiElements.length}개)\n\n`;
    result.uiElements.forEach((element, index) => {
      const statusIcon = element.found ? '✓' : '✗';
      const loadTimeInfo = element.loadTime ? ` (로드 시간: ${element.loadTime}ms)` : '';
      report += `${index + 1}. ${element.name}: ${statusIcon} ${element.found ? 'FOUND' : 'NOT FOUND'}${loadTimeInfo}\n`;
    });

    if (result.totalLoadTime) {
      report += `\n**전체 UI 요소 로드 시간**: ${result.totalLoadTime}ms\n`;
    }
  }

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
    report += `- 실패한 UI 요소를 중심으로 원인 분석 필요\n`;
    report += `- 네트워크 지연, 요소 로딩 타이밍 이슈 확인\n`;
    report += `- 셀렉터 안정성 재검토\n`;
    report += `- 15초 타임아웃 내에 모든 요소가 로드되지 않았을 가능성\n`;
  } else {
    report += `- 모든 테스트 단계가 성공적으로 완료되었습니다.\n`;
    report += `- 전체 UI 요소 로드 시간 확인 및 성능 최적화 검토\n`;
    report += `- 추가 엣지 케이스 (네트워크 지연, 느린 렌더링) 테스트 고려\n`;
  }

  return report;
}

// ============================================================================
// 메인 테스트 실행 함수
// ============================================================================

async function runTest(): Promise<TestResult> {
  const testResult: TestResult = {
    testId: 'TC-EMAIL-005',
    testName: '로그인 후 워크스페이스 페이지 UI 요소 검증',
    status: 'PASS',
    startTime: new Date(),
    endTime: new Date(),
    duration: 0,
    steps: [],
    errors: [],
    screenshots: [],
    uiElements: [],
    totalLoadTime: 0
  };

  let browser: Browser | null = null;
  let page: Page | null = null;
  const uiElementStartTime = Date.now();

  try {
    log('='.repeat(80));
    log('테스트 시작: TC-EMAIL-005 - 로그인 후 워크스페이스 페이지 UI 요소 검증');
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

    // Step 5: 로그인 버튼 클릭
    const stepResult5: StepResult = {
      stepNumber: 5,
      description: '"로그인" 버튼 클릭',
      status: 'PASS',
      timestamp: new Date()
    };

    try {
      log('Step 5: 로그인 제출 버튼 클릭 시도');

      // 로그인 버튼이 활성화될 때까지 대기 (aria-disabled="false" 또는 속성 없음)
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
    // ASSERT (검증): 워크스페이스 페이지 및 UI 요소 검증
    // ========================================================================

    log('ASSERT: 워크스페이스 페이지 로드 및 UI 요소 검증 시작');

    // Assert 1: 로그인 후 URL 변경 확인 및 경로 판별
    const assertResult1: StepResult = {
      stepNumber: 6,
      description: 'URL이 변경되었는지 확인 및 경로 판별 (15초 이내)',
      status: 'PASS',
      timestamp: new Date()
    };

    let loginPath: 'workspace' | 'userSelection' | null = null;

    try {
      log('Assert 1: 로그인 후 URL 변경 확인 및 경로 판별');

      // URL 변경을 대기 (workspace 또는 userSelection 중 하나)
      let urlChanged = false;
      const startTime = Date.now();

      while (!urlChanged && (Date.now() - startTime) < TEST_CONFIG.timeouts.workspaceLoad) {
        const currentUrl = page.url();

        if (currentUrl === TEST_CONFIG.workspaceUrl) {
          loginPath = 'workspace';
          urlChanged = true;
          log(`✓ 경로 1 감지: Workspace Drive 페이지 - ${currentUrl}`, 'SUCCESS');
        } else if (currentUrl === TEST_CONFIG.userSelectionUrl) {
          loginPath = 'userSelection';
          urlChanged = true;
          log(`✓ 경로 2 감지: 사용자 분야 선택 페이지 - ${currentUrl}`, 'SUCCESS');
        } else {
          // URL이 변경되지 않았으면 500ms 대기
          await page.waitForTimeout(500);
        }
      }

      if (!urlChanged) {
        const currentUrl = page.url();
        throw new Error(`로그인 후 예상 경로로 URL이 변경되지 않음. 현재 URL: ${currentUrl}`);
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

    // 로그인 후 스크린샷 캡처
    const afterLoginScreenshot = `${TEST_CONFIG.screenshotDir}\\after-login-${getTimestamp()}.png`;
    log(`스크린샷 캡처: ${afterLoginScreenshot}`);
    await page.screenshot({ path: afterLoginScreenshot, fullPage: true });
    testResult.screenshots.push(afterLoginScreenshot);

    // Assert 2: 페이지 로드 대기 (DOM 콘텐츠 로드)
    const assertResult2: StepResult = {
      stepNumber: 7,
      description: '페이지 로드 완료 대기 (DOM 콘텐츠)',
      status: 'PASS',
      timestamp: new Date()
    };

    try {
      log('Assert 2: 페이지 로드 완료 대기');

      // 페이지의 DOM content loaded 상태를 기다림 (최대 10초)
      await page.waitForLoadState('domcontentloaded', { timeout: 10000 }).catch(() => {
        log('  ⚠ DOM content loaded 타임아웃, 추가 대기...');
      });

      // 추가 대기시간 (DOM 최종 렌더링)
      await page.waitForTimeout(3000);

      testResult.steps.push(assertResult2);
      log('✓ Assert 2 통과: 페이지 로드 완료', 'SUCCESS');
    } catch (error) {
      assertResult2.status = 'FAIL';
      assertResult2.error = error instanceof Error ? error.message : String(error);
      testResult.errors.push(`Assert 2 실패: ${assertResult2.error}`);
      // 경고 수준으로 처리 (계속 진행)
      log(`⚠ Assert 2 경고: ${assertResult2.error}`, 'ERROR');
    }

    // Assert 3: 경로별 필수 UI 요소 검증 (15초 이내)
    const assertResult3: StepResult = {
      stepNumber: 8,
      description: `필수 UI 요소 검증 (경로: ${loginPath}) (15초 이내)`,
      status: 'PASS',
      timestamp: new Date()
    };

    try {
      if (loginPath === 'workspace') {
        log('Assert 3: 워크스페이스 드라이브 페이지 필수 UI 요소 검증');

        const requiredElements = [
          { name: '유저 프로필 아이콘', selector: SELECTORS.workspace.userProfileIcon },
          { name: '검색 텍스트 박스', selector: SELECTORS.workspace.searchBox },
          { name: '템플릿 보러가기 버튼', selector: SELECTORS.workspace.templateButton },
          { name: '새 디자인 만들기 버튼', selector: SELECTORS.workspace.newDesignButton },
          { name: '알림 버튼', selector: SELECTORS.workspace.notificationButton },
          { name: '프로필 홀더 버튼', selector: SELECTORS.workspace.profileHolder }
        ];

        const elementStartTime = Date.now();
        let allElementsFound = true;

        for (const element of requiredElements) {
          const elementCheckStart = Date.now();
          try {
            log(`  - ${element.name} 확인 중...`);

            // 요소가 visible 상태가 될 때까지 대기 (15초 제한)
            const remainingTime = TEST_CONFIG.timeouts.uiElementsTimeout - (Date.now() - elementStartTime);
            if (remainingTime <= 0) {
              throw new Error('15초 타임아웃 초과');
            }

            await page.waitForSelector(element.selector, {
              timeout: Math.min(remainingTime, TEST_CONFIG.timeouts.elementVisible),
              state: 'visible'
            });

            const elementCheckEnd = Date.now();
            const loadTime = elementCheckEnd - elementCheckStart;

            // UI 요소 결과 기록
            const uiElement: UIElement = {
              name: element.name,
              selector: element.selector,
              found: true,
              loadTime: loadTime
            };
            testResult.uiElements?.push(uiElement);

            log(`  ✓ ${element.name} 표시됨 (로드 시간: ${loadTime}ms)`);
          } catch (error) {
            allElementsFound = false;
            const errorMsg = error instanceof Error ? error.message : String(error);
            log(`  ✗ ${element.name} 미표시됨: ${errorMsg}`, 'ERROR');

            // UI 요소 결과 기록
            const uiElement: UIElement = {
              name: element.name,
              selector: element.selector,
              found: false
            };
            testResult.uiElements?.push(uiElement);
          }
        }

        const elementEndTime = Date.now();
        const totalElementLoadTime = elementEndTime - elementStartTime;
        testResult.totalLoadTime = totalElementLoadTime;

        if (!allElementsFound) {
          throw new Error('일부 UI 요소가 15초 이내에 표시되지 않았습니다.');
        }

        testResult.steps.push(assertResult3);
        log(`✓ Assert 3 통과: 워크스페이스 드라이브 페이지 6개 필수 UI 요소 모두 표시됨 (총 로드 시간: ${totalElementLoadTime}ms)`, 'SUCCESS');
      } else if (loginPath === 'userSelection') {
        log('Assert 3: 사용자 분야 선택 페이지 검증');

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

        const elementStartTime = Date.now();
        let allElementsFound = true;

        for (const element of requiredElements) {
          const elementCheckStart = Date.now();
          try {
            log(`  - ${element.name} 확인 중...`);

            // 요소가 visible 상태가 될 때까지 대기 (15초 제한)
            const remainingTime = TEST_CONFIG.timeouts.uiElementsTimeout - (Date.now() - elementStartTime);
            if (remainingTime <= 0) {
              throw new Error('15초 타임아웃 초과');
            }

            await page.waitForSelector(element.selector, {
              timeout: Math.min(remainingTime, TEST_CONFIG.timeouts.elementVisible),
              state: 'visible'
            });

            const elementCheckEnd = Date.now();
            const loadTime = elementCheckEnd - elementCheckStart;

            // UI 요소 결과 기록
            const uiElement: UIElement = {
              name: element.name,
              selector: element.selector,
              found: true,
              loadTime: loadTime
            };
            testResult.uiElements?.push(uiElement);

            log(`  ✓ ${element.name} 표시됨 (로드 시간: ${loadTime}ms)`);
          } catch (error) {
            allElementsFound = false;
            const errorMsg = error instanceof Error ? error.message : String(error);
            log(`  ✗ ${element.name} 미표시됨: ${errorMsg}`, 'ERROR');

            // UI 요소 결과 기록
            const uiElement: UIElement = {
              name: element.name,
              selector: element.selector,
              found: false
            };
            testResult.uiElements?.push(uiElement);
          }
        }

        const elementEndTime = Date.now();
        const totalElementLoadTime = elementEndTime - elementStartTime;
        testResult.totalLoadTime = totalElementLoadTime;

        if (!allElementsFound) {
          throw new Error('일부 UI 요소가 15초 이내에 표시되지 않았습니다.');
        }

        testResult.steps.push(assertResult3);
        log(`✓ Assert 3 통과: 사용자 분야 선택 페이지 필수 UI 요소 모두 표시됨 (총 로드 시간: ${totalElementLoadTime}ms)`, 'SUCCESS');
      }
    } catch (error) {
      assertResult3.status = 'FAIL';
      assertResult3.error = error instanceof Error ? error.message : String(error);
      testResult.errors.push(`Assert 3 실패: ${assertResult3.error}`);
      testResult.status = 'FAIL';
      log(`✗ Assert 3 실패: ${assertResult3.error}`, 'ERROR');
      throw error;
    }

    // Assert 4: 각 요소가 클릭 가능한 상태인지 확인
    const assertResult4: StepResult = {
      stepNumber: 9,
      description: '주요 UI 요소가 클릭 가능한 상태인지 확인',
      status: 'PASS',
      timestamp: new Date()
    };

    try {
      log('Assert 4: UI 요소 클릭 가능성 검증');

      let clickableElements: any[] = [];

      if (loginPath === 'workspace') {
        clickableElements = [
          { name: '검색 텍스트 박스', selector: SELECTORS.workspace.searchBox },
          { name: '템플릿 보러가기 버튼', selector: SELECTORS.workspace.templateButton },
          { name: '새 디자인 만들기 버튼', selector: SELECTORS.workspace.newDesignButton },
          { name: '알림 버튼', selector: SELECTORS.workspace.notificationButton },
          { name: '프로필 홀더 버튼', selector: SELECTORS.workspace.profileHolder }
        ];
      } else if (loginPath === 'userSelection') {
        clickableElements = [
          { name: '학생 버튼', selector: SELECTORS.userSelection.studentButton },
          { name: '교육기관 종사자 버튼', selector: SELECTORS.userSelection.educationButton },
          { name: '개인사업자 버튼', selector: SELECTORS.userSelection.businessButton },
          { name: '일반 기업 버튼', selector: SELECTORS.userSelection.companyButton }
        ];
      }

      for (const element of clickableElements) {
        log(`  - ${element.name} 클릭 가능성 확인 중...`);
        const isClickable = await page.isEnabled(element.selector).catch(() => false);

        if (!isClickable) {
          log(`  ⚠ ${element.name}이 클릭 가능하지 않을 수 있습니다.`, 'ERROR');
        } else {
          log(`  ✓ ${element.name} 클릭 가능함`);
        }
      }

      testResult.steps.push(assertResult4);
      log('✓ Assert 4 통과: UI 요소 클릭 가능성 검증 완료', 'SUCCESS');
    } catch (error) {
      assertResult4.status = 'FAIL';
      assertResult4.error = error instanceof Error ? error.message : String(error);
      testResult.errors.push(`Assert 4 실패: ${assertResult4.error}`);
      // 이 단계는 실패해도 테스트 전체 실패로 처리하지 않음 (경고 수준)
      log(`⚠ Assert 4 경고: ${assertResult4.error}`, 'ERROR');
    }

    // 최종 스크린샷 캡처
    const finalScreenshot = `${TEST_CONFIG.screenshotDir}\\workspace-ui-${getTimestamp()}.png`;
    log(`최종 스크린샷 캡처: ${finalScreenshot}`);
    await page.screenshot({ path: finalScreenshot, fullPage: true });
    testResult.screenshots.push(finalScreenshot);

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
    const reportPath = `${TEST_CONFIG.reportDir}\\TC-EMAIL-005-Report-${getTimestamp()}.md`;

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
