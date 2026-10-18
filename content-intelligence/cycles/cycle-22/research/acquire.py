"""Acquire research-only text; never persist HTML scripts, credentials or URL tokens."""
import datetime, hashlib, json, re, urllib.request
from pathlib import Path
from html.parser import HTMLParser

class Text(HTMLParser):
    def __init__(self):
        super().__init__(); self.parts=[]; self.skip=0
    def handle_starttag(self, tag, attrs):
        if tag in ('script','style','noscript','svg','form'): self.skip+=1
        if tag in ('p','h1','h2','h3','h4','div','li','br','section'): self.parts.append('\n')
    def handle_endtag(self, tag):
        if tag in ('script','style','noscript','svg','form'): self.skip=max(0,self.skip-1)
    def handle_data(self, data):
        if not self.skip: self.parts.append(data)

sources={
 'pietsch1975':'https://www.nature.com/articles/256038a0',
 'pietsch2005':'https://link.springer.com/article/10.1007/s10228-005-0286-2',
 'tol':'https://tolweb.org/Ceratioidei',
 'museum':'https://australian.museum/learn/animals/fishes/triplewart-seadevil-cryptopsaras-couesii-gill-1883/',
 'swann2020':'https://pubmed.ncbi.nlm.nih.gov/32732279/',
 'uw2020':'https://www.washington.edu/news/2020/07/30/deep-sea-anglerfishes-have-evolved-a-new-type-of-immune-system/',
 'brownstein2024':'https://www.cell.com/current-biology/fulltext/S0960-9822(24)00576-1',
 'satow2026':'https://pubmed.ncbi.nlm.nih.gov/42481056/',
 'mpg2026':'https://www.ie-freiburg.mpg.de/6143965/2026_06_23_ERC_Adv_Grant_Thomas_Boehm_en',
 'miya2010':'https://pmc.ncbi.nlm.nih.gov/articles/PMC2836326/',
 'mpg2020':'https://hdl.handle.net/21.11116/0000-0006-CE67-F',
}
base=Path(__file__).parent; records=[]
for key,url in sources.items():
    try:
        response=urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=35)
        raw=response.read(); parser=Text(); parser.feed(raw.decode('utf8','replace'))
        body=re.sub(r'\n[ \t]*\n+', '\n\n',''.join(parser.parts))
        substitutions=[]
        patterns=[r'(?i)([?&](?:token|access_token|api_key|apikey|key|signature|sig|auth|code)=)[^\s&<>"\']+',r'\beyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]+(?:\.[A-Za-z0-9_-]+)?',r'\b(?:sk-|AKIA)[A-Za-z0-9_-]{16,}']
        for pattern in patterns:
            body,n=re.subn(pattern,'[REDACTED INCIDENTAL TOKEN]',body)
            if n: substitutions.append({'rule':pattern,'count':n})
        # Public researcher contact details are irrelevant to the evidence package.
        body,n=re.subn(r'[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}', '[PUBLIC CONTACT OMITTED]',body)
        path=base/(key+'.txt'); path.write_text(body)
        record={'key':key,'url':url,'retrievedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'method':'Actual HTTP response; HTML parser text extraction; scripts/styles/forms/SVG/attributes omitted before any persistence. Raw HTML never saved.','rawResponseSha256':hashlib.sha256(raw).hexdigest(),'retainedPath':str(path),'retainedSha256':hashlib.sha256(body.encode()).hexdigest(),'bytes':len(body.encode()),'sanitization':substitutions,'publicContactRedactions':n,'access':'acquired; body inspection separately required'}
        records.append(record); print(key,len(body),response.status)
    except Exception as e:
        records.append({'key':key,'url':url,'access':'failed','error':str(e)});print(key,str(e))
(base/'acquisition.json').write_text(json.dumps(records,indent=2)+'\n')
