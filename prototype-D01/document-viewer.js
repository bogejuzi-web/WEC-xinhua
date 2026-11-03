(() => {
  const docs = {
    flows: ['业务流程图', '业务流程图.md', 'DOC03'],
    interfaces: ['接口数据对照', '接口数据对照.md', 'DOC04'],
    standard: ['新华标准接口原文', '新华健康权益对接标准接口(1).md', 'DOC05'],
    adr: ['讨论确认记录', '/reference/adr.md', 'DOC06']
  };
  const params = new URLSearchParams(location.search);
  const key = params.get('doc') || 'flows';
  const doc = docs[key];
  const content = document.getElementById('content');
  const status = document.getElementById('status');
  let previous, loading = false, renderId = 0;
  if (!doc) { status.textContent = '文档不存在'; return; }
  const sourceURL = doc[1].startsWith('/') ? doc[1] : '/version-docs/' + encodeURIComponent(doc[1]);
  document.getElementById('title').textContent = doc[0];
  document.title = doc[0] + ' · 新华 D01';
  document.getElementById('source').href = sourceURL;
  mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', theme: 'neutral' });

  function links() {
    content.querySelectorAll('a[href]').forEach(a => {
      const href = a.getAttribute('href');
      if (href.startsWith('#')) return;
      let decoded;
      try { decoded = decodeURIComponent(href.split('#')[0]); } catch { decoded = href; }
      if (/^https?:/i.test(decoded)) { a.target = '_blank'; a.rel = 'noopener'; return; }
      const filename = decoded.split('/').pop();
      const hash = href.includes('#') ? href.slice(href.indexOf('#')) : '';
      const match = Object.entries(docs).find(([, d]) => d[1] === filename || (d[1] === '/reference/adr.md' && decoded.includes('/ADR/')));
      if (match) {
        a.href = './document-viewer.html?doc=' + match[0] + hash;
        if (hash && parent !== window) {
          a.href = './?page=' + match[1][2] + '#' + match[1][2] + '/' + hash.slice(1);
          a.target = '_top';
          return;
        }
        a.addEventListener('click', event => {
          if (parent !== window && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
            event.preventDefault();
            parent.postMessage({type:'prototype:navigation-request',pageId:match[1][2]}, location.origin);
          }
        });
      } else if (decoded === 'prototype-D01/index.html') {
        a.href = './?page=P02'; a.target = '_top';
      } else if (decoded.includes('prototype-shell/') || decoded.includes('code-yuanma/')) {
        a.removeAttribute('href');
        a.title = decoded;
        a.append(decoded.includes('code-yuanma/') ? '（仓库源码路径，请在本地编辑器查看）' : '（历史路径，当前原型见左侧导航）');
      } else if (filename === '保单管理接口文档V1.0.docx') {
        a.href = '/version-docs/' + encodeURIComponent(filename); a.target = '_blank'; a.rel = 'noopener';
      } else {
        a.href = new URL(href, new URL(sourceURL, location.href)).href;
        a.target = '_blank'; a.rel = 'noopener';
      }
    });
  }

  async function refresh(force = false) {
    if (loading) return;
    loading = true;
    try {
      const response = await fetch(sourceURL, {cache:'no-store'});
      if (!response.ok) throw new Error('源文档读取失败（HTTP ' + response.status + '），请使用“启动预览.cmd”打开框架。');
      const markdown = await response.text();
      if (force || markdown !== previous) {
        const firstRender = previous === undefined;
        const scrollY = window.scrollY;
        const fragment = DOMPurify.sanitize(marked.parse(markdown), {RETURN_DOM_FRAGMENT:true});
        content.replaceChildren(fragment);
        if (key === 'interfaces') {
          const notice = document.createElement('p');
          notice.className = 'reference-notice';
          notice.textContent = '使用ai对比2边接口文档生成，供参考，实际以接口设计为准';
          content.prepend(notice);
        }
        const slugs = new Map();
        content.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach(heading => {
          const slug = heading.textContent.toLowerCase().replace(/[^\p{L}\p{N}_\s-]/gu, '').trim().replace(/\s+/g, '-');
          const count = slugs.get(slug) || 0;
          slugs.set(slug, count + 1); heading.id = slug + (count ? '-' + count : '');
        });
        links();
        content.querySelectorAll('table').forEach(table => {
          const wrapper = document.createElement('div'); wrapper.className = 'table-scroll';
          table.replaceWith(wrapper); wrapper.append(table);
        });
        for (const block of content.querySelectorAll('pre > code.language-mermaid')) {
          const container = document.createElement('div'); container.className = 'mermaid';
          try {
            const result = await mermaid.render('diagram-' + (++renderId), block.textContent);
            container.innerHTML = result.svg;
            block.parentElement.replaceWith(container);
          } catch (error) {
            const note = document.createElement('p'); note.className = 'error';
            note.textContent = '流程图暂时无法渲染，以下保留源内容：' + error.message;
            block.parentElement.before(note);
          }
        }
        previous = markdown;
        window.scrollTo(0, scrollY);
        if (firstRender || force) scrollToSection();
      }
      status.textContent = '源文档同步中 · 每 2 秒检查 · 最近核对 ' + new Date().toLocaleTimeString('zh-CN');
      status.classList.remove('error');
    } catch (error) {
      status.textContent = location.protocol === 'file:' ? '同步文档需要本地预览服务，请运行同目录“启动预览.cmd”，再打开 http://127.0.0.1:4194/' : error.message;
      status.classList.add('error');
      if (previous === undefined) content.textContent = status.textContent;
    } finally {
      loading = false; content.setAttribute('aria-busy', 'false');
    }
  }
  function scrollToSection() {
    const fragment = location.hash || (parent !== window && parent.location.hash.startsWith('#' + doc[2] + '/') ? '#' + parent.location.hash.slice(doc[2].length + 2) : '');
    if (fragment) {
      try { document.getElementById(decodeURIComponent(fragment.slice(1)))?.scrollIntoView(); } catch { /* Ignore malformed fragments. */ }
    }
  }
  addEventListener('hashchange', scrollToSection);
  document.getElementById('refresh').addEventListener('click', () => refresh(true));
  addEventListener('focus', () => refresh());
  document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh(); });
  setInterval(() => { if (!document.hidden) refresh(); }, 2000);
  refresh();
  parent.postMessage({type:'prototype:page-ready',pageId:doc[2],sessionId:params.get('prototypeSession')}, location.protocol === 'file:' ? '*' : location.origin);
})();
