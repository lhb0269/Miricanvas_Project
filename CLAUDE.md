# CLAUDE.md

이 파일은 Claude Code (claude.ai/code)가 이 저장소의 코드를 작업할 때 참고할 수 있는 가이드를 제공합니다.

## 프로젝트 목적
미리캔버스 홈페이지의 로그인 과정을 대상으로 자동화 테스트 구현
https://www.miricanvas.com/ko


## 구현 환경
TypeScript로 자동화 스크립트를 작성하며 Playwright MCP를 활용한다.

## 진행 스텝
### 요구사항 분석
    - 자동화 스크립트에서 사용할 cssSelector를 종합한다.
    - QA관점에서 자동화 스크립트의 Pass/Fail 기준 정의
    - 분석 단계에서 생성된 모든 문서는 C:\Miricanvas_Project\Docs\Requirements Analysis 폴더에 생성한다. 

### 설계
    - 요구사항 분석 단계에서 생성된 문서를 바탕으로 TestCase 생성
    - C:\Miricanvas_Project\Docs\TestCase 작성된 TestCase는 여기에 저장
    - C:\Miricanvas_Project\.claude\commands\generate-test-cases.md 이 경로의 테스트 케이스 작성 커맨드를 사용한다.

### 구현
    - 이 단계는 병렬적으로 수행될것이다. 따라서 스크립트의 작성 방식은 모두 통일되어야 한다.(When-Then 규칙을 따라 스크립트 제목 생성)
    - 설계 단계에서 작성한 테스트 케이스를 토대로 C:\Miricanvas_Project\.claude\agents\playwright-test-automator.md 서브 에이전트를 사용하여 테스트 스크립트를 생성한다.
    - C:\Miricanvas_Project\Docs\TestScript 작성된 스크립트는 여기에 저장한다.
    - 실행 결과 콘솔 출력 및 스크린샷을 남겨 결과를 명확하게 알 수 있도록 한다.

### 회고
    - 개선점 도출 AI 한계점, 보완 내용을 작성한다.

스텝마다 별도의 브랜치를 생성하여 각 스텝이 완료되었다고 AI가 아닌 사용자가 판단했을때 Main에 머지한다.