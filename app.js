'use strict';
const K='borafechar:v1',$=s=>document.querySelector(s);
const fmt=c=>(c/100).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const CATS=[['casa','🏠','Casa'],['comida','🍔','Comida'],['transp','🚗','Transporte'],['contas','💡','Luz'],['agua','💧','Água'],['internet','🌐','Internet'],['gas','🔥','Gás'],['condominio','🏢','Condomínio'],['seguro','🛡️','Seguro'],['lazer','🎉','Lazer'],['compras','🛍️','Compras'],['guardar','💰','Guardar dinheiro'],['outra','➕','Outra coisa']];
const IDEAS=[
['micro','📝','Microtarefas','Pequenas tarefas online, feitas aos poucos.','R$ 10 a R$ 60 por dia (estimativa)','Fácil','15–60 min',.5],
['venda','🛍️','Venda de produtos','Venda algo que você já tem ou encontre revenda.','Depende do que você vender','Médio','1–2 h',.5],
['cel','📱','Trabalhos pelo celular','Atividades que dá pra fazer só com o celular.','Os valores variam','Fácil','30–90 min',.5],
['local','🧹','Serviços locais','Pequenos serviços para pessoas próximas.','Pode render R$ 40 a R$ 150 por serviço','Médio','2–4 h',1],
['free','💻','Freelances','Serviços digitais para pessoas ou empresas.','Depende da oportunidade','Alto','2–4 h',2],
['entr','🛵','Entregas','Trabalho com entregas, quando disponível na sua região.','Os valores variam muito','Alto','2–4 h',2]];
const ACH={g1:['🏆','Primeira meta criada'],m1:['🔥','Primeiro dinheiro registrado'],h50:['💪','50% da meta alcançada'],done:['🚀','Meta concluída'],org:['🎯','Mês organizado']};
const newM=()=>({id:new Date().toISOString().slice(0,7),income:null,items:[],stage:'income',goal:null});
function load(){try{const s=JSON.parse(localStorage.getItem(K));if(s&&s.m)return s}catch(e){}return{m:newM(),hist:[],ach:[],view:'home'}}
let S=load(),sub=0,tmp={};
const save=()=>{try{localStorage.setItem(K,JSON.stringify(S))}catch(e){}};
const spent=()=>S.m.items.reduce((a,i)=>a+i.v,0);
const diff=()=>S.m.income-spent();
const pct=g=>g.got>=g.target?100:Math.min(99,Math.round(g.got/g.target*100));
const daily=g=>Math.round(g.target/g.days);
const MN=['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const mName=id=>MN[+id.slice(5)-1]+' '+id.slice(0,4);
function unlock(k){if(!S.ach.includes(k)){S.ach.push(k);return true}return false}
function streak(){const g=S.m.goal;if(!g)return 0;const days=new Set(g.log.map(l=>l.d));let n=0,d=new Date();if(!days.has(d.toISOString().slice(0,10)))d.setDate(d.getDate()-1);while(days.has(d.toISOString().slice(0,10))){n++;d.setDate(d.getDate()-1)}return n}
const moneyIn=(id,ph)=>`<label for="${id}" class="sm">Valor em reais</label><input class="money" id="${id}" inputmode="numeric" autocomplete="off" placeholder="${ph||'R$ 0,00'}" data-c="0">`;
document.addEventListener('input',e=>{const t=e.target;if(t.classList.contains('daysin')){const d=t.value.replace(/\D/g,'').slice(0,3);t.value=d;t.dataset.c=d?parseInt(d,10):0;if(d){tmp.days=0;document.querySelectorAll('.chip.on').forEach(c=>c.classList.remove('on'))}return}if(!t.classList.contains('money'))return;const d=t.value.replace(/\D/g,'').slice(0,9);const c=parseInt(d||'0',10);t.dataset.c=c;t.value=d?fmt(c):''});
const cents=id=>parseInt($('#'+id).dataset.c||'0',10);
function render(){
 const m=S.m,v=S.view;let h='';
 if(v==='home')h=home();else if(v==='goal')h=goalV();else if(v==='prog')h=progV();else h=setV();
 $('#app').innerHTML=`<div class="screen">${h}</div>`;
 $('#nav').innerHTML=[['home','🏠','Início'],['goal','🎯','Minha meta'],['prog','📈','Progresso'],['set','⚙️','Ajustes']].map(([k,e,n])=>`<button data-a="nav" data-v="${k}" class="${v===k?'on':''}" aria-label="${n}" ${v===k?'aria-current="page"':''}><span>${e}</span>${n}</button>`).join('');
 const bar=$('.bar i');if(bar){const w=bar.dataset.w;requestAnimationFrame(()=>setTimeout(()=>bar.style.width=w+'%',60))}
}
function home(){
 const m=S.m;
 if(m.stage==='income')return `<div class="big">👋</div><h1>Oi! Vamos cuidar do seu dinheiro?</h1><p>Vou te fazer algumas perguntas rápidas. Primeiro me conta: quanto você recebeu este mês?</p>${moneyIn('inc','R$ 2.300,00')}<div class="err" id="err"></div><button class="btn" data-a="income">Continuar →</button>`;
 if(m.stage==='spend')return `<h1>🏠 Para onde seu dinheiro vai?</h1><p>Vamos organizar seus principais gastos. Toque num card para adicionar.</p><div class="grid">${CATS.map(([k,e,n],i)=>{const it=m.items.find(x=>x.k===k);return `<button class="cat ${it?'on':''}" style="animation-delay:${i*40}ms" data-a="cat" data-v="${k}" aria-label="${n}${it?', '+fmt(it.v):''}"><span>${e}</span>${n}${it?`<small>✔ ${fmt(it.v)}</small>`:''}</button>`}).join('')}</div>${m.items.length?`<p class="pct">${m.items.length} ${m.items.length>1?'categorias adicionadas':'categoria adicionada'} 🔥</p><button class="btn" data-a="finish">Pronto, bora ver como ficou →</button>`:`<p class="sm">Adicione pelo menos um gasto pra continuar.</p>`}`;
 const d=diff(),need=spent();
 if(d>0)return `<div class="big">🎉</div><h1>Boa!</h1><p>Parece que seu mês está sob controle. Depois dos seus gastos, você pode ficar com:</p><div class="val" style="color:var(--lime)">💰 ${fmt(d)}</div><button class="btn" data-a="sobra" data-v="Guardar">💰 Guardar</button><button class="btn alt" data-a="sobra" data-v="Aproveitar">🎉 Aproveitar</button><button class="btn alt" data-a="sobra" data-v="Planejar">📅 Planejar o próximo mês</button>${edit()}`;
 if(d===0)return `<div class="big">😎</div><h1>Mês equilibrado!</h1><p>Tudo certinho: o que você recebe cobre o que você planejou. Sem sobra e sem aperto.</p>${edit()}`;
 const g=m.goal;
 return `<div class="big">😬</div><h1>Calma, encontramos um probleminha...</h1><div class="card"><p>Seu mês precisa de:</p><div class="val">${fmt(need)}</div><p>Você tem:</p><div class="val">${fmt(m.income)}</div></div><div class="red">🔴 Faltam ${fmt(-d)}</div><p style="text-align:center">💪 Vamos buscar uma solução. Não precisa resolver tudo de uma vez.</p><button class="btn hero" data-a="${g?'nav':'plan'}" data-v="goal">🚀 ME AJUDE A CONSEGUIR ${fmt(-d)}</button>${edit()}`;
}
const edit=()=>`<button class="btn alt" data-a="back">✏️ Mudar meus gastos</button>`;
function goalV(){
 const m=S.m,g=m.goal;
 if(!g){
  if(m.stage!=='result'||diff()>=0)return `<div class="big">🎯</div><h1>Ainda sem meta</h1><p>Quando faltar dinheiro no seu mês, é aqui que a gente monta o plano.</p><button class="btn" data-a="nav" data-v="home">Voltar ao início</button>`;
  const t=-diff();
  if(sub<=0)return `<h1>💡 Vamos buscar esse dinheiro?</h1><div class="card"><p>🎯 Sua meta:</p><div class="val">${fmt(t)}</div></div><h2>📅 Em quantos dias você quer tentar resolver isso?</h2><div class="chips">${[7,15,30].map(n=>`<button class="chip ${tmp.days===n?'on':''}" data-a="days" data-v="${n}">${n} dias</button>`).join('')}</div><input class="daysin" id="cd" inputmode="numeric" maxlength="3" autocomplete="off" aria-label="Outro prazo em dias" placeholder="Outro prazo em dias" data-c="0"><div class="err" id="err"></div><button class="btn" data-a="s1">Continuar →</button>`;
  return `<h1>⏰ Quanto tempo você tem por dia?</h1><div class="chips">${[[.5,'30 minutos'],[1,'1 hora'],[2,'2 horas'],[4,'4 horas'],[5,'Mais de 4 horas']].map(([n,l])=>`<button class="chip ${tmp.hours===n?'on':''}" data-a="hours" data-v="${n}">${l}</button>`).join('')}</div><div class="card"><p>Meta de ${fmt(t)} em ${tmp.days} dias:</p><div class="val">${fmt(Math.round(t/tmp.days))}</div><p>por dia</p></div><div class="err" id="err"></div><button class="btn" data-a="mk">Criar meu plano 🚀</button><button class="btn alt" data-a="s0">← Voltar</button>`;
 }
 const p=pct(g),rem=Math.max(0,g.target-g.got),list=[...IDEAS].sort((a,b)=>(a[7]<=g.hours?0:1)-(b[7]<=g.hours?0:1)||a[7]-b[7]);
 let h=`<h1>🎯 Minha meta</h1><div class="card"><p>Meta: ${fmt(g.target)} em ${g.days} dias</p><div class="val">${fmt(daily(g))}<span class="sm"> por dia</span></div><div class="bar" role="progressbar" aria-valuenow="${p}" aria-valuemin="0" aria-valuemax="100"><i data-w="${p}"></i></div><div class="pct">${p}%</div><p style="text-align:center">${p>=100?'🎉 Você conseguiu!':'Faltam '+fmt(rem)}</p></div><button class="btn" data-a="reg">➕ Registrei dinheiro</button><h2>🔥 Plano sugerido</h2><p>Você precisa buscar aproximadamente ${fmt(daily(g))} por dia. Marque o que pretende tentar. Os valores variam, confira as condições antes de começar.</p>`;
 h+=list.map((x,i)=>{const on=g.ideas.includes(x[0]);return `<div class="card idea ${on?'sel':''}" style="animation-delay:${i*50}ms"><div class="e">${x[1]}</div><div style="flex:1"><h2>${x[2]}</h2><p>${x[3]}</p><span class="tag">💸 ${x[4]}</span><span class="tag">⚡ Esforço: ${x[5]}</span><span class="tag">⏱️ ${x[6]}</span><button class="btn alt" data-a="idea" data-v="${x[0]}" aria-pressed="${on}">${on?'✅ Vou tentar':'Ver ideia / Vou tentar'}</button></div></div>`}).join('');
 return h;
}
function progV(){
 const g=S.m.goal,s=streak();
 let h=`<h1>📈 Seu progresso</h1>`;
 h+=g?`<div class="card"><h2>🎯 Meta: ${fmt(g.target)}</h2><div class="bar"><i data-w="${pct(g)}"></i></div><div class="pct">${pct(g)}% · conseguiu ${fmt(g.got)}</div><p style="text-align:center">🔥 Sequência: ${s} ${s===1?'dia':'dias'}</p></div>`:`<div class="card"><p>Você ainda não tem uma meta. Quando criar, o progresso aparece aqui.</p></div>`;
 h+=`<h2>🏆 Conquistas</h2><div class="card">${Object.entries(ACH).map(([k,[e,n]])=>{const on=S.ach.includes(k);return `<div class="ach ${on?'':'off'}"><span style="font-size:2rem">${e}</span>${n} ${on?'✔':'🔒'}</div>`}).join('')}</div>`;
 if(S.hist.length)h+=`<h2>📅 Meses anteriores</h2>${S.hist.slice().reverse().map(x=>`<div class="card">📅 ${mName(x.id)} ${x.goal&&x.goal.got>=x.goal.target?'🚀 meta concluída':x.goal?'🎯 meta em andamento':'✔ organizado'}</div>`).join('')}`;
 return h;
}
const setV=()=>`<h1>⚙️ Configurações</h1><button class="btn alt" data-a="newm">🔄 Começar um novo mês</button><button class="btn danger" data-a="wipe">🗑️ Apagar meus dados</button><p class="sm">Seus dados ficam só neste aparelho. BoraFechar é um organizador, não promete renda: os valores das ideias são estimativas.</p>`;
function modal(h){const m=$('#modal');if(!h){m.hidden=true;m.innerHTML='';return}m.hidden=false;m.innerHTML=`<div class="sheet" role="dialog" aria-modal="true">${h}</div>`;const i=m.querySelector('input');if(i)i.focus()}
function confetti(n=60){const c=['#b6f23a','#ffd23f','#ff7ad9','#7ad7ff','#ff6b6b'];for(let i=0;i<n;i++){const d=document.createElement('i');d.className='conf';d.style.cssText=`left:${Math.random()*100}vw;background:${c[i%5]};animation-delay:${Math.random()*.6}s;animation-duration:${1.8+Math.random()*1.4}s`;document.body.appendChild(d);setTimeout(()=>d.remove(),3800)}}
let failed=false;
function err(t){failed=true;const e=(!$('#modal').hidden&&$('#merr'))||$('#err');if(e)e.textContent=t}
const A={
 nav(v){S.view=v;sub=0},
 income(){const c=cents('inc');if(c<=0)return err('Coloque um valor maior que zero 🙂');S.m.income=c;S.m.stage='spend'},
 cat(k){const [,e,n]=CATS.find(c=>c[0]===k),it=S.m.items.find(x=>x.k===k);tmp.cat=k;modal(`<div class="big">${e}</div><h2>${n}</h2><p>Quanto você pretende gastar com isso?</p>${moneyIn('mv')}<div class="err" id="merr"></div><button class="btn" data-a="addcat">Adicionar</button>${it?'<button class="btn alt" data-a="rmcat">Remover</button>':''}<button class="btn alt" data-a="close">Cancelar</button>`)},
 addcat(){const c=cents('mv');if(c<=0)return err('Digite um valor maior que zero.');const x=S.m.items.find(i=>i.k===tmp.cat);x?x.v=c:S.m.items.push({k:tmp.cat,v:c});modal()},
 rmcat(){S.m.items=S.m.items.filter(i=>i.k!==tmp.cat);modal()},
 close(){modal()},
 finish(){S.m.stage='result';if(unlock('org'))setTimeout(()=>confetti(30),300)},
 back(){S.m.stage='spend'},
 sobra(v){const t={Guardar:'💰 Ótima ideia! Separe esse valor assim que ele cair.',Aproveitar:'🎉 Merecido! Aproveite sem culpa.','Planejar':'📅 Boa! Quando o mês acabar, é só começar um novo em Ajustes.'}[v];modal(`<div class="big">😎</div><h2>${t}</h2><button class="btn" data-a="close">Bora!</button>`)},
 plan(){sub=0;tmp={};S.view='goal'},
 days(v){tmp.days=+v},
 s1(){const c=cents('cd');if(c>0)tmp.days=c;if(!(tmp.days>0))return err('Escolha um prazo (mínimo 1 dia).');if(tmp.days>365)return err('Escolha até 365 dias.');sub=1},
 s0(){sub=0},
 hours(v){tmp.hours=+v},
 mk(){if(!tmp.hours)return err('Escolha quanto tempo você tem por dia.');const t=-diff();if(t<=0)return;S.m.goal={target:t,days:tmp.days,hours:tmp.hours,ideas:[],got:0,log:[]};unlock('g1');sub=0;tmp={};confetti(30)},
 idea(v){const g=S.m.goal,i=g.ideas.indexOf(v);i<0?g.ideas.push(v):g.ideas.splice(i,1)},
 reg(){modal(`<div class="big">🎉</div><h2>Quanto você conseguiu?</h2>${moneyIn('rv','R$ 150')}<div class="err" id="merr"></div><button class="btn" data-a="doreg">Registrar</button><button class="btn alt" data-a="close">Cancelar</button>`)},
 doreg(){const g=S.m.goal,c=cents('rv');if(c<=0)return err('Digite um valor maior que zero.');if(g.got+c>g.target&&!confirm('Esse valor passa da meta. Registrar mesmo assim?'))return;
  const was=pct(g);g.got+=c;g.log.push({c,d:new Date().toISOString().slice(0,10)});const p=pct(g);unlock('m1');if(p>=50)unlock('h50');
  let t,s;if(g.got>g.target){t='🎉 Você passou da meta!';s='Você conseguiu '+fmt(g.got)+'.'}else if(p>=100){t='🎉🎉🎉 VOCÊ CONSEGUIU!';s='Você fechou sua meta de '+fmt(g.target)+'.'}else if(p>=75){t='🚀 Está quase!';s='Faltam só '+fmt(g.target-g.got)+'.'}else if(p>=50){t='🔥 Metade do caminho!';s='Faltam '+fmt(g.target-g.got)+'.'}else{t='🎉 BOA!';s='Você já conseguiu '+fmt(g.got)+'. Agora faltam '+fmt(g.target-g.got)+'!'}
  if(p>=100){unlock('done');confetti(120)}else confetti(30);
  save();S.view='goal';render();
  modal(`<div class="big">${p>=100?'🏆':'🎉'}</div><h2>${t}</h2><p>${s}</p><div class="bar"><i data-w="${p}" style="width:${was}%"></i></div><div class="pct">${p}%</div><button class="btn" data-a="close">Continuar 💪</button>`);
  setTimeout(()=>{const b=$('#modal .bar i');if(b)b.style.width=p+'%'},80);return 'keep'},
 newm(){modal(`<div class="big">🔄</div><h2>Começar um novo mês?</h2><p>Seu mês atual vai para o histórico.</p><button class="btn" data-a="donew">Sim, bora!</button><button class="btn alt" data-a="close">Cancelar</button>`)},
 donew(){if(S.m.income)S.hist.push(S.m);S.m=newM();S.view='home';modal()},
 wipe(){modal(`<div class="big">🗑️</div><h2>Apagar tudo?</h2><p>Isso apaga receita, metas, histórico e conquistas deste aparelho. Não dá pra desfazer.</p><button class="btn danger" data-a="dowipe">Sim, apagar tudo</button><button class="btn alt" data-a="close">Cancelar</button>`)},
 dowipe(){try{localStorage.removeItem(K)}catch(e){}S={m:newM(),hist:[],ach:[],view:'home'};tmp={};sub=0;modal()}
};
document.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(!b)return;failed=false;const r=A[b.dataset.a](b.dataset.v);if(r==='keep'||failed)return;save();render()});
render();
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('service-worker.js').catch(()=>{}));
