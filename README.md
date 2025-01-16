# 1. Project Overview (프로젝트 개요)
- 프로젝트 이름: Blendeo
- 프로젝트 설명: 루프 스테이션을 통해 다양한 사람들과 협업이 가능한 SNS 형태의 음악 플랫폼

<br/>
<br/>

# 2. Team Members (팀원 및 팀 소개)
| 김민서 | 김영진 | 김혜빈 | 박다희 | 유준선 | 임채준 |
|:------:|:------:|:------:|:------:|:------:|:------:|
| <img src="./assets/흰둥이.png" alt="김민서" width="150"> | <img src="./assets/맹구.png" alt="김영진" width="150"> | <img src="./assets/유리.jpg" alt="김혜빈" width="150"> | <img src="./assets/짱구.jpg" alt="박다희" width="150"> | <img src="./assets/철수.webp" alt="유준선" width="150"> | <img src="./assets/훈이.jpg" alt="임채준" width="150"> |
| BE | BE | FE | BE | FE | FE |
| [GitHub](https://github.com/ms9648) | [GitHub](https://github.com/haochaen73) | [GitHub](https://github.com/pencil-HB) | [GitHub]() | [GitHub](https://github.com/JoonsunRyu) | [GitHub](https://github.com/dlacowns21) |

<br/>
<br/>

# 3. Key Features (주요 기능)
- **음악 협업**:
  - 다른 사람들의 영상을 포크해서 나의 연주를 덧붙여 합주영상 제작

- **음악 컨텐츠 감상**:
  - 업로드 된 영상들을 릴스형태로 감상. 추천 / 최신 / 랭킹으로 조회

- **영상 편집**:
  - 잡음제거, 편집점 잡기, 속도 조절, 볼륨 조절, 반복 재생, 레이아웃 셋팅, 컷 기능

- **SNS**:
  - 유저간 팔로우, 댓글, 채팅, 영상통화

<br/>
<br/>

# 4. Distinctiveness and Creative Elements (차별점 및 독창성성)
  - 그래프 DB를 활용한 데이터 관리 MySQL과 Neo4j의 데이터 정합성 유지
  - gRPC 기반 WebRTC 그룹 화상통화 연결 QUIC 프로토콜을 통한 gRPC 연결로 연결 안정성/시그널링 성능 제고
  - ffmpeg.wasm 라이브러리를 활용한 음성 효과 편집
  - ffmpeg을 활용한 영상 합치기 / 레이아웃 설정
  - Redis를 활용한 실시간 랭킹 제공
  - SSE를 활용한 알림 제공

<br/>
<br/>

# 5. Technology Stack (기술 스택)
## 5.1 Frontend
|  |  |
|-----------------|-----------------|
| HTML5    |<img src="https://github.com/user-attachments/assets/2e122e74-a28b-4ce7-aff6-382959216d31" alt="HTML5" width="100">| 
| CSS3    |   <img src="https://github.com/user-attachments/assets/c531b03d-55a3-40bf-9195-9ff8c4688f13" alt="CSS3" width="100">|
| Javascript    |  <img src="https://github.com/user-attachments/assets/4a7d7074-8c71-48b4-8652-7431477669d1" alt="Javascript" width="100"> |
| React    |  <img src="https://github.com/user-attachments/assets/e3b49dbb-981b-4804-acf9-012c854a2fd2" alt="React" width="100"> |

<br/>

## 5.2 Backend
|  |  |
|-----------------|-----------------|
| Java | <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/java/java-original.svg" alt="Java" width="100"> |
| Spring Boot | <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/spring/spring-original.svg" alt="Spring Boot" width="100"> |

<br/>

## 5.3 Cooperation
|  |  |
|-----------------|-----------------|
| GitLab | <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/gitlab/gitlab-original.svg" alt="GitLab" width="100"> |
| Jira | <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/jira/jira-original.svg" alt="Jira" width="100"> |
| Notion | <img src="https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1570106347/noticon/hx52ypkqqdzjdvd8iaid.svg" alt="Notion" width="100"> |

<br/>
<br/>

# 6. Project Structure (프로젝트 구조)

<br/>
<br/>

# 7. Development Workflow (개발 워크플로우)
## 브랜치 전략 (Branch Strategy)

<br/>
<br/>

# 8. 커밋 컨벤션

## 기본 규칙
**(이모지) + [기능] + 기능설명**

** git commit -m ":sparkles: [FEAT] 로그인 api 추가" **

## 🖤 CLI에서 커밋 메시지 여러 줄로 작성하는 방법

** 쌍따옴표를 닫지 말고 개행하며 작성 → 다 작성한 후에 쌍따옴표를 닫으면 작성 완료 **

git commit -m ":sparkles: [FEAT] 로그인 api 추가

✅ **TIL(Today I Learned) 작성 방법**
git commit -m **":memo: 250116 OOO TIL"**


<br/>

## ⚡️GitMoji
| 아이콘 | 코드 | 의미 |
|--------|------|------|
| 🎉 | `:tada:` | [Start] 프로젝트 시작 |
| ✨ | `:sparkles:` | [Feat] 새 기능 |
| 🙈 | `:see_no_evil:` | .gitignore 추가/수정 |
| 💩 | `:poop:` | 똥싼 코드 |
| 🔒 | `:lock:` | 보안 이슈 수정 |
| ✅ | `:white_check_mark:` | 테스트 추가/수정 |
| 🔀 | `:twisted_rightwards_arrows:` | 브랜치 합병 |
| ♻️ | `:recycle:` | 코드 리팩토링 |
| 🗃 | `:card_file_box:` | 데이터베이스 관련 수정 |
| 🔥 | `:fire:` | 코드/파일 삭제 |
| 🚚 | `:truck:` | 리소스 이동, 이름 변경 |
| 📝 | `:memo:` | 문서 추가/수정 |
| 💡 | `:bulb:` | 주석 추가/수정 |
| 🎨 | `:art:` | 코드의 구조/형태 개선 |
| ⚡️ | `:zap:` | 성능 개선 |
| 🔊 | `:loud_sound:` | 로그 추가/수정 |
| 🐛 | `:bug:` | 버그 수정 |
| 🚑 | `:ambulance:` | 긴급 수정 |
| 💄 | `:lipstick:` | UI/스타일 파일 추가/수정 |
| 🔖 | `:bookmark:` | 릴리즈/버전 태그 |
| 💚 | `:green_heart:` | CI 빌드 수정 |
| 📌 | `:pushpin:` | 특정 버전 의존성 고정 |
| 👷 | `:construction_worker:` | CI 빌드 시스템 추가/수정 |
| 📈 | `:chart_with_upwards_trend:` | 분석, 추적 코드 추가/수정 |
| ➕ | `:heavy_plus_sign:` | 의존성 추가 |
| ➖ | `:heavy_minus_sign:` | 의존성 제거 |
| 🔧 | `:wrench:` | 구성 파일 추가/삭제 |
| 🔨 | `:hammer:` | 개발 스크립트 추가/수정 |
| 🌐 | `:globe_with_meridians:` | 국제화/현지화 |
| ⏪ | `:rewind:` | 변경 내용 되돌리기 |
| 📦 | `:package:` | 컴파일된 파일 추가/수정 |
| 👽 | `:alien:` | 외부 API 변화로 인한 수정 |
| 📄 | `:page_facing_up:` | 라이센스 추가/수정 |
| 🍻 | `:beers:` | 술 취해서 쓴 코드 |

<br/>

🖤 커밋 메시지 컨벤션
<aside> ✅ 커밋 규칙

1. 커밋 유형 지정
* 커밋 유형은 영어 대문자로 작성하기

| 커밋 유형 | 의미 |
|-----------|------|
| `Feat` | 새로운 기능 추가 |
| `Fix` | 버그 수정 |
| `Docs` | 문서 수정 |
| `Style` | 코드 formatting, 세미콜론 누락, 코드 자체의 변경이 없는 경우 |
| `Refactor` | 코드 리팩토링 |
| `Test` | 테스트 코드, 리팩토링 테스트 코드 추가 |
| `Chore` | 패키지 매니저 수정, 그 외 기타 수정 ex) .gitignore |
| `Design` | CSS 등 사용자 UI 디자인 변경 |
| `Comment` | 필요한 주석 추가 및 변경 |
| `Rename` | 파일 또는 폴더 명을 수정하거나 옮기는 작업만인 경우 |
| `Remove` | 파일을 삭제하는 작업만 수행한 경우 |
| `!BREAKING CHANGE` | 커다란 API 변경의 경우 |
| `!HOTFIX` | 급하게 치명적인 버그를 고쳐야 하는 경우 |

2. 제목과 본문을 빈 행으로 분리
* 커밋 유형 이후 제목과 본문은 한글로 작성하여 내용이 잘 전달될 수 있도록 할 것
* 본문에는 변경한 내용과 이유 설명 (어떻게보다는 무엇 & 왜를 설명)

3. 제목 첫 글자는 대문자로, 끝에는 `.` 금지

4. 제목은 영문 기준 50자 이내로 할 것

5. 자신의 코드가 직관적으로 바로 파악할 수 있다고 생각하지 말자

6. 여러가지 항목이 있다면 글머리 기호를 통해 가독성 높이기
</aside>

