(function(){'use strict';
function esc(s){return String(s||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function slugText(s){return (s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim()}
function teacherCards(){return Array.from(document.querySelectorAll('.teacher-card')).map(function(a){return {name:(a.querySelector('b')||{}).textContent||'',href:a.getAttribute('href')||'',areas:(a.getAttribute('data-areas')||'').split(',').filter(Boolean),text:a.textContent||''}})}
function inferTeacherAreas(t){if(window.BMI_AREA_ICONS&&window.BMI_AREA_ICONS.infer)return window.BMI_AREA_ICONS.infer(t.text);return t.areas}
function icon(k){var defs=window.BMI_AREA_ICONS&&window.BMI_AREA_ICONS.definitions;var x=defs&&defs[k];if(!x)return '';return '<span class="ts-icon" aria-hidden="true"><svg viewBox="0 0 24 24">'+x[1]+'</svg></span>'}
function label(k){var defs=window.BMI_AREA_ICONS&&window.BMI_AREA_ICONS.definitions;return defs&&defs[k]?defs[k][0]:k}
function cleanTeacherName(raw){return String(raw||'').replace(/,.*$/,'').replace(/\s+és\s+/g,'|').split('|').map(function(x){return x.trim()}).filter(Boolean)}
function mapsUrl(address){return 'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(String(address||'').trim())}
function normalizeUi(){
 var hero=document.querySelector('.hero .actions,.hero-actions,.hero .hero-actions');
 if(hero){
  Array.from(hero.querySelectorAll('a')).forEach(function(a){if((a.textContent||'').trim()==='magyariskola.at')a.textContent='Kezdőlap'});
  var historyLinks=Array.from(hero.querySelectorAll('a')).filter(function(a){return /Iskolánk története/i.test(a.textContent||'')||/hu\.wikipedia\.org\/wiki\/Bécsi_Magyar_Iskola/i.test(a.href||'')});
  var history=historyLinks.shift();
  historyLinks.forEach(function(a){a.remove()});
  if(!history){
   history=document.createElement('a');history.className='btn ghost';history.href='https://hu.wikipedia.org/wiki/Bécsi_Magyar_Iskola';history.target='_blank';history.rel='noopener external';history.textContent='Iskolánk története';
   var finder=Array.from(hero.querySelectorAll('a')).find(function(a){return /Foglalkozást keresek/i.test(a.textContent||'')});
   if(finder&&finder.nextSibling)hero.insertBefore(history,finder.nextSibling);else hero.appendChild(history);
  }
  history.dataset.schoolHistory='1';
 }
 var footer=document.querySelector('.footer .footer-grid > div:first-child');
 if(footer&&!footer.querySelector('.bmi-map-address')){
  var old='A-1010 Wien, Schwedenplatz 2.<br>Bejárat: Laurenzerberg 5 / 1. em., 8–9. ajtó';
  if(footer.innerHTML.indexOf(old)>=0){
   var full='Schwedenplatz 2 / Laurenzerberg 5, 1. em., Top 8–9, 1010 Wien, Austria';
   footer.innerHTML=footer.innerHTML.replace(old,'<a class="bmi-map-address" href="'+mapsUrl(full)+'" target="_blank" rel="noopener external" aria-label="Cím megnyitása a Google Mapsben">A-1010 Wien, Schwedenplatz 2.<br>Bejárat: Laurenzerberg 5 / 1. em., 8–9. ajtó ↗</a>');
  }
 }
 var judit=document.querySelector('#dapin-hajnalka-judit');
 if(judit){
  var ps=Array.from(judit.querySelectorAll('p'));
  ps.forEach(function(p){
   var old='A zenei és terápiás területek végül a zeneterápiában értek össze számomra; ezt 2025 óta a Bécsi Zeneművészeti Egyetemen tanultam.';
   if(p.textContent.indexOf(old)>=0)p.textContent=p.textContent.replace(old,'A zenei és terápiás területek végül a zeneterápiában értek össze számomra; 2017 óta tanultam zeneterápiát a Bécsi Zeneművészeti Egyetemen, ahol 2025-ben szereztem meg a diplomámat.');
  });
 }
}
function init(){
 normalizeUi();
 var cfg=window.BMI_FINDER;if(!cfg||!Array.isArray(cfg.programs))return;
 var anchor=document.querySelector('.index#tanarok,.index[id="tanarok"],section.index');if(!anchor||document.getElementById('terulet-kereso'))return;
 var sec=document.createElement('section');sec.className='teacher-area-search';sec.id='terulet-kereso';
 sec.innerHTML='<div class="wrap"><div class="ts-head"><span class="eyebrow">Gyors kereső</span><h2>Milyen terület érdekel?</h2><p>Válassz egy területet. Megmutatjuk a kapcsolódó tanárokat és a jelenlegi 2026/27-es foglalkozásokat, időponttal és helyszínnel.</p></div><div class="ts-cats" role="list"></div><div class="ts-results" aria-live="polite"></div></div>';
 anchor.parentNode.insertBefore(sec,anchor);
 var cats=sec.querySelector('.ts-cats'),results=sec.querySelector('.ts-results');
 var areas=(cfg.interests||[]).map(function(x){return {id:x.id,label:x.label}});
 var extra=[['pedagogia','Pedagógia'],['szinpad','Színpad és dráma'],['kozosseg','Közösségépítés'],['hagyomany','Hagyomány és identitás'],['vezetes','Vezetés és felelősség']];
 extra.forEach(function(x){if(!areas.some(function(a){return a.id===x[0]}))areas.push({id:x[0],label:x[1]})});
 function render(area){
  Array.from(cats.querySelectorAll('button')).forEach(function(b){b.classList.toggle('active',b.dataset.area===area)});
  var teachers=teacherCards();teachers.forEach(function(t){if(!t.areas.length)t.areas=inferTeacherAreas(t)});
  var programs=cfg.programs.filter(function(p){return (p.interests||[]).indexOf(area)>=0});
  var rows=[];
  programs.forEach(function(p){var names=cleanTeacherName(p.teacher);var matched=teachers.filter(function(t){var tn=slugText(t.name);return names.some(function(n){var nn=slugText(n);return tn.indexOf(nn)>=0||nn.indexOf(tn)>=0})});if(!matched.length){matched=teachers.filter(function(t){return t.areas.indexOf(area)>=0&&slugText(p.teacher).indexOf(slugText(t.name))>=0})}if(!matched.length)rows.push({teacher:p.teacher||'Foglalkozásvezető',href:'',p:p});else matched.forEach(function(t){rows.push({teacher:t.name,href:t.href,p:p})})});
  var areaTeachers=teachers.filter(function(t){return t.areas.indexOf(area)>=0});
  areaTeachers.forEach(function(t){if(!rows.some(function(r){return r.teacher===t.name}))rows.push({teacher:t.name,href:t.href,p:null})});
  rows.sort(function(a,b){return a.teacher.localeCompare(b.teacher,'hu')});
  if(!rows.length){results.innerHTML='<p class="ts-empty">Ehhez a területhez jelenleg nincs közzétett találat.</p>';return}
  results.innerHTML='<div class="ts-result-title">'+icon(area)+'<div><strong>'+esc(label(area))+'</strong><span>'+rows.length+' találat</span></div></div><div class="ts-grid">'+rows.map(function(r){var p=r.p;var location=p&&p.location?String(p.location).trim():'';var locationHtml=location?'<a class="ts-map-link" href="'+esc(mapsUrl(location))+'" target="_blank" rel="noopener external" aria-label="'+esc(location)+' megnyitása a Google Mapsben">'+esc(location)+' ↗</a>':'Aktuális programoldal szerint';return '<article class="ts-card"><div class="ts-person">'+(r.href?'<a href="'+esc(r.href)+'">'+esc(r.teacher)+'</a>':'<strong>'+esc(r.teacher)+'</strong>')+'</div>'+(p?'<a class="ts-program" href="'+esc(p.url)+'" target="_blank" rel="noopener">'+esc(p.name)+'</a><dl><div><dt>Időpont</dt><dd>'+esc(p.when||'Aktuális programoldal szerint')+'</dd></div><div><dt>Helyszín</dt><dd>'+locationHtml+'</dd></div></dl>':'<p class="ts-no-program">A szakmai profil ezen a területen releváns; aktuális kapcsolódó programért nézd meg a Programválasztót.</p>')+'</article>'}).join('')+'</div>';
 }
 areas.forEach(function(a){var b=document.createElement('button');b.type='button';b.dataset.area=a.id;b.innerHTML=icon(a.id)+'<span>'+esc(a.label)+'</span>';b.addEventListener('click',function(){render(a.id)});cats.appendChild(b)});
 if(areas.length)render(areas[0].id);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();