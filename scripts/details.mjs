// 회차별 상세(날짜·당첨자·상금·추첨 순서)를 data/detalhes.json 에 모음.
// update-data.mjs 가 매번 최신 회차를 넣고, 빠진 회차는 조금씩 채움.
// 한꺼번에 채우기: node scripts/details.mjs --all
import { readFile, writeFile } from 'node:fs/promises';

export const DET = 'data/detalhes.json';
const UA = { 'User-Agent': 'Mozilla/5.0 (SorteMax data bot; contato@duriup.com.br)', 'Accept': 'application/json' };
const SRC = [
  n => `https://servicebus2.caixa.gov.br/portaldeloterias/api/megasena/${n}`,
  n => `https://api.guidi.dev.br/loteria/megasena/${n}`,
];

export async function loadDet() {
  try { return JSON.parse(await readFile(DET, 'utf8')); } catch { return {}; }
}
export async function saveDet(det) {
  const out = {};
  Object.keys(det).map(Number).sort((a, b) => a - b).forEach(k => { out[k] = det[k]; });
  await writeFile(DET, JSON.stringify(out) + '\n');
}

// Caixa 형식 → 짧은 기록 {d:날짜, a:누적, r:[[당첨자,상금]x3], o:[추첨 순서]}
export function compact(raw) {
  const r = (raw.listaRateioPremio || []).slice(0, 3).map(p => [p.numeroDeGanhadores, p.valorPremio]);
  const o = (raw.dezenasSorteadasOrdemSorteio || []).map(Number);
  const x = { d: raw.dataApuracao, a: !!raw.acumulado, r };
  if (o.length === 6) x.o = o;
  return x;
}

async function get(url) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), 20000);
  try {
    const res = await fetch(url, { headers: UA, signal: ctl.signal });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return await res.json();
  } finally { clearTimeout(t); }
}

export async function fetchDet(n, dezenas) {
  for (const s of SRC) {
    try {
      const raw = await get(s(n));
      if (Number(raw.numero) !== n || !raw.dataApuracao) throw new Error('formato');
      const z = (raw.listaDezenas || []).map(Number).sort((a, b) => a - b).join(',');
      if (dezenas && z !== dezenas.join(',')) throw new Error('dezenas diferentes');
      return compact(raw);
    } catch (e) { /* 다음 출처 */ }
  }
  return null;
}

// 빠진 회차를 최대 limit 개 채움
export async function fill(det, draws, limit, sleepMs = 250) {
  let done = 0;
  const keys = Object.keys(draws).map(Number).sort((a, b) => b - a); // 최신부터
  for (const n of keys) {
    if (done >= limit) break;
    if (det[n]) continue;
    const x = await fetchDet(n, draws[n]);
    if (x) { det[n] = x; done++; if (done % 100 === 0) console.log(`  detalhes +${done} (concurso ${n})`); }
    await new Promise(r => setTimeout(r, sleepMs));
  }
  return done;
}

if (process.argv[1] && process.argv[1].endsWith('details.mjs') && process.argv.includes('--all')) {
  const hist = JSON.parse(await readFile('data/megasena.json', 'utf8'));
  const det = await loadDet();
  let total = 0;
  while (true) {
    const n = await fill(det, hist.draws, 200);
    total += n;
    await saveDet(det);
    console.log(`salvo: ${Object.keys(det).length}/${Object.keys(hist.draws).length}`);
    if (n === 0) break;
  }
  console.log('fim, +', total);
}
