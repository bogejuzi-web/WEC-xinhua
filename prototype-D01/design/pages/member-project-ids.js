(() => {
  const params = new URLSearchParams(location.search);
  const sessionId = params.get('prototypeSession');
  const screen = document.getElementById('screen');
  const dialog = document.querySelector('.dialog');
  const scroller = document.getElementById('dialog-content');
  const reopen = document.getElementById('reopen');
  const rows = document.getElementById('id-rows');
  const feedback = document.getElementById('feedback');
  // Local fixtures stand in for the member-detail response; no real endpoint is called.
  const records = [
    {projectName:'健康增值服务（演示）',memberEquityId:'DEMO-EQUITY-001'},
    {projectName:'绿色通道项目（演示）',memberEquityId:'DEMO-EQUITY-002'}
  ];
  function fit() {
    const scale = Math.min(innerWidth / 1712, 1);
    screen.style.transform = `scale(${scale})`;
    document.body.style.height = `${1264 * scale}px`;
  }
  function updateEmpty() { document.getElementById('id-empty').hidden = rows.children.length > 0; }
  function renderRecords(data) {
    rows.replaceChildren();
    for (const record of data) {
      const row = document.createElement('tr');
      const projectCell = document.createElement('td');
      const idCell = document.createElement('td');
      projectCell.textContent = record.projectName;
      idCell.textContent = record.memberEquityId;
      row.append(projectCell, idCell); rows.append(row);
    }
    updateEmpty();
  }
  function showDialog() {dialog.hidden=false;reopen.hidden=true;}
  function closeDialog() {dialog.hidden=true;reopen.hidden=false;reopen.focus();}
  document.querySelector('.close-icon').addEventListener('click',closeDialog);
  document.getElementById('cancel').addEventListener('click',closeDialog);
  reopen.addEventListener('click',()=>{showDialog();document.getElementById('member-name').focus();});
  document.querySelectorAll('[data-clear]').forEach(button=>button.addEventListener('click',()=>{const input=document.getElementById(button.dataset.clear);input.value='';input.focus();}));
  document.getElementById('remark').addEventListener('input',event=>{document.getElementById('remark-count').textContent=event.target.value.length+' / 500';});
  document.getElementById('save').addEventListener('click',()=>{
    feedback.textContent='原型演示：会员基本信息编辑仅在本页展示，会员权益ID为只读同步信息。';
  });
  document.querySelectorAll('.existing-button').forEach(button=>button.addEventListener('click',()=>{feedback.textContent='本页演示会员权益ID记录，其他业务入口保留截图样式。';}));
  function scenario(id) {
    showDialog();screen.classList.toggle('baseline',id==='baseline');feedback.textContent='';
    renderRecords(id==='empty'?[]:records);scroller.scrollTop=0;
  }
  addEventListener('message',event=>{
    if(event.source!==parent || !event.data || event.data.sessionId!==sessionId)return;
    if(location.protocol!=='file:' && event.origin!==location.origin)return;
    if(event.data.type==='prototype:scenario')scenario(event.data.scenarioId);
    if(event.data.type==='prototype:highlight'){
      showDialog();screen.classList.remove('baseline');const group=document.getElementById('entitlement-group');group.scrollIntoView({block:'center'});group.classList.add('highlight');setTimeout(()=>group.classList.remove('highlight'),2000);
    }
  });
  const backgroundTable=document.getElementById('background-table');
  const sidebar=document.getElementById('sidebar');
  const menu=[['♧','服务管理'],['♧','产品管理'],['♙','企业管理'],['♧','项目管理'],['▣','会员管理'],['♧','供应商管理'],['▣','激活码管理'],['▥','白名单管理'],['▣','核保测评方案配置'],['▤','文章管理'],['⌂','家庭管理'],['♣','微信用户管理']];
  for(const [icon,label] of menu){const item=document.createElement('div');item.className='menu-item'+(label==='会员管理'?' current':'');const symbol=document.createElement('span');symbol.className='menu-icon';symbol.textContent=icon;item.append(symbol,label);sidebar.append(item);}
  for(let i=0;i<11;i++){
    const row=document.createElement('div');row.className='background-tr';
    const checkbox=document.createElement('span');checkbox.className='checkbox';
    const value=document.createElement('span');value.textContent=i===0?'创建时间':'2026-06-12';
    const operations=document.createElement('span');operations.className='operations';
    if(i===0)operations.textContent='操作';else{operations.append('查看　 编辑　 ');const del=document.createElement('span');del.className='delete';del.textContent='删除';operations.append(del,'　 更多⌄');}
    row.append(checkbox,value,operations);backgroundTable.append(row);
  }
  fit();addEventListener('resize',fit);scenario(params.get('prototypeScenario'));
  parent.postMessage({type:'prototype:page-ready',pageId:'P03',sessionId},location.protocol==='file:'?'*':location.origin);
})();
