# SorteMax 작업 규칙

- 사이트: https://sortemax.duriup.com.br (GitHub Pages 자동 배포)

## 내용 규칙
- 앱 화면 글의 기본 언어는 포르투갈어(브라질). 화면에서 스페인어·영어·한국어로 바꿀 수 있다(4개 언어 모두 함께 고친다).
- 이름·링크는 Duriup 만 쓴다. Mix Mania, mixmania, Caçador de Mercados, cacadordemercados 는 쓰지 않는다.
- 문의 이메일: contato@duriup.com.br
- 비밀번호·키는 저장소에 넣지 않는다.

## 배포 규칙
- 작업은 main 에 바로 반영한다(사이트가 main 에서 배포됨). 브랜치로 올렸다면 main 에 합친 뒤 사이트 확인까지 한다.
- 코드를 고쳐 올릴 때마다 `sw.js` 의 캐시 이름을 하나 올린다(sortemax-v1 → v2 → v3…). 안 올리면 앱을 설치한 사람에게 새 버전이 안 보인다.
- 올린 뒤 1~2분 기다렸다가 사이트에서 바뀐 것이 보이는지 직접 확인하고 보고한다.

## 보고 방식
- 채팅·보고는 한국어로 짧게.
- 잘 된 것은 한 줄, 안 된 것·조심할 것만 번호로 적는다.

## 결과 데이터
- `data/megasena.json`, `data/latest.json` 은 GitHub Actions(`.github/workflows/update-data.yml`)가 Caixa 에서 받아 자동으로 갱신한다. 손으로 고치지 않는다.
- 앱에 가짜·예시 당첨 번호를 넣지 않는다. 최신 결과를 못 받으면 경고를 띄운다.
- 조합(fechamento) 표를 바꾸면 모든 6개 추첨 경우를 전수 검사해 보장을 확인한다.

## 채널 정보가 바뀔 때
- 3채널(소노·시네·두리업) 이름·주제·로고가 바뀌면 같이 고친다: 앱 배너·채널 목록(4개 언어), `/baixar/` 페이지, 공유 문구.
- KIL 의 claude.ai 사용자 기본 설정(Settings → 개인 선호사항)은 내가 못 고친다. 바뀐 내용을 넣은 **설정 전체 문구**를 보고에 붙여서 그대로 바꿔 넣을 수 있게 준다.
- 현재 채널: 소노 @sognodargento(이탈리아 60년대 음악) · 시네 @CinemaBallad(영화 음악) · 두리업 @Duriup(코인·주식, 브라질).
