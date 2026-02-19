# Miricanvas_Project

## <img width="20" height="20" alt="image" src="https://github.com/user-attachments/assets/ebd39ab4-cd1a-4827-8a67-b7dbf38655e0" /> 미리 캔버스 이메일 로그인 테스트 자동화 프로젝트
### 테스트 대상
**웹** : 미리캔버스(https://www.miricanvas.com/ko)

 - 이메일을 통한 로그인 과정
 - Naver,Google 등 다른 플랫폼은 보안 우려로 제외하였습니다.
 - 하단 테스트 케이스에서의 개인 정보는 지웠습니다.

### <img width="30" height="30" alt="image" src="https://github.com/user-attachments/assets/c1b4a2d4-08ab-43e7-bcc4-1efaf4b9a185" /> 요구사항 분석
 - QA 관점 Pass/Fail 기준 정의 (pass-fail-criteria.md)
 - CSS 셀렉터 식별 및 종합 (css-selectors.md)<br>
 
 테스트 케이스 작성에 필요한 Pass/Fail 기준을 정의하였으며,CSS 셀렉터를 식별하고 설계 단계에서 작성되는 테스트 케이스를 AI가 효율적으로 작성할 수 있도록 문서화하였습니다.

### <img width="30" height="30" alt="image" src="https://github.com/user-attachments/assets/9406b863-3f0e-4010-8eee-31e194b4e1b8" /> 설계
 - Claude Code Templates의 [Generate Test Cases](https://www.aitmpl.com/component/command/generate-test-cases) 커맨드를 기반으로 커스터마이징화 하여 **Claude에게 테스트 케이스를 작성하게 하였습니다.**
 - 구현 단계에서 사용할 테스트 스크립트 **작성 에이전트가 테스트 케이스를 참조하여 PlayWright 자동화 스크립트를 작성토록** 테스트 케이스를 작성하는것이 목적입니다.

### <img width="30" height="30" alt="image" src="https://github.com/user-attachments/assets/4057297d-7f5a-4ee8-b2d8-88f3ec774645" /> 구현
 - 단일 테스트 케이스의 각 스텝을 분석하여 **Playwright MCP 명령어로 변환 및 테스트 스크립트를 작성합니다.**
 - 필요시 **추가적인 웹 요소 식별 및 상호작용 로직을 구현**합니다.(에러 처리 및 예외 상황에 대응합니다.)
 - 작성시 **AAA패턴 및 FIRST규칙**을 준수합니다. 

**작업 프로세스:**
1. 입력받은 테스트 케이스의 각 스텝을 상세히 분석
2. 각 스텝을 Playwright MCP 명령어로 매핑
3. 웹 요소 선택자 전략 수립 (ID, CSS selector, XPath 등)
4. 데이터 입력, 클릭, 네비게이션 등의 액션 구현
5. 예상 결과 검증을 위한 어설션 추가
6. 스크린샷 캡처 및 로깅 포함
7. 에러 핸들링 및 재시도 로직 구현



## 이메일 로그인 테스트 케이스
<details>
  <summary>test-cases.md</summary>
#### TC-EMAIL-001
| 항목 | 내용 |
|-----|-----|
| **TC ID** | TC-EMAIL-001 |
| **Title** | 유효한 계정 정보로 이메일 로그인 성공 |
| **Precondition** | - 미리캔버스 메인 페이지(`https://www.miricanvas.com/ko`) 접속<br>- 로그아웃 상태<br>- 유효한 이메일 계정: `` / `` |
| **Test Step** | 1. 메인 페이지 우측 상단 "로그인" 버튼 클릭<br>2. 로그인 다이얼로그가 표시되면 "이메일로 시작하기" 버튼 클릭<br>3. 이메일 입력 필드에 `` 입력<br>4. 비밀번호 입력 필드에 `` 입력<br>5. "로그인" 버튼 클릭 |
| **Expected Result** | - 10초 이내에 URL이 `https://www.miricanvas.com/workspace/drive`로 변경됨<br>- 다음 6개 UI 요소가 모두 표시됨:<br>&nbsp;&nbsp;1. 유저 프로필 아이콘<br>&nbsp;&nbsp;2. 검색 텍스트 박스<br>&nbsp;&nbsp;3. 템플릿 보러가기 버튼<br>&nbsp;&nbsp;4. 새 디자인 만들기 버튼<br>&nbsp;&nbsp;5. 알림 버튼<br>&nbsp;&nbsp;6. 프로필 홀더 버튼<br>- 로그인 다이얼로그가 자동으로 닫힘 |

#### TC-EMAIL-002
| 항목 | 내용 |
|-----|-----|
| **TC ID** | TC-EMAIL-002 |
| **Title** | 로그인 다이얼로그 정상 표시 확인 |
| **Precondition** | - 미리캔버스 메인 페이지(`https://www.miricanvas.com/ko`) 접속<br>- 로그아웃 상태 |
| **Test Step** | 1. 메인 페이지 우측 상단 "로그인" 버튼 클릭<br>2. 다이얼로그 내 요소 확인 |
| **Expected Result** | - 로그인 다이얼로그가 화면 중앙에 표시됨<br>- 다이얼로그 내 "이메일로 시작하기" 버튼 존재<br>- 소셜 로그인 버튼들 표시 (네이버, 구글, 카카오, 페이스북, 웨일, 애플)<br>- 다이얼로그 닫기(X) 버튼 존재 |

#### TC-EMAIL-003
| 항목 | 내용 |
|-----|-----|
| **TC ID** | TC-EMAIL-003 |
| **Title** | 이메일 입력 필드 정상 작동 확인 |
| **Precondition** | - 로그인 다이얼로그 열림<br>- 이메일 로그인 폼 표시 상태 |
| **Test Step** | 1. 이메일 입력 필드에 포커스<br>2. 유효한 이메일 주소 `` 입력<br>3. 입력된 값 확인 |
| **Expected Result** | - 이메일 입력 필드에 텍스트가 정상적으로 입력됨<br>- 입력한 이메일 주소가 필드에 표시됨<br>- placeholder 텍스트가 사라짐 |

#### TC-EMAIL-004
| 항목 | 내용 |
|-----|-----|
| **TC ID** | TC-EMAIL-004 |
| **Title** | 비밀번호 입력 필드 정상 작동 확인 |
| **Precondition** | - 로그인 다이얼로그 열림<br>- 이메일 로그인 폼 표시 상태 |
| **Test Step** | 1. 비밀번호 입력 필드에 포커스<br>2. 비밀번호 `` 입력<br>3. 입력된 값 확인 |
| **Expected Result** | - 비밀번호 입력 필드에 텍스트가 정상적으로 입력됨<br>- 입력한 비밀번호가 마스킹 처리됨 (•••••)<br>- placeholder 텍스트가 사라짐 |

#### TC-EMAIL-005
| 항목 | 내용 |
|-----|-----|
| **TC ID** | TC-EMAIL-005 |
| **Title** | 로그인 후 워크스페이스 페이지 UI 요소 검증 |
| **Precondition** | - 유효한 계정으로 로그인 성공<br>- URL이 `https://www.miricanvas.com/workspace/drive`로 변경됨 |
| **Test Step** | 1. 워크스페이스 페이지 로드 완료 대기<br>2. 페이지 내 주요 UI 요소 존재 확인 |
| **Expected Result** | - 다음 6개 UI 요소가 15초 이내에 모두 표시됨:<br>&nbsp;&nbsp;1. 유저 프로필 아이콘 (사이드바)<br>&nbsp;&nbsp;2. 검색 텍스트 박스 (상단)<br>&nbsp;&nbsp;3. 템플릿 보러가기 버튼<br>&nbsp;&nbsp;4. 새 디자인 만들기 버튼<br>&nbsp;&nbsp;5. 알림 버튼<br>&nbsp;&nbsp;6. 프로필 홀더 버튼<br>- 각 요소가 클릭 가능한 상태 |

### 1.2 비정상 시나리오

#### TC-EMAIL-006
| 항목 | 내용 |
|-----|-----|
| **TC ID** | TC-EMAIL-006 |
| **Title** | 잘못된 이메일 주소로 로그인 실패 |
| **Precondition** | - 로그인 다이얼로그 열림<br>- 이메일 로그인 폼 표시 상태 |
| **Test Step** | 1. 이메일 입력 필드에 존재하지 않는 이메일 `invalid@test.com` 입력<br>2. 비밀번호 입력 필드에 임의의 비밀번호 입력<br>3. "로그인" 버튼 클릭<br>4. 5초 대기 후 결과 확인 |
| **Expected Result** | - URL이 변경되지 않음 (`https://www.miricanvas.com/ko` 유지)<br>- **에러 메시지 표시**: "존재하지 않는 이메일입니다." (#text 노드로 표시)<br>- **이메일 입력 컨테이너 클래스 변경**: `form > div:nth-child(1) > div[data-f='StyledDiv-3ec0']`의 클래스가 `sc-267d8ce6-0 ejTrKt` → `sc-267d8ce6-0 gGTyzN`으로 변경<br>- 로그인 다이얼로그가 닫히지 않음<br>- 입력 필드가 활성 상태로 유지 |

#### TC-EMAIL-007
| 항목 | 내용 |
|-----|-----|
| **TC ID** | TC-EMAIL-007 |
| **Title** | 잘못된 비밀번호로 로그인 실패 |
| **Precondition** | - 로그인 다이얼로그 열림<br>- 이메일 로그인 폼 표시 상태 |
| **Test Step** | 1. 이메일 입력 필드에 유효한 이메일 `` 입력<br>2. 비밀번호 입력 필드에 잘못된 비밀번호 `wrongpassword123` 입력<br>3. "로그인" 버튼 클릭<br>4. 5초 대기 후 결과 확인 |
| **Expected Result** | - URL이 변경되지 않음<br>- **에러 메시지 표시**: `span[data-f='Span-ba96']` 내 "잘못된 비밀번호입니다." 텍스트 표시<br>- **비밀번호 입력 컨테이너 클래스 변경**: `form > div:nth-child(2) > div[data-f='StyledDiv-3ec0']`의 클래스가 `sc-267d8ce6-0 ejTrKt` → `sc-267d8ce6-0 gGTyzN`으로 변경<br>- 로그인 다이얼로그가 닫히지 않음<br>- 비밀번호 필드가 초기화되거나 유지됨 |

#### TC-EMAIL-008
| 항목 | 내용 |
|-----|-----|
| **TC ID** | TC-EMAIL-008 |
| **Title** | 이메일 미입력 시 로그인 불가 |
| **Precondition** | - 로그인 다이얼로그 열림<br>- 이메일 로그인 폼 표시 상태 |
| **Test Step** | 1. 이메일 입력 필드를 빈 상태로 유지<br>2. 비밀번호 입력 필드에 임의 비밀번호 입력<br>3. "로그인" 버튼 클릭 |
| **Expected Result** | - **에러 메시지 표시**: "이메일 주소를 입력해주세요." (#text 노드로 표시)<br>- **이메일 입력 컨테이너 클래스 변경**: `form > div:nth-child(1) > div[data-f='StyledDiv-3ec0']`의 클래스가 `sc-267d8ce6-0 ejTrKt` → `sc-267d8ce6-0 gGTyzN`으로 변경<br>- URL이 변경되지 않음 (`https://www.miricanvas.com/ko` 유지)<br>- 로그인 다이얼로그가 닫히지 않음 |

#### TC-EMAIL-009
| 항목 | 내용 |
|-----|-----|
| **TC ID** | TC-EMAIL-009 |
| **Title** | 비밀번호 미입력 시 로그인 불가 |
| **Precondition** | - 로그인 다이얼로그 열림<br>- 이메일 로그인 폼 표시 상태 |
| **Test Step** | 1. 이메일 입력 필드에 `` 입력<br>2. 비밀번호 입력 필드를 빈 상태로 유지<br>3. "로그인" 버튼 클릭 |
| **Expected Result** | - **에러 메시지 표시**: `span[data-f='Span-ba96']` 내 "공백 없이 입력해주세요." 텍스트 표시<br>- **비밀번호 입력 컨테이너 클래스 변경**: `form > div:nth-child(2) > div[data-f='StyledDiv-3ec0']`의 클래스가 `sc-267d8ce6-0 ejTrKt` → `sc-267d8ce6-0 gGTyzN`으로 변경<br>- URL이 변경되지 않음 (`https://www.miricanvas.com/ko` 유지)<br>- 로그인 다이얼로그가 닫히지 않음 |

#### TC-EMAIL-010
| 항목 | 내용 |
|-----|-----|
| **TC ID** | TC-EMAIL-010 |
| **Title** | 이메일과 비밀번호 모두 미입력 시 로그인 불가 |
| **Precondition** | - 로그인 다이얼로그 열림<br>- 이메일 로그인 폼 표시 상태 |
| **Test Step** | 1. 이메일 입력 필드를 빈 상태로 유지<br>2. 비밀번호 입력 필드를 빈 상태로 유지<br>3. "로그인" 버튼 클릭 |
| **Expected Result** | - **이메일 에러 메시지 표시**: "이메일 주소를 입력해주세요." (#text 노드로 표시)<br>- **비밀번호 에러 메시지 표시**: `span[data-f='Span-ba96']` 내 "공백 없이 입력해주세요." 텍스트 표시<br>- **이메일 입력 컨테이너 클래스 변경**: `form > div:nth-child(1) > div[data-f='StyledDiv-3ec0']`의 클래스가 `sc-267d8ce6-0 ejTrKt` → `sc-267d8ce6-0 gGTyzN`으로 변경<br>- **비밀번호 입력 컨테이너 클래스 변경**: `form > div:nth-child(2) > div[data-f='StyledDiv-3ec0']`의 클래스가 `sc-267d8ce6-0 ejTrKt` → `sc-267d8ce6-0 gGTyzN`으로 변경<br>- URL이 변경되지 않음 (`https://www.miricanvas.com/ko` 유지)<br>- 로그인 다이얼로그가 닫히지 않음 |

#### TC-EMAIL-011
| 항목 | 내용 |
|-----|-----|
| **TC ID** | TC-EMAIL-011 |
| **Title** | 유효하지 않은 이메일 형식 입력 시 검증 |
| **Precondition** | - 로그인 다이얼로그 열림<br>- 이메일 로그인 폼 표시 상태 |
| **Test Step** | 1. 이메일 입력 필드에 잘못된 형식 입력 (예: `notanemail`)<br>2. 비밀번호 입력 필드에 임의의 값 입력<br>3. "로그인" 버튼 클릭 시도 |
| **Expected Result** | - 이메일 형식 검증 에러 메시지 표시 (예: "올바른 이메일 형식을 입력해주세요")<br>- 로그인 시도가 진행되지 않거나<br>- 서버 측에서 거부됨 |

### 1.3 엣지 케이스

#### TC-EMAIL-012
| 항목 | 내용 |
|-----|-----|
| **TC ID** | TC-EMAIL-012 |
| **Title** | 로그인 다이얼로그 닫기 버튼 동작 확인 |
| **Precondition** | - 로그인 다이얼로그 열림 |
| **Test Step** | 1. 로그인 다이얼로그 우측 상단 닫기(X) 버튼 클릭<br>2. 페이지 상태 확인 |
| **Expected Result** | - 로그인 다이얼로그가 닫힘<br>- URL이 `https://www.miricanvas.com/ko`로 유지됨<br>- 메인 페이지로 돌아감 |

#### TC-EMAIL-013
| 항목 | 내용 |
|-----|-----|
| **TC ID** | TC-EMAIL-013 |
| **Title** | 이메일에 공백 포함 시 처리 확인 |
| **Precondition** | - 로그인 다이얼로그 열림<br>- 이메일 로그인 폼 표시 상태 |
| **Test Step** | 1. 이메일 입력 필드에 앞/뒤 공백이 포함된 이메일 입력 (예: `  `)<br>2. 비밀번호 입력<br>3. 로그인 버튼 클릭 |
| **Expected Result** | - 공백이 자동으로 제거되고 로그인 성공하거나<br>- 공백으로 인해 로그인 실패 시 적절한 에러 메시지 표시 |

#### TC-EMAIL-014
| 항목 | 내용 |
|-----|-----|
| **TC ID** | TC-EMAIL-014 |
| **Title** | 페이지 새로고침 후 세션 유지 확인 |
| **Precondition** | - 유효한 계정으로 로그인 성공<br>- 워크스페이스 페이지 접속 중 |
| **Test Step** | 1. 브라우저 새로고침 (F5 또는 Ctrl+R)<br>2. 페이지 로드 대기<br>3. 로그인 상태 확인 |
| **Expected Result** | - 새로고침 후에도 로그인 상태 유지됨<br>- 워크스페이스 페이지에 머물러 있음<br>- 재로그인 요구되지 않음 |
</details>
