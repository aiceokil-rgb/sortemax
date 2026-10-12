# SorteMax 작업 규칙 (시작 안내)

이 파일을 먼저 읽고 시작한다. 작업을 끝낼 때마다 "지금 상태"·"남은 일"·새 결정을 갱신한다. 대화가 압축된 뒤에는 이 파일을 다시 연다.
이 파일은 사이트에 공개되므로 비밀번호·키는 적지 않는다.

## 이 앱이 무엇인가
- **SorteMax Mega**: 브라질 Mega-Sena 번호 생성·통계·조합(fechamento)·모의추첨 무료 PWA다. 4개 언어를 지원하고, Duriup 브랜드로 운영한다.
- 사이트는 https://sortemax.duriup.com.br 이다(GitHub Pages 자동 배포). 소개와 설치 안내는 `/baixar/` 에 있다.
- **지금 상태 (2026-10-12)**:
  - 웹앱 v2.3.3 이 운영 중이다(sw 캐시 v11).
  - 결과는 자동으로 갱신되고 있다(최근 3069회).
  - Android 앱(TWA)은 서명한 AAB와 스토어 자료까지 준비했다.
  - Play 개발자 계정은 만들었고, Google 신원 확인(신분증)을 기다리는 중이다.

## 폴더 구조
- `index.html`: 앱 본체 한 파일. 4개 언어 문구 `LANG` 과 조합표 `WHEELS` 가 들어 있다.
- `manifest.json`, `sw.js`(캐시 이름 `sortemax-vNN`)
- `baixar/`: 설치 안내(4개 언어) / `privacidade/`: 개인정보 처리방침(Play 제출용)
- `data/megasena.json`, `data/latest.json`: 결과 데이터(자동 갱신, 손대지 않음) / `scripts/update-data.mjs`: 갱신 스크립트
- `icons/`: 아이콘·채널 로고·QR / `.well-known/assetlinks.json`: Play 앱 연결(`.nojekyll` 필요)
- `android/`: TWA 프로젝트(패키지 `br.com.duriup.sortemax`)
- `.github/workflows/`: `update-data.yml`(하루 10회), `build-android.yml`(수동 실행만)
- `CNAME` = `sortemax.duriup.com.br`(지우지 않는다)

## 실행·배포 방법
- 로컬 확인: `python -m http.server 8080` 을 실행하고 http://localhost:8080 으로 연다.
- 배포: 작업 전에 `git pull` 을 한다(봇이 data 를 push 한다). 그다음 `git add -A && git commit -m "…" && git push` 를 하면 1~2분 뒤 Pages 에 반영된다.
- 결과 수동 갱신: Actions → "Atualizar resultados Mega-Sena" → Run workflow
- Android 새 버전 만드는 순서:
  1. `android/app/build.gradle` 의 versionCode·versionName 을 올린다.
  2. Actions → "Build Android (Play)" 를 실행한다.
  3. `android-build` 브랜치에서 `app-release-unsigned.aab` 를 받는다.
  4. `jarsigner -keystore sortemax-upload.jks <aab> sortemax` 로 서명한다.
  5. Play Console 에 올린다.

## 내용 규칙
- 앱 화면 글의 기본 언어는 포르투갈어(브라질)다. 화면에서 스페인어·영어·한국어로 바꿀 수 있고, 4개 언어를 항상 함께 고친다.
- 이름·링크는 Duriup 만 쓴다. Mix Mania, mixmania, Caçador de Mercados, cacadordemercados 는 쓰지 않는다.
- 문의 이메일: contato@duriup.com.br
- 비밀번호·키는 저장소에 넣지 않는다(`.gitignore` 가 *.jks 를 막는다).

## 배포 규칙
- 작업은 main 에 바로 반영한다. 브랜치로 올렸다면 main 에 합친 뒤 사이트 확인까지 한다.
- 코드를 고쳐 올릴 때마다 `sw.js` 캐시 이름을 하나 올린다(지금 v11 → v12…). 안 올리면 설치한 사람에게 새 버전이 안 보인다.
- main 에 push 한 직후 다른 브랜치를 같이 push 하지 않는다(그때 Pages 배포가 두 번 실패함). 배포가 실패하면 "pages build and deployment" 를 한 번 다시 돌린다.
- 올린 뒤 1~2분 기다렸다가 사이트에서 바뀐 것이 보이는지 직접 확인하고 보고한다.

## 결과 데이터
- `data/*.json` 은 GitHub Actions 가 Caixa 에서 받아 자동으로 갱신한다. 손으로 고치지 않는다.
- 앱에 가짜·예시 당첨 번호를 넣지 않는다. 최신 결과를 못 받으면 경고(배너와 팝업)를 띄운다.
- 조합표를 바꾸면 6개 번호의 모든 추첨 경우를 전수 검사해 보장을 확인한다.

## KIL 과 정한 결정
- [KIL 1007] SorteMax 를 공개 GitHub 저장소(aiceokil-rgb/sortemax)로 옮기고 GitHub Pages 로 배포한다. 주소는 sortemax.duriup.com.br 이다. 이후 수정은 클라우드 클코에서 저장소로 한다.
- [KIL 1007] 다음을 바꾼다:
  - 문의 이메일 → contato@duriup.com.br
  - 유튜브 링크 → @Duriup
  - 배너 이름과 썸네일 → Duriup
- [KIL 1007] 옛 주소는 건드리지 않는다(폐기는 따로 정한다).
- [KIL 1008] 이메일 등록 없이 무료로 쓰게 한다. 환영 화면에 버전 번호를 작게 표시하고, 테마는 시스템을 따르며 라이트·다크 토글을 둔다.
- [KIL 1008] "가짜 번호라던가 모두 지우고 만약에 caixa 에서 얻어 오지 못할경우에는 경고창을 뛰워 주던가 해줘"
- [KIL 1008] 두리업 사이트 위쪽 메뉴의 "App SorteMax (grátis)" 는 `/baixar/` 를 새 탭으로 연다.
- [KIL 1008] 앱 안에 QR, 초대 문구 복사, WhatsApp 공유를 넣는다. 시네는 "이제 영화음악만 취급하는 채널" 이다.
- [KIL 1009] "이런 사람들도 그냥 버튼 누르면 다운 받게" 해야 한다. 그래서 원탭 설치를 넣고 Play 스토어에도 등록한다.
- [KIL 1009] Play 개발자 계정은 개인 계정으로, 소노 계정 aiceokil@gmail.com 을 쓴다. 수익화 질문에는 "아직 모름"으로 답한다.
- [KIL 1009] PIX 후원은 "그건 없애"(남은 글자까지 모두 지웠다).
- [KIL 1009] 서명키와 Play 파일은 Drive `확장프로그램/SorteMax` 에 저장한다.
- 보고는 한국어로 짧게 한다. 잘 된 것은 한 줄로, 안 된 것과 조심할 것만 번호로 적는다.

## 해 보고 버린 것과 이유
- 원본 파일명 `index.html.html` 을 `index.html` 로 바꿨다. `sw.js` 가 `/index.html` 을 캐시하기 때문이다.
- 시작할 때마다 등록 정보를 지우던 테스트 줄을 삭제했다. 남겨 두면 이메일 화면이 매번 떴다.
- 사용자 도메인의 HTTPS 인증서가 2시간 넘게 발급되지 않았다. Pages 의 Custom domain 을 지웠다가 다시 넣으니 약 10분 만에 발급됐다.
- 앱 안의 예시 당첨 번호(FALLBACK)는 실제 결과로 오해할 수 있어서 지웠다.
- 예전 조합 알고리즘은 낭비가 심했다(12개 번호로 Quadra 를 보장하는 데 42게임). 검증된 최소 설계 표(7게임)로 바꿨다.
- 삼성 인터넷의 웹앱 설치는 Play Protect 에 막힌다("안전하지 않은 앱"). 그래서 삼성에는 manifest 를 주지 않고, Chrome 으로 넘기는 intent 링크를 쓴다.
- 클라우드 작업 환경에서는 Actions 결과물(blob)과 큰 파일의 Drive 업로드가 막혀 있다. 그래서 `android-build`·`play-release` 브랜치의 raw 링크로 받는다.

## 남은 일 (다음에 할 것부터)
1. 신원 확인이 승인되면 전화번호 인증을 하고 앱을 만든다.
   - 이름 "SorteMax Mega: Gerador Grátis", pt-BR, 앱, 무료
2. 앱 설정을 채운다.
   - 개인정보 URL `/privacidade/`
   - 광고 없음, 18+, 도박 = 아니오
   - 데이터 안전: 대략적 위치·앱 상호작용·기기 ID 를 분석용으로 수집
3. 스토어 등록정보를 `SorteMax-loja.zip` 으로 채운다.
4. 비공개 테스트에 AAB 를 올리고 테스터 12명 이상(목표 14~15명)을 넣는다. 14일 뒤 정식 공개를 신청한다.
5. 첫 업로드 뒤 앱 무결성 화면에서 **앱 서명 키 SHA-256** 을 받는다. 이것을 `assetlinks.json` 에 추가하고, sw 캐시를 올려 main 에 배포한다.
6. 옛 주소 폐기는 KIL 이 따로 정한다.

## 공용 자원을 건드리는 것
1. GitHub 저장소: https://github.com/aiceokil-rgb/sortemax (공개). 브랜치는 다음과 같다.
   - main: 사이트
   - android-build: 서명 없는 AAB
   - play-release: 서명한 AAB와 스토어 zip
2. 결과 갱신 봇: `update-data.yml` 이 UTC 기준 하루 10회 `data/` 를 push 한다. Windows 예약 작업은 없다.
3. 도메인·DNS: duriup.com.br 는 Hostinger 에서 관리한다. CNAME `sortemax` 가 `aiceokil-rgb.github.io` 를 가리킨다(바꾸지 않는다).
4. 이메일: contato@duriup.com.br 는 Hostinger 사서함이고, aiceokil@gmail.com 으로 사본이 전달된다.
5. 외부 데이터: Caixa API `servicebus2.caixa.gov.br/portaldeloterias/api/megasena`. 예비로 guidi·heroku 미러를 쓴다.
6. 코드 안의 공개 값(비밀 아님): Google 애널리틱스 `G-7KKRM14D7Y`, Formspree 주소(`index.html` 의 `FORM_URL`).
7. 서명키 `sortemax-upload.jks` 와 비밀번호 안내 txt: Drive `확장프로그램/SorteMax`. 저장소에는 없다.
8. Google Play Console: 개발자 계정 aiceokil@gmail.com, 패키지 `br.com.duriup.sortemax`.
9. 다른 채널 폴더:
   - 두리업 로고를 `icons/duriup-yt.png` 로 한 번 복사했다.
   - 지시문을 Site-Duriup `_교환` 과 @Cine `_교환` 에 한 번씩 보냈다.
   - 지금 계속 읽는 곳은 없다.

API 키·토큰은 없다. 코드·설정에 `D:\ZZ-Channel\…` 절대 경로도 없다(확인함).

## 채널 정보가 바뀔 때
- 3채널(소노·시네·두리업) 이름·주제·로고가 바뀌면 같이 고친다: 앱 배너, 채널 목록(4개 언어), `/baixar/` 페이지, 공유 문구.
- KIL 의 claude.ai 사용자 기본 설정(Settings → 개인 선호사항)은 내가 못 고친다. 바뀐 내용을 넣은 **설정 전체 문구**를 보고에 붙여서 그대로 바꿔 넣을 수 있게 준다.
- 현재 채널:
  - 소노 @sognodargento(이탈리아 60년대 음악)
  - 시네 @CinemaBallad(영화 음악)
  - 두리업 @Duriup(코인·주식, 브라질)
