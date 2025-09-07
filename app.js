/* ---------- helpers ---------- */
const $ = id => document.getElementById(id);
const todayKey = () => new Date().toISOString().slice(0,10);

/* ---------- profile ---------- */
const defaultProf = {name:'',gender:'male',age:30,weight:70,height:170,
  goal:{type:'maintain',deltaKg:0,weeks:0},cal:2000,mac:{p:0,c:0,f:0,fib:0}};
const getProf = () => JSON.parse(localStorage.getItem('nt_profile')||JSON.stringify(defaultProf));
const setProf = p => localStorage.setItem('nt_profile',JSON.stringify(p));

const kcalMaint = p => Math.round((10*p.weight)+(6.25*p.height)-(5*p.age)+(p.gender==='male'?5:-161));
function applyGoal(p){
  const m = kcalMaint(p);
  if (p.goal.type==='loss') p.cal = m - (p.goal.deltaKg*7700)/(p.goal.weeks*7||1);
  else if (p.goal.type==='gain') p.cal = m + (250*p.goal.deltaKg);
  else p.cal = m;
  p.mac = {p:Math.round(p.cal*0.25/4),c:Math.round(p.cal*0.45/4),
           f:Math.round(p.cal*0.30/9),fib:30};
}

/* ---------- sample food DB ---------- */
const foodDB = {
  rice:{n:'Cooked Rice',serv:'100g',k:121,mac:{p:2.6,c:25.2,f:0.4,fib:0.4},mic:{}},
  egg :{n:'Boiled Egg',  serv:'50g' ,k:78 ,mac:{p:6.3,c:0.6 ,f:5.3,fib:0 },mic:{}}
};

/* ---------- diary ---------- */
const getDiary = () => JSON.parse(localStorage.getItem(todayKey())||'{}');
const setDiary = d  => localStorage.setItem(todayKey(),JSON.stringify(d));

/* ---------- render dashboard ---------- */
const ringCtx = $('kcalRing').getContext('2d');
function drawRing(pct){
  ringCtx.clearRect(0,0,170,170);
  ringCtx.lineWidth = 14;
  ringCtx.strokeStyle = '#eee';
  ringCtx.beginPath(); ringCtx.arc(85,85,60,0,Math.PI*2); ringCtx.stroke();
  ringCtx.strokeStyle = '#4CAF50';
  ringCtx.beginPath(); ringCtx.arc(85,85,60,-Math.PI/2,-Math.PI/2+Math.PI*2*pct); ringCtx.stroke();
}
function refreshDash(){
  const prof = getProf(), diary = getDiary();
  let k=0,p=0,c=0,f=0,fib=0;
  Object.values(diary).flat().forEach(it=>{
    k+=it.k;p+=it.mac.p;c+=it.mac.c;f+=it.mac.f;fib+=it.mac.fib;
  });
  drawRing(Math.min(k/prof.cal,1));
  $('kcalLabel').innerHTML = `${k}/${prof.cal}<br>kcal`;

  const bars = [['protBar',p,prof.mac.p],['carbBar',c,prof.mac.c],
                ['fatBar',f,prof.mac.f], ['fibBar',fib,prof.mac.fib]];
  bars.forEach(([id,val,goal])=>{
    const el=$(id); el.style.setProperty('--fill',`${Math.min(val/goal,1)*100}%`);
    el.style.background=`linear-gradient(90deg,#4CAF50 var(--fill),#eee var(--fill))`;
    el.innerHTML = `<span style="font-size:.7rem;position:absolute;top:-18px">${val}/${goal}</span>`;
  });
  $('dashboard').querySelector('h2').textContent = `Hello${prof.name?`, ${prof.name}`:''}!`;
}

/* ---------- render diary ---------- */
function renderDiary(){
  const ul=$('diaryUL'); ul.innerHTML='';
  const d=getDiary();
  Object.entries(d).forEach(([meal,arr])=>{
    arr.forEach((it,i)=>{
      const li=document.createElement('li');
      li.dataset.meal=meal; li.dataset.idx=i;
      li.innerHTML=`<span>${it.n} ${it.qty}${it.u}</span>
                    <span>${it.k} kcal</span>
                    <button class="del">🗑</button>`;
      ul.appendChild(li);
    });
  });
}

/* ---------- modals ---------- */
function openFoodDetail(it){
  $('fTitle').textContent = it.n; $('fServ').textContent = `Serving ${it.serv}`;
  $('fMacros').innerHTML = Object.entries(it.mac)
    .map(([k,v])=>`<li>${k}: ${v}</li>`).join('');
  $('fMicros').innerHTML = Object.entries(it.mic||{})
    .map(([k,v])=>`<li>${k}: ${v}</li>`).join('');
  $('foodModal').classList.remove('hidden');
}

/* ---------- events ---------- */
document.querySelectorAll('footer button').forEach(b=>{
  b.onclick=()=>{document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
                 $(b.dataset.target).classList.add('active');};
});
$('p-goal-type').onchange=e=>$('p-goal-extra').classList.toggle('hidden',e.target.value==='maintain');
$('p-save').onclick=()=>{
  const p=getProf();
  Object.assign(p,{name:$('p-name').value.trim(),gender:$('p-gender').value,
    age:+$('p-age').value,weight:+$('p-weight').value,height:+$('p-height').value,
    goal:{type:$('p-goal-type').value,deltaKg:+$('p-delta').value||0,weeks:+$('p-weeks').value||1}});
  applyGoal(p); setProf(p);
  $('p-msg').textContent = `Targets set • ${p.cal} kcal`; setTimeout(()=>$('p-msg').textContent='',2500);
  refreshDash();
};
$('open-add').onclick=()=>$('addModal').classList.remove('hidden');
$('addClose').onclick=()=>$('addModal').classList.add('hidden');
$('foodClose').onclick=()=>$('foodModal').classList.add('hidden');

$('saveFood').onclick=()=>{
  const name=$('food-name').value.trim().toLowerCase();
  const base=foodDB[name]||foodDB.rice;
  const qty=+$('serv-qty').value||0,u=$('serv-unit').value,meal=$('meal-sel').value;
  const f=qty/100, entry={n:base.n,qty,u,k:Math.round(base.k*f),
    mac:{p:+(base.mac.p*f).toFixed(1),c:+(base.mac.c*f).toFixed(1),
         f:+(base.mac.f*f).toFixed(1),fib:+(base.mac.fib*f).toFixed(1)},
    mic:base.mic,serv:base.serv};
  const d=getDiary(); (d[meal]=d[meal]||[]).push(entry); setDiary(d);
  $('addModal').classList.add('hidden'); $('food-name').value=''; renderDiary(); refreshDash();
};
$('diaryUL').onclick=e=>{
  const li=e.target.closest('li'); if(!li) return;
  const d=getDiary(), arr=d[li.dataset.meal], it=arr[li.dataset.idx];
  if(e.target.classList.contains('del')){arr.splice(li.dataset.idx,1); setDiary(d); renderDiary(); refreshDash();}
  else openFoodDetail(it);
};

/* ---------- boot ---------- */
refreshDash(); renderDiary();
