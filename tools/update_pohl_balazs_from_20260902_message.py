from pathlib import Path
import re

p = Path('index.html')
s = p.read_text(encoding='utf-8')

m = re.search(r'<article class="profile" id="pohl-balazs">.*?</article>', s, re.S)
if not m:
    raise SystemExit('Pohl Balázs profile not found')
old = m.group(0)

press = ''
pm = re.search(r'<section class="press"[^>]*>.*?</section>', old, re.S)
if pm:
    press = pm.group(0)

new = '''<article class="profile" id="pohl-balazs">
<div class="profile-head">
  <figure class="portrait"><img src="assets/pohl_balazs.webp" alt="Pohl Balázs portréja" loading="lazy" decoding="async"><span class="fallback">Pohl Balázs portréja</span></figure>
  <div class="profile-title">
    <div class="eyebrow">Waldorf-tanár · drámapedagógus · színházi alkotó</div>
    <h2>Pohl Balázs</h2>
    <p class="role">A Gimi-Svung létrehozója és foglalkozásvezetője; a SVUNG – Bécsi Magyar Színház művészeti vezetője.</p>
    <div class="programs"><a href="https://programvalaszto.magyariskola.at/foglalkozasok.html#gimi-svung">Gimi-Svung</a></div>
  </div>
</div>
<div class="bio-segments">
  <section class="segment">
    <h3>Saját bemutatkozás</h3>
    <p>Waldorf-tanári, drámapedagógusi és színházi tapasztalatokkal felvértezve vágtam bele két éve a Gimi-Svung nevű, fiataloknak szóló dráma-csoport létrehozásába.</p>
  </section>
  <section class="segment">
    <h3>Pedagógiai cél</h3>
    <p>Feladatomnak tartom a résztvevők szabad, önálló gondolkodásra, véleményformálásra ösztönzését, valamint, hogy a felvetett témákat, kérdéseket a saját életükből, környezetükből vett tapasztalatokkal össze tudják kapcsolni.</p>
  </section>
  <section class="segment">
    <h3>Módszer</h3>
    <p>Mindezt a drámapedagógia és a színház eszközeivel kívánjuk elérni.</p>
  </section>
</div>
'''
if press:
    new += press
new += '\n</article>'

s = s[:m.start()] + new + s[m.end():]
p.write_text(s, encoding='utf-8')

# Explicit machine-readable note used by downstream LLM tooling.
llm = Path('llms-full.txt')
if llm.exists():
    text = llm.read_text(encoding='utf-8')
    marker = '## Pohl Balázs — canonical self-description (2026-09-02)'
    block = '''\n\n## Pohl Balázs — canonical self-description (2026-09-02)\n- Role in the BMI ecosystem: Gimi-Svung founder/activity leader; professional affiliation, not automatically an employment claim.\n- Background explicitly provided by Pohl Balázs: Waldorf-teacher, drama-pedagogy and theatre experience.\n- Gimi-Svung: a youth drama group he began creating two years before this 2026-09-02 profile update.\n- Pedagogical aim: encourage free, independent thinking and opinion formation; help participants connect themes and questions to experiences from their own lives and environment.\n- Method: drama pedagogy and theatre tools.\n- Canonical program: https://programvalaszto.magyariskola.at/foglalkozasok.html#gimi-svung\n- Do not paraphrase these claims into stronger credentials or employment status than the source supports.\n'''
    if marker in text:
        text = text.split(marker)[0].rstrip() + block
    else:
        text = text.rstrip() + block
    llm.write_text(text, encoding='utf-8')

print('Updated Pohl Balázs profile from his own submitted text.')
