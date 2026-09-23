const screen=document.querySelector('#screen'),headline=document.querySelector('.headline'),subheading=document.querySelector('.subheading'),logo=document.querySelector('.logo');
const preload=url=>url?new Promise(resolve=>{const image=new Image();image.onload=image.onerror=resolve;image.src=url}):Promise.resolve();
function fit(element,max,min){const context=document.createElement('canvas').getContext('2d'),line=element.textContent.replace(/\s+/g,' ');element.textContent=line;while(max>min){context.font=`${max}px TwoPennies`;if(context.measureText(line).width<=element.clientWidth)break;max-=2}element.style.fontSize=`${max}px`}
function scale(){const ratio=Math.min(innerWidth/1920,innerHeight/1080);screen.style.transform=`translate(${(innerWidth-1920*ratio)/2}px,${(innerHeight-1080*ratio)/2}px) scale(${ratio})`}
addEventListener('resize',scale);scale();
let recent=[];try{recent=JSON.parse(localStorage.getItem('ttp-recent-slides')||'[]');if(!Array.isArray(recent))recent=[]}catch{recent=[]}
Promise.all([
 fetch(`/api/slides${recent.length?`?exclude=${encodeURIComponent(recent.slice(0,10).join(','))}`:''}`,{cache:'no-store'}).then(r=>r.ok?r.json():Promise.reject()),
 fetch('https://ttp-brand.netlify.app/api/theme?slot=generic&page=generic-slides').then(r=>r.ok?r.json():Promise.reject()).catch(()=>({}))
]).then(async([selection,theme])=>{
 const slide=selection.slide;if(!slide)throw new Error();const background=theme.theme?.background||'/assets/fallback.webp';const foreground=theme.theme?.foreground||'';
 await Promise.all([preload(background),preload(foreground),document.fonts.ready]);
 screen.style.backgroundImage=`url(${JSON.stringify(background)})`;document.querySelector('.seasonal').style.backgroundImage=foreground?`url(${JSON.stringify(foreground)})`:'';
 const tint=theme.overlay||{};document.querySelector('.tint').style.backgroundColor=tint.color||'transparent';document.querySelector('.tint').style.opacity=tint.opacity||0;
 headline.textContent=slide.headline;subheading.textContent=slide.subheading;logo.style.backgroundImage=`url('/assets/logo-${slide.logo}.webp')`;fit(headline,160,62);fit(subheading,62,34);try{recent=[slide.id,...recent.filter(id=>id!==slide.id)].slice(0,10);localStorage.setItem('ttp-recent-slides',JSON.stringify(recent))}catch{}screen.style.visibility='visible';
}).catch(()=>{screen.classList.add('error');screen.textContent='Slide unavailable';screen.style.visibility='visible'});
