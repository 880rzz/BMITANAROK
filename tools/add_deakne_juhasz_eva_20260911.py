from pathlib import Path
import re, json

htmlp = Path('index.html')
s = htmlp.read_text(encoding='utf-8')
assert Path('deakne.webp').exists(), 'deakne.webp missing from repository root'

pid = 'deakne-juhasz-eva'
uid = 'https://tanarok.magyariskola.at/#deakne-juhasz-eva'
profile = '''<article class="profile" id="deakne-juhasz-eva"><div class="profile-head"><figure class="portrait"><img src="deakne.webp" alt="Deákné Juhász Éva portréja" loading="lazy" decoding="async"><span class="fallback">Deákné Juhász Éva portréja</span></figure><div class="profile-title"><div class="eyebrow">Ének-zene tanár · tanító · hangszeres pedagógus</div><h2>Deákné Juhász Éva</h2><p class="role">A magyar nyelv és a zene kapcsolatára építi foglalkozásait: dalokon, meséken, verseken és hangszeres élményeken keresztül fejleszti a 6–14 éves gyermekek szókincsét, beszédét és kifejezőkészségét.</p></div></div><div class="bio-segments"><section class="segment"><h3>Szakmai háttér és legfontosabb tapasztalatok</h3><p>Negyven éve tanít 6–14 éves gyermekeket. Zongora-, tambura-, gitár-, ukulele- és furulyajátékot, magyar irodalmat és nyelvtant, valamint éneket tanít. A Magyar Nemzeti Levéltárban megőrzött rajkai helyi lap pályaképe ének-zene-, zongora- és szolfézstanárként, valamint zenei munkaközösség-vezetőként is bemutatja korábbi rajkai munkáját.</p></section><section class="segment"><h3>Nyelv és zene együtt</h3><p>A gyermekdalokat nyelvtanulási lehetőségként is használja: a dallam, a szófordulatok, a természeti képek, a mesék, versek és történetek egymást erősítve segítik a magyar szókincs, a beszéd és az árnyalt önkifejezés fejlődését. Pedagógiai szemléletében fontos a pozitív megerősítés és az, hogy a gyermek biztonságban hibázhasson, kérdezhessen és próbálkozhasson.</p></section><section class="segment"><h3>Közösségi zene és helytörténet</h3><p>Rajkai közösségi munkájáról több nyilvános forrás is beszámol. A Kisalföld 2014-ben a Rajkai Kulturális Egyesület zenés adventi kalendáriumának ötletgazdájaként és szervezőjeként mutatta be; a programban gyermek- és felnőttkórusok, zenekar és meghívott előadók működtek együtt. 2018-ban a Hőnel Béla Kerékpáros Emléktúra egyik vezetőjeként szerepelt, a Magyar Nemzeti Levéltár pedig rajkai helytörténeti kalauzolását is dokumentálja. Helytörténeti szerzőként az <em>Iskolák Rajkán 1948-ig</em> című, Régmúlt Rajka sorozatban megjelent kötet bibliográfiai rekordjában is szerepel.</p></section></div><section class="press" aria-label="Deákné Juhász Éva válogatott sajtó- és nyilvános megjelenései"><div class="press-head"><span class="eyebrow">Sajtó és nyilvános források</span><h3>Válogatott megjelenések</h3></div><div class="press-grid"><a class="press-card" href="https://www.kisalfold.hu/mosonmagyarovar-es-kornyeke/2014/12/rajkaiak-zenes-adventje" target="_blank" rel="noopener external"><span class="press-medium">Kisalföld · 2014</span><strong>Rajkaiak zenés adventje</strong><span class="press-desc">Portréértékű riport a zenés adventi kalendáriumról, a közösségi zenei szervezésről és saját Adventi gyertyák című szerzeményéről.</span><span class="press-open">Cikk megnyitása ↗</span></a><a class="press-card" href="https://www.kisalfold.hu/gyor-es-kornyeke/2018/09/gyori-nep-es-vilagzenei-fesztival-nyarbucsuztatok-regisegvasar-megyei-programajanlo-a-hetvegere" target="_blank" rel="noopener external"><span class="press-medium">Kisalföld · 2018</span><strong>Hőnel Béla Kerékpáros Emléktúra</strong><span class="press-desc">A Rajkára vezető helytörténeti emléktúra egyik vezetőjeként szerepel a megyei programajánlóban.</span><span class="press-open">Cikk megnyitása ↗</span></a><a class="press-card" href="https://mnl.gov.hu/download/file/fid/573356" target="_blank" rel="noopener external"><span class="press-medium">Rajkai Hírmondó / Magyar Nemzeti Levéltár · 2019</span><strong>Több évtizedes zenei-pedagógiai pálya Rajkán</strong><span class="press-desc">A helyi lap ének-zene-, zongora- és szolfézstanárként, valamint zenei munkaközösség-vezetőként foglalja össze korábbi munkáját.</span><span class="press-open">Forrás megnyitása ↗</span></a></div></section></article>'''

pat = r'<article class="profile" id="' + re.escape(pid) + r'">.*?</article>'
if re.search(pat, s, re.S):
    s = re.sub(pat, profile, s, count=1, flags=re.S)
else:
    assert '</main>' in s, 'main close marker missing'
    s = s.replace('</main>', profile + '\n</main>', 1)

gm = re.search(r'(<div class="teacher-grid">)(.*?)(</div>)', s, re.S)
assert gm, 'teacher-grid missing'
cards = gm.group(2)
if f'href="#{pid}"' not in cards:
    cards += '\n<a class="teacher-card" data-areas="nyelv,zene,pedagogia,hagyomany" href="#deakne-juhasz-eva"><b>Deákné Juhász Éva</b><span>Magyar nyelv · ének-zene · hangszeres pedagógia</span></a>'
s = s[:gm.start()] + gm.group(1) + cards + gm.group(3) + s[gm.end():]

sm = re.search(r'<script type="application/ld\+json">(.*?)</script>', s, re.S)
assert sm, 'inline JSON-LD missing'
data = json.loads(sm.group(1))
graph = data.get('@graph', [])
itemlist = next((x for x in graph if x.get('@id') == 'https://tanarok.magyariskola.at/#teachers'), None)
assert itemlist, 'teacher ItemList missing'
items = itemlist.setdefault('itemListElement', [])
if not any((x.get('item') or {}).get('@id') == uid for x in items):
    items.append({'@type':'ListItem','position':len(items)+1,'item':{'@id':uid}})
for i, x in enumerate(items, 1):
    x['position'] = i
itemlist['numberOfItems'] = len(items)
person_data = {
    '@type':'Person','@id':uid,'name':'Deákné Juhász Éva',
    'jobTitle':'Ének-zene tanár · tanító · hangszeres pedagógus',
    'description':'A magyar nyelvet és a zenét összekapcsoló pedagógiai munkában több évtizedes tapasztalattal rendelkező tanár és foglalkozásvezető.',
    'url':uid,'image':'https://tanarok.magyariskola.at/deakne.webp',
    'affiliation':{'@id':'https://www.magyariskola.at/#school'},
    'knowsAbout':['magyar nyelv','ének-zene','gyermekdal','zongora','tambura','gitár','ukulele','furulya','magyar irodalom','nyelvtan','közösségi zene'],
    'subjectOf':[
        'https://www.kisalfold.hu/mosonmagyarovar-es-kornyeke/2014/12/rajkaiak-zenes-adventje',
        'https://www.kisalfold.hu/gyor-es-kornyeke/2018/09/gyori-nep-es-vilagzenei-fesztival-nyarbucsuztatok-regisegvasar-megyei-programajanlo-a-hetvegere',
        'https://mnl.gov.hu/download/file/fid/573356',
        'https://hebraisztika.elte.hu/site/searchresult?callnumber=69.3.'
    ]
}
person = next((x for x in graph if x.get('@id') == uid), None)
if person:
    person.clear(); person.update(person_data)
else:
    graph.append(person_data)
s = s[:sm.start(1)] + json.dumps(data, ensure_ascii=False, separators=(',', ':')) + s[sm.end(1):]
htmlp.write_text(s, encoding='utf-8')

llm = Path('llms-full.txt')
t = llm.read_text(encoding='utf-8')
line = '- Deákné Juhász Éva — Ének-zene tanár · tanító · hangszeres pedagógus — https://tanarok.magyariskola.at/#deakne-juhasz-eva'
if line not in t:
    anchor = '- Póser-Piroska Ildikó — Csapatparancsnok · ifjúsági közösségi vezető — https://tanarok.magyariskola.at/#poser-piroska-ildiko'
    t = t.replace(anchor, anchor + '\n' + line, 1) if anchor in t else t + '\n' + line + '\n'
llm.write_text(t, encoding='utf-8')

print('Prepared Deákné Juhász Éva profile, press evidence, JSON-LD and LLM index')
