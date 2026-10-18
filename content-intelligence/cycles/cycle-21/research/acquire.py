import urllib.request,json,hashlib,datetime,re
from pathlib import Path
from html.parser import HTMLParser
class Text(HTMLParser):
 def __init__(self):super().__init__();self.parts=[];self.skip=0
 def handle_starttag(self,t,a):
  if t in ['script','style']:self.skip+=1
  if t in ['p','h1','h2','h3','h4','div','li','br']:self.parts.append('\n')
 def handle_endtag(self,t):
  if t in ['script','style']:self.skip=max(0,self.skip-1)
 def handle_data(self,d):
  if not self.skip:self.parts.append(d)
base=Path(__file__).parent
sources={
'genomics':'https://pmc.ncbi.nlm.nih.gov/articles/PMC9459311/',
'expression':'https://pmc.ncbi.nlm.nih.gov/articles/PMC8480191/',
'genome2023':'https://academic.oup.com/dnaresearch/article/30/1/dsac047/6909006',
'morphology':'https://www.tandfonline.com/doi/full/10.1080/11250003.2016.1203034',
'smithsonian':'https://invasions.si.edu/nemesis/calnemo/species_summary/-502',
'nhm':'https://www.nhm.ac.uk/discover/immortal-jellyfish-secret-to-cheating-death.html',
'amnh':'https://www.amnh.org/explore/news-blogs/immortal-jellyfish',
'piraino':'https://www.journals.uchicago.edu/doi/10.2307/1543022',
'kubota':'https://repository.kulib.kyoto-u.ac.jp/bitstream/2433/179209/1/Biogeography_13_101.pdf'}
records=[]
for key,url in sources.items():
 try:
  response=urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=40);raw=response.read();ct=response.headers.get('Content-Type','');ext='pdf' if raw[:4]==b'%PDF' else 'html';path=base/(key+'.'+ext);path.write_bytes(raw)
  if ext=='html':
   parser=Text();parser.feed(raw.decode('utf8','replace'));body=re.sub(r'\n[ \t]*\n+', '\n\n',''.join(parser.parts));(base/(key+'.txt')).write_text(body)
  records.append({'sourceId':'source.jellyfish.'+key,'url':url,'resolvedUrl':response.url,'retrievedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'acquisition':'Python urllib actual response body','file':str(path),'sha256':hashlib.sha256(raw).hexdigest(),'bytes':len(raw),'contentType':ct,'access':'acquired; inspection separately recorded'})
  print(key,len(raw),ext)
 except Exception as e:records.append({'sourceId':'source.jellyfish.'+key,'url':url,'access':'failed','error':str(e)});print(key,str(e))
(base/'acquisition.json').write_text(json.dumps(records,indent=2)+'\n')
