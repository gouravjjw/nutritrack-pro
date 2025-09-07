/***** UTILITIES *****/
const $ = id => document.getElementById(id);
const todayKey = () => new Date().toISOString().slice(0,10);

/***** PROFILE MODEL *****/
const defaultProfile = {
  name:'',gender:'male',age:30,weight:70,height:170,
  goal:{type:'maintain',deltaKg:0,weeks:0},
  macros:{protein:0,carbs:0,fat:0,fiber:0},
  calorieGoal:2000
};
function getProfile(){return JSON.parse(localStorage.getItem('nt_profile')||JSON.stringify(defaultProfile));}
function setProfile(p){localStorage.setItem('nt_profile',JSON.stringify(p));}

/***** GOAL ENGINE *****/
const kcalMaint = p => Math.round((10*p.weight)+(6.25*p.height)-(5*p.age)+(p.gender==='male'?5:-161));
function applyGoal(p){
  const kcal = kcalMaint(p);
  if(p.goal.type==='loss'){
    const def = (p.goal.deltaKg*7700)/(p.goal.weeks*7);
    p.calorieGoal = kcal-def;
  }else if(p.goal.type==='gain'){
    p.calorieGoal = kcal + (250*p.goal.deltaKg);
  }else p.calorieGoal = kcal;

  p.macros = {
    protein: Math.round(p.calorieGoal*0.25/4),
    carbs  : Math.round(p.calorieGoal*0.45/4),
    fat    : Math.round(p.calorieGoal*0.30/9),
    fiber  : 30
  };
}

/***** BASIC FOOD DATABASE (sample) *****/
const foodDB={
  rice:{name:"Cooked Rice",serv:"100g",kcal:121,macro:{protein:2.6,carbs:25.2,fat:0.4,fiber:0.4},
        micro:{vitamin_c:0,iron:0.2}},
  egg :{name:"Boiled Egg",serv:"50g",kcal:78,macro:{protein:6.3,carbs:0.6,fat:5.3,fiber:0},
        micro:{vitamin_a:80,iron:0.6}}
};

/***** DIARY STORAGE *****/
function getDiary(){return JSON.parse(localStorage.getItem(todayKey())||'{}');}
function setDiary(d){localStorage.setItem(todayKey(),JSON.stringify(d));}

/***** RENDER FUNCTIONS *****/
function ring(ctx,percent,color){
  ctx.clearRect(0,0,170,170);
  ctx.lineWidth=14;ctx.strokeStyle="#eee";
  ctx.beginPath();ctx.arc(85,85,60,0,2*Math.PI);ctx.stroke();
  ctx.strokeStyle=color;
  ctx.beginPath();ctx.arc(85,85,60,-Math.PI/2,(-Math.PI/2)+(2*Math.PI*percent));
  ctx.stroke();
}
function refreshDashboard(){
  const prof=getProfile(); const diary=getDiary();
  let kcal=0,prot=0,carb=0,fat=0,fib=0;
  Object.values(diary).flat().forEach(it=>{
    kcal+=it.kcal;prot+=it.macro.protein;carb+=it.macro.carbs;fat+=it.macro.fat;fib+=it.macro.fiber;
  });
  // ring
  const pct=Math.min(kcal/prof.calorieGoal,1);
  ring(kcalCtx,pct,"#4CAF50");
  $("kcalLabel").innerHTML=`${kcal}/${prof.calorieGoal}<br>kcal`;
  // bars
  const bars=[["protBar",prot,prof.macros.protein],
              ["carbBar",carb,prof.macros.carbs],
              ["fatBar",fat,prof.macros.fat],
              ["fibBar",fib,prof.macros.fiber]];
  bars.forEach(([id,val,goal])=>{
    const el=$(id);
    el.style.setProperty("--fill",`${Math.min(val/goal,1)*100}%`);
    el.style.position="relative";
    el.innerHTML=`<span class='lbl'>${id.slice(0,3)} ${val}/${goal}</span>`;
    el.querySelector(".lbl")?.remove();
    const lbl=document.createElement("div");
    lbl.className="lbl";lbl.style="font-size:.7rem;position:absolute;top:-18px";
    lbl.textContent=`${val}/${goal}`;
    el.appendChild(lbl);
    el.style.setProperty("background-image",
      `linear-gradient(90deg,#4CAF50 var(--fill),#eee var(--fill))`);
  });
  // greeting
  $("dashboard").querySelector("h2").textContent=`Hello${prof.name?`, ${prof.name}`:''}!`;
}
/***** BUILD DIARY LIST *****/
function renderDiary(){
  const diary=getDiary();const ul=$("diaryUL");ul.innerHTML='';
  Object.entries(diary).forEach(([meal,arr])=>{
    arr.forEach((it,i)=>{
      const li=document.createElement("li");li.dataset.meal=meal;li.dataset.index=i;
      li.innerHTML=`<span>${it.name} ${it.qty}${it.unit}</span>
        <span>${it.kcal} kcal</span>
        <button class="edit">✎</button><button class="del">🗑</button>`;
      ul.appendChild(li);
    });
  });
}

/***** FOOD MODAL *****/
function openFoodModal(item){
 $("modal-title").textContent=item.name;
 $("modal-serv").textContent=`Serving ${item.serv}`;
 // macros
 const macUL=$("modal-macros");macUL.innerHTML='';
 Object.entries(item.macro).forEach(([k,v])=>{
   const li=document.createElement("li");li.textContent=`${k}: ${v}`;
   macUL.appendChild(li);
 });
 // micros
 const miUL=$("modal-micros");miUL.innerHTML='';
 Object.entries(item.micro||{}).forEach(([k,v])=>{
   const li=document.createElement("li");li.textContent=`${k}: ${v}`;
   miUL.appendChild(li);
 });
 $("food-modal").classList.remove("hidden");
}

/***** EVENT BINDINGS *****/
const kcalCtx=$("kcalRing").getContext("2d");
document.querySelectorAll("footer nav button").forEach(btn=>{
 btn.onclick=()=>{document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
                  $(btn.dataset.target).classList.add("active");};
});
$("p-goal-type").onchange=e=>$("p-goal-extra").classList.toggle("hidden",e.target.value==="maintain");

$("p-save").onclick=()=>{
  const p=getProfile();
  Object.assign(p,{
    name:$("p-name").value.trim(),gender:$("p-gender").value,
    age:+$("p-age").value,weight:+$("p-weight").value,height:+$("p-height").value,
    goal:{type:$("p-goal-type").value,deltaKg:+$("p-delta").value||0,weeks:+$("p-weeks").value||0}
  });
  applyGoal(p);setProfile(p);
  $("p-msg").textContent=`Targets set • ${p.calorieGoal} kcal`;
  setTimeout(()=>$("p-msg").textContent='',3000);
  refreshDashboard();
};

$("open-add").onclick=()=>$("add-modal").classList.remove("hidden");
$("add-close").onclick=()=>$("add-modal").classList.add("hidden");
$("modal-close").onclick=()=>$("food-modal").classList.add("hidden");

$("save-food").onclick=()=>{
  const name=$("food-name").value.trim().toLowerCase();
  const base=foodDB[name]||foodDB.rice;         // fallback
  const qty=+$("serv-qty").value,unit=$("serv-unit").value,meal=$("meal-sel").value;
  const factor=qty/100;
  const entry={
    name:base.name,qty,unit,kcal:Math.round(base.kcal*factor),
    macro:{
      protein:+(base.macro.protein*factor).toFixed(1),
      carbs  :+(base.macro.carbs*factor).toFixed(1),
      fat    :+(base.macro.fat*factor).toFixed(1),
      fiber  :+(base.macro.fiber*factor).toFixed(1)
    },
    micro:base.micro,serv:base.serv
  };
  const diary=getDiary();
  (diary[meal]=diary[meal]||[]).push(entry);
  setDiary(diary);$("add-modal").classList.add("hidden");
  renderDiary();refreshDashboard();
  $("food-name").value='';
};

$("diaryUL").onclick=e=>{
  const li=e.target.closest("li");if(!li)return;
  const diary=getDiary();const arr=diary[li.dataset.meal];
  const item=arr[li.dataset.index];
  if(e.target.classList.contains("del")){
    arr.splice(li.dataset.index,1);setDiary(diary);renderDiary();refreshDashboard();
  }else if(e.target.classList.contains("edit")){
    // basic edit: reopen add modal pre-filled (left for brevity)
  }else openFoodModal(item);
};

/***** INIT *****/
renderDiary();refreshDashboard();
