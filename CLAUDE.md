# SorteMax 작업 규칙 (시작 안내)

이 파일을 먼저 읽고 시작한다. 작업을 끝낼 때마다 "지금 상태"·"남은 일"·새 결정을 갱신한다. 대화가 압축된 뒤에는 이 파일을 다시 연다.

## 이 앱이 무엇인가
브라질 Mega-Sena 번호 생성 PWA(설치형 웹앱, 4개 언어). 사이트: https://sortemax.duriup.com.br (GitHub Pages 자동 배포). 소개·설치 안내는 `/baixar/`.
**지금 상태 (2026-10-12):** 웹앱 v2.3.3 운영 중, 결과 데이터는 자동 갱신(최근 concurso 3069). Android(Play) 앱은 TWA 프로젝트와 서명 없는 AAB 빌드까지만 준비됨.

## 폴더 구조
- `index.html` 앱 본체 한 파일 / `manifest.json` / `sw.js`(서비스워커, 캐시 이름 `sortemax-vNN`)
- `baixar/` 설치 안내(4개 언어) / `privacidade/` 개인정보 처리방침
- `data/megasena.json`, `data/latest.json` 당첨 결과(자동 갱신, 손대지 않음) / `scripts/update-data.mjs` 갱신 스크립트
- `icons/` 아이콘·채널 로고·QR / `.well-known/assetlinks.json` Play 앱 연결
- `android/` TWA 프로젝트 / `.github/workflows/` `update-data.yml`(결과 갱신, 하루 여러 번), `build-android.yml`(수동만)
- `CNAME` = `sortemax.duriup.com.br` (지우지 않는다)

## 실행·배포 방법
- 로컬 확인: 저장소 폴더에서 `python -m http.server 8080` → http://localhost:8080
- 배포: `git add -A && git commit -m "…" && git push` (main → Pages 자동 배포, 1~2분)
- 결과 갱신 수동 실행: Actions → "Atualizar resultados Mega-Sena" → Run workflow
- Android AAB: Actions → "Build Android (Play)" 수동 실행 → `android-build` 브랜치에 서명 없는 AAB

## 내용 규칙
- 앱 화면 글의 기본 언어는 포르투갈어(브라질). 화면에서 스페인어·영어·한국어로 바꿀 수 있다(4개 언어 모두 함께 고친다).
- 이름·링크는 Duriup 만 쓴다. Mix Mania, mixmania, Caçador de Mercados, cacadordemercados 는 쓰지 않는다.
- 문의 이메일: contato@duriup.com.br
- 비밀번호·키는 저장소에 넣지 않는다.

## 배포 규칙
- 작업은 main 에 바로 반영한다(사이트가 main 에서 배포됨). 브랜치로 올렸다면 main 에 합친 뒤 사이트 확인까지 한다.
- 코드를 고쳐 올릴 때마다 `sw.js` 의 캐시 이름을 하나 올린다(지금 v11 → v12…). 안 올리면 앱을 설치한 사람에게 새 버전이 안 보인다.
- main 에 올린 직후 다른 브랜치를 같이 push 하지 않는다(그때 GitHub Pages 배포가 두 번 실패함). 배포가 실패하면 "pages build and deployment" 를 한 번 다시 돌린다.
- 올린 뒤 1~2분 기다렸다가 사이트에서 바뀐 것이 보이는지 직접 확인하고 보고한다.

## 결과 데이터
- `data/*.json` 은 GitHub Actions 가 Caixa 에서 받아 자동 갱신한다. 손으로 고치지 않는다.
- 앱에 가짜·예시 당첨 번호를 넣지 않는다. 최신 결과를 못 받으면 경고를 띄운다.
- 조합(fechamento) 표를 바꾸면 모든 6개 추첨 경우를 전수 검사해 보장을 확인한다.

## KIL 과 정한 결정
- [KIL 1007] SorteMax 를 공개 GitHub 저장소(aiceokil-rgb/sortemax)로 옮기고 GitHub Pages 로 배포, 주소는 sortemax.duriup.com.br. 이후 수정은 클라우드 클코에서 저장소로.
- [KIL 1007] 문의 이메일 info@mixmania.blog → contato@duriup.com.br, 유튜브 링크 @cacadordemercados → @Duriup, 배너 이름·썸네일도 Duriup 으로. 옛 주소 sortemax.mixmania.blog 는 건드리지 않는다(폐기는 따로).
- [KIL 1008] 두리업 사이트 위쪽 메뉴의 "App SorteMax (grátis)" 는 `/baixar/` 로 새 탭에서 열린다(두리업 사이트를 벗어나지 않게).
- 보고는 한국어로 짧게. 잘 된 것은 한 줄, 안 된 것·조심할 것만 번호로.

## 해 보고 버린 것과 이유
- 원본 파일명 `index.html.html`(확장자 중복) → `index.html` 로 바꿈. `sw.js` 가 `/index.html` 을 캐시하므로 안 바꾸면 오프라인 대체가 깨진다.
- 시작 때마다 등록 정보를 지우던 테스트 줄(`localStorage.removeItem('sortemax_reg')`)은 배포 전에 삭제함. 남겨 두면 이메일 입력 화면이 매번 뜬다.
- 사용자 도메인 HTTPS 인증서가 2시간 넘게 안 나옴 → Pages 의 Custom domain 을 지웠다 다시 넣으니 약 10분 안에 발급. 같은 일이 생기면 먼저 이 방법.
- Samsung Internet 은 WebAPK 설치가 Play Protect 에 막혀 설치 방식을 따로 둠(v2.2.2). PIX 후원 기능은 제거함(v2.3.1·v2.3.3).
- 같은 주소에서 코드를 바꿀 때 `sw.js` 캐시 이름을 안 올리면 기존 사용자에게 갱신이 안 보임.

## 남은 일 (다음에 할 것부터)
1. Play 스토어용 AAB 는 서명이 없다. 서명 키를 만들고 Play Console 에 올리는 일은 KIL 과 정한 뒤 진행(키 파일은 저장소에 넣지 않는다 — `.gitignore` 로 막혀 있음). 서명 후 `.well-known/assetlinks.json` 의 지문을 맞춘다.
2. 클라우드 클코가 이 저장소에 접근 가능한지(GitHub 설정의 Claude 앱 설치 범위)는 확인하지 않았다 — 접근이 안 되면 그때 확인.
3. 옛 주소(sortemax.mixmania.blog) 폐기는 KIL 이 따로 정한다.

## 공용 자원을 건드리는 것
- GitHub 저장소: https://github.com/aiceokil-rgb/sortemax (공개, main 에서 Pages 배포). 결과 갱신 봇이 하루 여러 번 `data/` 를 직접 push 한다 → 작업 전 `git pull`.
- 도메인·DNS: duriup.com.br 의 DNS 는 Hostinger. CNAME `sortemax` → `aiceokil-rgb.github.io` (바꾸지 않는다).
- 이메일: contato@duriup.com.br 는 Hostinger 사서함이고 aiceokil@gmail.com 으로 사본 전달된다.
- 코드 안에 공개로 들어 있는 값(비밀 아님): Google 애널리틱스 `G-7KKRM14D7Y`, 문의 폼 Formspree 주소(`index.html` 의 `FORM_URL`).
- API 키·토큰: 없음(코드·저장소에 두지 않는다). Windows 예약 작업: 없음. 다른 채널 폴더(@Sono·@Cine·@Duriup·본부)를 읽는 곳: 없음.
- 코드·설정에 `D:\ZZ-Channel\…` 절대 경로는 없음(확인함).

## 채널 정보가 바뀔 때
- 3채널(소노·시네·두리업) 이름·주제·로고가 바뀌면 같이 고친다: 앱 배너·채널 목록(4개 언어), `/baixar/` 페이지, 공유 문구.
- KIL 의 claude.ai 사용자 기본 설정(Settings → 개인 선호사항)은 내가 못 고친다. 바뀐 내용을 넣은 **설정 전체 문구**를 보고에 붙여서 그대로 바꿔 넣을 수 있게 준다.
- 현재 채널: 소노 @sognodargento(이탈리아 60년대 음악) · 시네 @CinemaBallad(영화 음악) · 두리업 @Duriup(코인·주식, 브라질).
