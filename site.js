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
  const sidebar=$('#books-sidebar'), box=$('#books-groups');
  const definitions=[
    {key:'academic',label:'Academic books',categories:['Academic books']},
    {key:'edited',label:'Edited volumes & source editions',categories:['Edited volumes & source editions']},
    {key:'public',label:'Public history books',categories:['Public history books']}
  ];
  const groups=definitions.filter(g=>d.items.some(x=>g.categories.includes(x.category||'Academic books')));
  sidebar.innerHTML=`<button class="pub-side-btn active" data-group="all">All books</button>${groups.map(g=>`<button class="pub-side-btn" data-group="${esc(g.key)}">${esc(g.label)}</button>`).join('')}`;
  function item(x,i){
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
  }
  function draw(key='all'){
    const active=key==='all'?groups:groups.filter(g=>g.key===key);
    box.innerHTML=active.map(g=>{
      const arr=d.items.filter(x=>g.categories.includes(x.category||'Academic books'));
      return arr.length?`<div class="book-group"><h2>${esc(g.label)}</h2><div class="compact-panel">${arr.map(item).join('')}</div></div>`:'';
    }).join('')||`<p class="empty">Add books in /admin.</p>`;
  }
  let key='all'; draw();
  sidebar.addEventListener('click',e=>{
    if(!e.target.matches('.pub-side-btn'))return;
    $$('.pub-side-btn',sidebar).forEach(b=>b.classList.remove('active'));
    e.target.classList.add('active');
    key=e.target.dataset.group;
    draw(key);
  });
}

async function researchPage(){const d=await load('research');setText('#page-intro',d.page_intro);$('#research-list').innerHTML=d.items.map((x,i)=>`<section id="${esc(x.id||'project-'+i)}"><div class="container"><div class="smallcaps">${esc(x.number||String(i+1).padStart(2,'0'))}</div><h2>${esc(x.title)}</h2><div class="prose">${paras(x.body)}${x.related?`<p><strong>Related:</strong> ${esc(x.related)}</p>`:''}</div></div></section>`).join('')}

async function pubsPage(){
  const d=await load('publications');
  setText('#page-intro',d.page_intro);
  const toolbar=$('#pub-toolbar'), box=$('#pub-groups'), sidebar=$('#pub-sidebar');
  const definitions=[
    {key:'books',label:'Books & editions',types:['Books & editions']},
    {key:'articles',label:'Articles, book chapters & reviews',types:['Peer-reviewed articles','Book chapters','Review essays & reviews']},
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
  const d=await load('talks');
  setText('#page-intro',d.page_intro);
  const sidebar=$('#talks-sidebar'), toolbar=$('#talks-toolbar'), box=$('#talks-groups');
  const definitions=[
    {key:'academic',label:'Academic talks & conference papers',types:['Academic talks & conference papers']},
    {key:'publiclectures',label:'Public lectures & conversations',types:['Public lectures & conversations']},
    {key:'media',label:'Media & interviews',types:['Media & interviews']},
    {key:'podcasts',label:'Podcasts & public history',types:['Podcasts & public history']},
    {key:'essays',label:'Essays & commentary',types:['Essays & commentary']},
    {key:'policy',label:'Policy analysis',types:['Policy analysis']}
  ];
  const groups=definitions.filter(g=>d.items.some(x=>g.types.includes(x.type||'')));
  toolbar.innerHTML=`<input id="talks-search" type="search" placeholder="Type to filter" aria-label="Search talks, media, and public writing">`;
  sidebar.innerHTML=`<button class="pub-side-btn active" data-group="all">All talks & media</button>${groups.map(g=>`<button class="pub-side-btn" data-group="${esc(g.key)}">${esc(g.label)}</button>`).join('')}`;
  function guessLabel(x){
    if(x.link_label)return x.link_label;
    const t=(x.type||'').toLowerCase();
    if(t.includes('podcast'))return'Listen';
    if(t.includes('media'))return'Watch / read';
    if(t.includes('essays')||t.includes('policy'))return'Read';
    return'Event';
  }
  function item(x){
    return `<article class="compact-talk-item">
      <div class="talk-year">${esc(x.date||'')}</div>
      <div class="compact-talk-copy">
        <div class="pub-title">${esc(x.title)}</div>
        <div class="meta">${esc(x.venue||'')}</div>
        ${x.description?`<p>${esc(x.description)}</p>`:''}
        ${x.url?`<div class="publication-links">${link(x.url,guessLabel(x))}</div>`:''}
      </div>
    </article>`;
  }
  function draw(key='all',q=''){
    const ql=q.toLowerCase();
    const active=key==='all'?groups:groups.filter(g=>g.key===key);
    box.innerHTML=active.map(g=>{
      const arr=d.items.filter(x=>g.types.includes(x.type||'')&&(!ql||[x.title,x.venue,x.date,x.description,x.type].join(' ').toLowerCase().includes(ql)));
      return arr.length?`<div class="talk-group"><h2>${esc(g.label)}</h2>${arr.map(item).join('')}</div>`:'';
    }).join('')||`<p class="empty">No items match this search.</p>`;
  }
  let key='all'; draw();
  sidebar.addEventListener('click',e=>{
    if(!e.target.matches('.pub-side-btn'))return;
    $$('.pub-side-btn',sidebar).forEach(b=>b.classList.remove('active'));
    e.target.classList.add('active');
    key=e.target.dataset.group;
    draw(key,$('#talks-search').value);
  });
  $('#talks-search').addEventListener('input',e=>draw(key,e.target.value));
}

async function aboutPage(){const d=await load('about');setText('#page-intro',d.page_intro);$('#about-body').innerHTML=(d.paragraphs||[]).map(p=>`<p>${esc(p)}</p>`).join('');setText('#short-bio',d.short_bio);setText('#organizer-note',d.organizer_note);$('#about-photo').innerHTML=imageOrPlaceholder(d.portrait,'portrait')}
async function cvPage(){const d=await load('cv');setText('#page-intro',d.page_intro);setText('#updated',d.last_updated?`Last updated: ${d.last_updated}`:'');const b=$('#cv-download');if(d.pdf){b.href=d.pdf;b.classList.remove('disabled');b.textContent='Download CV — PDF'}else{b.removeAttribute('href');b.textContent='Upload CV PDF in /admin'}setText('#cv-note',d.note);$('#appointments').innerHTML=(d.appointments||[]).length?(d.appointments||[]).map(x=>`<li><strong>${esc(x.position)}</strong><br>${esc(x.institution)}${x.period?`<div class="meta">${esc(x.period)}</div>`:''}</li>`).join(''):'<li class="empty">Add appointments in /admin.</li>';$('#education').innerHTML=(d.education||[]).length?d.education.map(x=>`<li><strong>${esc(x.degree)}</strong><br>${esc(x.institution)}${x.year?`<div class="meta">${esc(x.year)}</div>`:''}</li>`).join(''):'<li class="empty">Add education in /admin.</li>';$('#areas').innerHTML=(d.research_areas||[]).map(x=>`<span class="tag">${esc(x)}</span>`).join('')}
document.addEventListener('DOMContentLoaded',render);


/* SITE-WIDE SEARCH — additive feature (October 2026). Keep existing code above. */
/*
 * Global search for Oleksandr Avramchuk's academic website.
 * Additive enhancement: does not alter Decap CMS, content JSON or existing page renderers.
 * The search index is built in the browser from the CURRENT content/*.json files.
 */
(() => {
  'use strict';

  const FILES = ['site', 'books', 'research', 'publications', 'teaching', 'talks', 'about', 'cv'];
  const MAX_RESULTS = 40;
  const normalize = value => String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase()
    .replace(/[‐‑‒–—]/g, '-');
  const clean = value => String(value ?? '').replace(/\s+/g, ' ').trim();
  const textOf = (...values) => clean(values.flat(Infinity).filter(v => v !== null && v !== undefined).join(' '));
  const make = (tag, cls, text) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const linkWithSearch = (file, term) => `${file}?search=${encodeURIComponent(term)}`;
  const safeAnchor = id => String(id || '').replace(/[^a-zA-Z0-9_-]/g, '');

  let records = [];
  let loadPromise = null;
  let currentButton = null;
  let modal = null;
  let field = null;
  let listing = null;
  let status = null;
  let lastFocus = null;
  let displaying = false;

  function record(section, title, meta, description, url, more = '') {
    const o = {
      section, title: clean(title), meta: clean(meta), description: clean(description),
      url, more: clean(more)
    };
    if (o.title) records.push(o);
  }

  function addData(data, key) {
    if (!data || typeof data !== 'object') return;
    if (key === 'site') {
      record('Home', data.name || 'Home', data.tagline,
        textOf(data.intro, data.home_research_intro), 'index.html', data.theme_tags);
    }
    if (key === 'books') {
      (data.items || []).forEach(x => record('Books', x.title, textOf(x.subtitle, x.publisher, x.year),
        x.description, `books.html#${safeAnchor(x.id)}`, x.category));
    }
    if (key === 'research') {
      (data.items || []).forEach(x => record('Research', x.title, x.related,
        textOf(x.summary, x.body), `research.html#${safeAnchor(x.id)}`));
    }
    if (key === 'publications') {
      (data.items || []).forEach(x => record('Publications', x.title, textOf(x.meta, x.year),
        '', linkWithSearch('publications.html', x.title), textOf(x.type, x.tags)));
    }
    if (key === 'teaching') {
      (data.courses || []).forEach(x => record('Teaching', x.title, textOf(x.institution, x.period),
        textOf(x.description, x.level, x.language), 'teaching.html'));
      if (data.supervision_note) record('Teaching', 'Supervision', '', data.supervision_note, 'teaching.html');
    }
    if (key === 'talks') {
      (data.items || []).forEach(x => record('Talks & Media', x.title, textOf(x.venue, x.date),
        x.description, linkWithSearch('talks.html', x.title), x.type));
    }
    if (key === 'about') {
      record('About', 'Biography', '', textOf(data.page_intro, data.paragraphs, data.short_bio), 'about.html');
    }
    if (key === 'cv') {
      record('CV', 'Curriculum Vitae', data.last_updated,
        textOf(data.research_areas,
          (data.appointments || []).map(x => textOf(x.position, x.institution)),
          (data.education || []).map(x => textOf(x.degree, x.institution))), 'cv.html');
    }
  }

  async function loadIndex() {
    if (loadPromise) return loadPromise;
    loadPromise = Promise.all(FILES.map(async key => {
      try {
        const response = await fetch(`content/${key}.json`, {cache: 'no-store'});
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return [key, await response.json()];
      } catch (e) {
        console.warn(`[Site search] ${key}.json unavailable`, e);
        return [key, null];
      }
    })).then(datasets => {
      records = [];
      datasets.forEach(([key, data]) => addData(data, key));
      return records;
    });
    return loadPromise;
  }

  function matches(input) {
    const query = normalize(input).trim();
    const terms = query.split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    return records.map(r => {
      const title = normalize(r.title);
      const meta = normalize(r.meta);
      const desc = normalize(r.description);
      const extra = normalize(r.more + ' ' + r.section);
      const full = `${title} ${meta} ${desc} ${extra}`;
      if (!terms.every(t => full.includes(t))) return null;
      const score = terms.reduce((total, t) => {
        return total + (title.includes(t) ? 15 : 0)
          + (meta.includes(t) ? 5 : 0)
          + (extra.includes(t) ? 3 : 0)
          + (desc.includes(t) ? 2 : 0);
      }, title.includes(query) ? 25 : 0);
      return {r, score};
    }).filter(Boolean).sort((a, b) => b.score - a.score || a.r.title.localeCompare(b.r.title));
  }

  function summary(r, query) {
    const source = r.meta || r.description || r.more;
    if (!source) return '';
    const wanted = normalize(query).split(/\s+/).filter(Boolean);
    const lower = normalize(source);
    let start = 0;
    const locs = wanted.map(t => lower.indexOf(t)).filter(i => i >= 0);
    if (locs.length) start = Math.max(0, Math.min(...locs) - 45);
    // Prefer a compact snippet, but keep metadata at the beginning.
    if (r.meta) start = 0;
    return `${start ? '…' : ''}${source.slice(start, start + 185)}${start + 185 < source.length ? '…' : ''}`;
  }

  function renderResults() {
    if (!field || !listing || !status) return;
    const q = field.value.trim();
    listing.replaceChildren();
    if (!q) {
      status.textContent = 'Search books, publications, research, teaching, and talks.';
      const hint = make('p', 'gs-hint', 'Try “Fulbright”, “Ukraine”, “Brzezinski”, or “Cold War”.');
      listing.append(hint);
      return;
    }
    if (!records.length) {
      status.textContent = 'Search data is unavailable. Try refreshing the page.';
      return;
    }
    const hits = matches(q);
    status.textContent = `${hits.length} result${hits.length === 1 ? '' : 's'} for “${q}”`;
    if (!hits.length) {
      listing.append(make('p', 'gs-empty', 'No matches. Try another keyword or a shorter phrase.'));
      return;
    }
    hits.slice(0, MAX_RESULTS).forEach(({r}) => {
      const anchor = make('a', 'gs-result');
      anchor.href = r.url;
      anchor.append(make('span', 'gs-section', r.section));
      anchor.append(make('strong', 'gs-title', r.title));
      const snippet = summary(r, q);
      if (snippet) anchor.append(make('span', 'gs-excerpt', snippet));
      listing.append(anchor);
    });
    if (hits.length > MAX_RESULTS) listing.append(make('p', 'gs-hint', `Showing first ${MAX_RESULTS} results. Refine your search for more specific matches.`));
  }

  function openSearch() {
    if (!modal) return;
    lastFocus = document.activeElement;
    modal.hidden = false;
    document.body.classList.add('gs-modal-open');
    field.value = '';
    field.focus();
    status.textContent = 'Loading current site content…';
    listing.replaceChildren();
    displaying = true;
    loadIndex().then(() => { if (displaying) renderResults(); });
  }

  function closeSearch() {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.body.classList.remove('gs-modal-open');
    displaying = false;
    if (lastFocus && typeof lastFocus.focus === 'function' && lastFocus.isConnected) lastFocus.focus();
    else currentButton?.focus();
  }

  function addStyles() {
    if (document.getElementById('gs-styles')) return;
    const style = document.createElement('style');
    style.id = 'gs-styles';
    style.textContent = `
      .gs-trigger{display:inline-flex;align-items:center;justify-content:center;flex:none;
        width:38px;height:38px;margin-left:3px;color:var(--ink,#172033);border:1px solid var(--line,#dedbd4);
        border-radius:50%;background:transparent;cursor:pointer}
      .gs-trigger:hover,.gs-trigger:focus-visible{color:var(--wine,#8a273d);border-color:currentColor}
      .gs-trigger svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
      .gs-modal-open{overflow:hidden}
      .gs-overlay[hidden]{display:none!important}
      .gs-overlay{position:fixed;inset:0;z-index:1000;background:rgba(15,24,39,.68);
        padding:clamp(18px,9vh,80px) 18px 18px;display:flex;justify-content:center;align-items:flex-start}
      .gs-dialog{width:min(100%,740px);max-height:calc(100vh - 50px);background:var(--paper,#faf9f6);
        border:1px solid var(--line,#dedbd4);box-shadow:0 30px 80px rgba(0,0,0,.28);
        display:flex;flex-direction:column;overflow:hidden;border-radius:5px;color:var(--ink,#172033)}
      .gs-head{display:flex;align-items:center;justify-content:space-between;padding:18px 22px 8px;gap:10px}
      .gs-heading{font-family:var(--serif,Georgia,serif);font-size:1.7rem;line-height:1.25;margin:0}
      .gs-close{border:0;background:none;color:var(--ink,#172033);cursor:pointer;font-size:1.7rem;
        line-height:1;padding:3px 8px}
      .gs-input-wrap{padding:8px 22px 12px}
      .gs-input{box-sizing:border-box;width:100%;padding:12px 14px;background:#fff;
        border:1px solid var(--ink,#172033);border-radius:3px;
        color:var(--ink,#172033);font:inherit;font-size:1rem}
      .gs-input:focus-visible{outline:2px solid var(--wine,#8a273d);outline-offset:2px}
      .gs-status{padding:0 22px 10px;color:var(--muted,#626875);font:400 .82rem/1.5 var(--sans,system-ui,sans-serif)}
      .gs-results{overflow:auto;overscroll-behavior:contain;min-height:100px;padding:0 22px 18px}
      .gs-result{display:flex;flex-direction:column;gap:3px;padding:12px 4px;
        border-top:1px solid var(--line,#dedbd4);color:var(--ink,#172033);text-decoration:none}
      .gs-result:hover,.gs-result:focus-visible{background:rgba(23,32,51,.045);text-decoration:none}
      .gs-section{text-transform:uppercase;letter-spacing:.09em;color:var(--wine,#8a273d);
        font:600 .65rem/1.4 var(--sans,system-ui,sans-serif)}
      .gs-title{font:600 .98rem/1.42 var(--sans,system-ui,sans-serif)}
      .gs-excerpt{color:var(--muted,#626875);font:400 .82rem/1.5 var(--sans,system-ui,sans-serif)}
      .gs-hint,.gs-empty{color:var(--muted,#626875);font-size:.9rem;line-height:1.6;margin:14px 0}
      .gs-foot{padding:10px 22px;border-top:1px solid var(--line,#dedbd4);
        color:var(--muted,#626875);font:400 .7rem/1.5 var(--sans,system-ui,sans-serif)}
      @media(max-width:850px){.gs-trigger{order:2;margin-left:auto;margin-right:6px}
        .menu-toggle{order:3}.nav-links{order:4}
        .gs-overlay{padding:12px 10px}.gs-dialog{max-height:calc(100vh - 24px)}
        .gs-head{padding:13px 15px 6px}.gs-input-wrap{padding:8px 15px}
        .gs-status{padding-left:15px;padding-right:15px}.gs-results{padding:0 15px 12px}}
    `;
    document.head.appendChild(style);
  }

  function addModal() {
    modal = make('div', 'gs-overlay');
    modal.hidden = true;
    const dialog = make('section', 'gs-dialog');
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.setAttribute('aria-labelledby', 'gs-dialog-title');
    const head = make('div', 'gs-head');
    const title = make('h2', 'gs-heading', 'Search the website');
    title.id = 'gs-dialog-title';
    const close = make('button', 'gs-close', '×');
    close.type = 'button';
    close.setAttribute('aria-label', 'Close search');
    close.addEventListener('click', closeSearch);
    head.append(title, close);
    const wrap = make('div', 'gs-input-wrap');
    field = make('input', 'gs-input');
    field.type = 'search';
    field.autocomplete = 'off';
    field.placeholder = 'Type to search…';
    field.setAttribute('aria-label', 'Search all site sections');
    field.addEventListener('input', renderResults);
    field.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const first = listing.querySelector('a.gs-result');
        if (first) { e.preventDefault(); window.location.assign(first.href); }
      }
      if (e.key === 'ArrowDown') {
        const first = listing.querySelector('a.gs-result');
        if (first) { e.preventDefault(); first.focus(); }
      }
    });
    wrap.append(field);
    status = make('div', 'gs-status');
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    listing = make('div', 'gs-results');
    listing.setAttribute('role', 'list');
    const foot = make('div', 'gs-foot', 'Press Esc to close · Enter to open the first result · ⌘K / Ctrl+K to search');
    dialog.append(head, wrap, status, listing, foot);
    modal.append(dialog);
    document.body.append(modal);
    modal.addEventListener('mousedown', event => { if (event.target === modal) closeSearch(); });
    document.addEventListener('keydown', event => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        if (modal.hidden) openSearch(); else field.focus();
      } else if (event.key === 'Escape' && !modal.hidden) {
        event.preventDefault(); closeSearch();
      } else if (event.key === 'Tab' && !modal.hidden) {
        // Keep focus within the modal when it is open.
        const targets = [close, field, ...listing.querySelectorAll('a.gs-result')];
        const first = targets[0], last = targets[targets.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault(); last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault(); first.focus();
        }
      }
    });
  }

  function restoreLocalFilter() {
    const param = new URLSearchParams(window.location.search).get('search');
    if (!param || !['publications', 'talks'].includes(document.body.dataset.page)) return;
    const inputId = document.body.dataset.page === 'publications' ? '#pub-search' : '#talks-search';
    function apply() {
      const input = document.querySelector(inputId);
      if (!input) return false;
      input.value = param;
      input.dispatchEvent(new Event('input', {bubbles: true}));
      return true;
    }
    if (apply()) return;
    const observer = new MutationObserver(() => { if (apply()) observer.disconnect(); });
    observer.observe(document.body, {childList: true, subtree: true});
    setTimeout(() => observer.disconnect(), 10000);
  }

  function restoreAnchor() {
    const hash = decodeURIComponent(window.location.hash.slice(1));
    if (!hash || !['books', 'research'].includes(document.body.dataset.page)) return;
    function apply() {
      const target = document.getElementById(hash);
      if (!target) return false;
      target.scrollIntoView({block: 'start', behavior: 'instant'});
      return true;
    }
    if (apply()) return;
    const observer = new MutationObserver(() => { if (apply()) observer.disconnect(); });
    observer.observe(document.body, {childList: true, subtree: true});
    setTimeout(() => observer.disconnect(), 10000);
  }

  function init() {
    const nav = document.querySelector('.site-header .nav');
    if (!nav) {
      // The site's main script inserts the header dynamically. Wait if needed.
      const observer = new MutationObserver(() => {
        if (document.querySelector('.site-header .nav')) {
          observer.disconnect();
          init();
        }
      });
      observer.observe(document.body, {childList: true, subtree: true});
      setTimeout(() => observer.disconnect(), 10000);
      return;
    }
    if (document.getElementById('gs-open-button')) return;
    addStyles();
    currentButton = make('button', 'gs-trigger');
    currentButton.id = 'gs-open-button';
    currentButton.type = 'button';
    currentButton.setAttribute('aria-label', 'Search this website');
    currentButton.setAttribute('title', 'Search this website (⌘K / Ctrl+K)');
    currentButton.setAttribute('aria-haspopup', 'dialog');
    currentButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></svg>';
    nav.append(currentButton);
    addModal();
    currentButton.addEventListener('click', openSearch);
    restoreLocalFilter();
    restoreAnchor();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
