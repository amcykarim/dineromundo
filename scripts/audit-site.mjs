import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const issues=[];
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>['.git','.agents'].includes(e.name)?[]:e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
const files=walk(root),pages=files.filter(f=>f.endsWith('.html')),indexable=pages.filter(f=>path.basename(f)!=='404.html');
const unique={title:new Map(),description:new Map(),canonical:new Map()};
const extract=(html,re)=>(html.match(re)||[])[1]||'';
for(const file of pages){
  const html=fs.readFileSync(file,'utf8'),rel=path.relative(root,file);
  if(!/<html lang="es">/i.test(html))issues.push(['lang',rel]);
  if((html.match(/<h1\b/gi)||[]).length!==1)issues.push(['h1',rel]);
  if(!html.includes('href="#contenido"'))issues.push(['skip-link',rel]);
  if(!html.includes('rel="icon"'))issues.push(['favicon',rel]);
  for(const match of html.matchAll(/href="([^"]*)"/g)){
    let url=match[1];
    if(!url)issues.push(['empty-href',rel]);
    if(/^(https?:|mailto:|tel:|#)/.test(url))continue;
    url=url.split(/[?#]/)[0];if(!url)continue;
    let target=path.resolve(path.dirname(file),url);if(url.endsWith('/'))target=path.join(target,'index.html');
    if(!fs.existsSync(target))issues.push(['broken-link',rel,match[1]]);
  }
  for(const match of html.matchAll(/(?:src|href)="([^"]+)"/g)){
    if(/^(https?:|mailto:|tel:|#)/.test(match[1]))continue;
    const url=match[1].split(/[?#]/)[0];if(!url)continue;
    let target=path.resolve(path.dirname(file),url);if(url.endsWith('/'))target=path.join(target,'index.html');
    if(!fs.existsSync(target))issues.push(['broken-asset',rel,match[1]]);
  }
  for(const json of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)){try{JSON.parse(json[1])}catch{issues.push(['jsonld',rel])}}
  if(path.basename(file)==='404.html')continue;
  const values={title:extract(html,/<title>([^<]+)<\/title>/i),description:extract(html,/<meta name="description" content="([^"]+)"/i),canonical:extract(html,/<link rel="canonical" href="([^"]+)"/i)};
  for(const [kind,value] of Object.entries(values)){if(!value)issues.push([`missing-${kind}`,rel]);else if(unique[kind].has(value))issues.push([`duplicate-${kind}`,rel,unique[kind].get(value)]);else unique[kind].set(value,rel)}
  if(!/^https:\/\/dineromundo\.com\/(?:$|[^?#]*\/$)/.test(values.canonical))issues.push(['canonical-format',rel,values.canonical]);
  for(const property of ['og:type','og:title','og:description','og:url','og:site_name','og:locale'])if(!html.includes(`<meta property="${property}"`))issues.push(['missing-og',rel,property]);
  const faqSchemas=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m=>{try{return JSON.parse(m[1])}catch{return null}}).filter(x=>x?.['@type']==='FAQPage');
  if(faqSchemas.length){const visible=[...html.matchAll(/<details><summary>(.*?)<\/summary><p>(.*?)<\/p><\/details>/g)];const entities=faqSchemas.flatMap(x=>x.mainEntity||[]);if(visible.length!==entities.length)issues.push(['faq-count',rel]);else visible.forEach((m,i)=>{if(m[1]!==entities[i].name||m[2]!==entities[i].acceptedAnswer?.text)issues.push(['faq-match',rel,i])})}
}
const forbidden=/localhost|file:\/\/|C:\\Users\\|href="#"|#proximamente|Cargando|api[_-]?key\s*=|password\s*=|token\s*=/i;
for(const file of files.filter(f=>f.endsWith('.html')||f.endsWith('.css')||(f.endsWith('.js')&&!f.endsWith('.mjs')))){const text=fs.readFileSync(file,'utf8');if(forbidden.test(text)||/\bTODO\b/.test(text))issues.push(['forbidden-reference',path.relative(root,file)])}
const sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8'),urls=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]),expected=indexable.map(f=>{const rel=path.relative(root,f).replaceAll('\\','/');return rel==='index.html'?'https://dineromundo.com/':`https://dineromundo.com/${rel.replace(/index\.html$/,'')}`});
if(urls.length!==expected.length||new Set(urls).size!==urls.length)issues.push(['sitemap-count',urls.length,expected.length]);for(const url of expected)if(!urls.includes(url))issues.push(['sitemap-missing',url]);if(urls.some(u=>u.includes('404.html')))issues.push(['sitemap-404']);
const robots=fs.readFileSync(path.join(root,'robots.txt'),'utf8').replace(/\r/g,'').trim();if(robots!=='User-agent: *\nAllow: /\n\nSitemap: https://dineromundo.com/sitemap.xml')issues.push(['robots']);
console.log(JSON.stringify({htmlPages:pages.length,indexablePages:indexable.length,sitemapUrls:urls.length,uniqueTitles:unique.title.size,uniqueDescriptions:unique.description.size,uniqueCanonicals:unique.canonical.size,issues},null,2));
if(issues.length)process.exit(1);
