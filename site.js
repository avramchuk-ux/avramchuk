const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
const paras=s=>String(s||'').split(/\n\s*\n/).filter(Boolean).map(p=>`<p>${esc(p).replace(/\n/g,'<br>')}</p>`).join('');
const link=(url,label,cls='')=>url?`<a ${cls?`class="${cls}"`:''} href="${esc(url)}" target="_blank" rel="noopener">${esc(label)}</a>`:'';
async function load(name){const r=await fetch(`content/${name}.json`,{cache:'no-store'});if(!r.ok)throw new Error(`${name}: ${r.status}`);return r.json()}
function setText(sel,text){const el=$(sel);if(el&&text)el.textContent=text}
function imageOrPlaceholder(src,kind='portrait'){if(src)return `<img class="${kind==='cover'?'book-cover':'portrait'}" src="${esc(src)}" alt="">`;return kind==='cover'?`<div class="cover-placeholder"><small>Book cover</small><strong>Upload cover in /admin</strong><small>Image</small></div>`:`<div class="portrait-placeholder"><span>OA</span></div>`}
function optionalImg(src,cls,alt=''){return src?`<img class="${cls}" src="${esc(src)}" alt="${esc(alt)}">`:''}
function bibBlock(bib){return bib?`<details class="bib-details"><summary>BIB</summary><pre>${esc(bib)}</pre></details>`:''}
function globalUI(site){$$('[data-site-name]').forEach(e=>e.textContent=site.name||'Oleksandr Avramchuk');$$('[data-institution]').forEach(e=>e.textContent=site.institution||'University of Warsaw');const fl=$('#footer-links');if(fl){const xs=[];if(site.email)xs.push(`<a href="mailto:${esc(site.email)}">Email</a>`);if(site.orcid_url)xs.push(link(site.orcid_url,'ORCID'));if(site.scholar_url)xs.push(link(site.scholar_url,'Google Scholar'));if(site.profile_url)xs.push(link(site.profile_url,'Profile'));fl.innerHTML=xs.join(' · ')||'Add contact links in /admin';}
 const btn=$('.menu-toggle'), nav=$('.nav-links'); if(btn&&nav&&!btn.dataset.ready){btn.dataset.ready='1';btn.addEventListener('click',()=>{nav.classList.toggle('open');btn.setAttribute('aria-expanded',nav.classList.contains('open'))})}}
function headerFooter(){return `<header class="site-header"><div class="container nav"><a class="brand" href="index.html" data-site-name>Oleksandr Avramchuk</a><button class="menu-toggle" aria-label="Menu" aria-expanded="false">☰</button><nav class="nav-links" aria-label="Main navigation"><a href="books.html">Books</a><a href="research.html">Research</a><a href="publications.html">Publications</a><a href="teaching.html">Teaching</a><a href="talks.html">Talks &amp; Media</a><a href="about.html">About</a><a href="cv.html">CV</a></nav></div></header>`}
function footer(){return `<footer><div class="container footer-grid"><div><span data-site-name>Oleksandr Avramchuk</span> · <span data-institution>University of Warsaw</span></div><div id="footer-links">Add contact links in /admin</div></div></footer>`}
async function render(){document.body.insertAdjacentHTML('afterbegin',headerFooter());document.body.insertAdjacentHTML('beforeend',footer());try{const site=await load('site');globalUI(site);const page=document.body.dataset.page;if(page==='home')await home(site);if(page==='books')await booksPage();if(page==='research')await researchPage();if(page==='publications')await pubsPage();if(page==='teaching')await teachingPage();if(page==='talks')await talksPage();if(page==='about')await aboutPage();if(page==='cv')await cvPage();}catch(e){console.error(e);const m=$('main');if(m)m.innerHTML=`<div class="container" style="padding:5rem 0"><div class="error-box"><strong>Content could not be loaded.</strong><br>Open this site through a web server (not directly as a local file), or check the JSON files in <code>content/</code>.</div></div>`}}
async function home(site){
  const [books,research,pubs]=await Promise.all([load('books'),load('research'),load('publications')]);
  setText('#hero-eyebrow',site.eyebrow);setText('#hero-name',site.name);setText('#hero-tagline',site.tagline);setText('#hero-intro',site.intro);$('#hero-portrait').innerHTML=imageOrPlaceholder(site.portrait,'portrait');setText('#feature-label',site.home_feature_label);
  const fb=books.items.find(x=>x.featured)||books.items[0];
  if(fb){
    const shortDesc=String(fb.description||'').split(/\n\s*\n/).filter(Boolean)[0]||'';
    $('#feature-book').innerHTML=`<div class="home-feature-book ${fb.cover?'':'no-thumb'}">${fb.cover?`<div>${optionalImg(fb.cover,'home-feature-cover',fb.title)}</div>`:''}<div class="home-feature-copy"><div class="compact-status">${esc(fb.status||'Book')}</div><h2>${esc(fb.title)}</h2>${fb.subtitle?`<h3><em>${esc(fb.subtitle)}</em></h3>`:''}<div class="meta">${esc([fb.publisher,fb.publication_note||fb.year].filter(Boolean).join(' · '))}</div>${shortDesc?`<p>${esc(shortDesc)}</p>`:''}<div class="publication-links"><a href="books.html#${esc(fb.id)}">About</a>${fb.external_url?link(fb.external_url,fb.link_label||'Publisher'):''}</div></div></div>`;
  }
  setText('#research-heading',site.home_research_heading);setText('#research-intro',site.home_research_intro);
  $('#research-grid').innerHTML=research.items.slice(0,4).map(x=>`<article class="research-compact-item"><div class="research-compact-number">${esc(x.number)}</div><div><h3>${esc(x.title)}</h3><p>${esc(x.summary)}</p><a href="research.html#${esc(x.id)}">Read more →</a></div></article>`).join('');
  setText('#pub-heading',site.publications_heading);setText('#pub-intro',site.publications_intro);const fp=pubs.items.filter(x=>x.featured).slice(0,5);$('#home-pubs').innerHTML=fp.map(x=>`<li class="pub-item"><div class="pub-title">${esc(x.title)}</div><div class="meta">${esc(x.meta||x.year||'')}</div></li>`).join('');$('#theme-tags').textContent=(site.theme_tags||[]).join(' · ')
}

async function booksPage(){
  const d=await load('books');
  setText('#page-intro',d.page_intro);
  $('#books-list').innerHTML=`<section><div class="container"><div class="compact-panel">${
    d.items.map((x,i)=>{
      const id=esc(x.id||'book-'+i);
      const thumb=x.cover?`<div>${optionalImg(x.cover,'compact-book-cover',x.title)}</div>`:'';
      const label=x.link_label||'Publisher';
      return `<article class="compact-book-item ${x.cover?'':'no-thumb'}" id="${id}">
        ${thumb}
        <div class="compact-book-copy">
          <div class="compact-status">${esc(x.status||'Book')}</div>
          <h2>${esc(x.title)}</h2>
          ${x.subtitle?`<h3><em>${esc(x.subtitle)}</em></h3>`:''}
          <div class="meta">${esc([x.publisher,x.publication_note||x.year].filter(Boolean).join(' · '))}</div>
          ${paras(x.description)}
          ${x.external_url?`<div class="publication-links">${link(x.external_url,label)}</div>`:''}
        </div>
      </article>`;
    }).join('')
  }</div></div></section>`;
}

async function researchPage(){const d=await load('research');setText('#page-intro',d.page_intro);$('#research-list').innerHTML=d.items.map((x,i)=>`<section id="${esc(x.id||'project-'+i)}"><div class="container"><div class="smallcaps">${esc(x.number||String(i+1).padStart(2,'0'))}</div><h2>${esc(x.title)}</h2><div class="prose">${paras(x.body)}${x.related?`<p><strong>Related:</strong> ${esc(x.related)}</p>`:''}</div></div></section>`).join('')}

async function pubsPage(){
  const d=await load('publications');
  setText('#page-intro',d.page_intro);
  const toolbar=$('#pub-toolbar'), box=$('#pub-groups'), sidebar=$('#pub-sidebar');
  const definitions=[
    {key:'books',label:'Books & editions',types:['Books & editions']},
    {key:'articles',label:'Articles, book chapters & reviews',types:['Peer-reviewed articles','Book chapters','Review essays & reviews']},
    {key:'public',label:'Public history & essays',types:['Public history & essays']},
    {key:'progress',label:'Work in progress',types:['Work in progress']},
    {key:'other',label:'Other',types:['Other']}
  ];
  const groups=definitions.filter(g=>d.items.some(x=>g.types.includes(x.type||'Other')));
  const known=new Set(definitions.flatMap(g=>g.types));
  const extraTypes=[...new Set(d.items.map(x=>x.type||'Other').filter(t=>!known.has(t)))];
  extraTypes.forEach((t,i)=>groups.push({key:`extra-${i}`,label:t,types:[t]}));
  toolbar.innerHTML=`<input id="pub-search" type="search" placeholder="Type to filter" aria-label="Search publications">`;
  sidebar.innerHTML=`<button class="pub-side-btn active" data-group="all">All publications</button>${groups.map(g=>`<button class="pub-side-btn" data-group="${esc(g.key)}">${esc(g.label)}</button>`).join('')}`;
  function renderItem(x){
    const thumb=x.image?optionalImg(x.image,'pub-thumb',x.title):'';
    const ext=x.url?link(x.url,x.link_label||'Link'):'';
    const pdf=x.pdf?link(x.pdf,'PDF'):'';
    const doi=x.doi?link(x.doi.startsWith('http')?x.doi:`https://doi.org/${x.doi}`,'DOI'):'';
    return `<article class="compact-pub-item ${x.image?'':'no-thumb'}">${thumb?`<div>${thumb}</div>`:''}<div class="compact-pub-copy"><div class="pub-title">${esc(x.title)}</div><div class="meta">${esc(x.meta||x.year||'')}</div>${(ext||pdf||doi||x.bibtex)?`<div class="publication-links">${bibBlock(x.bibtex)}${doi}${pdf}${ext}</div>`:''}</div></article>`;
  }
  function draw(groupKey='all',q=''){
    const ql=q.toLowerCase();
    const active=groupKey==='all'?groups:groups.filter(g=>g.key===groupKey);
    box.innerHTML=active.map(g=>{
      const arr=d.items.filter(x=>g.types.includes(x.type||'Other')&&(!ql||[x.title,x.meta,x.type,(x.tags||[]).join(' '),x.year].join(' ').toLowerCase().includes(ql)));
      return arr.length?`<div class="publication-group"><h2>${esc(g.label)}</h2>${arr.map(renderItem).join('')}</div>`:'';
    }).join('')||`<p class="empty">No publications match this search.</p>`;
  }
  let groupKey='all';draw();
  sidebar.addEventListener('click',e=>{if(!e.target.matches('.pub-side-btn'))return;$$('.pub-side-btn',sidebar).forEach(b=>b.classList.remove('active'));e.target.classList.add('active');groupKey=e.target.dataset.group;draw(groupKey,$('#pub-search').value)});
  $('#pub-search').addEventListener('input',e=>draw(groupKey,e.target.value));
}

async function teachingPage(){
  const d=await load('teaching');
  setText('#page-intro',d.page_intro);
  const box=$('#teaching-list'), supervision=$('#supervision-block');
  const courses=d.courses||[];
  if(!courses.length){
    box.innerHTML=`<p class="empty">Add courses in /admin.</p>`;
  }else{
    const groups=[];
    courses.forEach(x=>{
      const key=[x.institution||'',x.period||''].join('||');
      let g=groups.find(y=>y.key===key);
      if(!g){g={key,institution:x.institution||'Teaching',period:x.period||'',items:[]};groups.push(g)}
      g.items.push(x);
    });
    box.innerHTML=groups.map(g=>`<section class="teaching-group"><h2>${esc(g.institution)}</h2>${g.period?`<div class="teaching-period">${esc(g.period)}</div>`:''}<div class="teaching-panel">${g.items.map(x=>`<article class="teaching-item"><div class="teaching-copy"><div class="teaching-title">${esc(x.title)}</div>${(x.level||x.language)?`<div class="meta">${esc([x.level,x.language].filter(Boolean).join(' · '))}</div>`:''}${x.description?`<p>${esc(x.description)}</p>`:''}${x.syllabus_url?`<div class="publication-links">${link(x.syllabus_url,x.link_label||'Syllabus')}</div>`:''}</div></article>`).join('')}</div></section>`).join('');
  }
  if(d.supervision_note){supervision.innerHTML=`<div class="teaching-supervision"><h2>Supervision</h2><p>${esc(d.supervision_note)}</p></div>`}else{supervision.innerHTML=''}
}

async function talksPage(){
  const d=await load('talks');setText('#page-intro',d.page_intro);
  const sidebar=$('#talks-sidebar'), box=$('#talks-groups');
  const definitions=[
    {key:'lectures',label:'Lectures & talks',types:['Lecture','Conference paper','Seminar','Selected lecture']},
    {key:'interviews',label:'Interviews & conversations',types:['Podcast','Interview']},
    {key:'media',label:'Media & public history',types:['Media','Public history']},
    {key:'other',label:'Other',types:['Other']}
  ];
  const groups=definitions.filter(g=>d.items.some(x=>g.types.includes(x.type||'Other')));
  const known=new Set(definitions.flatMap(g=>g.types));
  const extraTypes=[...new Set(d.items.map(x=>x.type||'Other').filter(t=>!known.has(t)))];
  extraTypes.forEach((t,i)=>groups.push({key:`extra-${i}`,label:t,types:[t]}));
  sidebar.innerHTML=`<button class="pub-side-btn active" data-group="all">All talks & media</button>${groups.map(g=>`<button class="pub-side-btn" data-group="${esc(g.key)}">${esc(g.label)}</button>`).join('')}`;
  function guessLabel(x){if(x.link_label)return x.link_label;const t=(x.type||'').toLowerCase();if(t.includes('podcast'))return'Listen';if(t.includes('interview')||t.includes('media'))return'Watch / read';return'Event / media'}
  function item(x){return `<article class="compact-talk-item"><div class="talk-year">${esc(x.date||'')}</div><div class="compact-talk-copy"><div class="pub-title">${esc(x.title)}</div><div class="meta">${esc(x.venue||'')}</div>${x.description?`<p>${esc(x.description)}</p>`:''}${x.url?`<div class="publication-links">${link(x.url,guessLabel(x))}</div>`:''}</div></article>`}
  function draw(key='all'){
    const active=key==='all'?groups:groups.filter(g=>g.key===key);
    box.innerHTML=active.map(g=>{const arr=d.items.filter(x=>g.types.includes(x.type||'Other'));return arr.length?`<div class="talk-group"><h2>${esc(g.label)}</h2>${arr.map(item).join('')}</div>`:''}).join('')||`<p class="empty">Add talks and media items in /admin.</p>`;
  }
  let key='all';draw();
  sidebar.addEventListener('click',e=>{if(!e.target.matches('.pub-side-btn'))return;$$('.pub-side-btn',sidebar).forEach(b=>b.classList.remove('active'));e.target.classList.add('active');key=e.target.dataset.group;draw(key)});
}

async function aboutPage(){const d=await load('about');setText('#page-intro',d.page_intro);$('#about-body').innerHTML=(d.paragraphs||[]).map(p=>`<p>${esc(p)}</p>`).join('');setText('#short-bio',d.short_bio);setText('#organizer-note',d.organizer_note);$('#about-photo').innerHTML=imageOrPlaceholder(d.portrait,'portrait')}
async function cvPage(){const d=await load('cv');setText('#page-intro',d.page_intro);setText('#updated',d.last_updated?`Last updated: ${d.last_updated}`:'');const b=$('#cv-download');if(d.pdf){b.href=d.pdf;b.classList.remove('disabled');b.textContent='Download CV — PDF'}else{b.removeAttribute('href');b.textContent='Upload CV PDF in /admin'}setText('#cv-note',d.note);$('#appointments').innerHTML=(d.appointments||[]).length?(d.appointments||[]).map(x=>`<li><strong>${esc(x.position)}</strong><br>${esc(x.institution)}${x.period?`<div class="meta">${esc(x.period)}</div>`:''}</li>`).join(''):'<li class="empty">Add appointments in /admin.</li>';$('#education').innerHTML=(d.education||[]).length?d.education.map(x=>`<li><strong>${esc(x.degree)}</strong><br>${esc(x.institution)}${x.year?`<div class="meta">${esc(x.year)}</div>`:''}</li>`).join(''):'<li class="empty">Add education in /admin.</li>';$('#areas').innerHTML=(d.research_areas||[]).map(x=>`<span class="tag">${esc(x)}</span>`).join('')}
document.addEventListener('DOMContentLoaded',render);
