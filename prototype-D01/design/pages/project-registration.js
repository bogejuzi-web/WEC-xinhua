(() => {
  const options = [
    ['name','姓名'],['phone','电话'],['idType','证件类型'],['idNumber','证件号码'],
    ['gender','性别'],['birthday','出生日期'],['region','省市'],['email','邮箱'],
    ['voucherId','权益凭证ID']
  ];
  const defaults = ['name','phone','idType','idNumber'];
  let selected = new Set(defaults);
  const params = new URLSearchParams(location.search);
  const sessionId = params.get('prototypeSession');
  const combo = document.getElementById('field-combobox');
  const list = document.getElementById('field-options');
  const tags = document.getElementById('selected-tags');
  const dialog = document.querySelector('.dialog');
  const reopen = document.getElementById('reopen');
  function fit() {
    const scale = Math.min(innerWidth / 1710, 1);
    document.getElementById('screen').style.transform = `scale(${scale})`;
    document.body.style.height = `${1267 * scale}px`;
  }
  function openList(open) {
    list.hidden = !open; combo.setAttribute('aria-expanded', String(open));
  }
  function toggle(value) {
    selected.has(value) ? selected.delete(value) : selected.add(value);
    render();
  }
  function render() {
    tags.replaceChildren();
    for (const [value, label] of options) {
      if (!selected.has(value)) continue;
      const tag = document.createElement('span'); tag.className = 'tag';
      const text = document.createElement('span'); text.textContent = label;
      const remove = document.createElement('button'); remove.type = 'button';
      remove.textContent = '×'; remove.setAttribute('aria-label', '移除' + label);
      remove.addEventListener('click', event => { event.stopPropagation(); toggle(value); combo.focus(); });
      tag.append(text, remove); tags.append(tag);
    }
    // Keep option nodes stable so keyboard focus and scroll position survive selection.
    for (const option of list.children) {
      const active = selected.has(option.dataset.value);
      option.setAttribute('aria-selected', String(active));
      option.querySelector('.check').textContent = active ? '✓' : '';
    }
  }
  for (const [value, label] of options) {
    const item = document.createElement('div'); item.className = 'option';
    item.dataset.value = value; item.setAttribute('role', 'option'); item.tabIndex = 0;
    const text = document.createElement('span'); text.textContent = label; item.append(text);
    if (value === 'voucherId') {
      item.dataset.changeId = 'P02-C01';
      item.title = '权益凭证ID：用户唯一的备案号码';
      const meaning = document.createElement('span'); meaning.className = 'meaning';
      meaning.textContent = '用户唯一的备案号码'; item.append(meaning);
    }
    const check = document.createElement('span'); check.className = 'check'; check.setAttribute('aria-hidden','true'); item.append(check);
    item.addEventListener('click', () => toggle(value));
    item.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggle(value); }
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault(); (event.key === 'ArrowDown' ? item.nextElementSibling : item.previousElementSibling)?.focus();
      }
      if (event.key === 'Escape') { event.preventDefault(); openList(false); combo.focus(); }
    });
    list.append(item);
  }
  combo.addEventListener('click', () => openList(list.hidden));
  combo.addEventListener('keydown', event => {
    if (event.target !== combo) return;
    if (['Enter',' ','ArrowDown'].includes(event.key)) {event.preventDefault();openList(true);list.firstElementChild.focus();}
    if (event.key === 'Escape') openList(false);
  });
  document.querySelector('.clear-fields').addEventListener('click', event => {event.stopPropagation();selected.clear();render();combo.focus();});
  document.addEventListener('click', event => {if (!document.getElementById('field-picker').contains(event.target)) openList(false);});
  document.addEventListener('keydown', event => {if (event.key === 'Escape') {openList(false);combo.focus();}});
  document.querySelector('[data-clear]').addEventListener('click', () => {document.getElementById('project-name').value='';});
  function close() {dialog.hidden=true;reopen.hidden=false;document.getElementById('screen').classList.add('is-closed');reopen.focus();}
  document.querySelector('.close-icon').addEventListener('click', close);
  document.querySelector('.close-button').addEventListener('click', close);
  reopen.addEventListener('click', event => {event.stopPropagation();dialog.hidden=false;reopen.hidden=true;document.getElementById('screen').classList.remove('is-closed');openList(true);combo.focus();});
  document.querySelector('.next-button').addEventListener('click', () => {
    openList(false);
    document.getElementById('feedback').textContent = '当前为基本信息原型，所选备案字段已保留供查看。';
  });
  document.querySelector('.add-welcome').addEventListener('click', () => {
    const input = document.createElement('textarea'); input.placeholder='请输入项目欢迎语';input.setAttribute('aria-label','新增项目欢迎语');
    const control = document.querySelector('.welcome-control');control.style.flexWrap='wrap';input.style.flexBasis='100%';control.append(input);input.focus();
  });
  document.getElementById('project-form').addEventListener('submit', event => event.preventDefault());
  function scenario(id) {
    selected = new Set(defaults); dialog.hidden=false;reopen.hidden=true;document.getElementById('screen').classList.remove('is-closed');
    if (id === 'selected') selected.add('voucherId');
    render(); openList(id !== 'selected'); list.scrollTop=0;
    if (id === 'credential') list.lastElementChild.scrollIntoView({block:'nearest'});
  }
  addEventListener('message', event => {
    if (event.source !== parent || !event.data || event.data.sessionId !== sessionId) return;
    if (location.protocol !== 'file:' && event.origin !== location.origin) return;
    if (event.data.type === 'prototype:scenario') scenario(event.data.scenarioId);
    if (event.data.type === 'prototype:highlight') {
      dialog.hidden=false;reopen.hidden=true;document.getElementById('screen').classList.remove('is-closed');
      openList(true); const option=list.lastElementChild;option.scrollIntoView({block:'nearest'});
      option.classList.add('highlight');setTimeout(()=>option.classList.remove('highlight'),2000);
    }
  });
  fit();addEventListener('resize',fit);scenario(params.get('prototypeScenario'));
  parent.postMessage({type:'prototype:page-ready',pageId:'P02',sessionId},location.protocol==='file:'?'*':location.origin);
})();
