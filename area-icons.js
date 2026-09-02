(function(){'use strict';
var I={
nyelv:['Nyelv és kommunikáció','<path d="M4 5.5h16v10H9l-5 4v-4z"/><path d="M8 9h8M8 12h5"/>'],
pedagogia:['Pedagógia','<path d="M4 5.5c3-1 5-.7 8 1.2v12c-3-1.9-5-2.2-8-1.2z"/><path d="M20 5.5c-3-1-5-.7-8 1.2v12c3-1.9 5-2.2 8-1.2z"/>'],
szinpad:['Színpad és dráma','<path d="M5 4h14v12H5z"/><path d="M8 8c1-1 2-1 3 0M13 8c1-1 2-1 3 0M9 12c2 1.5 4 1.5 6 0M4 20h16"/>'],
alkotas:['Alkotás és vizuális művészet','<path d="M4 19l4-.8L19 7.2 16.8 5 5.8 16z"/><path d="M14.8 7l2.2 2.2M4 19h6"/>'],
mozgas:['Mozgás és fejlesztés','<circle cx="12" cy="5" r="2"/><path d="M12 8l-3 4 3 2 2 5M9 12l-4 2M12 10l4 2 3-2"/>'],
tech:['Digitális és technikai terület','<rect x="4" y="5" width="16" height="11" rx="1.5"/><path d="M9 20h6M12 16v4"/>'],
logika:['Logika és stratégia','<rect x="5" y="5" width="14" height="14" rx="2"/><path d="M12 5v14M5 12h14"/>'],
jollet:['Jóllét és önismeret','<path d="M12 20s-7-4.2-7-9a4 4 0 017-2.4A4 4 0 0119 11c0 4.8-7 9-7 9z"/>'],
kozosseg:['Közösségépítés','<circle cx="9" cy="9" r="3"/><circle cx="16.5" cy="10" r="2.5"/><path d="M3.5 19c.8-3.2 3-5 5.5-5s4.7 1.8 5.5 5M14 15c2.8-.7 5.2.8 6 3.5"/>'],
hagyomany:['Hagyomány és identitás','<circle cx="12" cy="12" r="8"/><path d="M12 7l2 4-2 6-2-6z"/>'],
vezetes:['Vezetés és felelősség','<path d="M12 3l7 4v5c0 4.2-2.8 7.2-7 9-4.2-1.8-7-4.8-7-9V7z"/><path d="M9 12l2 2 4-4"/>']};
function svg(k){var x=I[k]||I.kozosseg;return '<span class="bmi-area-icon" title="'+x[0]+'" aria-label="'+x[0]+'"><svg viewBox="0 0 24 24" aria-hidden="true">'+x[1]+'</svg></span>'}
function infer(t){t=(t||'').toLowerCase();var a=[];function add(k){if(a.indexOf(k)<0)a.push(k)}
  if(/dráma|szín|musical|színház|rendez/.test(t))add('szinpad');
  if(/pedagóg|tanár|tanító|nyelv|beszéd|waldorf|montessori/.test(t))add('pedagogia');
  if(/rajz|vizuál|alkot|illusztr/.test(t))add('alkotas');
  if(/mozgás|tánc|jóga|teráp/.test(t))add('mozgas');
  if(/informat|minecraft|film|fotó|office|tech/.test(t))add('tech');
  if(/sakk|logika|stratég/.test(t))add('logika');
  if(/pszich|önismer|jóllét|fókusz/.test(t))add('jollet');
  if(/közöss|cserkész|társulat/.test(t))add('kozosseg');
  if(/néptánc|népzene|hagyomány|cserkész|magyar identit/.test(t))add('hagyomany');
  if(/vezető|igazgató|parancsnok/.test(t))add('vezetes');
  return a.slice(0,3)}
function decorate(el,areas,extra){if(!el||el.querySelector(':scope > .bmi-area-icons'))return;areas=(areas||[]).filter(function(k){return I[k]}).slice(0,3);if(!areas.length)return;var d=document.createElement('span');d.className='bmi-area-icons'+(extra?' '+extra:'');d.innerHTML=areas.map(svg).join('');el.insertBefore(d,el.firstChild)}
function teachers(){document.querySelectorAll('.teacher-card').forEach(function(c){var raw=(c.getAttribute('data-areas')||'').split(',').filter(Boolean);decorate(c,raw.length?raw:infer(c.textContent),'')})}
function programs(){var cfg=window.BMI_FINDER;if(!cfg||!Array.isArray(cfg.programs))return;var els=[].slice.call(document.querySelectorAll('.tile,.result-card,.program-card,.partner-program-card'));cfg.programs.forEach(function(p){var areas=(p.interests||[]).filter(function(k){return I[k]});els.forEach(function(el){if((el.textContent||'').indexOf(p.name)!==-1)decorate(el,areas,'bmi-program-area-icons')})})}
function run(){teachers();programs()}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();new MutationObserver(function(){requestAnimationFrame(run)}).observe(document.documentElement,{childList:true,subtree:true});
window.BMI_AREA_ICONS={definitions:I,decorate:decorate,infer:infer};})();