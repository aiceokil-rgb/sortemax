#!/bin/sh
# 공용 원본 자체광고.json → 공개본 house-ads.json 복사·배포 [1128]
# 쓰는 법: 원본을 고친 방이 SorteMax 방에 "자체광고 바뀜" 이라고 알리면 이 파일 하나 실행.
set -e
cd "$(dirname "$0")/.."
SRC="D:/ZZ-Local/AppDev/_공용/자체광고.json"
node -e "JSON.parse(require('fs').readFileSync(process.argv[1],'utf8'))" "$SRC"   # 깨진 JSON 은 안 올림
if cmp -s "$SRC" house-ads.json; then echo "이미 같음"; exit 0; fi
cp "$SRC" house-ads.json
git add house-ads.json
git commit -q -m "house-ads.json: 공용 자체광고.json 원본과 맞춤"
git pull -q --rebase && git push -q
echo "올림 — 1~2분 뒤 https://sortemax.duriup.com.br/house-ads.json"
