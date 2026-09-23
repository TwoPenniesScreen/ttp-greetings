const DAYS=['mon','tue','wed','thu','fri','sat','sun'],labels=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
let slides=[],selectedId='';
const list=document.querySelector('#slides'),editor=document.querySelector('#editor'),status=document.querySelector('#status');
const esc=value=>String(value??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const blankSchedule=()=>Object.fromEntries(DAYS.map(d=>[d,{enabled:true,start:'00:00',end:'23:59'}]));
const selected=()=>slides.find(s=>s.id===selectedId);

function timingSummary(slide){
  const groups=new Map();
  DAYS.forEach((day,index)=>{const item=slide.schedule[day];if(!item?.enabled)return;const time=item.start==='00:00'&&item.end==='23:59'?'All day':`${item.start}–${item.end}`;if(!groups.has(time))groups.set(time,[]);groups.get(time).push(labels[index])});
  if(!groups.size)return 'No days selected';
  if(groups.size===1){const [[time,days]]=groups;if(days.length===7)return `Every day · ${time}`;if(days.join()===labels.slice(0,5).join())return `Mon–Fri · ${time}`;if(days.join()===labels.slice(5).join())return `Weekend · ${time}`}
  return [...groups].map(([time,days])=>`${days.join(', ')} · ${time}`).join('  •  ');
}

function miniPreview(slide){return `<div class="mini-preview"><img src="/assets/fixed-text.webp" alt=""><img src="/assets/logo-${slide.logo}.webp" alt=""><div class="mini-head">${esc(slide.headline)}</div><div class="mini-sub">${esc(slide.subheading)}</div></div>`}

function renderList(){
  list.innerHTML=slides.map((slide,index)=>`<button class="slide-item ${slide.id===selectedId?'selected':''} ${slide.enabled?'':'off'}" data-id="${esc(slide.id)}"><span class="number">${index+1}</span>${miniPreview(slide)}<span class="slide-meta"><strong>${esc(slide.name)}</strong><span>${esc(timingSummary(slide))}</span><small>${slide.enabled?`Chance ${slide.weight}`:'Not in rotation'}${slide.starts||slide.ends?` · ${esc(slide.starts||'Any date')} to ${esc(slide.ends||'Any date')}`:''}</small></span></button>`).join('');
  document.querySelector('#count').textContent=`${slides.length} slides`;
}

function renderEditor(){
  const s=selected();
  if(!s){editor.innerHTML='<div class="empty">Choose a slide from the list.</div>';return}
  editor.innerHTML=`<div class="editor-head"><div><span class="eyebrow">Editing slide</span><h2>${esc(s.name)}</h2></div><button class="delete" data-delete>Delete slide</button></div><div class="preview"><img src="/assets/fixed-text.webp" alt=""><img data-logo src="/assets/logo-${s.logo}.webp" alt=""><div class="ph">${esc(s.headline)}</div><div class="ps">${esc(s.subheading)}</div></div><section class="panel"><h3>Content</h3><div class="row"><label class="field">Admin name<input data-k="name" value="${esc(s.name)}"></label><label class="field">Central logo<select data-k="logo"><option value="two-pennies" ${s.logo==='two-pennies'?'selected':''}>The Two Pennies</option><option value="basement" ${s.logo==='basement'?'selected':''}>No. 1 The Basement</option></select></label><label class="field">Headline<input data-k="headline" maxlength="120" value="${esc(s.headline)}"></label><label class="field">Subheading<input data-k="subheading" maxlength="120" value="${esc(s.subheading)}"></label></div></section><section class="panel"><h3>Rotation</h3><div class="compact row"><label class="field">Chance (1–20)<input data-k="weight" type="number" min="1" max="20" value="${s.weight}"></label><label class="field">Start date (optional)<input data-k="starts" type="date" value="${s.starts||''}"></label><label class="field">End date (optional)<input data-k="ends" type="date" value="${s.ends||''}"></label><label class="field">Available<label class="toggle"><input data-k="enabled" type="checkbox" ${s.enabled?'checked':''}> Include this slide</label></label></div></section><section class="panel"><h3>Days and times</h3><div class="checks">${DAYS.map((day,index)=>{const x=s.schedule[day];return `<div class="day"><label><input data-day="${day}" data-part="enabled" type="checkbox" ${x.enabled?'checked':''}>${labels[index]}</label><input aria-label="${labels[index]} start" data-day="${day}" data-part="start" type="time" value="${x.start}"><span>to</span><input aria-label="${labels[index]} end" data-day="${day}" data-part="end" type="time" value="${x.end}"></div>`}).join('')}</div></section>`;
}

function render(){if(!selectedId&&slides.length)selectedId=slides[0].id;renderList();renderEditor()}
list.addEventListener('click',event=>{const item=event.target.closest('.slide-item');if(!item)return;selectedId=item.dataset.id;render()});
editor.addEventListener('input',event=>{const s=selected();if(!s)return;if(event.target.dataset.k){const key=event.target.dataset.k;s[key]=event.target.type==='checkbox'?event.target.checked:event.target.value;if(key==='headline')editor.querySelector('.ph').textContent=s.headline;if(key==='subheading')editor.querySelector('.ps').textContent=s.subheading;if(key==='logo')editor.querySelector('[data-logo]').src=`/assets/logo-${s.logo}.webp`;if(key==='name')editor.querySelector('h2').textContent=s.name}else if(event.target.dataset.day){const {day,part}=event.target.dataset;s.schedule[day][part]=event.target.type==='checkbox'?event.target.checked:event.target.value}renderList()});
editor.addEventListener('click',event=>{if(!event.target.matches('[data-delete]'))return;const index=slides.findIndex(s=>s.id===selectedId);slides.splice(index,1);selectedId=slides[Math.min(index,slides.length-1)]?.id||'';render()});
document.querySelector('#add').onclick=()=>{const slide={id:crypto.randomUUID(),name:'New slide',headline:'NEW HEADLINE',subheading:'SUBHEADING',logo:'two-pennies',weight:1,enabled:true,starts:'',ends:'',schedule:blankSchedule()};slides.unshift(slide);selectedId=slide.id;render();editor.scrollTo(0,0)};
document.querySelector('#save').onclick=async()=>{status.textContent='Saving…';try{const response=await fetch('/api/slides',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({slides})});const data=await response.json();if(!response.ok)throw new Error(data.error);slides=data.slides;status.textContent='Saved';render()}catch(error){status.textContent=error.message}};
(async()=>{try{const response=await fetch('/api/slides?admin=1',{cache:'no-store'});const data=await response.json();if(!response.ok)throw new Error(data.error);slides=data.slides;render()}catch(error){status.textContent=error.message}})();
