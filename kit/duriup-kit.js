/* Duriup 웹앱 공용 부품 v1 [SorteMax 1127, 기획부 1127 웹배포 공동지시]
 * 한 파일로 세 가지를 붙인다 (5개 언어 pt·es·en·ko·zh, 바깥 라이브러리 없음):
 *  1) 서로 광고 띠  — 공용 자체광고.json 목록에서 자기 앱을 뺀 live 항목을 한 줄 띠로 돌려 보임 + "우리 앱 더 보기" 화면
 *  2) 의견 보내기    — 짧은 폼(Formspree 같은 JSON POST 주소) / WhatsApp 링크 / 이메일 중 있는 것만
 *  3) 아이폰 설치 안내 — iPhone·iPad Safari 에서 아직 설치 안 했으면 "공유 → 홈 화면에 추가" 그림 안내(7일에 한 번)
 * 쓰는 법: README.md. 원본은 AppDev\_공용\웹부품\ — 앱에는 복사해 쓰고, 고칠 것은 원본에 고쳐 다시 복사.
 */
(function(){
'use strict';
var T={
 pt:{how:'Ver como',more:'Mais apps',moreTitle:'Mais apps da Duriup',open:'Abrir',close:'Fechar',fb:'Enviar opinião',fbTitle:'Sua opinião',fbSub:'O que achou fácil, difícil ou o que faltou? Uma frase já ajuda muito.',fbPh:'Escreva aqui…',fbSend:'Enviar',fbOk:'Obrigado! Recebemos sua opinião.',fbFail:'Não deu para enviar agora. Tente pelo WhatsApp ou e-mail.',fbEmpty:'Escreva pelo menos algumas palavras.',fbWa:'WhatsApp',fbMail:'E-mail',fbOr:'ou',insTitle:'Instale no iPhone',insSub:'Use como app, direto da tela de início:',ins1:'Toque em Compartilhar',ins1b:'(o quadrado com a seta, embaixo ou no topo do Safari)',ins2:'Escolha "Adicionar à Tela de Início"',ins2b:'(role a lista para baixo se não aparecer)',ins3:'Toque em "Adicionar"',ins3b:'O ícone aparece na tela de início.',later:'Agora não',ok:'Entendi',insSafari:'No iPhone, abra este site no Safari para instalar.'},
 es:{how:'Ver cómo',more:'Más apps',moreTitle:'Más apps de Duriup',open:'Abrir',close:'Cerrar',fb:'Enviar opinión',fbTitle:'Tu opinión',fbSub:'¿Qué te pareció fácil, difícil o qué faltó? Una frase ya ayuda mucho.',fbPh:'Escribe aquí…',fbSend:'Enviar',fbOk:'¡Gracias! Recibimos tu opinión.',fbFail:'No se pudo enviar ahora. Prueba por WhatsApp o e-mail.',fbEmpty:'Escribe al menos unas palabras.',fbWa:'WhatsApp',fbMail:'E-mail',fbOr:'o',insTitle:'Instala en el iPhone',insSub:'Úsala como app, desde la pantalla de inicio:',ins1:'Toca Compartir',ins1b:'(el cuadrado con la flecha, abajo o arriba en Safari)',ins2:'Elige "Agregar a inicio"',ins2b:'(desliza la lista hacia abajo si no aparece)',ins3:'Toca "Agregar"',ins3b:'El ícono aparece en la pantalla de inicio.',later:'Ahora no',ok:'Entendido',insSafari:'En el iPhone, abre este sitio en Safari para instalar.'},
 en:{how:'Show me',more:'More apps',moreTitle:'More Duriup apps',open:'Open',close:'Close',fb:'Send feedback',fbTitle:'Your feedback',fbSub:'What was easy, hard or missing? One sentence already helps a lot.',fbPh:'Write here…',fbSend:'Send',fbOk:'Thank you! We got your feedback.',fbFail:'Could not send right now. Try WhatsApp or e-mail.',fbEmpty:'Please write at least a few words.',fbWa:'WhatsApp',fbMail:'E-mail',fbOr:'or',insTitle:'Install on iPhone',insSub:'Use it like an app, right from your home screen:',ins1:'Tap Share',ins1b:'(the square with the arrow, at the bottom or top of Safari)',ins2:'Choose "Add to Home Screen"',ins2b:'(scroll the list down if you don\'t see it)',ins3:'Tap "Add"',ins3b:'The icon appears on your home screen.',later:'Not now',ok:'Got it',insSafari:'On iPhone, open this site in Safari to install.'},
 ko:{how:'방법 보기',more:'앱 더 보기',moreTitle:'두리업 앱 더 보기',open:'열기',close:'닫기',fb:'의견 보내기',fbTitle:'의견 보내기',fbSub:'쉬웠던 것, 어려웠던 것, 있었으면 하는 것 — 한 줄이면 충분해요.',fbPh:'여기에 적어 주세요…',fbSend:'보내기',fbOk:'고맙습니다! 의견을 받았어요.',fbFail:'지금은 보내지 못했어요. WhatsApp 이나 이메일로 보내 주세요.',fbEmpty:'몇 글자라도 적어 주세요.',fbWa:'WhatsApp',fbMail:'이메일',fbOr:'또는',insTitle:'아이폰에 설치하기',insSub:'홈 화면에서 앱처럼 바로 열 수 있어요:',ins1:'공유 버튼을 누르세요',ins1b:'(Safari 아래나 위의 네모에 화살표)',ins2:'"홈 화면에 추가"를 고르세요',ins2b:'(안 보이면 목록을 아래로 내리세요)',ins3:'"추가"를 누르세요',ins3b:'홈 화면에 아이콘이 생겨요.',later:'나중에',ok:'알겠어요',insSafari:'아이폰에서는 Safari 로 이 사이트를 열어야 설치할 수 있어요.'},
 zh:{how:'查看方法',more:'更多应用',moreTitle:'Duriup 的更多应用',open:'打开',close:'关闭',fb:'发送意见',fbTitle:'您的意见',fbSub:'哪里好用、哪里难用、还缺什么?一句话就很有帮助。',fbPh:'在这里写…',fbSend:'发送',fbOk:'谢谢!我们收到了您的意见。',fbFail:'暂时无法发送。请通过 WhatsApp 或电子邮件发送。',fbEmpty:'请至少写几个字。',fbWa:'WhatsApp',fbMail:'电子邮件',fbOr:'或',insTitle:'在 iPhone 上安装',insSub:'像应用一样从主屏幕直接打开:',ins1:'点"分享"',ins1b:'(Safari 底部或顶部带箭头的方框)',ins2:'选择"添加到主屏幕"',ins2b:'(看不到就把列表往下滑)',ins3:'点"添加"',ins3b:'图标会出现在主屏幕上。',later:'以后再说',ok:'知道了',insSafari:'在 iPhone 上请用 Safari 打开本网站来安装。'}
};
var C={app:'',appName:'',lang:function(){return 'pt';},track:function(){},houseUrl:'',houseFallback:null,formUrl:'',whatsapp:'5511955994522',email:'',stripMount:null,fbMount:null,iosGuide:true,rotateMs:6000,storePrefix:'dk_'};
var ADS=[],idx=0,timer=null;
function L(){var l=(C.lang&&C.lang())||'pt';return T[l]?l:'pt';}
function t(k){return T[L()][k]||T.pt[k]||k;}
function ls(k,v){try{if(v===undefined)return localStorage.getItem(C.storePrefix+k);localStorage.setItem(C.storePrefix+k,v);}catch(e){return null;}}
function tr(ev,p){try{C.track(ev,p||{});}catch(e){}}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function line(a){return (a.line&&(a.line[L()]||a.line.pt))||'';}
function okUrl(u){return typeof u==='string'&&/^https:\/\//.test(u);}

/* ── 모양: 앱의 색 변수가 있으면 따르고, 없으면 기본값 ── */
function css(){
 if(document.getElementById('dk-css'))return;
 var s=document.createElement('style');s.id='dk-css';
 s.textContent=
 '.dk-strip{display:flex;align-items:center;gap:8px;margin:14px 0 6px;padding:8px 10px;border:1px solid var(--bd,rgba(127,127,127,.22));border-radius:14px;background:var(--surf2,rgba(127,127,127,.06));font-size:13px;line-height:1.3}'+
 '.dk-ad{flex:1;min-width:0;display:flex;align-items:center;gap:10px;color:inherit;text-decoration:none}'+
 '.dk-ad img{width:30px;height:30px;border-radius:8px;flex:none;object-fit:cover;background:var(--surf3,rgba(127,127,127,.12))}'+
 '.dk-ad b{display:block;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'+
 '.dk-ad span{display:block;color:var(--t2,inherit);opacity:.85;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:12px}'+
 '.dk-ad div{min-width:0;transition:opacity .25s}.dk-ad.fade div,.dk-ad.fade img{opacity:0}'+
 '.dk-btn{flex:none;border:1px solid var(--bd2,rgba(127,127,127,.3));background:transparent;color:inherit;border-radius:10px;padding:7px 10px;font:inherit;font-size:12px;font-weight:600;cursor:pointer;min-height:34px}'+
 '.dk-fbbtn{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--greenB,var(--bd2,rgba(127,127,127,.3)));background:var(--greenT,transparent);color:inherit;border-radius:12px;padding:10px 14px;font:inherit;font-weight:700;cursor:pointer;min-height:44px}'+
 '.dk-ov{position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.45);display:flex;align-items:flex-end;justify-content:center;padding:12px}'+
 '@media(min-width:600px){.dk-ov{align-items:center}}'+
 '.dk-sh{width:100%;max-width:440px;max-height:86vh;overflow:auto;background:var(--bg2,#fff);color:var(--t1,#111);border-radius:20px;padding:18px 16px 16px;box-shadow:0 10px 40px rgba(0,0,0,.3);font-size:14px;line-height:1.45}'+
 '.dk-sh h3{margin:0 0 4px;font-size:18px}.dk-sh p.dk-sub{margin:0 0 12px;color:var(--t2,inherit);opacity:.9}'+
 '.dk-sh textarea{width:100%;box-sizing:border-box;min-height:110px;border:1px solid var(--bd2,rgba(127,127,127,.35));border-radius:12px;padding:10px;font:inherit;background:var(--surf2,transparent);color:inherit;resize:vertical}'+
 '.dk-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:12px}'+
 '.dk-p{flex:1;min-height:44px;border:0;border-radius:12px;background:var(--green,#00a85a);color:var(--onAccent,#fff);font:inherit;font-weight:700;cursor:pointer;padding:0 14px;text-align:center;text-decoration:none;display:inline-flex;align-items:center;justify-content:center}'+
 '.dk-s{min-height:44px;border:1px solid var(--bd2,rgba(127,127,127,.35));border-radius:12px;background:transparent;color:inherit;font:inherit;font-weight:600;cursor:pointer;padding:0 14px;text-decoration:none;display:inline-flex;align-items:center;justify-content:center}'+
 '.dk-msg{margin-top:10px;font-weight:600}.dk-or{opacity:.7;font-size:12px;margin:12px 0 0}'+
 '.dk-list{display:flex;flex-direction:column;gap:8px}'+
 '.dk-item{display:flex;align-items:center;gap:12px;padding:10px;border:1px solid var(--bd,rgba(127,127,127,.22));border-radius:14px;color:inherit;text-decoration:none}'+
 '.dk-item img{width:44px;height:44px;border-radius:11px;flex:none;object-fit:cover}'+
 '.dk-item div{flex:1;min-width:0}.dk-item b{display:block}.dk-item span{display:block;font-size:12px;opacity:.8}'+
 '.dk-item em{font-style:normal;font-size:12px;font-weight:700;color:var(--green,#00a85a);flex:none}'+
 '.dk-steps{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:12px}'+
 '.dk-steps li{display:flex;gap:12px;align-items:flex-start}'+
 '.dk-ic{flex:none;width:48px;height:48px;border-radius:12px;background:var(--surf2,rgba(127,127,127,.08));border:1px solid var(--bd,rgba(127,127,127,.22));display:flex;align-items:center;justify-content:center;color:#0a84ff}'+
 '.dk-steps b{display:block}.dk-steps small{display:block;opacity:.75;font-size:12px}'+
 '.dk-ios{position:fixed;left:12px;right:12px;bottom:12px;z-index:9998;max-width:440px;margin:0 auto;background:var(--bg2,#fff);color:var(--t1,#111);border:1px solid var(--bd2,rgba(127,127,127,.3));border-radius:16px;padding:12px;box-shadow:0 8px 30px rgba(0,0,0,.25);display:flex;gap:10px;align-items:center;font-size:13px}'+
 '.dk-ios div{flex:1}.dk-ios b{display:block;font-size:14px}';
 document.head.appendChild(s);
}
var IC_SHARE='<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="M8 7l4-4 4 4"/><path d="M6 11H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-1"/></svg>';
var IC_ADD='<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3.5" y="3.5" width="17" height="17" rx="4"/><path d="M12 8v8M8 12h8"/></svg>';
var IC_OK='<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7"/></svg>';

/* ── 띄우는 화면(시트) 하나 ── */
function sheet(html,onOpen){
 var ov=document.createElement('div');ov.className='dk-ov';ov.setAttribute('role','dialog');ov.setAttribute('aria-modal','true');
 ov.innerHTML='<div class="dk-sh">'+html+'</div>';
 function close(){if(ov.parentNode)ov.parentNode.removeChild(ov);document.removeEventListener('keydown',key);}
 function key(e){if(e.key==='Escape')close();}
 ov.addEventListener('click',function(e){if(e.target===ov||e.target.hasAttribute('data-dk-close'))close();});
 document.addEventListener('keydown',key);
 document.body.appendChild(ov);
 if(onOpen)onOpen(ov.firstChild,close);
 return close;
}

/* ── 1) 서로 광고 띠 + 우리 앱 더 보기 ── */
function pick(list){
 return (list||[]).filter(function(a){return a&&a.live&&a.id!==C.app&&okUrl(a.url)&&a.name;});
}
function adHref(a){var u=a.url;try{var x=new URL(u);if(C.app&&!x.searchParams.get('utm_medium'))x.searchParams.set('utm_medium',C.app);u=x.toString();}catch(e){}return u;}
function renderStrip(){
 var m=C.stripMount;if(!m)return;
 if(!ADS.length){m.innerHTML='';return;}
 if(idx>=ADS.length)idx=0;
 var a=ADS[idx];
 m.innerHTML='<div class="dk-strip"><a class="dk-ad" target="_blank" rel="noopener"><img alt="" loading="lazy"><div><b></b><span></span></div></a><button type="button" class="dk-btn" data-dk-more></button></div>';
 fillAd(m,a);
 m.querySelector('[data-dk-more]').textContent=t('more');
 m.querySelector('[data-dk-more]').onclick=function(){openApps();};
 m.querySelector('.dk-ad').onclick=function(){tr('house_ad_click',{ad_id:ADS[idx]&&ADS[idx].id,place:'strip'});};
}
function fillAd(m,a){
 var el=m.querySelector('.dk-ad');el.href=adHref(a);
 var im=el.querySelector('img');if(a.icon){im.src=a.icon;im.style.display='';}else im.style.display='none';im.alt=a.name;
 el.querySelector('b').textContent=a.name;el.querySelector('span').textContent=line(a);
}
function rotate(){
 if(ADS.length<2||!C.stripMount)return;
 var el=C.stripMount.querySelector('.dk-ad');if(!el)return;
 el.classList.add('fade');
 setTimeout(function(){idx=(idx+1)%ADS.length;fillAd(C.stripMount,ADS[idx]);el.classList.remove('fade');},260);
}
function openApps(){
 tr('house_more_open',{});
 var h='<h3>'+esc(t('moreTitle'))+'</h3><p class="dk-sub"></p><div class="dk-list">';
 ADS.forEach(function(a,i){h+='<a class="dk-item" data-i="'+i+'" target="_blank" rel="noopener"><img alt="" loading="lazy"><div><b></b><span></span></div><em>'+esc(t('open'))+' ›</em></a>';});
 h+='</div><div class="dk-row"><button type="button" class="dk-s" style="flex:1" data-dk-close>'+esc(t('close'))+'</button></div>';
 sheet(h,function(box){
  box.querySelectorAll('.dk-item').forEach(function(it){
   var a=ADS[+it.getAttribute('data-i')];it.href=adHref(a);
   var im=it.querySelector('img');if(a.icon)im.src=a.icon;else im.style.visibility='hidden';im.alt=a.name;
   it.querySelector('b').textContent=a.name;it.querySelector('span').textContent=line(a);
   it.onclick=function(){tr('house_ad_click',{ad_id:a.id,place:'more'});};
  });
 });
}
function loadAds(){
 if(C.houseFallback)ADS=pick(C.houseFallback);
 renderStrip();
 if(!C.houseUrl)return;
 try{fetch(C.houseUrl,{cache:'no-cache'}).then(function(r){return r.ok?r.json():null;}).then(function(j){
  var list=pick(j&&j.ads);if(list.length){ADS=list;idx=0;renderStrip();}
 }).catch(function(){});}catch(e){}
}

/* ── 2) 의견 보내기 ── */
function waHref(text){var n=String(C.whatsapp||'').replace(/\D/g,'');return n?'https://wa.me/'+n+'?text='+encodeURIComponent('['+(C.appName||C.app)+'] '+(text||'')):'';} // 받는 쪽이 어느 앱 의견인지 알게 앞에 [앱 이름]
function mailHref(text){return C.email?'mailto:'+C.email+'?subject='+encodeURIComponent((C.appName||C.app)+' — '+t('fbTitle'))+'&body='+encodeURIComponent(text||''):'';}
function openFeedback(from){
 tr('feedback_open',{from:from||''});
 var h='<h3>'+esc(t('fbTitle'))+'</h3><p class="dk-sub">'+esc(t('fbSub'))+'</p>';
 if(C.formUrl)h+='<textarea maxlength="2000" placeholder="'+esc(t('fbPh'))+'"></textarea><div class="dk-row"><button type="button" class="dk-s" data-dk-close>'+esc(t('close'))+'</button><button type="button" class="dk-p" data-dk-send>'+esc(t('fbSend'))+'</button></div><div class="dk-msg" aria-live="polite"></div>';
 var alt='';
 if(C.whatsapp)alt+='<a class="dk-s" data-dk-wa target="_blank" rel="noopener">'+esc(t('fbWa'))+'</a>';
 if(C.email)alt+='<a class="dk-s" data-dk-mail>'+esc(t('fbMail'))+'</a>';
 if(alt)h+=(C.formUrl?'<p class="dk-or">'+esc(t('fbOr'))+'</p>':'')+'<div class="dk-row" style="margin-top:6px">'+alt+(C.formUrl?'':'<button type="button" class="dk-s" data-dk-close>'+esc(t('close'))+'</button>')+'</div>';
 sheet(h,function(box,close){
  var ta=box.querySelector('textarea'),msg=box.querySelector('.dk-msg');
  function cur(){return ta?ta.value.trim():'';}
  var wa=box.querySelector('[data-dk-wa]'),ml=box.querySelector('[data-dk-mail]');
  function sync(){if(wa)wa.href=waHref(cur());if(ml)ml.href=mailHref(cur());}
  sync();if(ta){ta.addEventListener('input',sync);setTimeout(function(){try{ta.focus();}catch(e){}},50);}
  if(wa)wa.onclick=function(){tr('feedback_whatsapp',{});};
  if(ml)ml.onclick=function(){tr('feedback_email',{});};
  var sb=box.querySelector('[data-dk-send]');
  if(sb)sb.onclick=function(){
   var v=cur();if(v.length<3){msg.textContent=t('fbEmpty');ta.focus();return;}
   sb.disabled=true;msg.textContent='…';
   fetch(C.formUrl,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},
    body:JSON.stringify({_subject:(C.appName||C.app)+' — opinião / feedback',tipo:'feedback',app:C.app,mensagem:v,idioma:L(),pagina:location.pathname+location.search,instalado:standalone()?'sim':'nao'})})
   .then(function(r){if(!r.ok)throw new Error(r.status);msg.textContent=t('fbOk');ta.value='';ta.disabled=true;sb.style.display='none';tr('feedback_sent',{lang:L()});})
   .catch(function(){msg.textContent=t('fbFail');sb.disabled=false;tr('feedback_fail',{});});
  };
 });
}
function renderFbButton(){
 var m=C.fbMount;if(!m)return;
 m.innerHTML='<button type="button" class="dk-fbbtn">💬 <span></span></button>';
 m.querySelector('span').textContent=t('fb');
 m.firstChild.onclick=function(){openFeedback('button');};
}

/* ── 3) 아이폰 "홈 화면에 추가" 안내 ── */
function isIOS(){var u=navigator.userAgent||'';return /iPhone|iPad|iPod/.test(u)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);}
function standalone(){try{return (window.matchMedia&&matchMedia('(display-mode: standalone)').matches)||navigator.standalone===true;}catch(e){return false;}}
function isSafari(){var u=navigator.userAgent||'';return /Safari/.test(u)&&!/CriOS|FxiOS|EdgiOS|OPiOS|GSA\/|FBAN|FBAV|Instagram|Line\//.test(u);}
function openInstall(from){
 tr('ios_guide_open',{from:from||''});
 var h='<h3>'+esc(t('insTitle'))+'</h3><p class="dk-sub">'+esc(t('insSub'))+'</p>';
 if(isIOS()&&!isSafari())h+='<p class="dk-msg" style="margin:0 0 12px">'+esc(t('insSafari'))+'</p>';
 h+='<ol class="dk-steps"><li><span class="dk-ic">'+IC_SHARE+'</span><div><b>1. '+esc(t('ins1'))+'</b><small>'+esc(t('ins1b'))+'</small></div></li>'+
  '<li><span class="dk-ic">'+IC_ADD+'</span><div><b>2. '+esc(t('ins2'))+'</b><small>'+esc(t('ins2b'))+'</small></div></li>'+
  '<li><span class="dk-ic">'+IC_OK+'</span><div><b>3. '+esc(t('ins3'))+'</b><small>'+esc(t('ins3b'))+'</small></div></li></ol>'+
  '<div class="dk-row"><button type="button" class="dk-p" data-dk-close>'+esc(t('ok'))+'</button></div>';
 sheet(h);
}
function iosNudge(){
 if(!C.iosGuide||!isIOS()||standalone())return;
 var last=+(ls('ios_seen')||0);if(Date.now()-last<7*864e5)return;
 setTimeout(function(){
  if(document.querySelector('.dk-ov,.dk-ios'))return;
  var b=document.createElement('div');b.className='dk-ios';
  b.innerHTML='<span class="dk-ic">'+IC_ADD+'</span><div class="dk-tx"><b></b><span></span></div><button type="button" class="dk-btn" data-x></button><button type="button" class="dk-p" style="flex:none" data-go></button>';
  b.querySelector('b').textContent=t('insTitle');b.querySelector('.dk-tx span').textContent=t('insSub');
  b.querySelector('[data-x]').textContent=t('later');b.querySelector('[data-go]').textContent=t('how');
  function done(){ls('ios_seen',String(Date.now()));if(b.parentNode)b.parentNode.removeChild(b);}
  b.querySelector('[data-x]').onclick=function(){done();tr('ios_guide_later',{});};
  b.querySelector('[data-go]').onclick=function(){done();openInstall('nudge');};
  document.body.appendChild(b);tr('ios_guide_shown',{});
 },4000);
}

/* ── 밖에서 부르는 것 ── */
window.DuriupKit={
 version:'1.0.2',
 init:function(opt){
  for(var k in opt)if(Object.prototype.hasOwnProperty.call(opt,k))C[k]=opt[k];
  if(typeof C.stripMount==='string')C.stripMount=document.querySelector(C.stripMount);
  if(typeof C.fbMount==='string')C.fbMount=document.querySelector(C.fbMount);
  css();loadAds();renderFbButton();iosNudge();
  clearInterval(timer);timer=setInterval(rotate,C.rotateMs);
  document.addEventListener('click',function(e){
   var x=e.target.closest&&e.target.closest('[data-dk-feedback],[data-dk-install],[data-dk-apps]');if(!x)return;
   e.preventDefault();
   if(x.hasAttribute('data-dk-feedback'))openFeedback('link');else if(x.hasAttribute('data-dk-install'))openInstall('link');else openApps();
  });
 },
 relang:function(){renderStrip();renderFbButton();},
 openFeedback:openFeedback,openInstall:openInstall,openApps:openApps,
 isIOS:isIOS,isStandalone:standalone,strings:T
};
})();
