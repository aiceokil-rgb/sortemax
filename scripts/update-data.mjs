// Mega-Sena 결과를 받아 data/megasena.json, data/latest.json 을 최신으로 맞춤.
// 실행: node scripts/update-data.mjs  (GitHub Actions 에서 자동 실행)
import { readFile, writeFile, mkdir } from 'node:fs/promises';

const HIST = 'data/megasena.json';
const LATEST = 'data/latest.json';
const SEED = 'https://raw.githubusercontent.com/guilhermeasn/loteria.json/master/data/megasena.json';
const UA = { 'User-Agent': 'Mozilla/5.0 (SorteMax data bot; contato@duriup.com.br)', 'Accept': 'application/json' };

// 출처 3곳: Caixa 공식 → 공개 API 2곳(같은 Caixa 데이터를 중계)
const SOURCES = [
  { name: 'caixa', url: n => `https://servicebus2.caixa.gov.br/portaldeloterias/api/megasena${n ? '/' + n : ''}`, parse: fromCaixa },
  { name: 'guidi', url: n => `https://api.guidi.dev.br/loteria/megasena/${n || 'ultimo'}`, parse: fromCaixa },
  { name: 'heroku', url: n => `https://loteriascaixa-api.herokuapp.com/api/megasena/${n || 'latest'}`, parse: fromHeroku },
];

function fromCaixa(d) {
  if (!d || !d.numero || !Array.isArray(d.listaDezenas)) throw new Error('formato inválido');
  return {
    concurso: Number(d.numero),
    data: d.dataApuracao,
    dezenas: d.listaDezenas.map(Number),
    acumulado: !!d.acumulado,
    rateio: (d.listaRateioPremio || []).map(p => ({ faixa: p.descricaoFaixa, ganhadores: p.numeroDeGanhadores, premio: p.valorPremio })),
    proximo: { concurso: Number(d.numeroConcursoProximo) || Number(d.numero) + 1, data: d.dataProximoConcurso || null, estimativa: d.valorEstimadoProximoConcurso || 0 },
  };
}
function fromHeroku(d) {
  if (!d || !d.concurso || !Array.isArray(d.dezenas)) throw new Error('formato inválido');
  return {
    concurso: Number(d.concurso),
    data: d.data,
    dezenas: d.dezenas.map(Number),
    acumulado: !!d.acumulou,
    rateio: (d.premiacoes || []).map(p => ({ faixa: p.descricao, ganhadores: p.ganhadores, premio: p.valorPremio })),
    proximo: { concurso: Number(d.proximoConcurso) || Number(d.concurso) + 1, data: d.dataProximoConcurso || null, estimativa: d.valorEstimadoProximoConcurso || 0 },
  };
}

async function getJSON(url) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), 20000);
  try {
    const r = await fetch(url, { headers: UA, signal: ctl.signal });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return await r.json();
  } finally { clearTimeout(t); }
}

function valid(x) {
  const z = x.dezenas;
  return z.length === 6 && new Set(z).size === 6 && z.every(n => Number.isInteger(n) && n >= 1 && n <= 60);
}

const working = [...SOURCES];
async function fetchDraw(n) {
  const errs = [];
  for (const s of working) {
    try {
      const x = s.parse(await getJSON(s.url(n)));
      if (n && x.concurso !== n) throw new Error('concurso diferente');
      if (!valid(x)) throw new Error('dezenas inválidas');
      x.fonte = s.name;
      return x;
    } catch (e) { errs.push(`${s.name}: ${e.message}`); }
  }
  throw new Error(`concurso ${n || 'último'} indisponível — ${errs.join(' | ')}`);
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function main() {
  let hist = { draws: {} };
  try { hist = JSON.parse(await readFile(HIST, 'utf8')); } catch { }
  if (!Object.keys(hist.draws || {}).length) {
    console.log('histórico vazio → semente do GitHub público');
    const seed = await getJSON(SEED);
    hist.draws = {};
    for (const [k, v] of Object.entries(seed)) hist.draws[k] = v.map(Number).sort((a, b) => a - b);
  }
  const latest = await fetchDraw(0);
  console.log(`último concurso: ${latest.concurso} (${latest.data}) via ${latest.fonte}`);
  const have = Object.keys(hist.draws).map(Number);
  const maxHave = have.length ? Math.max(...have) : 0;
  let added = 0, failed = [];
  for (let n = 1; n <= latest.concurso; n++) {
    if (hist.draws[n]) continue;
    if (n < maxHave - 5000) continue;
    try {
      const x = n === latest.concurso ? latest : await fetchDraw(n);
      hist.draws[n] = x.dezenas.slice().sort((a, b) => a - b);
      added++;
      if (added % 25 === 0) console.log(`  +${added} (até ${n})`);
      await sleep(250);
    } catch (e) { failed.push(n); console.log('  falha', e.message); }
  }
  // 동일한지 몇 회차 대조(출처 데이터 검증)
  for (const n of [1, 1500, latest.concurso - 30]) {
    if (!hist.draws[n] || n === latest.concurso) continue;
    try {
      const x = await fetchDraw(n);
      const a = x.dezenas.slice().sort((p, q) => p - q).join(','), b = hist.draws[n].join(',');
      if (a !== b) { console.log(`  DIVERGÊNCIA concurso ${n}: arquivo ${b} / fonte ${a} → corrigido`); hist.draws[n] = a.split(',').map(Number); }
      else console.log(`  conferido concurso ${n}: ok`);
    } catch (e) { console.log('  conferência falhou', e.message); }
  }
  await mkdir('data', { recursive: true });
  const count = Object.keys(hist.draws).length;
  const missing = [];
  for (let n = 1; n <= latest.concurso; n++) if (!hist.draws[n]) missing.push(n);
  const now = new Date().toISOString();
  const sorted = {};
  Object.keys(hist.draws).map(Number).sort((a, b) => a - b).forEach(k => { sorted[k] = hist.draws[k]; });
  await writeFile(HIST, JSON.stringify({ ultimo: latest.concurso, total: count, faltando: missing, draws: sorted }) + '\n');
  latest.dezenas = latest.dezenas.slice();
  // 내용이 그대로면 시각만 바꾸지 않음(쓸데없는 커밋 방지)
  let prev = null;
  try { prev = JSON.parse(await readFile(LATEST, 'utf8')); } catch { }
  const same = prev && JSON.stringify({ ...prev, verificadoEm: 0, fonte: 0 }) === JSON.stringify({ ...latest, verificadoEm: 0, fonte: 0 });
  latest.verificadoEm = same ? prev.verificadoEm : now;
  await writeFile(LATEST, JSON.stringify(latest, null, 1) + '\n');
  console.log(`ok: ${count} concursos, +${added} novos, faltando ${missing.length}`);
  if (missing.length) console.log('faltando:', missing.slice(0, 50).join(','));
}
main().catch(e => { console.error('ERRO:', e.message); process.exit(1); });
