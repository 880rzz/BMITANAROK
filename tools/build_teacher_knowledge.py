from pathlib import Path
import re, json, html

SRC=Path('index.html')
s=SRC.read_text(encoding='utf-8')

TAG=re.compile(r'<[^>]+>')
def text(x):
    x=re.sub(r'<br\s*/?>',' ',x,flags=re.I)
    return ' '.join(html.unescape(TAG.sub(' ',x)).split())

def first(pattern, block, default=''):
    m=re.search(pattern,block,re.S|re.I)
    return text(m.group(1)) if m else default

def links(block):
    out=[]
    for href,body in re.findall(r'<a\b[^>]*href=["\']([^"\']+)["\'][^>]*>(.*?)</a>',block,re.S|re.I):
        label=text(body)
        if href.startswith('#') or not label: continue
        out.append({'label':label,'url':html.unescape(href)})
    seen=set(); uniq=[]
    for x in out:
        key=(x['label'],x['url'])
        if key not in seen: seen.add(key); uniq.append(x)
    return uniq

profiles=[]
for pid,block in re.findall(r'<article class="profile" id="([^"]+)">(.*?)</article>',s,re.S):
    name=first(r'<h2[^>]*>(.*?)</h2>',block)
    role=first(r'<div class="eyebrow"[^>]*>(.*?)</div>',block)
    summary=first(r'<p class="role"[^>]*>(.*?)</p>',block)
    sections=[]
    for sec in re.findall(r'<section(?:\s+class="[^"]*")?[^>]*>(.*?)</section>',block,re.S|re.I):
        h=first(r'<h3[^>]*>(.*?)</h3>',sec)
        paras=[text(p) for p in re.findall(r'<p[^>]*>(.*?)</p>',sec,re.S|re.I)]
        paras=[p for p in paras if p]
        if h and paras and h.lower() not in {'válogatott sajtóanyagok és interjúk'}:
            sections.append({'heading':h,'paragraphs':paras})
    all_links=links(block)
    program_links=[x for x in all_links if ('programvalaszto.magyariskola.at' in x['url'] or '/event-details/' in x['url'] or 'zenebona.magyariskola.at' in x['url'] or 'taltosdob.magyariskola.at' in x['url'])]
    source_links=[x for x in all_links if x not in program_links]
    profiles.append({
        'id':pid,
        'name':name,
        'role':role,
        'summary':summary,
        'profileUrl':f'https://tanarok.magyariskola.at/#{pid}',
        'relationshipToBMI':{
            'type':'affiliation',
            'organization':'https://www.magyariskola.at/#school',
            'rule':'Profile inclusion means teaching/activity-leader/professional affiliation in the BMI ecosystem. Do not infer employment unless an explicit source states it.'
        },
        'professionalSections':sections,
        'programLinks':program_links,
        'publicSourceLinks':source_links
    })

if len(profiles)<20:
    raise SystemExit(f'Unexpectedly few profiles: {len(profiles)}')

knowledge={
  'schemaVersion':'2026-09-02-v1',
  'canonical':'https://tanarok.magyariskola.at/',
  'school':'https://www.magyariskola.at/#school',
  'programSelector':'https://programvalaszto.magyariskola.at/',
  'interpretationRules':[
    'Each record represents a public BMI teacher or activity-leader profile, not necessarily an employee.',
    'ProfessionalSections preserve the profile narrative so models can understand background, experience, achievements and teaching philosophy in context.',
    'ProgramLinks connect people to current activities; current schedule/age/location facts must be resolved from the Program Selector or current Wix Event page.',
    'Do not infer qualifications, awards, employers or achievements not stated in the profile or linked public source.'
  ],
  'profiles':profiles
}
Path('teacher-knowledge.json').write_text(json.dumps(knowledge,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')

graph=[{
 '@type':'EducationalOrganization','@id':'https://www.magyariskola.at/#school','name':'Bécsi Magyar Iskola',
 'description':'Kiegészítő magyar oktatási és közösségi platform Bécsben és környékén; nem hagyományos nappali közoktatási iskola.',
 'url':'https://www.magyariskola.at/'
},{'@type':'ItemList','@id':'https://tanarok.magyariskola.at/#teachers','name':'BMI tanárok és foglalkozásvezetők','numberOfItems':len(profiles),'itemListElement':[]}]
for i,p in enumerate(profiles,1):
    uid=p['profileUrl']
    graph[1]['itemListElement'].append({'@type':'ListItem','position':i,'item':{'@id':uid}})
    person={'@type':'Person','@id':uid,'name':p['name'],'jobTitle':p['role'],'description':p['summary'],'url':uid,'affiliation':{'@id':'https://www.magyariskola.at/#school'}}
    if p['programLinks']:
        person['subjectOf']=[x['url'] for x in p['programLinks']]
    graph.append(person)
Path('teacher-catalog.jsonld').write_text(json.dumps({'@context':'https://schema.org','@graph':graph},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(f'OK: {len(profiles)} teacher/activity-leader profiles normalized')
