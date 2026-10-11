/* NEWS & CONTACT — additive module; does not modify existing CMS content or page renderers. */
(() => {
  'use strict';
  const byId = id => document.getElementById(id);
  const clean = s => String(s ?? '').trim();
  const text = (node, value) => { if(node && value !== undefined && value !== null) node.textContent = value; };
  const validLink = raw => {
    try {
      const u = new URL(clean(raw), window.location.href);
      return ['https:', 'http:'].includes(u.protocol) ? u.href : null;
    } catch { return null; }
  };
  const item = (tag, cls, value) => {
    const n = document.createElement(tag);
    if(cls) n.className = cls;
    if(value !== undefined) n.textContent = clean(value);
    return n;
  };
  const navItems = [
    ['about.html', 'About'],
    ['news.html', 'News'],
    ['research.html', 'Research'],
    ['publications.html', 'Publications'],
    ['teaching.html', 'Teaching'],
    ['talks.html', 'Talks & Media'],
    ['cv.html', 'CV'],
    ['contact.html', 'Contact']
  ];

  function applyNavigation() {
    const nav = document.querySelector('.site-header .nav-links');
    if(!nav) return false;
    if(nav.dataset.updatedNav === '1') return true;
    const prior = new Map([...nav.querySelectorAll('a[href]')].map(a => [a.getAttribute('href').split('?')[0].replace(/^.*\//,''), a]));
    const here = window.location.pathname.split('/').pop() || 'index.html';
    const links = navItems.map(([path, label]) => {
      const a = prior.get(path) || document.createElement('a');
      a.href = path;
      a.textContent = label;
      if(here === path) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
      return a;
    });
    nav.replaceChildren(...links);
    nav.dataset.updatedNav = '1';
    return true;
  }

  function applyGlobalNavCSS() {
    if(byId('site-news-nav-css')) return;
    const s = document.createElement('style');
    s.id = 'site-news-nav-css';
    s.textContent = `
      .site-header .nav-links{gap:clamp(.5rem,1vw,.9rem);font-size:.82rem}
      .site-header .brand{font-size:1.23rem}
      @media(max-width:1120px){
        .site-header .nav{min-height:64px;align-items:center;padding:1rem 0}
        .site-header .menu-toggle{display:block;order:3}
        .site-header .nav-links{display:none;position:absolute;left:0;right:0;top:64px;background:var(--paper);border-bottom:1px solid var(--line);padding:1rem 20px 1.5rem;flex-direction:column;align-items:flex-start;gap:.9rem}
        .site-header .nav-links.open{display:flex}
        .site-header .gs-trigger{order:2;margin-left:auto;margin-right:8px}
      }`;
    document.head.append(s);
  }

  async function loadJson(path) {
    const response = await fetch(path, {cache:'no-store'});
    if(!response.ok) throw new Error(`${path}: ${response.status}`);
    return response.json();
  }

  function formatDate(s) {
    const value = clean(s);
    if(!value) return '';
    const d = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T12:00:00`) : new Date(value);
    return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString('en-GB', {day:'numeric', month:'long', year:'numeric'});
  }
  function sortDate(s) {
    const v=Date.parse(clean(s));
    return Number.isNaN(v) ? 0 : v;
  }

  async function newsPage() {
    const list=byId('news-list');
    if(!list) return;
    try {
      const news=await loadJson('content/news.json');
      text(byId('news-intro'), news.page_intro || 'Research updates, publications, forthcoming events and reviews.');
      const items=Array.isArray(news.items)? [...news.items].sort((a,b)=>sortDate(b.date)-sortDate(a.date)) : [];
      const show=q=>{
        list.replaceChildren();
        const term=clean(q).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
        const norm=s=>clean(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
        const filtered=items.filter(n=>!term||norm([n.title,n.description,n.category,n.date].join(' ')).includes(term));
        if(!filtered.length){
          list.append(item('p','news-empty',items.length?'No news matches this search.':'No updates published yet.'));
          return;
        }
        for (const n of filtered) {
          const article=item('article','news-entry');
          article.append(item('div','news-date',formatDate(n.date)));
          const right=item('div','news-copy');
          if(n.category) right.append(item('div','news-category',n.category));
          right.append(item('h2','',n.title));
          if(n.description) right.append(item('p','',n.description));
          const url=validLink(n.url);
          if(url){
            const row=item('div','publication-links');
            const a=item('a','',n.link_label||'Read more');
            a.href=url;a.rel='noopener noreferrer';a.target='_blank';
            row.append(a);right.append(row);
          }
          article.append(right);list.append(article);
        }
      };
      show('');
      byId('news-filter')?.addEventListener('input', e=>show(e.target.value));
    } catch(e){
      console.error('Could not load news:',e);
      list.replaceChildren(item('p','news-empty','News could not be loaded. Please try again later.'));
    }
  }

  async function contactPage() {
    const el=byId('contact-details'); if(!el)return;
    let data={};
    try{data=await loadJson('content/site.json')}catch(e){console.warn('Using fallback contact details',e)}
    text(byId('contact-name'), data.name || 'Oleksandr Avramchuk');
    text(byId('contact-position'), data.role || 'Assistant Professor of History');
    text(byId('contact-affiliation'), data.institution ? `Faculty of History, ${data.institution}` : 'Faculty of History, University of Warsaw');
    const email=clean(data.email || 'o.avramchuk2@uw.edu.pl');
    const emailDiv=byId('contact-email');
    if(emailDiv){const a=item('a','',email);a.href=`mailto:${encodeURIComponent(email)}`;emailDiv.replaceChildren(a)}
    const profiles=byId('contact-profiles');
    const row=byId('contact-profiles-row');
    for(const [name,value] of [['ORCID',data.orcid_url],['Google Scholar',data.scholar_url],['Academic profile',data.profile_url]]){
      const url=validLink(value);if(!url)continue;
      const a=item('a','',name);a.href=url;a.rel='noopener noreferrer';a.target='_blank';profiles.append(a);
    }
    row.hidden=profiles.childElementCount===0;
  }

  function init() {
    applyGlobalNavCSS();
    if(!applyNavigation()) {
      const observer=new MutationObserver(()=>{if(applyNavigation())observer.disconnect()});
      observer.observe(document.body,{childList:true,subtree:true});
      setTimeout(()=>observer.disconnect(),10000);
    }
    if(document.body.dataset.page==='news')newsPage();
    if(document.body.dataset.page==='contact')contactPage();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
  else init();
})();


/* PUBLICATION ENHANCEMENTS — cover zoom + optional linked notes, additive and CMS-safe. */
(() => {
  'use strict';
  if (window.__avramchukPubEnhancements) return;
  window.__avramchukPubEnhancements = true;

  const SELECTOR = '.pub-thumb, .compact-book-cover, .home-feature-cover, .book-cover';
  const norm = s => String(s ?? '').normalize('NFKC').replace(/\s+/g, ' ').trim().toLocaleLowerCase();
  const rootPath = 'content/';
  const safeUrl = raw => {
    try {
      const u = new URL(String(raw || '').trim(), location.href);
      return /^(https?:)$/.test(u.protocol) ? u.href : '';
    } catch { return ''; }
  };
  const make = (tag, cls, value) => {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (value !== undefined) el.textContent = String(value);
    return el;
  };

  function styles() {
    if (document.getElementById('publication-extras-css')) return;
    const style = document.createElement('style');
    style.id = 'publication-extras-css';
    style.textContent = `
      ${SELECTOR}{cursor:zoom-in}
      ${SELECTOR}:focus-visible{outline:3px solid var(--wine,#8a273d);outline-offset:4px}
      .publication-highlights{font:400 .88rem/1.65 var(--sans,system-ui,sans-serif);color:var(--muted,#626875);margin:.4rem 0 .55rem}
      .publication-highlights .publication-highlight{margin:0 0 .1rem}
      .publication-highlights a{color:var(--wine,#8a273d);text-decoration:underline;text-underline-offset:2px}
      .publication-highlights a:hover{text-decoration-thickness:2px}
      dialog.publication-lightbox{position:fixed;margin:auto;border:0;padding:1.4rem;background:#fff;color:#172033;border-radius:4px;box-shadow:0 24px 85px #10182855;max-width:min(94vw,1000px);max-height:92dvh;overflow:auto}
      dialog.publication-lightbox::backdrop{background:rgba(12,19,32,.84)}
      .publication-lightbox-inner{display:flex;flex-direction:column;gap:.6rem;align-items:center;min-width:0}
      .publication-lightbox-inner img{display:block;object-fit:contain;max-width:100%;max-height:calc(92dvh - 7rem);width:auto;height:auto}
      .publication-lightbox-caption{font:400 .86rem/1.4 var(--sans,system-ui,sans-serif);max-width:75ch;text-align:center}
      .publication-lightbox-close{position:sticky;top:0;margin-left:auto;margin-bottom:.3rem;display:block;border:0;background:#f1f1f1;cursor:pointer;color:#172033;border-radius:2px;font:600 1.1rem var(--sans,system-ui,sans-serif);padding:.3rem .65rem}
      .publication-lightbox-close:hover{background:#e2e2e2}
    `;
    document.head.appendChild(style);
  }

  let modal;
  function openImage(img) {
    if (!modal) {
      modal = make('dialog', 'publication-lightbox');
      modal.setAttribute('aria-label', 'Enlarged cover image');
      const close = make('button', 'publication-lightbox-close', '×');
      close.type = 'button';
      close.setAttribute('aria-label', 'Close image');
      const inner = make('div','publication-lightbox-inner');
      const large = make('img');
      const caption = make('div', 'publication-lightbox-caption');
      inner.append(large,caption);
      modal.append(close,inner);
      document.body.appendChild(modal);
      close.addEventListener('click',()=>modal.close());
      modal.addEventListener('click',e=>{if(e.target === modal) modal.close();});
    }
    const src = img.currentSrc || img.src;
    const larger = modal.querySelector('img');
    const caption = modal.querySelector('.publication-lightbox-caption');
    const card = img.closest('.compact-pub-item,.compact-book-item,.home-feature-book,.feature-book');
    const title = card?.querySelector('.pub-title,h2,h3')?.textContent?.trim() || img.alt || 'Publication cover';
    larger.src = src;
    larger.alt = img.alt || title;
    caption.textContent = title;
    if (!modal.open) modal.showModal();
    modal.querySelector('.publication-lightbox-close').focus();
  }

  function enableImages() {
    document.querySelectorAll(SELECTOR).forEach(img=>{
      if (img.dataset.zoomReady === '1') return;
      img.dataset.zoomReady = '1';
      img.tabIndex = 0;
      img.setAttribute('role','button');
      img.setAttribute('aria-label',`Enlarge image: ${img.alt || 'publication cover'}`);
    });
  }

  const lookup = new Map();
  function displayHighlights(container, notes) {
    if (!container || !Array.isArray(notes) || !notes.length) return;
    if (container.querySelector('.publication-highlights')) return;
    const valid = notes.filter(n=>n && typeof n.text==='string' && n.text.trim());
    if (!valid.length) return;
    const block = make('div','publication-highlights');
    for (const entry of valid) {
      const row=make('p','publication-highlight');
      const url = safeUrl(entry.url);
      if (url) {
        const a = make('a','',entry.text.trim());
        a.href=url; a.target='_blank'; a.rel='noopener noreferrer';
        row.append(a);
      } else row.textContent=entry.text.trim();
      block.append(row);
    }
    const buttons=container.querySelector('.publication-links');
    if (buttons) container.insertBefore(block,buttons);
    else container.append(block);
  }

  function updateCards() {
    document.querySelectorAll('#pub-groups .compact-pub-item').forEach(card=>{
      const title=norm(card.querySelector('.pub-title')?.textContent);
      const entry=lookup.get(`pub:${title}`);
      if (entry) displayHighlights(card.querySelector('.compact-pub-copy'),entry);
    });
    document.querySelectorAll('#books-groups .compact-book-item').forEach(card=>{
      const title=norm(card.querySelector('.compact-book-copy h2')?.textContent);
      const entry=lookup.get(`book:${title}`);
      if (entry) displayHighlights(card.querySelector('.compact-book-copy'),entry);
    });
    const feature=document.querySelector('#feature-book .home-feature-book');
    if (feature) {
      const title=norm(feature.querySelector('.home-feature-copy h2')?.textContent);
      const entry=lookup.get(`book:${title}`);
      if (entry) displayHighlights(feature.querySelector('.home-feature-copy'),entry);
    }
  }

  let scheduled=false;
  function refresh() {
    if(scheduled)return;
    scheduled=true;
    requestAnimationFrame(()=>{scheduled=false;enableImages();updateCards();});
  }
  async function readNotes() {
    const kinds = [ ['publications.json','pub'],['books.json','book'] ];
    await Promise.all(kinds.map(async ([file,key])=>{
      try{
        const response=await fetch(rootPath+file,{cache:'no-store'});
        if(!response.ok)return;
        const data=await response.json();
        for (const entry of (Array.isArray(data.items)?data.items:[])) {
          if(entry && entry.title && Array.isArray(entry.highlights))lookup.set(`${key}:${norm(entry.title)}`,entry.highlights);
        }
      }catch(err){ console.warn('Publication notes unavailable:',file,err); }
    }));
    refresh();
  }

  function init() {
    styles();
    document.addEventListener('click',e=>{
      const img=e.target.closest?.(SELECTOR);
      if(img){e.preventDefault();openImage(img);}
    });
    document.addEventListener('keydown',e=>{
      if((e.key==='Enter'||e.key===' ')&&e.target.matches?.(SELECTOR)){
        e.preventDefault();openImage(e.target);
      }
    });
    refresh();
    const area = document.querySelector('main');
    if (area) {
      const observer = new MutationObserver(refresh);
      observer.observe(area,{childList:true,subtree:true});
    }
    readNotes();
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
