# 미리캔버스 로그인 자동화 테스트 케이스

## 문서 정보
- **작성일**: 2026-02-16
- **대상**: 미리캔버스 로그인 기능
- **URL**: https://www.miricanvas.com/ko
- **목적**: 이메일 로그인 및 소셜 로그인 자동화 테스트

---

## ⚠️ 중요: 테스트 실행 제한사항

### 실행 가능 테스트
- ✅ **이메일 로그인**: 제공된 계정으로 실제 테스트 실행 가능
  - Email: `lhb0269@naver.com`
  - Password: `gksqlc9784!`

### 구현만 가능 (실행 제한)
- ⚠️ **소셜 로그인** (네이버, 구글, 카카오, 페이스북, 웨일, 애플)
  - 자동화 스크립트 구현은 완료
  - 보안 이슈로 유효 계정 미제공
  - 실제 로그인 테스트 불가 (향후 계정 제공 시 즉시 실행 가능)

---

## 테스트 케이스 범례

| 표기 | 의미 |
|-----|-----|
| ✅ | 실행 가능 - 실제 계정으로 테스트 가능 |
| ⚠️ | 구현만 - 스크립트는 있으나 계정 미제공으로 실행 불가 |
| 🔴 | 비정상 케이스 - 실패가 예상되는 테스트 |
| 🟢 | 정상 케이스 - 성공이 예상되는 테스트 |

---

## 1. 이메일 로그인 테스트 케이스 (실행 가능 ✅)

### 1.1 정상 시나리오

#### TC-EMAIL-001 🟢 ✅
| 항목 | 내용 |
|-----|-----|
| **TC ID** | TC-EMAIL-001 |
| **Title** | 유효한 계정 정보로 이메일 로그인 성공 |
| **Precondition** | - 미리캔버스 메인 페이지(`https://www.miricanvas.com/ko`) 접속<br>- 로그아웃 상태<br>- 유효한 이메일 계정: `lhb0269@naver.com` / `gksqlc9784!` |
| **Test Step** | 1. 메인 페이지 우측 상단 "로그인" 버튼 클릭<br>2. 로그인 다이얼로그가 표시되면 "이메일로 시작하기" 버튼 클릭<br>3. 이메일 입력 필드에 `lhb0269@naver.com` 입력<br>4. 비밀번호 입력 필드에 `gksqlc9784!` 입력<br>5. "로그인" 버튼 클릭 |
| **Expected Result** | - 10초 이내에 URL이 `https://www.miricanvas.com/workspace/drive`로 변경됨<br>- 다음 6개 UI 요소가 모두 표시됨:<br>&nbsp;&nbsp;1. 유저 프로필 아이콘<br>&nbsp;&nbsp;2. 검색 텍스트 박스<br>&nbsp;&nbsp;3. 템플릿 보러가기 버튼<br>&nbsp;&nbsp;4. 새 디자인 만들기 버튼<br>&nbsp;&nbsp;5. 알림 버튼<br>&nbsp;&nbsp;6. 프로필 홀더 버튼<br>- 로그인 다이얼로그가 자동으로 닫힘 |

#### TC-EMAIL-002 🟢 ✅
| 항목 | 내용 |
|-----|-----|
| **TC ID** | TC-EMAIL-002 |
| **Title** | 로그인 다이얼로그 정상 표시 확인 |
| **Precondition** | - 미리캔버스 메인 페이지(`https://www.miricanvas.com/ko`) 접속<br>- 로그아웃 상태 |
| **Test Step** | 1. 메인 페이지 우측 상단 "로그인" 버튼 클릭<br>2. 다이얼로그 내 요소 확인 |
| **Expected Result** | - 로그인 다이얼로그가 화면 중앙에 표시됨<br>- 다이얼로그 내 "이메일로 시작하기" 버튼 존재<br>- 소셜 로그인 버튼들 표시 (네이버, 구글, 카카오, 페이스북, 웨일, 애플)<br>- 다이얼로그 닫기(X) 버튼 존재 |

#### TC-EMAIL-003 🟢 ✅
| 항목 | 내용 |
|-----|-----|
| **TC ID** | TC-EMAIL-003 |
| **Title** | 이메일 입력 필드 정상 작동 확인 |
| **Precondition** | - 로그인 다이얼로그 열림<br>- 이메일 로그인 폼 표시 상태 |
| **Test Step** | 1. 이메일 입력 필드에 포커스<br>2. 유효한 이메일 주소 `lhb0269@naver.com` 입력<br>3. 입력된 값 확인 |
| **Expected Result** | - 이메일 입력 필드에 텍스트가 정상적으로 입력됨<br>- 입력한 이메일 주소가 필드에 표시됨<br>- placeholder 텍스트가 사라짐 |

#### TC-EMAIL-004 🟢 ✅
| 항목 | 내용 |
|-----|-----|
| **TC ID** | TC-EMAIL-004 |
| **Title** | 비밀번호 입력 필드 정상 작동 확인 |
| **Precondition** | - 로그인 다이얼로그 열림<br>- 이메일 로그인 폼 표시 상태 |
| **Test Step** | 1. 비밀번호 입력 필드에 포커스<br>2. 비밀번호 `gksqlc9784!` 입력<br>3. 입력된 값 확인 |
| **Expected Result** | - 비밀번호 입력 필드에 텍스트가 정상적으로 입력됨<br>- 입력한 비밀번호가 마스킹 처리됨 (•••••)<br>- placeholder 텍스트가 사라짐 |

#### TC-EMAIL-005 🟢 ✅
| 항목 | 내용 |
|-----|-----|
| **TC ID** | TC-EMAIL-005 |
| **Title** | 로그인 후 워크스페이스 페이지 UI 요소 검증 |
| **Precondition** | - 유효한 계정으로 로그인 성공<br>- URL이 `https://www.miricanvas.com/workspace/drive`로 변경됨 |
| **Test Step** | 1. 워크스페이스 페이지 로드 완료 대기<br>2. 페이지 내 주요 UI 요소 존재 확인 |
| **Expected Result** | - 다음 6개 UI 요소가 15초 이내에 모두 표시됨:<br>&nbsp;&nbsp;1. 유저 프로필 아이콘 (사이드바)<br>&nbsp;&nbsp;2. 검색 텍스트 박스 (상단)<br>&nbsp;&nbsp;3. 템플릿 보러가기 버튼<br>&nbsp;&nbsp;4. 새 디자인 만들기 버튼<br>&nbsp;&nbsp;5. 알림 버튼<br>&nbsp;&nbsp;6. 프로필 홀더 버튼<br>- 각 요소가 클릭 가능한 상태 |

### 1.2 비정상 시나리오

#### TC-EMAIL-006 🔴 ✅
| 항목 | 내용 |
|-----|-----|
| **TC ID** | TC-EMAIL-006 |
| **Title** | 잘못된 이메일 주소로 로그인 실패 |
| **Precondition** | - 로그인 다이얼로그 열림<br>- 이메일 로그인 폼 표시 상태 |
| **Test Step** | 1. 이메일 입력 필드에 존재하지 않는 이메일 `invalid@test.com` 입력<br>2. 비밀번호 입력 필드에 임의의 비밀번호 입력<br>3. "로그인" 버튼 클릭<br>4. 5초 대기 후 결과 확인 |
| **Expected Result** | - URL이 변경되지 않음 (`https://www.miricanvas.com/ko` 유지)<br>- **에러 메시지 표시**: "존재하지 않는 이메일입니다." (#text 노드로 표시)<br>- **이메일 입력 컨테이너 클래스 변경**: `form > div:nth-child(1) > div[data-f='StyledDiv-3ec0']`의 클래스가 `sc-267d8ce6-0 ejTrKt` → `sc-267d8ce6-0 gGTyzN`으로 변경<br>- 로그인 다이얼로그가 닫히지 않음<br>- 입력 필드가 활성 상태로 유지 |

#### TC-EMAIL-007 🔴 ✅
| 항목 | 내용 |
|-----|-----|
| **TC ID** | TC-EMAIL-007 |
| **Title** | 잘못된 비밀번호로 로그인 실패 |
| **Precondition** | - 로그인 다이얼로그 열림<br>- 이메일 로그인 폼 표시 상태 |
| **Test Step** | 1. 이메일 입력 필드에 유효한 이메일 `lhb0269@naver.com` 입력<br>2. 비밀번호 입력 필드에 잘못된 비밀번호 `wrongpassword123` 입력<br>3. "로그인" 버튼 클릭<br>4. 5초 대기 후 결과 확인 |
| **Expected Result** | - URL이 변경되지 않음<br>- **에러 메시지 표시**: `span[data-f='Span-ba96']` 내 "잘못된 비밀번호입니다." 텍스트 표시<br>- **비밀번호 입력 컨테이너 클래스 변경**: `form > div:nth-child(2) > div[data-f='StyledDiv-3ec0']`의 클래스가 `sc-267d8ce6-0 ejTrKt` → `sc-267d8ce6-0 gGTyzN`으로 변경<br>- 로그인 다이얼로그가 닫히지 않음<br>- 비밀번호 필드가 초기화되거나 유지됨 |

#### TC-EMAIL-008 🔴 ✅
| 항목 | 내용 |
|-----|-----|
| **TC ID** | TC-EMAIL-008 |
| **Title** | 이메일 미입력 시 로그인 불가 |
| **Precondition** | - 로그인 다이얼로그 열림<br>- 이메일 로그인 폼 표시 상태 |
| **Test Step** | 1. 이메일 입력 필드를 빈 상태로 유지<br>2. 비밀번호 입력 필드에 임의 비밀번호 입력<br>3. "로그인" 버튼 클릭 |
| **Expected Result** | - **에러 메시지 표시**: "이메일 주소를 입력해주세요." (#text 노드로 표시)<br>- **이메일 입력 컨테이너 클래스 변경**: `form > div:nth-child(1) > div[data-f='StyledDiv-3ec0']`의 클래스가 `sc-267d8ce6-0 ejTrKt` → `sc-267d8ce6-0 gGTyzN`으로 변경<br>- URL이 변경되지 않음 (`https://www.miricanvas.com/ko` 유지)<br>- 로그인 다이얼로그가 닫히지 않음 |

#### TC-EMAIL-009 🔴 ✅
| 항목 | 내용 |
|-----|-----|
| **TC ID** | TC-EMAIL-009 |
| **Title** | 비밀번호 미입력 시 로그인 불가 |
| **Precondition** | - 로그인 다이얼로그 열림<br>- 이메일 로그인 폼 표시 상태 |
| **Test Step** | 1. 이메일 입력 필드에 `lhb0269@naver.com` 입력<br>2. 비밀번호 입력 필드를 빈 상태로 유지<br>3. "로그인" 버튼 클릭 |
| **Expected Result** | - **에러 메시지 표시**: `span[data-f='Span-ba96']` 내 "공백 없이 입력해주세요." 텍스트 표시<br>- **비밀번호 입력 컨테이너 클래스 변경**: `form > div:nth-child(2) > div[data-f='StyledDiv-3ec0']`의 클래스가 `sc-267d8ce6-0 ejTrKt` → `sc-267d8ce6-0 gGTyzN`으로 변경<br>- URL이 변경되지 않음 (`https://www.miricanvas.com/ko` 유지)<br>- 로그인 다이얼로그가 닫히지 않음 |

#### TC-EMAIL-010 🔴 ✅
| 항목 | 내용 |
|-----|-----|
| **TC ID** | TC-EMAIL-010 |
| **Title** | 이메일과 비밀번호 모두 미입력 시 로그인 불가 |
| **Precondition** | - 로그인 다이얼로그 열림<br>- 이메일 로그인 폼 표시 상태 |
| **Test Step** | 1. 이메일 입력 필드를 빈 상태로 유지<br>2. 비밀번호 입력 필드를 빈 상태로 유지<br>3. "로그인" 버튼 클릭 |
| **Expected Result** | - **이메일 에러 메시지 표시**: "이메일 주소를 입력해주세요." (#text 노드로 표시)<br>- **비밀번호 에러 메시지 표시**: `span[data-f='Span-ba96']` 내 "공백 없이 입력해주세요." 텍스트 표시<br>- **이메일 입력 컨테이너 클래스 변경**: `form > div:nth-child(1) > div[data-f='StyledDiv-3ec0']`의 클래스가 `sc-267d8ce6-0 ejTrKt` → `sc-267d8ce6-0 gGTyzN`으로 변경<br>- **비밀번호 입력 컨테이너 클래스 변경**: `form > div:nth-child(2) > div[data-f='StyledDiv-3ec0']`의 클래스가 `sc-267d8ce6-0 ejTrKt` → `sc-267d8ce6-0 gGTyzN`으로 변경<br>- URL이 변경되지 않음 (`https://www.miricanvas.com/ko` 유지)<br>- 로그인 다이얼로그가 닫히지 않음 |

#### TC-EMAIL-011 🔴 ✅
| 항목 | 내용 |
|-----|-----|
| **TC ID** | TC-EMAIL-011 |
| **Title** | 유효하지 않은 이메일 형식 입력 시 검증 |
| **Precondition** | - 로그인 다이얼로그 열림<br>- 이메일 로그인 폼 표시 상태 |
| **Test Step** | 1. 이메일 입력 필드에 잘못된 형식 입력 (예: `notanemail`)<br>2. 비밀번호 입력 필드에 임의의 값 입력<br>3. "로그인" 버튼 클릭 시도 |
| **Expected Result** | - 이메일 형식 검증 에러 메시지 표시 (예: "올바른 이메일 형식을 입력해주세요")<br>- 로그인 시도가 진행되지 않거나<br>- 서버 측에서 거부됨 |

### 1.3 엣지 케이스

#### TC-EMAIL-012 🟢 ✅
| 항목 | 내용 |
|-----|-----|
| **TC ID** | TC-EMAIL-012 |
| **Title** | 로그인 다이얼로그 닫기 버튼 동작 확인 |
| **Precondition** | - 로그인 다이얼로그 열림 |
| **Test Step** | 1. 로그인 다이얼로그 우측 상단 닫기(X) 버튼 클릭<br>2. 페이지 상태 확인 |
| **Expected Result** | - 로그인 다이얼로그가 닫힘<br>- URL이 `https://www.miricanvas.com/ko`로 유지됨<br>- 메인 페이지로 돌아감 |

#### TC-EMAIL-013 🟢 ✅
| 항목 | 내용 |
|-----|-----|
| **TC ID** | TC-EMAIL-013 |
| **Title** | 이메일에 공백 포함 시 처리 확인 |
| **Precondition** | - 로그인 다이얼로그 열림<br>- 이메일 로그인 폼 표시 상태 |
| **Test Step** | 1. 이메일 입력 필드에 앞/뒤 공백이 포함된 이메일 입력 (예: ` lhb0269@naver.com `)<br>2. 비밀번호 입력<br>3. 로그인 버튼 클릭 |
| **Expected Result** | - 공백이 자동으로 제거되고 로그인 성공하거나<br>- 공백으로 인해 로그인 실패 시 적절한 에러 메시지 표시 |

#### TC-EMAIL-014 🔴 ✅
| 항목 | 내용 |
|-----|-----|
| **TC ID** | TC-EMAIL-014 |
| **Title** | 특수문자가 포함된 비밀번호 입력 처리 |
| **Precondition** | - 로그인 다이얼로그 열림<br>- 이메일 로그인 폼 표시 상태 |
| **Test Step** | 1. 이메일 입력 필드에 `lhb0269@naver.com` 입력<br>2. 비밀번호 입력 필드에 특수문자가 포함된 비밀번호 입력 (`gksqlc9784!`)<br>3. 로그인 버튼 클릭 |
| **Expected Result** | - 특수문자가 정상적으로 처리됨<br>- 올바른 비밀번호인 경우 로그인 성공<br>- 특수문자로 인한 입력 오류 발생하지 않음 |

#### TC-EMAIL-015 🔴 ✅
| 항목 | 내용 |
|-----|-----|
| **TC ID** | TC-EMAIL-015 |
| **Title** | 네트워크 지연 상황에서 로그인 타임아웃 처리 |
| **Precondition** | - 로그인 다이얼로그 열림<br>- 네트워크 throttling 설정 (Slow 3G)<br>- 이메일 로그인 폼 표시 상태 |
| **Test Step** | 1. 네트워크를 느린 속도로 제한<br>2. 유효한 이메일/비밀번호 입력<br>3. 로그인 버튼 클릭<br>4. 30초 대기 |
| **Expected Result** | - 로딩 인디케이터 표시 (있을 경우)<br>- 10초 타임아웃 설정에 따라 처리되거나<br>- 느린 네트워크에서도 최종적으로 로그인 성공<br>- 적절한 에러 메시지 표시 (타임아웃 시) |

#### TC-EMAIL-016 🟢 ✅
| 항목 | 내용 |
|-----|-----|
| **TC ID** | TC-EMAIL-016 |
| **Title** | 페이지 새로고침 후 세션 유지 확인 |
| **Precondition** | - 유효한 계정으로 로그인 성공<br>- 워크스페이스 페이지 접속 중 |
| **Test Step** | 1. 브라우저 새로고침 (F5 또는 Ctrl+R)<br>2. 페이지 로드 대기<br>3. 로그인 상태 확인 |
| **Expected Result** | - 새로고침 후에도 로그인 상태 유지됨<br>- 워크스페이스 페이지에 머물러 있음<br>- 재로그인 요구되지 않음 |

---

## 2. 소셜 로그인 테스트 케이스 (구현만 ⚠️)

> **참고**: 이하 소셜 로그인 테스트 케이스는 CSS 셀렉터 식별 및 자동화 스크립트 구현이 완료되었으나, 보안 이슈로 유효한 계정 정보가 제공되지 않아 **실제 실행은 불가능**합니다. 향후 계정 제공 시 즉시 테스트 가능합니다.

### 2.1 네이버 로그인

#### TC-NAVER-001 🟢 ⚠️
| 항목 | 내용 |
|-----|-----|
| **TC ID** | TC-NAVER-001 |
| **Title** | 네이버 계정으로 소셜 로그인 성공 |
| **Precondition** | - 미리캔버스 메인 페이지 접속<br>- 로그아웃 상태<br>- **유효한 네이버 계정 필요 (미제공)** |
| **Test Step** | 1. "로그인" 버튼 클릭<br>2. 로그인 다이얼로그에서 "네이버" 버튼 클릭<br>3. 네이버 로그인 팝업 창 대기<br>4. 팝업에서 네이버 아이디 입력 (`input[name='id']`)<br>5. 네이버 비밀번호 입력 (`input[name='pw']`)<br>6. 로그인 버튼 클릭 (`button[type='submit']`)<br>7. 팝업 창 닫힘 대기 |
| **Expected Result** | - 팝업 창이 자동으로 닫힘<br>- 원래 페이지 URL이 `https://www.miricanvas.com/workspace/drive`로 변경<br>- 워크스페이스 페이지 UI 요소 6개 모두 표시 |

#### TC-NAVER-002 🔴 ⚠️
| 항목 | 내용 |
|-----|-----|
| **TC ID** | TC-NAVER-002 |
| **Title** | 네이버 로그인 팝업에서 취소 버튼 클릭 |
| **Precondition** | - 로그인 다이얼로그 열림<br>- 네이버 로그인 팝업 표시 |
| **Test Step** | 1. 네이버 로그인 버튼 클릭<br>2. 팝업 창 대기<br>3. 팝업 창 닫기 버튼 클릭 또는 ESC 키 입력 |
| **Expected Result** | - 팝업 창이 닫힘<br>- 원래 페이지가 메인 페이지로 유지<br>- 로그인 다이얼로그 상태 유지 또는 재표시 |

#### TC-NAVER-003 🔴 ⚠️
| 항목 | 내용 |
|-----|-----|
| **TC ID** | TC-NAVER-003 |
| **Title** | 네이버 로그인 실패 - 잘못된 계정 정보 |
| **Precondition** | - 네이버 로그인 팝업 표시 |
| **Test Step** | 1. 팝업에서 존재하지 않는 네이버 아이디 입력<br>2. 임의의 비밀번호 입력<br>3. 로그인 버튼 클릭<br>4. 에러 메시지 확인 |
| **Expected Result** | - 네이버 팝업 내 에러 메시지 표시 (`div.login_error_wrap`)<br>- 팝업 창이 닫히지 않음<br>- 미리캔버스 원래 페이지 URL 변경 없음 |

### 2.2 구글 로그인

#### TC-GOOGLE-001 🟢 ⚠️
| 항목 | 내용 |
|-----|-----|
| **TC ID** | TC-GOOGLE-001 |
| **Title** | 구글 계정으로 소셜 로그인 성공 (2단계) |
| **Precondition** | - 미리캔버스 메인 페이지 접속<br>- 로그아웃 상태<br>- **유효한 구글 계정 필요 (미제공)** |
| **Test Step** | 1. "로그인" 버튼 클릭<br>2. 로그인 다이얼로그에서 "구글" 버튼 클릭<br>3. 구글 로그인 팝업 창 대기<br>4. **1단계**: 이메일 입력 (`input[name='identifier']`)<br>5. "다음" 버튼 클릭<br>6. **2단계**: 비밀번호 입력 (`input[type='password']`)<br>7. "다음" 버튼 클릭<br>8. 팝업 창 닫힘 대기 |
| **Expected Result** | - 2단계 로그인 플로우가 정상적으로 진행됨<br>- 팝업 창 자동 닫힘<br>- URL이 `https://www.miricanvas.com/workspace/drive`로 변경<br>- 워크스페이스 페이지 UI 요소 표시 |

#### TC-GOOGLE-002 🔴 ⚠️
| 항목 | 내용 |
|-----|-----|
| **TC ID** | TC-GOOGLE-002 |
| **Title** | 구글 로그인 1단계에서 잘못된 이메일 입력 |
| **Precondition** | - 구글 로그인 팝업 표시<br>- 1단계 (이메일 입력) 화면 |
| **Test Step** | 1. 이메일 입력 필드에 존재하지 않는 이메일 입력<br>2. "다음" 버튼 클릭<br>3. 에러 메시지 확인 |
| **Expected Result** | - 구글 팝업 내 에러 메시지 표시 (예: "계정을 찾을 수 없습니다")<br>- 2단계로 진행되지 않음<br>- 팝업 창 유지 |

#### TC-GOOGLE-003 🔴 ⚠️
| 항목 | 내용 |
|-----|-----|
| **TC ID** | TC-GOOGLE-003 |
| **Title** | 구글 로그인 2단계에서 잘못된 비밀번호 입력 |
| **Precondition** | - 구글 로그인 팝업 표시<br>- 1단계 통과 후 2단계 (비밀번호 입력) 화면 |
| **Test Step** | 1. 비밀번호 입력 필드에 잘못된 비밀번호 입력<br>2. "다음" 버튼 클릭<br>3. 에러 메시지 확인 |
| **Expected Result** | - 구글 팝업 내 에러 메시지 표시 (예: "비밀번호가 올바르지 않습니다")<br>- 로그인 진행되지 않음<br>- 팝업 창 유지 |

### 2.3 카카오 로그인

#### TC-KAKAO-001 🟢 ⚠️
| 항목 | 내용 |
|-----|-----|
| **TC ID** | TC-KAKAO-001 |
| **Title** | 카카오 계정으로 소셜 로그인 성공 |
| **Precondition** | - 미리캔버스 메인 페이지 접속<br>- 로그아웃 상태<br>- **유효한 카카오 계정 필요 (미제공)** |
| **Test Step** | 1. "로그인" 버튼 클릭<br>2. 로그인 다이얼로그에서 "카카오" 버튼 클릭<br>3. 카카오 로그인 팝업 창 대기<br>4. 카카오 아이디 입력 (`input[name='loginId']`)<br>5. 카카오 비밀번호 입력 (`input[name='password']`)<br>6. 로그인 버튼 클릭 (`button[type='submit']`)<br>7. 팝업 창 닫힘 대기 |
| **Expected Result** | - 팝업 창 자동 닫힘<br>- URL이 `https://www.miricanvas.com/workspace/drive`로 변경<br>- 워크스페이스 페이지 UI 요소 표시 |

#### TC-KAKAO-002 🔴 ⚠️
| 항목 | 내용 |
|-----|-----|
| **TC ID** | TC-KAKAO-002 |
| **Title** | 카카오 로그인 실패 - 잘못된 계정 정보 |
| **Precondition** | - 카카오 로그인 팝업 표시 |
| **Test Step** | 1. 팝업에서 존재하지 않는 카카오 아이디 입력<br>2. 임의의 비밀번호 입력<br>3. 로그인 버튼 클릭 |
| **Expected Result** | - 카카오 팝업 내 에러 메시지 표시<br>- 팝업 창 유지<br>- 미리캔버스 URL 변경 없음 |

### 2.4 페이스북 로그인

#### TC-FACEBOOK-001 🟢 ⚠️
| 항목 | 내용 |
|-----|-----|
| **TC ID** | TC-FACEBOOK-001 |
| **Title** | 페이스북 계정으로 소셜 로그인 성공 |
| **Precondition** | - 미리캔버스 메인 페이지 접속<br>- 로그아웃 상태<br>- **유효한 페이스북 계정 필요 (미제공)** |
| **Test Step** | 1. "로그인" 버튼 클릭<br>2. 로그인 다이얼로그에서 "페이스북" 버튼 클릭<br>3. 페이스북 로그인 팝업 창 대기<br>4. 이메일/전화번호 입력 (`input[name='email']`)<br>5. 비밀번호 입력 (`input[name='pass']`)<br>6. 로그인 버튼 클릭 (`button[name='login']`)<br>7. 팝업 창 닫힘 대기 |
| **Expected Result** | - 팝업 창 자동 닫힘<br>- URL이 `https://www.miricanvas.com/workspace/drive`로 변경<br>- 워크스페이스 페이지 UI 요소 표시 |

#### TC-FACEBOOK-002 🔴 ⚠️
| 항목 | 내용 |
|-----|-----|
| **TC ID** | TC-FACEBOOK-002 |
| **Title** | 페이스북 로그인 실패 - 잘못된 계정 정보 |
| **Precondition** | - 페이스북 로그인 팝업 표시 |
| **Test Step** | 1. 팝업에서 존재하지 않는 이메일 입력<br>2. 임의의 비밀번호 입력<br>3. 로그인 버튼 클릭 |
| **Expected Result** | - 페이스북 팝업 내 에러 메시지 표시<br>- 팝업 창 유지<br>- 미리캔버스 URL 변경 없음 |

### 2.5 웨일 로그인

#### TC-WHALE-001 🟢 ⚠️
| 항목 | 내용 |
|-----|-----|
| **TC ID** | TC-WHALE-001 |
| **Title** | 웨일 계정으로 소셜 로그인 성공 |
| **Precondition** | - 미리캔버스 메인 페이지 접속<br>- 로그아웃 상태<br>- **유효한 웨일 계정 필요 (미제공)** |
| **Test Step** | 1. "로그인" 버튼 클릭<br>2. 로그인 다이얼로그에서 "웨일" 버튼 클릭<br>3. 웨일 로그인 팝업 창 대기<br>4. 사용자 ID 입력 (`input#user_id`)<br>5. 다음 단계 진행 (비밀번호 입력 등)<br>6. 팝업 창 닫힘 대기 |
| **Expected Result** | - 팝업 창 자동 닫힘<br>- URL이 `https://www.miricanvas.com/workspace/drive`로 변경<br>- 워크스페이스 페이지 UI 요소 표시 |

**참고**: 웨일 로그인은 복잡한 다단계 인증 프로세스를 가질 수 있으며, 실제 테스트 시 추가 단계 분석 필요

### 2.6 애플 로그인

#### TC-APPLE-001 🟢 ⚠️
| 항목 | 내용 |
|-----|-----|
| **TC ID** | TC-APPLE-001 |
| **Title** | 애플 계정으로 소셜 로그인 성공 |
| **Precondition** | - 미리캔버스 메인 페이지 접속<br>- 로그아웃 상태<br>- **유효한 애플 계정 필요 (미제공)** |
| **Test Step** | 1. "로그인" 버튼 클릭<br>2. 로그인 다이얼로그에서 "애플" 버튼 클릭<br>3. 애플 로그인 팝업 창 대기<br>4. Apple ID 입력 (`input#account_name_text_field`)<br>5. 비밀번호 입력 (`input#password_text_field`)<br>6. 계속/로그인 버튼 클릭 (`button#sign-in`)<br>7. 팝업 창 닫힘 대기 |
| **Expected Result** | - 팝업 창 자동 닫힘<br>- URL이 `https://www.miricanvas.com/workspace/drive`로 변경<br>- 워크스페이스 페이지 UI 요소 표시 |

#### TC-APPLE-002 🔴 ⚠️
| 항목 | 내용 |
|-----|-----|
| **TC ID** | TC-APPLE-002 |
| **Title** | 애플 로그인 실패 - 잘못된 계정 정보 |
| **Precondition** | - 애플 로그인 팝업 표시 |
| **Test Step** | 1. 팝업에서 존재하지 않는 Apple ID 입력<br>2. 임의의 비밀번호 입력<br>3. 로그인 버튼 클릭 |
| **Expected Result** | - 애플 팝업 내 에러 메시지 표시<br>- 팝업 창 유지<br>- 미리캔버스 URL 변경 없음 |

---

## 3. 공통 엣지 케이스

### 3.1 브라우저 호환성

#### TC-COMMON-001 🟢 ✅
| 항목 | 내용 |
|-----|-----|
| **TC ID** | TC-COMMON-001 |
| **Title** | Chrome 브라우저에서 이메일 로그인 |
| **Precondition** | - Chrome 브라우저 최신 버전<br>- 미리캔버스 메인 페이지 접속 |
| **Test Step** | 1. TC-EMAIL-001과 동일한 절차 수행 |
| **Expected Result** | - Chrome 브라우저에서 정상적으로 로그인 성공<br>- 모든 UI 요소가 올바르게 표시됨 |

#### TC-COMMON-002 🟢 ✅
| 항목 | 내용 |
|-----|-----|
| **TC ID** | TC-COMMON-002 |
| **Title** | Firefox 브라우저에서 이메일 로그인 |
| **Precondition** | - Firefox 브라우저 최신 버전<br>- 미리캔버스 메인 페이지 접속 |
| **Test Step** | 1. TC-EMAIL-001과 동일한 절차 수행 |
| **Expected Result** | - Firefox 브라우저에서 정상적으로 로그인 성공<br>- 모든 UI 요소가 올바르게 표시됨 |

#### TC-COMMON-003 🟢 ✅
| 항목 | 내용 |
|-----|-----|
| **TC ID** | TC-COMMON-003 |
| **Title** | Webkit 브라우저에서 이메일 로그인 |
| **Precondition** | - Webkit 기반 브라우저 (Safari)<br>- 미리캔버스 메인 페이지 접속 |
| **Test Step** | 1. TC-EMAIL-001과 동일한 절차 수행 |
| **Expected Result** | - Webkit 브라우저에서 정상적으로 로그인 성공<br>- 모든 UI 요소가 올바르게 표시됨 |

### 3.2 동시성 및 세션 관리

#### TC-COMMON-004 🟢 ✅
| 항목 | 내용 |
|-----|-----|
| **TC ID** | TC-COMMON-004 |
| **Title** | 여러 브라우저 탭에서 동시 로그인 시도 |
| **Precondition** | - 동일한 브라우저에서 2개의 탭 열림<br>- 두 탭 모두 미리캔버스 메인 페이지 접속<br>- 로그아웃 상태 |
| **Test Step** | 1. 탭 1에서 로그인 시작<br>2. 탭 2에서도 동시에 로그인 시작<br>3. 두 탭 모두 로그인 완료 시도 |
| **Expected Result** | - 두 탭 모두 정상적으로 로그인 처리됨<br>- 세션 충돌 없음<br>- 두 탭 모두 워크스페이스 페이지 표시 |

#### TC-COMMON-005 🟢 ✅
| 항목 | 내용 |
|-----|-----|
| **TC ID** | TC-COMMON-005 |
| **Title** | 쿠키 삭제 후 세션 만료 확인 |
| **Precondition** | - 로그인 완료 상태<br>- 워크스페이스 페이지 접속 중 |
| **Test Step** | 1. 개발자 도구를 통해 모든 쿠키 삭제<br>2. 페이지 새로고침<br>3. 로그인 상태 확인 |
| **Expected Result** | - 세션이 만료되어 로그아웃 상태가 됨<br>- 메인 페이지로 리다이렉트되거나 로그인 요청 메시지 표시 |

### 3.3 성능 및 안정성

#### TC-COMMON-006 🟢 ✅
| 항목 | 내용 |
|-----|-----|
| **TC ID** | TC-COMMON-006 |
| **Title** | 로그인 응답 시간 10초 이내 확인 |
| **Precondition** | - 미리캔버스 메인 페이지 접속<br>- 정상 네트워크 환경 |
| **Test Step** | 1. 유효한 이메일/비밀번호로 로그인 시도<br>2. 로그인 버튼 클릭 시점부터 워크스페이스 페이지 URL 변경까지 시간 측정 |
| **Expected Result** | - 로그인 완료까지 10초 이내<br>- 타임아웃 발생하지 않음 |

#### TC-COMMON-007 🟢 ✅
| 항목 | 내용 |
|-----|-----|
| **TC ID** | TC-COMMON-007 |
| **Title** | 워크스페이스 페이지 완전 로드 15초 이내 확인 |
| **Precondition** | - 유효한 계정으로 로그인 성공<br>- URL이 워크스페이스 페이지로 변경됨 |
| **Test Step** | 1. 로그인 성공 후 페이지 로드 대기<br>2. 모든 UI 요소가 표시될 때까지 시간 측정 |
| **Expected Result** | - 6개 주요 UI 요소가 15초 이내에 모두 로드됨<br>- 페이지가 networkidle 상태 도달 |

---

## 4. 테스트 케이스 통계

### 4.1 카테고리별 테스트 케이스 수

| 카테고리 | 실행 가능 (✅) | 구현만 (⚠️) | 합계 |
|---------|-------------|-----------|------|
| 이메일 로그인 | 16 | 0 | 16 |
| 네이버 로그인 | 0 | 3 | 3 |
| 구글 로그인 | 0 | 3 | 3 |
| 카카오 로그인 | 0 | 2 | 2 |
| 페이스북 로그인 | 0 | 2 | 2 |
| 웨일 로그인 | 0 | 1 | 1 |
| 애플 로그인 | 0 | 2 | 2 |
| 공통 테스트 | 7 | 0 | 7 |
| **합계** | **23** | **13** | **36** |

### 4.2 시나리오별 분류

| 시나리오 | 테스트 케이스 수 |
|---------|--------------|
| 정상 시나리오 (🟢) | 19 |
| 비정상 시나리오 (🔴) | 17 |
| **합계** | **36** |

---

## 5. 테스트 실행 우선순위

### 우선순위 1 (높음) - 즉시 실행 가능
- TC-EMAIL-001 ~ TC-EMAIL-005: 이메일 로그인 정상 시나리오
- TC-EMAIL-006 ~ TC-EMAIL-011: 이메일 로그인 비정상 시나리오
- TC-COMMON-001 ~ TC-COMMON-003: 브라우저 호환성

### 우선순위 2 (중간)
- TC-EMAIL-012 ~ TC-EMAIL-016: 이메일 로그인 엣지 케이스
- TC-COMMON-004 ~ TC-COMMON-007: 세션 및 성능 테스트

### 우선순위 3 (낮음) - 계정 제공 시 실행
- TC-NAVER-001 ~ TC-NAVER-003: 네이버 로그인
- TC-GOOGLE-001 ~ TC-GOOGLE-003: 구글 로그인
- TC-KAKAO-001 ~ TC-KAKAO-002: 카카오 로그인
- TC-FACEBOOK-001 ~ TC-FACEBOOK-002: 페이스북 로그인
- TC-WHALE-001: 웨일 로그인
- TC-APPLE-001 ~ TC-APPLE-002: 애플 로그인

---

## 6. 참고 문서

- [Pass/Fail 기준 문서](C:\Miricanvas_Project\Docs\Requirements Analysis\pass-fail-criteria.md)
- [CSS 셀렉터 종합 문서](C:\Miricanvas_Project\Docs\Requirements Analysis\css-selectors.md)
- [CLAUDE.md 프로젝트 가이드](C:\Miricanvas_Project\CLAUDE.md)

---

## 7. 업데이트 이력

| 날짜 | 변경 내용 | 작성자 |
|------|---------|-------|
| 2026-02-16 | 초기 테스트 케이스 작성 (총 36개) | Claude |

---

## 부록: CSS 셀렉터 빠른 참조

### 이메일 로그인
```typescript
// 로그인 버튼 (헤더)
page.getByRole('button', { name: '로그인' })

// 이메일 입력
page.locator("input[name='email']")

// 비밀번호 입력
page.locator("input[name='password']")

// 제출 버튼
page.locator("form button[type='submit']")
```

### 워크스페이스 페이지 검증 요소
```typescript
// 6개 필수 UI 요소
const elements = {
  userProfileIcon: page.locator("div[class*='user_profile_icon']"),
  searchBox: page.locator("input[placeholder='검색']"),
  templateButton: page.locator("div[class*='WorkspaceTemplateButtonView']"),
  newDesignButton: page.locator("div[class*='workspace_new_design_button']"),
  notificationButton: page.locator("div[class*='workspace_notification_button']"),
  profileHolder: page.locator("div[class*='WorkspaceHeaderVC__ProfilePhotoPlaceholder']")
};
```

### 소셜 로그인 팝업 핸들링
```typescript
// 팝업 대기 및 캡처
const [popup] = await Promise.all([
  context.waitForEvent('page'),
  page.locator("button:has-text('네이버')").click()
]);

// 팝업에서 작업 수행
await popup.locator("input[name='id']").fill('user_id');
await popup.locator("input[name='pw']").fill('password');
await popup.locator("button[type='submit']").click();

// 팝업 닫힘 대기
await popup.waitForEvent('close', { timeout: 10000 });
```
