(function(){'use strict';
function esc(s){return String(s||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function slugText(s){return (s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim()}
function teacherCards(){return Array.from(document.querySelectorAll('.teacher-card')).map(function(a){return {name:(a.querySelector('b')||{}).textContent||'',href:a.getAttribute('href')||'',text:a.textContent||''}})}
function icon(k){var defs=window.BMI_AREA_ICONS&&window.BMI_AREA_ICONS.definitions;var x=defs&&defs[k];if(!x)return '';return '<span class="ts-icon" aria-hidden="true"><svg viewBox="0 0 24 24">'+x[1]+'</svg></span>'}
function cleanTeacherNames(raw){return String(raw||'').replace(/\([^)]*\)/g,' ').split(/\s+és\s+|\s*;\s*|\s*\/\s*/).map(function(x){return x.replace(/,.*$/,'').trim()}).filter(Boolean)}
function mapsUrl(address){return 'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(String(address||'').trim())}
var CATEGORIES=[];
function refreshCategories(){
 var cfg=window.BMI_FINDER||{};
 CATEGORIES=(cfg.categories6&&cfg.categories6.length?cfg.categories6:(window.BMI_PROGRAM_TAXONOMY&&window.BMI_PROGRAM_TAXONOMY.categories)||[]).slice();
}
function programCategory(p){return p&&p.primaryCategory6||((window.BMI_PROGRAM_TAXONOMY&&window.BMI_PROGRAM_TAXONOMY.classify)?window.BMI_PROGRAM_TAXONOMY.classify(p):'nyelv')}
function teacherMatchesProgram(t,p){var raw=[p.teacher,p.teacherContact].filter(Boolean).join(' és '),declared=cleanTeacherNames(raw),tn=slugText(t.name);return declared.some(function(n){var nn=slugText(n);return nn&&(tn.indexOf(nn)>=0||nn.indexOf(tn)>=0)})}
function removePartnerProgramsVisualBlock(){Array.from(document.querySelectorAll('section,div')).forEach(function(el){var h=el.querySelector(':scope > h2,:scope > h3,:scope > .wrap > h2,:scope > .wrap > h3');if(!h)return;var txt=slugText(h.textContent||'');if(txt==='partnerprogramok'||txt==='partner programok')el.remove()})}
function syncProfileProgramLinks(cfg,teachers){
 teachers.forEach(function(t){
  if(!t.href||t.href.charAt(0)!=='#')return;
  var profile=document.querySelector(t.href);if(!profile)return;
  var programs=cfg.programs.filter(function(p){return teacherMatchesProgram(t,p)});
  if(!programs.length)return;
  var title=profile.querySelector('.profile-title')||profile.querySelector('.profile-head')||profile;
  var box=title.querySelector('.program-links');
  if(!box){box=document.createElement('div');box.className='program-links';box.innerHTML='<strong>Kapcsolódó program'+(programs.length>1?'ok':'')+'</strong><div class="program-link-list"></div>';title.appendChild(box)}
  var strong=box.querySelector('strong');if(strong)strong.textContent='Kapcsolódó program'+(programs.length>1?'ok':'');
  var list=box.querySelector('.program-link-list');if(!list){list=document.createElement('div');list.className='program-link-list';box.appendChild(list)}
  programs.forEach(function(p){if(!p.url)return;var exists=Array.from(list.querySelectorAll('a')).some(function(a){return a.href===p.url||a.getAttribute('href')===p.url});if(exists)return;var a=document.createElement('a');a.href=p.url;a.target='_blank';a.rel='noopener';a.textContent=p.name;list.appendChild(a)})
 })
}
function normalizeUi(){
 removePartnerProgramsVisualBlock();
 var hero=document.querySelector('.hero .actions,.hero-actions,.hero .hero-actions');
 if(hero){Array.from(hero.querySelectorAll('a')).forEach(function(a){if((a.textContent||'').trim()==='magyariskola.at')a.textContent='Kezdőlap'});var historyLinks=Array.from(hero.querySelectorAll('a')).filter(function(a){return /Iskolánk története/i.test(a.textContent||'')||/hu\.wikipedia\.org\/wiki\/Bécsi_Magyar_Iskola/i.test(a.href||'')});var history=historyLinks.shift();historyLinks.forEach(function(a){a.remove()});if(!history){history=document.createElement('a');history.className='btn ghost';history.href='https://hu.wikipedia.org/wiki/Bécsi_Magyar_Iskola';history.target='_blank';history.rel='noopener external';history.textContent='Iskolánk története';var finder=Array.from(hero.querySelectorAll('a')).find(function(a){return /Foglalkozást keresek/i.test(a.textContent||'')});if(finder&&finder.nextSibling)hero.insertBefore(history,finder.nextSibling);else hero.appendChild(history)}history.dataset.schoolHistory='1'}
 var footer=document.querySelector('.footer .footer-grid > div:first-child');if(footer&&!footer.querySelector('.bmi-map-address')){var old='A-1010 Wien, Schwedenplatz 2.<br>Bejárat: Laurenzerberg 5 / 1. em., 8–9. ajtó';if(footer.innerHTML.indexOf(old)>=0){var full='Schwedenplatz 2 / Laurenzerberg 5, 1. em., Top 8–9, 1010 Wien, Austria';footer.innerHTML=footer.innerHTML.replace(old,'<a class="bmi-map-address" href="'+mapsUrl(full)+'" target="_blank" rel="noopener external" aria-label="Cím megnyitása a Google Mapsben">A-1010 Wien, Schwedenplatz 2.<br>Bejárat: Laurenzerberg 5 / 1. em., 8–9. ajtó ↗</a>')}}
}
function init(){
 normalizeUi();
 var cfg=window.BMI_FINDER;if(!cfg||!Array.isArray(cfg.programs))return;if(window.BMI_PROGRAM_TAXONOMY&&window.BMI_PROGRAM_TAXONOMY.apply)window.BMI_PROGRAM_TAXONOMY.apply();refreshCategories();var teachers=teacherCards();syncProfileProgramLinks(cfg,teachers);if(CATEGORIES.length!==6)return;
 var anchor=document.querySelector('.index#tanarok,.index[id="tanarok"],section.index');if(!anchor||document.getElementById('terulet-kereso'))return;
 var sec=document.createElement('section');sec.className='teacher-area-search';sec.id='terulet-kereso';
 sec.innerHTML='<div class="wrap"><div class="ts-head"><span class="eyebrow">Gyors kereső</span><h2>Milyen terület érdekel?</h2><p>A hat területet a 2026/27-es programkínálat alapján állítottuk össze. Egy tanár vagy foglalkozásvezető csak akkor jelenik meg itt, ha az adott területhez tényleges, aktuális program kapcsolódik.</p></div><div class="ts-cats" role="list"></div><div class="ts-results" aria-live="polite"></div></div>';
 anchor.parentNode.insertBefore(sec,anchor);
 var cats=sec.querySelector('.ts-cats'),results=sec.querySelector('.ts-results');
 function matchTeachers(p){return teachers.filter(function(t){return teacherMatchesProgram(t,p)})}
 function render(area){
  Array.from(cats.querySelectorAll('button')).forEach(function(b){b.classList.toggle('active',b.dataset.area===area)});
  var programs=cfg.programs.filter(function(p){return programCategory(p)===area}),rows=[];
  programs.forEach(function(p){var matched=matchTeachers(p);if(!matched.length)rows.push({teacher:p.teacherContact||p.teacher||'Foglalkozásvezető',href:'',p:p});else matched.forEach(function(t){rows.push({teacher:t.name,href:t.href,p:p})})});
  rows.sort(function(a,b){var c=a.teacher.localeCompare(b.teacher,'hu');return c||String(a.p&&a.p.name||'').localeCompare(String(b.p&&b.p.name||''),'hu')});
  var cat=CATEGORIES.find(function(c){return c.id===area});if(!rows.length){results.innerHTML='<p class="ts-empty">Ehhez a területhez jelenleg nincs közzétett 2026/27-es program.</p>';return}
  results.innerHTML='<div class="ts-result-title">'+icon(area)+'<div><strong>'+esc(cat?cat.label:area)+'</strong><span>'+rows.length+' programkapcsolat</span></div></div><div class="ts-grid">'+rows.map(function(r){var p=r.p,location=p&&p.location?String(p.location).trim():'',locationHtml=location?'<a class="ts-map-link" href="'+esc(mapsUrl(location))+'" target="_blank" rel="noopener external" aria-label="'+esc(location)+' megnyitása a Google Mapsben">'+esc(location)+' ↗</a>':'Aktuális programoldal szerint';return '<article class="ts-card">'+(r.href?'<a class="ts-teacher-link" href="'+esc(r.href)+'" aria-label="'+esc(r.teacher)+' tanári profiljának megnyitása"><span class="ts-teacher-name">'+esc(r.teacher)+'</span><span class="ts-profile-cta">Tanári profil megnyitása →</span></a>':'<div class="ts-teacher-link is-static"><span class="ts-teacher-name">'+esc(r.teacher)+'</span><span class="ts-profile-cta">Foglalkozásvezető</span></div>')+'<a class="ts-program" href="'+esc(p.url)+'" target="_blank" rel="noopener">'+esc(p.name)+'</a><dl><div><dt>Időpont</dt><dd>'+esc(p.when||'Aktuális programoldal szerint')+'</dd></div><div><dt>Helyszín</dt><dd>'+locationHtml+'</dd></div></dl></article>'}).join('')+'</div>';
 }
 CATEGORIES.forEach(function(a){var b=document.createElement('button');b.type='button';b.dataset.area=a.id;b.innerHTML=icon(a.id)+'<span>'+esc(a.label)+'</span>';b.addEventListener('click',function(){render(a.id)});cats.appendChild(b)});render(CATEGORIES[0].id);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();