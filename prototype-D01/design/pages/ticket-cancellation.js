(() => {
  const params=new URLSearchParams(location.search);
  const sessionId=params.get('prototypeSession');
  const record={orderId:'DEMO-GREEN-001',projectName:'新华保险测试项目',cancelProjectName:'新华保险测试项目'};
  const party=document.getElementById('cancel-party');
  const rowCheckbox=document.getElementById('select-row');
  const allCheckbox=document.getElementById('select-all');
  function fit(){const scale=Math.min(innerWidth/2323,1);document.getElementById('screen').style.transform=`scale(${scale})`;document.body.style.height=`${1171*scale}px`;}
  function scenario(id){
    document.getElementById('order-id').textContent=record.orderId;
    document.getElementById('project-name').textContent=record.projectName;
    // Display the source project's name for an interface cancellation, not a generic platform label.
    party.textContent=id==='platform'?record.cancelProjectName:'睿聆';
    document.getElementById('feedback').hidden=true;
    rowCheckbox.checked=false;allCheckbox.checked=false;
  }
  allCheckbox.addEventListener('change',()=>{rowCheckbox.checked=allCheckbox.checked;});
  rowCheckbox.addEventListener('change',()=>{allCheckbox.checked=rowCheckbox.checked;});
  document.querySelectorAll('.actions button').forEach(button=>button.addEventListener('click',()=>{const feedback=document.getElementById('feedback');feedback.textContent='当前原型仅展示取消方，未接入真实工单操作。';feedback.hidden=false;}));
  addEventListener('message',event=>{
    if(event.source!==parent||!event.data||event.data.sessionId!==sessionId)return;
    if(location.protocol!=='file:'&&event.origin!==location.origin)return;
    if(event.data.type==='prototype:scenario')scenario(event.data.scenarioId);
    if(event.data.type==='prototype:highlight'){
      [party,document.getElementById('cancel-header')].forEach(element=>{element.classList.add('highlight');setTimeout(()=>element.classList.remove('highlight'),2000);});
    }
  });
  fit();addEventListener('resize',fit);scenario(params.get('prototypeScenario'));
  parent.postMessage({type:'prototype:page-ready',pageId:'P04',sessionId},location.protocol==='file:'?'*':location.origin);
})();
