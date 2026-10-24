/* EN/PL support: shared bibliographic records + editable Polish overlays. */
(() => {
  'use strict';
  const pl = document.documentElement.lang === 'pl' || /^\/pl(?:\/|$)/.test(location.pathname);
  const prefix = pl ? '../' : '';
  const mappings = {
    'Home':'Strona główna','About':'O mnie','News':'Aktualności','Research':'Badania','Publications':'Publikacje',
    'Teaching':'Dydaktyka','Talks & Media':'Wystąpienia i media','CV':'CV','Contact':'Kontakt',
    'Books':'Książki','Books & editions':'Książki i edycje źródłowe',
    'Articles, book chapters & reviews':'Artykuły, rozdziały i recenzje',
    'Work in progress':'W przygotowaniu','Other':'Pozostałe',
    'Peer-reviewed articles':'Artykuły recenzowane','Book chapters':'Rozdziały w książkach',
    'Review essays & reviews':'Artykuły recenzyjne i recenzje',
    'Academic books':'Monografie naukowe',
    'Edited volumes & source editions':'Tomy zbiorowe i edycje źródłowe',
    'Public history books':'Książki popularnonaukowe','Public History':'Historia dla szerszego odbiorcy',
    'All books':'Wszystkie książki','All publications':'Wszystkie publikacje',
    'All talks & media':'Wszystkie wystąpienia i media',
    'Academic talks & conference papers':'Referaty i wystąpienia naukowe',
    'Public lectures & conversations':'Wykłady otwarte i dyskusje',
    'Media & interviews':'Media i wywiady',
    'Podcasts & public history':'Podcasty i popularyzacja historii',
    'Essays & commentary':'Eseje i komentarze', 'Policy analysis':'Analizy eksperckie',
    'Research profile':'Profil badawczy', 'Current research':'Obecne badania',
    'Featured book':'Nowa książka','Selected work':'Wybrane publikacje',
    'Explore research':'Poznaj badania','View publications':'Zobacz wszystkie publikacje',
    'Read more →':'Czytaj więcej →','About':'O mnie',
    'Related:':'Powiązane zagadnienia:','Publisher':'Wydawca','Published':'Opublikowana','Forthcoming':'W przygotowaniu',
    'PDF':'PDF','DOI':'DOI','BIB':'BIB',
    'Type to filter':'Wpisz, aby filtrować',
    'Search publications':'Szukaj publikacji',
    'Search news':'Szukaj aktualności','Filter updates':'Filtruj aktualności',
    'Search the website':'Przeszukaj stronę',
    'Type to search…':'Wpisz szukane słowa…',
    'Search books, publications, research, teaching, and talks.':'Szukaj w książkach, publikacjach, badaniach, dydaktyce i wystąpieniach.',
    'No publications match this search.':'Brak publikacji spełniających kryteria wyszukiwania.',
    'No items match this search.':'Nie znaleziono pasujących materiałów.',
    'No news matches this search.':'Brak aktualności spełniających kryteria wyszukiwania.',
    'No updates published yet.':'Nie opublikowano jeszcze aktualności.',
    'Supervision':'Opieka naukowa',
    'Download CV — PDF':'Pobierz CV — PDF',
    'Upload CV PDF in /admin':'Dodaj CV w panelu /admin',
    'Last updated:':'Ostatnia aktualizacja:',
    'Academic appointments':'Zatrudnienie naukowe',
    'Education':'Wykształcenie','Research areas':'Obszary badawcze',
    'Short bio':'Krótki biogram','For organizers':'Dla organizatorów',
    'Contact & information':'Kontakt i informacje',
    'Full name':'Imię i nazwisko','Position':'Stanowisko','Affiliation':'Afiliacja',
    'Work email':'Adres służbowy','Location':'Adres','Academic profiles':'Profile akademickie',
    'Academic profile':'Profil akademicki','Email':'E-mail',
    'Published edited volume':'Opublikowana edycja źródłowa',
    'Edited volume in progress':'Tom zbiorowy w przygotowaniu',
    'Source edition in preparation':'Edycja źródłowa w przygotowaniu',
    'Read more':'Czytaj więcej', 'Watch / read':'Obejrzyj / przeczytaj',
    'Listen':'Słuchaj', 'Read':'Czytaj','Event':'Wydarzenie',
    'New publication':'Nowa publikacja','Review':'Recenzja',
    'Research update':'Wiadomość o badaniach','Media appearance':'W mediach',
    'No matches. Try another keyword or a shorter phrase.':'Brak wyników. Spróbuj innego lub krótszego zapytania.',
    'Close search':'Zamknij wyszukiwarkę',
    'Search this website':'Szukaj na stronie',
    'Try “Fulbright”, “Ukraine”, “Brzezinski”, or “Cold War”.':'Spróbuj wpisać „Fulbright”, „Ukraina”, „Brzeziński” lub „zimna wojna”.',
    'Search data is unavailable. Try refreshing the page.':'Nie można wczytać danych wyszukiwarki. Odśwież stronę.',
    'Loading current site content…':'Wczytywanie treści strony…',
    'No updates published yet.':'Nie opublikowano jeszcze aktualności.',
    'News could not be loaded. Please try again later.':'Nie udało się wczytać aktualności. Spróbuj ponownie później.'
  };
  const tr = value => pl ? (mappings[value] || value) : value;
  // Polish corrections are deliberately exact matches: edited CMS copy is never overwritten.
  const polishCopyFixes = {
    'Wyróżniona książka':'Nowa książka',
    'Krótki wybór prac; pełna bibliografia znajduje się w zakładce Publikacje.':'Wybrane prace. Pełny wykaz znajduje się w zakładce Publikacje.',
    'Moje obecne badania obejmują cztery powiązane ze sobą obszary.':'Moje badania obejmują cztery powiązane obszary historii zimnej wojny.',
    'wyrachowaną otwartością władz PRL':'pragmatyczną otwartością władz PRL',
    'historią nowoczesnej Europy Środkowo-Wschodniej':'historią Europy Środkowo-Wschodniej w XX wieku',
    'Stażysta podoktorski':'Badacz podoktorski',
    'Historia zimnej wojny w kulturze':'Historia kulturowej zimnej wojny'
  };
  function correctPolishCopy(value) {
    if (typeof value === 'string') {
      let t=value;
      for (const [original,revised] of Object.entries(polishCopyFixes)) {
        if(t===original) return revised;
        if (original==='wyrachowaną otwartością władz PRL' && t.includes(original))
          t=t.replace(original,revised);
      }
      // Time-aware correction to a sentence written before the English book's November 2026 release.
      if (t.includes('opublikowana po polsku w 2024 r., a po angielsku przez Manchester University Press w 2026 r.')) {
        t=t.replace('opublikowana po polsku w 2024 r., a po angielsku przez Manchester University Press w 2026 r.',
                    'opublikowana po polsku w 2024 r., ukaże się po angielsku nakładem Manchester University Press w listopadzie 2026 r.');
      }
      return t;
    }
    if (Array.isArray(value)) return value.map(correctPolishCopy);
    if (value && typeof value==='object') return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,correctPolishCopy(v)]));
    return value;
  }
  function periodKey(value) {
    return String(value||'').trim().toLowerCase().replace(/obecnie|present/g,'present').replace(/\s+/g,'');
  }
  function polishPeriod(value) { return String(value||'').replace(/\bpresent\b/gi,'obecnie'); }
  const monthNames = {january:'styczeń',february:'luty',march:'marzec',april:'kwiecień',may:'maj',june:'czerwiec',july:'lipiec',august:'sierpień',september:'wrzesień',october:'październik',november:'listopad',december:'grudzień'};
  function polishUpdateDate(value) {
    return String(value||'').replace(/\b(January|February|March|April|May|June|July|August|September|October|November|December)\b/gi,
      m=>monthNames[m.toLowerCase()]||m);
  }
  function mergeCV(source, trans, result) {
    // The EN lists determine both membership and order. New entries show up automatically.
    const oldPositions=new Map([
      ['Assistant Professor','Adiunkt'],['Postdoctoral Fellow','Badacz podoktorski']
    ]);
    const oldInstitutions=new Map([
      ['Faculty of History, University of Warsaw','Wydział Historii Uniwersytetu Warszawskiego'],
      ['John Paul II Catholic University of Lublin','Katolicki Uniwersytet Lubelski Jana Pawła II']
    ]);
    const localizedAppointments=trans.appointments||[];
    result.appointments=(source.appointments||[]).map(x=>{
      const key=periodKey(x.period);
      const sourceMatches=(source.appointments||[]).filter(a=>periodKey(a.period)===key);
      const translations=localizedAppointments.filter(a=>periodKey(a.period)===key);
      const match=sourceMatches.length===1 && translations.length===1 ? translations[0]:null;
      return {...x,
        position:match?.position || oldPositions.get(x.position) || x.position,
        institution:match?.institution || oldInstitutions.get(x.institution) || x.institution,
        period:polishPeriod(x.period)};
    });
    const degrees=new Map([
      ['Ph.D., History','Doktor nauk humanistycznych w dyscyplinie historia'],
      ['M.A., History','Magister historii'],
      ['B.A., History','Licencjat z historii']
    ]);
    const universities=new Map([
      ['University of Warsaw','Uniwersytet Warszawski'],
      ['National University Kyiv-Mohyla Academy','Narodowy Uniwersytet „Akademia Kijowsko-Mohylańska”']
    ]);
    const localizedEducation=trans.education||[];
    result.education=(source.education||[]).map(x=>{
      const key=String(x.year||'');
      const sourceMatches=(source.education||[]).filter(a=>String(a.year||'')===key);
      const translations=localizedEducation.filter(a=>String(a.year||'')===key);
      const match=sourceMatches.length===1 && translations.length===1 ? translations[0]:null;
      return {...x,degree:match?.degree || degrees.get(x.degree) || x.degree,
        institution:match?.institution || universities.get(x.institution) || x.institution};
    });
    // Match research-area translations by the exact original EN label, not the list position.
    const areaKeys=[
      'Intellectual history of East-Central Europe',
      'Polish-Ukrainian relations',
      'Cold War cultural diplomacy and academic exchange',
      'Soviet Ukraine and its relations with the West and the Kremlin',
      'Émigré knowledge production',
      'Memory politics and Russian imperialism'
    ];
    const areaTranslations=new Map(areaKeys.map((name,i)=>[name,(trans.research_areas||[])[i]]));
    result.research_areas=(source.research_areas||[]).map(x=>areaTranslations.get(x)||x);
    result.last_updated=polishUpdateDate(source.last_updated||trans.last_updated||'');
    return result;
  }
  function merge(name, source, trans) {
    if (!pl || !trans || typeof trans !== 'object') return source;
    const result = {...source};
    for (const [k,v] of Object.entries(trans)) {
      if (k === 'items' || k === 'courses' || (name==='cv' && ['appointments','education','research_areas','last_updated'].includes(k))) continue;
      if (v !== undefined && v !== null) result[k] = v;
    }
    if (name === 'cv') return correctPolishCopy(mergeCV(source,trans,result));
    if (name === 'news' && Array.isArray(trans.items)) {
      const index = new Map(trans.items.filter(x=>x.source_title).map(x=>[x.source_title,x]));
      result.items=(source.items||[]).map(x=>({ ...x, ...(index.get(x.title)||{}) }));
      result.items.push(...trans.items.filter(x=>!x.source_title && x.title));
      return correctPolishCopy(result);
    }
    const key = name === 'books' || name === 'research' ? 'id' : 'source_title';
    for (const field of ['items','courses']) {
      if (!Array.isArray(source[field]) || !Array.isArray(trans[field])) continue;
      const index = new Map(trans[field].map(x => [String(x[key] || x.original_title || ''), x]));
      result[field] = source[field].map(x => {
        const match = index.get(String(x[key] || x.title || ''));
        if (!match) return x;
        const out = {...x};
        for (const [f,v] of Object.entries(match)) {
          if (f === 'source_title' || f === 'original_title' || f === 'id') continue;
          if (v !== null && v !== undefined && v !== '') out[f] = v;
        }
        return out;
      });
    }
    if (name==='teaching' && Array.isArray(result.courses)) {
      result.courses=result.courses.map(x=>({...x,period:polishPeriod(x.period)}));
    }
    return correctPolishCopy(result);
  }
  async function localizeData(name, source) {
    if (!pl) return source;
    try {
      const r=await fetch(`${prefix}content/pl/${name}.json`,{cache:'no-store'});
      if (!r.ok) return source;
      return merge(name, source, await r.json());
    } catch (error) { console.warn('Polish content unavailable:',name,error);return source; }
  }
  window.AvramchukI18n = {pl, prefix, tr, merge:localizeData};

  // EN/PL language menu and SEO links on every page, including legacy /books.html.
  function languageLinks(){
    const current = location.pathname.split('/').pop() || 'index.html';
    const page = /^(index|about|research|publications|teaching|talks|news|contact|cv|books)\.html$/.test(current) ? current : 'index.html';
    const origin = location.origin;
    const en = `${origin}/${page === 'index.html' ? '' : page}`;
    const polish = `${origin}/pl/${page === 'index.html' ? '' : page}`;
    [['en',en],['pl',polish],['x-default',en]].forEach(([lang,href])=>{
      if (!document.querySelector(`link[rel="alternate"][hreflang="${lang}"]`)){
        const link = document.createElement('link');link.rel='alternate';link.hreflang=lang;link.href=href;document.head.append(link);
      }
    });
    if (!document.querySelector('link[rel="canonical"]')){
      const canonical=document.createElement('link');canonical.rel='canonical';canonical.href=pl?polish:en;document.head.append(canonical);
    }
    return {en, polish};
  }
  const dest=languageLinks();
  function addStyles(){
    if(document.getElementById('bilingual-css'))return;
    const s=document.createElement('style');s.id='bilingual-css';s.textContent=`
      .language-switch{display:flex;align-items:center;gap:.32rem;flex:none;margin-left:.25rem;font:600 .73rem/1 var(--sans,system-ui,sans-serif);white-space:nowrap}
      .language-switch a{color:var(--muted,#626875);padding:.3rem .15rem;text-decoration:none}
      .language-switch a[aria-current="true"]{color:var(--ink,#172033);text-decoration:underline;text-underline-offset:4px}
      .language-switch a:hover{color:var(--wine,#8a273d)}
      .language-switch span{color:var(--line,#dedbd4)}
      @media(max-width:1120px){.language-switch{order:1;margin-left:auto}.site-header .gs-trigger{margin-left:0!important}}
    `;document.head.append(s);
  }
  function addSwitcher(){
    const nav=document.querySelector('.site-header .nav');
    if(!nav || document.getElementById('site-language-switch'))return;
    addStyles();
    const wrap=document.createElement('div');wrap.id='site-language-switch';wrap.className='language-switch';wrap.setAttribute('aria-label',pl?'Wybierz język':'Choose language');
    for (const [code,href] of [['EN',dest.en],['PL',dest.polish]]){
      if(wrap.childNodes.length){const sep=document.createElement('span');sep.textContent='|';sep.setAttribute('aria-hidden','true');wrap.append(sep)}
      const a=document.createElement('a');a.href=href;a.textContent=code;
      if((code==='PL')===pl)a.setAttribute('aria-current','true');
      wrap.append(a);
    }
    const search=nav.querySelector('.gs-trigger');
    const menu=nav.querySelector('.menu-toggle');
    nav.insertBefore(wrap,search||menu||null);
  }
  const exactNodes = [
    '.site-header .nav-links a','.site-header .nav-links button',
    '.pub-sidebar button','.publication-group > h2','.book-group > h2','.talk-group > h2',
    '.eyebrow','.smallcaps','.gs-heading','.gs-status','.gs-section',
    '.gs-foot','.news-category','.news-actions label','.news-date',
    '.contact-details dt','.teaching-supervision h2',
    '.cv-grid .smallcaps','.card .smallcaps','.prose strong','.publication-links a',
    '.compact-status','.gs-hint','.gs-empty','.empty','.footer-links a'
  ].join(',');
  function applyTranslations(){
    if (!pl) return;
    for (const node of document.querySelectorAll(exactNodes)) {
      if (node.children.length) continue;
      const prev=node.textContent.trim(),next=tr(prev);
      if(prev!==next)node.textContent=next;
    }
    document.querySelectorAll('[placeholder]').forEach(e=>{
      const p=e.getAttribute('placeholder');if(p && tr(p)!==p)e.setAttribute('placeholder',tr(p));
    });
    document.querySelectorAll('[aria-label]').forEach(e=>{
      const p=e.getAttribute('aria-label');if(p && tr(p)!==p)e.setAttribute('aria-label',tr(p));
    });
    const date=document.getElementById('updated');
    if(date && date.textContent.startsWith('Last updated:'))date.textContent=date.textContent.replace('Last updated:','Ostatnia aktualizacja:');
    const button=document.getElementById('cv-download');
    if(button && tr(button.textContent)!==button.textContent)button.textContent=tr(button.textContent);
    document.querySelectorAll('.home-feature-copy .publication-links a, .research-compact-item a').forEach(e=>{
      const v=e.textContent.trim();
      const translated=e.closest('.home-feature-copy') && (v==='About'||v==='About the book') ? 'O książce' : tr(v);
      if(translated!==v)e.textContent=translated;
    });
    const src=document.querySelector('#contact-position');
    if(src && src.textContent==='Assistant Professor of History')src.textContent='Adiunkt na Wydziale Historii';
    // Localize the university name in the street address, preserving the street and postal code.
    document.querySelectorAll('#contact-details dt').forEach(label=>{
      if(label.textContent.trim()!=='Adres')return;
      const entry=label.nextElementSibling;
      if(!entry)return;
      for (const node of entry.childNodes){
        if(node.nodeType===3 && node.textContent.includes('Faculty of History, University of Warsaw')){
          node.textContent=node.textContent.replace('Faculty of History, University of Warsaw','Wydział Historii Uniwersytetu Warszawskiego');
        }
      }
    });
  }
  let pending=false;
  let newsDeepLinkDone=false;
  function applyNewsDeepLink(){
    if (newsDeepLinkDone || document.body.dataset.page!=='news')return;
    const term=new URLSearchParams(location.search).get('search');
    if(!term){newsDeepLinkDone=true;return}
    const input=document.getElementById('news-filter');
    const list=document.getElementById('news-list');
    // Wait for the News module to load and attach its filter event listener.
    if(!input || !list || !list.querySelector('.news-entry,.news-empty'))return;
    newsDeepLinkDone=true;
    input.value=term;
    input.dispatchEvent(new Event('input',{bubbles:true}));
  }
  function refresh(){
    if (pending) return;
    pending=true;
    requestAnimationFrame(()=>{pending=false;addSwitcher();applyTranslations();applyNewsDeepLink();});
  }
  function init(){
    refresh();
    const obs=new MutationObserver(refresh);
    obs.observe(document.body,{subtree:true,childList:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
  else init();
})();
