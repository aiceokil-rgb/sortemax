// 회차별 결과 페이지(/resultado/NNNN/)와 목록·사이트맵을 만든다. 손으로 고치지 않는다.
// 실행: node scripts/build-results.mjs  (update-data.yml 이 결과 갱신 뒤 자동 실행)
// 내용은 data/megasena.json(번호)·data/detalhes.json(날짜·상금)·data/latest.json(다음 회차) 에서만 온다 — 지어낸 값 없음.
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';

const SITE = 'https://sortemax.duriup.com.br';
const GA = 'G-7KKRM14D7Y';
const PER = 200; // 목록 한 쪽에 회차 수

const hist = JSON.parse(await readFile('data/megasena.json', 'utf8'));
const latest = JSON.parse(await readFile('data/latest.json', 'utf8'));
let det = {};
try { det = JSON.parse(await readFile('data/detalhes.json', 'utf8')); } catch { }

const draws = hist.draws;
const nums = Object.keys(draws).map(Number).sort((a, b) => a - b);
const last = nums[nums.length - 1];

const p2 = n => String(n).padStart(2, '0');
const brl = v => 'R$ ' + Number(v || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const DIAS = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
function parseD(s) { const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(s || ''); return m ? new Date(Date.UTC(+m[3], +m[2] - 1, +m[1])) : null; }
const iso = d => d.toISOString().slice(0, 10);

// 각 회차 "이전까지" 번호별 나온 횟수 — 앞에서부터 한 번에 계산
const before = {}; const cnt = Array(61).fill(0);
const seen = new Set();
const repeated = {};
for (const n of nums) {
  before[n] = draws[n].map(z => cnt[z]);
  const key = draws[n].join(',');
  repeated[n] = seen.has(key);
  seen.add(key);
  draws[n].forEach(z => cnt[z]++);
}

const head = (title, desc, path, extra = '') => `<!doctype html>
<html lang="pt-BR"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${SITE}${path}">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${SITE}${path}"><meta property="og:type" content="article"><meta property="og:image" content="${SITE}/baixar/img/og.jpg">
<meta name="theme-color" content="#00a85a"><link rel="icon" href="/icons/icon-192.png">
<link rel="stylesheet" href="/resultado/r.css">${extra}
<script async src="https://www.googletagmanager.com/gtag/js?id=${GA}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA}');</script>
</head><body>
<header class="top"><a class="brand" href="/resultado/"><img src="/icons/icon-192.png" alt="" width="34" height="34"><b>SorteMax</b> Resultados</a><a class="open" href="/?utm_source=resultado&utm_medium=topo">Abrir o app</a></header>
<main>`;

const foot = `</main>
<section class="cta"><h2>Confira seu jogo e gere novos jogos grátis</h2>
<p>No app SorteMax você compara seus números com os resultados, salva seus jogos e gera combinações — sem cadastro e sem login.</p>
<p class="btns"><a class="b1" href="/?utm_source=resultado&utm_medium=cta">Usar o SorteMax grátis</a><a class="b2" href="/baixar/?utm_source=resultado">Como instalar</a></p></section>
<footer><p>Resultados com base nos dados oficiais da Caixa. Confira sempre em <a href="https://loterias.caixa.gov.br" rel="nofollow noopener">loterias.caixa.gov.br</a> antes de qualquer decisão.</p>
<p>O SorteMax é uma ferramenta gratuita da Duriup e não tem vínculo com a Caixa Econômica Federal. 18+ · Jogue com responsabilidade.</p>
<p><a href="/resultado/">Todos os resultados</a> · <a href="/">App SorteMax</a> · <a href="/privacidade/">Privacidade</a> · <a href="mailto:contato@duriup.com.br">contato@duriup.com.br</a></p></footer>
</body></html>
`;

const balls = (z, cls = '') => `<div class="balls ${cls}">${z.map(x => `<span>${p2(x)}</span>`).join('')}</div>`;

function page(n) {
  const z = draws[n], d = det[n] || null, dt = d && parseD(d.d);
  const dataTxt = dt ? `${DIAS[dt.getUTCDay()]}, ${d.d}` : '';
  const zs = z.map(p2).join(' ');
  const title = `Resultado Mega-Sena ${n}${d ? ' (' + d.d + ')' : ''}: ${zs}`;
  const desc = `Mega-Sena concurso ${n}${d ? ', sorteio de ' + d.d : ''}: dezenas ${zs}.${d ? (d.a ? ' Acumulou.' : ' Teve ganhador da Sena.') : ''} Veja ganhadores, prêmios e análise das dezenas.`;
  let h = head(title, desc, `/resultado/${n}/`);
  h += `<nav class="crumb"><a href="/">Início</a> › <a href="/resultado/">Resultados</a> › Concurso ${n}</nav>`;
  h += `<h1>Resultado da Mega-Sena ${n}</h1>`;
  if (dataTxt) h += `<p class="date">Sorteio de ${dataTxt}</p>`;
  h += balls(z, 'big');
  if (d && d.o) h += `<p class="ord">Ordem do sorteio: ${d.o.map(p2).join(' · ')}</p>`;
  if (d) h += `<p class="tag ${d.a ? 'acc' : 'win'}">${d.a ? 'Acumulou! Ninguém acertou as 6 dezenas.' : 'Teve ganhador(es) da Sena!'}</p>`;
  if (d && d.r && d.r.length) {
    const fx = ['Sena (6 acertos)', 'Quina (5 acertos)', 'Quadra (4 acertos)'];
    h += `<section class="card"><h2>Ganhadores e prêmios</h2><table><thead><tr><th>Faixa</th><th>Ganhadores</th><th>Prêmio por ganhador</th></tr></thead><tbody>`;
    d.r.forEach((r, i) => { h += `<tr><td>${fx[i] || ''}</td><td>${Number(r[0] || 0).toLocaleString('pt-BR')}</td><td>${r[0] ? brl(r[1]) : '—'}</td></tr>`; });
    h += `</tbody></table></section>`;
  }
  if (n === last && latest.proximo && latest.concurso === n) {
    const pr = latest.proximo;
    h += `<section class="card next"><h2>Próximo concurso: ${pr.concurso}</h2><p>${pr.data ? 'Sorteio em ' + esc(pr.data) + '. ' : ''}${pr.estimativa ? 'Prêmio estimado: <b>' + brl(pr.estimativa) + '</b>.' : ''}</p><p class="small">Estimativa divulgada pela Caixa; pode mudar.</p></section>`;
  }
  const even = z.filter(x => x % 2 === 0).length, sum = z.reduce((a, b) => a + b, 0);
  h += `<section class="card"><h2>Análise das dezenas</h2><ul class="facts"><li>Soma das dezenas: <b>${sum}</b></li><li>Pares e ímpares: <b>${even} pares · ${6 - even} ímpares</b></li><li>Essa mesma combinação já tinha saído antes? <b>${repeated[n] ? 'Sim' : 'Não'}</b></li></ul>`;
  h += `<p>Quantas vezes cada dezena já tinha saído antes deste concurso (${n - 1 >= 1 ? 'concursos 1 a ' + (n - 1) : 'primeiro concurso'}):</p><div class="cnts">${z.map((x, i) => `<span><b>${p2(x)}</b>${before[n][i]}×</span>`).join('')}</div>`;
  h += `<p class="small">Cada sorteio é independente: o histórico não muda a chance de nenhum número sair.</p></section>`;
  h += `<nav class="pn">${draws[n - 1] ? `<a href="/resultado/${n - 1}/">← Concurso ${n - 1}</a>` : '<span></span>'}<a href="/resultado/">Todos</a>${draws[n + 1] ? `<a href="/resultado/${n + 1}/">Concurso ${n + 1} →</a>` : '<span></span>'}</nav>`;
  return h + foot;
}

function listPage(k, pages) {
  const desc_ = nums.slice().reverse();
  const part = desc_.slice((k - 1) * PER, k * PER);
  const path = k === 1 ? '/resultado/' : `/resultado/p/${k}/`;
  const title = k === 1 ? `Resultados da Mega-Sena: todos os concursos (último: ${last})` : `Resultados da Mega-Sena: concursos ${part[part.length - 1]} a ${part[0]}`;
  const desc = `Lista de resultados da Mega-Sena${k === 1 ? ', do último concurso ' + last + ' ao primeiro' : ', concursos ' + part[part.length - 1] + ' a ' + part[0]}. Dezenas sorteadas, datas e prêmios.`;
  let h = head(title, desc, path);
  h += `<nav class="crumb"><a href="/">Início</a> › Resultados${k > 1 ? ' › página ' + k : ''}</nav><h1>${k === 1 ? 'Resultados da Mega-Sena' : 'Resultados da Mega-Sena — concursos ' + part[part.length - 1] + ' a ' + part[0]}</h1>`;
  if (k === 1) {
    const d = det[last];
    h += `<section class="card hi"><h2><a href="/resultado/${last}/">Último resultado: concurso ${last}</a></h2>${d ? `<p class="date">${esc(d.d)}</p>` : ''}${balls(draws[last], 'big')}${d ? `<p class="tag ${d.a ? 'acc' : 'win'}">${d.a ? 'Acumulou!' : 'Teve ganhador(es) da Sena!'}</p>` : ''}<p><a href="/resultado/${last}/">Ver ganhadores e prêmios →</a></p></section>`;
  }
  h += `<ul class="list">` + part.map(n => `<li><a href="/resultado/${n}/"><span class="n">${n}</span><span class="d">${det[n] ? det[n].d : ''}</span><span class="z">${draws[n].map(p2).join(' ')}</span></a></li>`).join('') + `</ul>`;
  h += `<nav class="pages">` + Array.from({ length: pages }, (_, i) => i + 1).map(i => i === k ? `<b>${i}</b>` : `<a href="${i === 1 ? '/resultado/' : `/resultado/p/${i}/`}">${i}</a>`).join(' ') + `</nav>`;
  return h + foot;
}

const CSS = `:root{--bg:#eef4f0;--card:#fff;--t1:#0d1f16;--t2:#476356;--t3:#8aa197;--g:#00a85a;--g2:#008549;--gold:#c88400;--red:#e0344d;--line:#dbe7e0}
@media (prefers-color-scheme:dark){:root{--bg:#050c08;--card:#0d1a12;--t1:#e8f3ec;--t2:#a5c2b2;--t3:#6f8c7c;--line:#1d3226}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--t1);font:16px/1.55 system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif}
a{color:var(--g2)}@media (prefers-color-scheme:dark){a{color:#3fd68a}}
.top{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 16px;background:var(--card);border-bottom:1px solid var(--line);position:sticky;top:0}
.brand{display:flex;align-items:center;gap:8px;text-decoration:none;color:var(--t1);font-size:17px}.brand img{border-radius:50%}
.open{background:var(--g);color:#fff;text-decoration:none;padding:8px 14px;border-radius:999px;font-weight:700;font-size:14px;white-space:nowrap}
main,.cta,footer{max-width:760px;margin:0 auto;padding:0 16px}
.crumb{font-size:13px;color:var(--t3);margin:14px 0 4px}.crumb a{color:var(--t2)}
h1{font-size:26px;line-height:1.2;margin:6px 0}h2{font-size:18px;margin:0 0 10px}
.date{color:var(--t2);margin:0 0 12px}
.balls{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0}.balls span{width:44px;height:44px;border-radius:50%;background:var(--g);color:#fff;display:grid;place-items:center;font-weight:800;font-size:17px}
.balls.big span{width:52px;height:52px;font-size:20px}
.ord{font-size:14px;color:var(--t2);margin:4px 0}
.tag{display:inline-block;padding:6px 12px;border-radius:10px;font-weight:700;font-size:14px}.tag.acc{background:#fde8ec;color:var(--red)}.tag.win{background:#e2f7ec;color:var(--g2)}
.card{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:16px;margin:16px 0}.card.hi{border-color:var(--g)}
table{width:100%;border-collapse:collapse;font-size:15px}th,td{text-align:left;padding:8px 6px;border-bottom:1px solid var(--line)}th{color:var(--t2);font-weight:600;font-size:13px}td:last-child,th:last-child{text-align:right}
.facts{margin:0 0 10px;padding-left:18px}.cnts{display:flex;flex-wrap:wrap;gap:8px}.cnts span{border:1px solid var(--line);border-radius:10px;padding:6px 10px;font-size:14px}.cnts b{margin-right:6px}
.small{font-size:13px;color:var(--t3)}
.pn{display:flex;justify-content:space-between;gap:8px;margin:18px 0;font-weight:600}
.list{list-style:none;margin:16px 0;padding:0;background:var(--card);border:1px solid var(--line);border-radius:16px;overflow:hidden}
.list a{display:grid;grid-template-columns:56px 96px 1fr;gap:6px;padding:10px 14px;border-bottom:1px solid var(--line);text-decoration:none;color:var(--t1);font-size:15px}
.list .n{font-weight:800;color:var(--g2)}.list .d{color:var(--t2)}.list .z{font-variant-numeric:tabular-nums;letter-spacing:.5px}
@media (max-width:420px){.list a{grid-template-columns:50px 1fr}.list .z{grid-column:2}}
.pages{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0 20px}.pages a,.pages b{padding:6px 10px;border:1px solid var(--line);border-radius:8px;text-decoration:none}.pages b{background:var(--g);color:#fff;border-color:var(--g)}
.cta{margin-top:10px}.cta h2{font-size:20px}.cta .btns{display:flex;flex-wrap:wrap;gap:10px}
.b1,.b2{padding:12px 18px;border-radius:12px;font-weight:700;text-decoration:none}.b1{background:var(--g);color:#fff}.b2{border:2px solid var(--g);color:var(--g2)}
footer{font-size:13px;color:var(--t3);padding-top:16px;padding-bottom:30px}
`;

// 쓰기 (예전 회차 폴더는 그대로 덮어씀)
await rm('resultado', { recursive: true, force: true });
await mkdir('resultado', { recursive: true });
await writeFile('resultado/r.css', CSS);
for (const n of nums) {
  await mkdir(`resultado/${n}`, { recursive: true });
  await writeFile(`resultado/${n}/index.html`, page(n));
}
const pages = Math.ceil(nums.length / PER);
for (let k = 1; k <= pages; k++) {
  const dir = k === 1 ? 'resultado' : `resultado/p/${k}`;
  await mkdir(dir, { recursive: true });
  await writeFile(`${dir}/index.html`, listPage(k, pages));
}

// 사이트맵: 고정 페이지 + 목록 + 회차 전부
const lastD = det[last] && parseD(det[last].d) ? iso(parseD(det[last].d)) : new Date().toISOString().slice(0, 10);
const urls = [
  [`${SITE}/`, lastD], [`${SITE}/baixar/`, '2026-11-03'], [`${SITE}/privacidade/`, '2026-10-31'],
  [`${SITE}/resultado/`, lastD],
  ...Array.from({ length: pages - 1 }, (_, i) => [`${SITE}/resultado/p/${i + 2}/`, lastD]),
  ...nums.slice().reverse().map(n => { const d = det[n] && parseD(det[n].d); return [`${SITE}/resultado/${n}/`, d ? iso(d) : lastD]; }),
];
await writeFile('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` + urls.map(([u, d]) => `  <url><loc>${u}</loc><lastmod>${d}</lastmod></url>`).join('\n') + `\n</urlset>\n`);
console.log(`resultado: ${nums.length} concursos, ${pages} páginas de lista, detalhes ${Object.keys(det).length}`);
