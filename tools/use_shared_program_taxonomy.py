from pathlib import Path
import re

index=Path('index.html')
s=index.read_text(encoding='utf-8')
if 'program-taxonomy.js' not in s:
    m=re.search(r'(<script[^>]+programvalaszto\.magyariskola\.at/zenebona-program\.js[^>]*></script>)',s)
    if not m:
        raise SystemExit('zenebona partner registry script not found')
    tag='<script src="https://programvalaszto.magyariskola.at/program-taxonomy.js?v=20260902-1" defer></script>'
    s=s[:m.end()]+tag+s[m.end():]
s=re.sub(r'teacher-search\.js\?v=[^"\']+','teacher-search.js?v=20260902-six-taxonomy-v2',s)
index.write_text(s,encoding='utf-8')

j=Path('teacher-search.js')
x=j.read_text(encoding='utf-8')
start=x.index('var CATEGORIES=[')
end=x.index('function normalizeUi()',start)
replacement="""var CATEGORIES=[];
function refreshCategories(){
 var cfg=window.BMI_FINDER||{};
 CATEGORIES=(cfg.categories6&&cfg.categories6.length?cfg.categories6:(window.BMI_PROGRAM_TAXONOMY&&window.BMI_PROGRAM_TAXONOMY.categories)||[]).slice();
}
function programCategory(p){return p&&p.primaryCategory6||((window.BMI_PROGRAM_TAXONOMY&&window.BMI_PROGRAM_TAXONOMY.classify)?window.BMI_PROGRAM_TAXONOMY.classify(p):'nyelv')}
"""
x=x[:start]+replacement+x[end:]
x=x.replace("var cfg=window.BMI_FINDER;if(!cfg||!Array.isArray(cfg.programs))return;", "var cfg=window.BMI_FINDER;if(!cfg||!Array.isArray(cfg.programs))return;if(window.BMI_PROGRAM_TAXONOMY&&window.BMI_PROGRAM_TAXONOMY.apply)window.BMI_PROGRAM_TAXONOMY.apply();refreshCategories();if(CATEGORIES.length!==6)return;")
if 'p.primaryCategory6' not in x:
    raise SystemExit('shared taxonomy not used')
if 'szakmai profil ezen a területen releváns' in x:
    raise SystemExit('legacy half-card copy still present')
j.write_text(x,encoding='utf-8')
print('OK: teacher search now consumes shared Program Selector taxonomy')
