/* Simulador de compra Monteza Residences · Skyline Constructions */
(function(){
var root=document.getElementById('simulador');if(!root)return;
var CFG=JSON.parse(document.getElementById('sim-cfg').textContent);
var U=CFG.units, B=CFG.bancos, MAXM=CFG.mesesEntrega, ENTMIN=CFG.entradaMin||5, SUG=CFG.entradaSug||20;
var PRIV=['pichincha','pacifico','produbanco','otra'];
var $=function(s){return root.querySelector(s)};
var money=function(v){return 'USD '+Math.round(v).toLocaleString('es-EC')};
var money2=function(v){return 'USD '+v.toLocaleString('es-EC',{minimumFractionDigits:2,maximumFractionDigits:2})};
var pct=function(v){return (Math.round(v*10)/10).toLocaleString('es-EC')+' %'};
var st={modo:'plazo',sis:'frances',banco:'pichincha',full:false};
var el={u:$('#s-unidad'),p:$('#s-precio'),e:$('#s-ent'),ev:$('#s-ent-v'),m:$('#s-meses'),mv:$('#s-meses-v'),c:$('#s-cuota'),
 bk:$('#h-banco'),t:$('#h-tasa'),y:$('#h-anios'),yv:$('#h-anios-v')};
var g={};U.forEach(function(u){if(!u.pvp)return;(g[u.tipo]=g[u.tipo]||[]).push(u)});
Object.keys(g).forEach(function(t){var og=document.createElement('optgroup');og.label=t;g[t].forEach(function(u){var o=document.createElement('option');o.value=u.id;o.textContent=u.id+' · '+u.nivel+' · '+u.area.toFixed(2)+' m² · '+money(u.pvp);og.appendChild(o)});el.u.appendChild(og)});
B.forEach(function(b){var o=document.createElement('option');o.value=b.id;o.textContent=b.n;el.bk.appendChild(o)});
function bankOf(id){return B.find(function(b){return b.id===id})||B[0]}
function unitOf(id){return U.find(function(x){return x.id===id})}
function amort(L,tasa,anios,sis){var n=anios*12,i=tasa/100/12,rows=[],s=L,c;
 if(L<=0)return rows;
 if(sis==='frances'){c=i?L*i/(1-Math.pow(1+i,-n)):L/n;for(var k=1;k<=n;k++){var it=s*i,ca=c-it;s-=ca;rows.push({k:k,c:c,i:it,a:ca,s:Math.max(0,s)})}}
 else{var ca2=L/n;for(var k2=1;k2<=n;k2++){var it2=s*i;s-=ca2;rows.push({k:k2,c:ca2+it2,i:it2,a:ca2,s:Math.max(0,s)})}}
 return rows}
function sum(r,k){return r.reduce(function(a,x){return a+x[k]},0)}
/* Motor puro: recibe un estado y devuelve todos los resultados */
function simulate(s){
 var P=Math.max(0,+s.p||0), e=Math.min(100,Math.max(ENTMIN,+s.e||SUG)), E=P*e/100, S=P-E, n,cu,paid,saldo;
 if(s.modo==='plazo'){n=Math.max(1,Math.min(MAXM,+s.n||MAXM));cu=S/n;paid=S;saldo=0}
 else if(s.modo==='cuota'){var c=Math.max(0,+s.c||0);if(c<=0||S<=0){n=0;cu=0;paid=0;saldo=S}else{n=Math.min(MAXM,Math.ceil(S/c-1e-9));cu=c;paid=Math.min(S,c*n);saldo=S-paid;if(saldo<0.5)saldo=0}}
 else{n=0;cu=0;paid=0;saldo=S}
 if(S<=0){n=0;cu=0;paid=0;saldo=0}
 var b=bankOf(s.b), tasa=+s.t, anios=+s.y, rows=amort(saldo,tasa,anios,s.sis||'frances');
 var c1=rows.length?rows[0].c:0, ti=sum(rows,'i');
 var ref=bankOf(CFG.bancoRef), base=amort(P*0.8,ref.t,ref.y,'frances'), bi=sum(base,'i'), cb=base.length?base[0].c:0;
 var ult=n?S-cu*(n-1):0, pagado=E+paid, pctEnt=P?pagado/P*100:0;
 var warn=[];
 if(b.cap&&P>b.cap)warn.push('El precio de esta unidad ('+money(P)+') supera el tope de '+money(b.cap)+' para '+b.n+'. Elige otra entidad o una unidad dentro del tope.');
 if(b.min&&P<=b.min)warn.push('Con este precio la unidad corresponde al segmento VIS, no VIP.');
 if(b.loanMax&&saldo>b.loanMax)warn.push('El préstamo ('+money(saldo)+') supera el máximo de '+money(b.loanMax)+'; la diferencia debe cubrirse antes de la entrega.');
 if(PRIV.indexOf(b.id)>=0&&saldo>P*0.8+1)warn.push('Los bancos suelen financiar hasta el 80 % del valor. Te falta pagar '+money(saldo-P*0.8)+' antes de la entrega: súmalo a tus cuotas sin intereses y te ayudamos a armarlo.');
 if(anios>b.ymax)warn.push('Plazo máximo referencial para esta entidad: '+b.ymax+' años.');
 if(tasa>CFG.tasaMaxLegal)warn.push('La tasa supera la máxima legal vigente ('+String(CFG.tasaMaxLegal).replace('.',',')+' %).');
 return {s:s,u:s.u||'',unit:unitOf(s.u),P:P,e:e,E:E,S:S,n:n,cu:cu,ult:ult,paid:paid,saldo:saldo,pagado:pagado,pctEnt:pctEnt,b:b,tasa:tasa,anios:anios,sis:s.sis||'frances',rows:rows,c1:c1,ti:ti,bi:bi,cb:cb,ahorro:Math.max(0,bi-ti),total:P+ti,ing:c1/CFG.relacionCuotaIngreso,warn:warn,modo:s.modo};
}
function getState(){return {u:el.u.value,p:+el.p.value||0,e:+el.e.value,modo:st.modo,n:+el.m.value,c:+el.c.value||0,b:st.banco,t:+el.t.value,y:+el.y.value,sis:st.sis}}
function round50(v){return Math.max(100,Math.ceil(v/50)*50)}
function preset(k,base){var P=base.p,s={u:base.u,p:P,b:base.b,t:base.t,y:base.y,sis:base.sis};
 if(k==='ligero'){s.e=5;s.modo='cuota';s.c=round50(P*0.15/MAXM);s.n=MAXM}
 else if(k==='equilibrado'){s.e=20;s.modo='cuota';s.c=round50(P*0.2/MAXM);s.n=MAXM}
 else{s.e=20;s.modo='plazo';s.n=MAXM;s.c=0}
 var bk=bankOf(s.b);if(bk.cap&&P>bk.cap||bk.min&&P<=bk.min){s.b='pichincha';s.t=bankOf('pichincha').t;s.y=Math.min(s.y,20)}
 return s}
var PRESET_N={ligero:'Empieza ligero',equilibrado:'Equilibrado (sugerido)',cero:'Cero deuda'};
function applyState(s,silent){
 if(s.u&&unitOf(s.u)){el.u.value=s.u}else el.u.value='';
 el.p.value=Math.round(s.p||0);el.e.value=s.e||SUG;
 st.modo=s.modo||'plazo';root.querySelectorAll('[data-modo]').forEach(function(x){x.setAttribute('aria-pressed',x.dataset.modo===st.modo)});$('#w-plazo').hidden=st.modo!=='plazo';$('#w-cuota').hidden=st.modo!=='cuota';
 if(s.n)el.m.value=s.n;if(s.c)el.c.value=s.c;root.querySelectorAll('[data-cuota]').forEach(function(x){x.setAttribute('aria-pressed',+x.dataset.cuota===+el.c.value)});
 st.banco=s.b||'pichincha';el.bk.value=st.banco;var bk=bankOf(st.banco);el.y.max=bk.ymax;el.t.value=(s.t!=null&&s.t!=='')?s.t:bk.t;el.y.value=s.y||Math.min(bk.y,bk.ymax);
 st.sis=s.sis||'frances';root.querySelectorAll('[data-sis]').forEach(function(x){x.setAttribute('aria-pressed',x.dataset.sis===st.sis)});
 if(!silent)calc()}
function setBank(id){st.banco=id;el.bk.value=id;var b=bankOf(id);el.t.value=b.t;el.y.max=b.ymax;el.y.value=Math.min(b.y,b.ymax);calc()}
var last=null,used=false;function used1(){if(used)return;used=true;try{if(window.gtag)gtag('event','simulator_use')}catch(e){}}
function calc(){
 var r=simulate(getState());last=r;var P=r.P,e=r.e;
 el.ev.textContent=e+' % · '+money(r.E)+(e===SUG?' · sugerido':'');
 root.querySelectorAll('[data-ent]').forEach(function(x){x.setAttribute('aria-pressed',+x.dataset.ent===e)});
 var tip=$('#s-ent-tip');
 if(e<SUG){var d=P*(SUG-e)/100,ri=amort(d,r.tasa||7.5,r.anios||20,'frances'),di=sum(ri,'i');
  tip.className='ent-tip low';tip.innerHTML='Separas hoy con solo <b>'+money(r.E)+'</b> y completas la diferencia en cuotas <b>sin intereses</b>. Si llegas al 20 % ('+money(P*SUG/100)+') antes de la entrega, tu préstamo baja '+money(d)+' y te ahorras cerca de <b>'+money(di)+'</b> en intereses.'}
 else if(e===SUG){tip.className='ent-tip ok';tip.innerHTML='<b>Gran decisión.</b> El 20 % es la entrada que piden los bancos y te abre las mejores tasas.'}
 else{tip.className='ent-tip ok';tip.innerHTML='<b>Excelente.</b> Cada punto extra de entrada reduce tu deuda y lo que pagas en intereses.'}
 if(st.modo==='plazo')el.mv.textContent=r.n+(r.n===1?' mes':' meses');
 $('#r-ent').textContent=money(r.E);
 $('#r-cuota').textContent=r.n?money2(r.cu):'—';
 $('#r-cuota-l').textContent=(st.modo==='cuota'&&r.saldo===0&&r.n>1&&Math.abs(r.ult-r.cu)>0.5)?'Cuota mensual sin intereses · la última, de '+money2(r.ult):'Cuota mensual directa · sin intereses';
 $('#r-n').textContent=r.n?r.n+(r.n===1?' cuota':' cuotas'):'Sin cuotas';
 $('#r-ent-pct').textContent=pct(r.pctEnt);
 $('#r-saldo').textContent=r.saldo>0?money(r.saldo):'USD 0';
 $('#r-bar').style.width=Math.min(100,r.pctEnt)+'%';
 $('#r-msg').innerHTML=r.saldo>0?'Recibes tus llaves con el <b>'+pct(r.pctEnt)+'</b> de tu departamento pagado. El saldo de <b>'+money(r.saldo)+'</b> lo cubres con crédito hipotecario, simulado abajo'+(r.saldo<P*0.1?', o con un pago final de ahorro antes de la entrega.':'.'):'Recibes tus llaves con tu departamento <b>100 % pagado</b>, sin deuda bancaria y sin intereses.';
 var b=r.b;el.yv.textContent=r.anios+' años';
 $('#sim-hip').classList.toggle('off',r.saldo<=0);
 $('#h-note').textContent=b.note;
 $('#h-warn').innerHTML=r.warn.map(function(w){return '<li>'+w+'</li>'}).join('');$('#h-warn').hidden=!r.warn.length;
 $('#h-cuota').textContent=r.rows.length?money2(r.c1):'—';
 $('#h-cuota-l').textContent=r.sis==='frances'?'Cuota mensual fija':'Primera cuota (luego disminuye)';
 $('#h-int').textContent=money(r.ti);$('#h-tot').textContent=money(r.saldo+r.ti);
 $('#h-ing').textContent=r.rows.length?money(r.ing):'—';
 var ref=bankOf(CFG.bancoRef);
 renderSav(r);$('#c-base').textContent=money(r.bi);$('#c-plan').textContent=money(r.ti);$('#c-ahorro').textContent=money(r.ahorro);
 $('#c-txt').innerHTML='Si financiaras el 80 % con un banco al '+String(ref.t).replace('.',',')+' % a '+ref.y+' años pagarías <b>'+money(r.bi)+'</b> en intereses. Con tu plan pagas <b>'+money(r.ti)+'</b>. '+(r.ahorro>1?'Te ahorras <b>'+money(r.ahorro)+'</b>, '+pct(r.ahorro/P*100)+' del precio de tu departamento.':'');
 var tb=$('#h-tabla tbody'), html='';
 if(st.full){r.rows.forEach(function(x){html+='<tr><td>'+x.k+'</td><td>'+money2(x.c)+'</td><td>'+money2(x.i)+'</td><td>'+money2(x.a)+'</td><td>'+money2(x.s)+'</td></tr>'})}
 else{for(var yy=0;yy<r.anios;yy++){var sl=r.rows.slice(yy*12,yy*12+12);if(!sl.length)break;html+='<tr><td>Año '+(yy+1)+'</td><td>'+money2(sum(sl,'c'))+'</td><td>'+money2(sum(sl,'i'))+'</td><td>'+money2(sum(sl,'a'))+'</td><td>'+money2(sl[sl.length-1].s)+'</td></tr>'}}
 tb.innerHTML=html||'<tr><td colspan="5">Sin saldo a financiar.</td></tr>';
 $('#h-tabla thead th').textContent=st.full?'Mes':'Año';$('#h-tabla thead th:nth-child(2)').textContent=st.full?'Cuota':'Cuotas del año';
 var txt=summary(r)+' Quiero recibir mi plan de pagos.';
 $('#sim-wa').href=CFG.wa+'?text='+encodeURIComponent(txt);$('#sim-wa').dataset.txt=txt;
 var f=document.getElementById('form-mz');if(f){var h=f.querySelector('[name=simulacion]');if(h)h.value=txt;if(r.u){var fu=f.querySelector('[name=unidad]');if(fu&&!fu.value)fu.value=r.u}}
 updShare();
}
function summary(r){return 'Hola Skyline, simulé mi compra en Monteza Residences: '+(r.u?'unidad '+r.u+', ':'')+'precio '+money(r.P)+', entrada '+r.e+' % ('+money(r.E)+')'+(r.n?', '+r.n+' cuotas directas de '+money2(r.cu):'')+(r.saldo>0?', saldo a la entrega '+money(r.saldo)+' con '+r.b.n+' al '+String(r.tasa).replace('.',',')+' % a '+r.anios+' años (cuota aprox. '+money2(r.c1)+')':', departamento pagado al 100 % a la entrega')+'.'}
/* Escenarios */
var SC=[];
function scLabel(i){return 'Escenario '+'ABC'[i]}
function renderSC(){var box=$('#sc-list');if(!SC.length){box.innerHTML='';$('#sc-save').disabled=false;return}
 var rs=SC.map(function(x){return simulate(x.s)}), best=rs.reduce(function(a,x,i){return x.total<rs[a].total?i:a},0);
 box.innerHTML=rs.map(function(r,i){var t=SC[i].t;return '<div class="scard'+(rs.length>1&&i===best?' best':'')+'"><div class="sc-top"><b>'+scLabel(i)+'</b><span>'+(t||'')+'</span>'+(rs.length>1&&i===best?'<em>Menor costo total</em>':'')+'<button type="button" class="sc-x" data-x="'+i+'" aria-label="Quitar">×</button></div>'+
 '<p class="sc-u">'+(r.u?'Unidad '+r.u+(r.unit?' · '+r.unit.tipo:''):'Precio libre')+' · <b>'+money(r.P)+'</b></p><dl>'+
 '<dt>Entrada</dt><dd>'+r.e+' % · '+money(r.E)+'</dd><dt>Cuotas sin intereses</dt><dd>'+(r.n?r.n+' × '+money(r.cu):'—')+'</dd><dt>Pagado a la entrega</dt><dd>'+pct(r.pctEnt)+'</dd>'+
 '<dt>Hipoteca</dt><dd>'+(r.saldo>0?money(r.c1)+'/mes · '+r.b.n.replace(/ ·.*/,''):'Sin deuda')+'</dd><dt>Intereses</dt><dd>'+money(r.ti)+'</dd><dt>Costo total</dt><dd><b>'+money(r.total)+'</b></dd></dl>'+
 '<button type="button" class="sc-load" data-l="'+i+'">Ver este escenario</button></div>'}).join('');
 box.querySelectorAll('[data-x]').forEach(function(x){x.addEventListener('click',function(){SC.splice(+x.dataset.x,1);renderSC();updShare()})});
 box.querySelectorAll('[data-l]').forEach(function(x){x.addEventListener('click',function(){applyState(SC[+x.dataset.l].s)})});
 $('#sc-save').disabled=SC.length>=3;$('#sc-hint').textContent=SC.length>=3?'Ya tienes 3 escenarios. Quita uno para guardar otro.':'Cambia unidad, entrada o banco y guarda otro escenario para compararlo.'}
$('#sc-save').addEventListener('click',function(){if(SC.length>=3)return;used1();var s=getState(),pre=root.dataset.pre||'';SC.push({s:s,t:pre?PRESET_N[pre]:''});root.dataset.pre='';renderSC();updShare();try{if(window.gtag)gtag('event','sim_scenario_save')}catch(e){}});
root.querySelectorAll('[data-pre]').forEach(function(b){b.addEventListener('click',function(){used1();var s=preset(b.dataset.pre,getState());applyState(s);root.dataset.pre=b.dataset.pre;root.querySelectorAll('[data-pre]').forEach(function(x){x.classList.toggle('on',x===b)});try{if(window.gtag)gtag('event','sim_preset',{plan:b.dataset.pre})}catch(e){}})});
/* Compartir */
function enc(o){return btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
function dec(t){t=t.replace(/-/g,'+').replace(/_/g,'/');while(t.length%4)t+='=';return JSON.parse(decodeURIComponent(escape(atob(t))))}
function shareURL(){return location.origin+location.pathname+'#sim='+enc({v:1,s:getState(),sc:SC})}
function updShare(){if(!last)return;var a=$('#sh-wa');a.href='https://wa.me/?text='+encodeURIComponent('Mira esta simulación de compra en Monteza Residences (San Isidro del Inca, Quito): '+(last.u?'unidad '+last.u+', ':'')+money(last.P)+', entrada '+last.e+' %'+(last.n?', '+last.n+' cuotas de '+money(last.cu)+' sin intereses':'')+(last.saldo>0?' y hipoteca aprox. '+money(last.c1)+'/mes':' y llaves 100 % pagadas')+(SC.length?' · '+SC.length+' escenarios para comparar':'')+'. Ábrela y juega con los números: '+shareURL())}
$('#sh-copy').addEventListener('click',function(){var u=shareURL(),m=$('#sh-st');function ok(){m.textContent='Enlace copiado. Pégalo en WhatsApp, correo o donde quieras.'}
 if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(u).then(ok,function(){prompt('Copia este enlace:',u)});else prompt('Copia este enlace:',u);try{if(window.gtag)gtag('event','sim_share',{via:'link'})}catch(e){}});
$('#sh-wa').addEventListener('click',function(){try{if(window.gtag)gtag('event','sim_share',{via:'whatsapp'})}catch(e){}});
/* Eventos */
el.u.addEventListener('change',function(){var u=unitOf(el.u.value);if(u&&u.pvp)el.p.value=u.pvp;calc()});
el.p.addEventListener('input',function(){el.u.value='';calc()});
[el.e,el.m,el.c,el.t,el.y].forEach(function(x){x.addEventListener('input',function(){used1();calc()})});
el.bk.addEventListener('change',function(){setBank(el.bk.value)});
root.querySelectorAll('[data-ent]').forEach(function(b){b.addEventListener('click',function(){used1();el.e.value=b.dataset.ent;calc()})});
root.querySelectorAll('[data-modo]').forEach(function(b){b.addEventListener('click',function(){st.modo=b.dataset.modo;root.querySelectorAll('[data-modo]').forEach(function(x){x.setAttribute('aria-pressed',x===b)});$('#w-plazo').hidden=st.modo!=='plazo';$('#w-cuota').hidden=st.modo!=='cuota';calc()})});
root.querySelectorAll('[data-cuota]').forEach(function(b){b.addEventListener('click',function(){el.c.value=b.dataset.cuota;root.querySelectorAll('[data-cuota]').forEach(function(x){x.setAttribute('aria-pressed',x===b)});calc()})});
root.querySelectorAll('[data-sis]').forEach(function(b){b.addEventListener('click',function(){st.sis=b.dataset.sis;root.querySelectorAll('[data-sis]').forEach(function(x){x.setAttribute('aria-pressed',x===b)});calc()})});
$('#h-full').addEventListener('click',function(){st.full=!st.full;this.textContent=st.full?'Ver resumen anual':'Ver tabla mes a mes';calc()});
function renderSav(r){var box=document.getElementById('sav');if(!box)return;var P=r.P,S=r.S,bi=r.bi,ti=r.ti;
 var ah=r.ahorro;var tot=document.getElementById('sv-total');var from=+(tot.dataset.v||0);tot.dataset.v=ah;
 var t0=null;function step(ts){if(!t0)t0=ts;var k=Math.min(1,(ts-t0)/700);tot.textContent=money(from+(ah-from)*(1-Math.pow(1-k,3)));if(k<1)requestAnimationFrame(step)}requestAnimationFrame(step);
 var c=r.cb;
 document.getElementById('sv-eq').innerHTML=ah>1&&c?'Equivale a <b>'+Math.round(ah/c)+' cuotas</b> de hipoteca que ya no pagarás · '+pct(ah/P*100)+' del precio de tu departamento':'Sube tu cuota o tu entrada y mira cómo crece tu ahorro.';
 var mx=Math.max(bi,ti,1);document.getElementById('sv-bank').style.width=Math.max(1.5,bi/mx*100)+'%';document.getElementById('sv-mine').style.width=Math.max(1.5,ti/mx*100)+'%';
 document.getElementById('sv-bank-v').textContent=money(bi);document.getElementById('sv-mine-v').textContent=money(ti);
 var row='';
 [500,1000,1500,2000,2500,3000].forEach(function(q){var n=Math.min(MAXM,Math.ceil(S/q-1e-9)),sal=Math.max(0,S-q*n),rr=amort(sal,r.tasa,r.anios,r.sis),i=sum(rr,'i'),a=Math.max(0,bi-i);
  var on=st.modo==='cuota'&&+el.c.value===q;row+='<button type="button" class="stp'+(on?' on':'')+'" data-q="'+q+'"><span>Cuota '+money(q)+'</span><b>'+money(a)+'</b><small>'+(sal>0?'saldo '+money(sal):'pagado al 100 %')+'</small><i style="height:'+Math.max(6,a/Math.max(bi,1)*100)+'%"></i></button>'});
 var sv=document.getElementById('sv-steps');sv.innerHTML=row;
 sv.querySelectorAll('.stp').forEach(function(x){x.addEventListener('click',function(){var q=+x.dataset.q;st.modo='cuota';root.querySelectorAll('[data-modo]').forEach(function(m){m.setAttribute('aria-pressed',m.dataset.modo==='cuota')});$('#w-plazo').hidden=true;$('#w-cuota').hidden=false;el.c.value=q;root.querySelectorAll('[data-cuota]').forEach(function(m){m.setAttribute('aria-pressed',+m.dataset.cuota===q)});calc()})})}
window.simSetUnit=function(id){var u=unitOf(id);if(!u||!u.pvp)return;el.u.value=id;el.p.value=u.pvp;calc()};
/* Paquete para PDF y Excel */
window.SIM_WA=CFG.wa;
window.simPack=function(){var cur=getState(),r=simulate(cur);
 return {cur:r,txt:summary(r),scen:SC.map(function(x,i){var o=simulate(x.s);o.label=scLabel(i)+(x.t?' · '+x.t:'');return o}),
  presets:['ligero','equilibrado','cero'].map(function(k){var o=simulate(preset(k,cur));o.label=PRESET_N[k];o.key=k;return o}),
  units:U.filter(function(u){return u.pvp&&/dispon/i.test(u.estado||'Disponible')}),bancos:B,cfg:CFG,share:shareURL(),amort:amort,simulate:simulate}};
window.simLast=function(){var p=window.simPack(),r=p.cur;return {u:r.u,precio:money(r.P),ent:money(r.E),n:r.n,cuota:r.n?money2(r.cu):'',saldo:r.saldo>0?money(r.saldo):'',txt:p.txt}};
/* Estado inicial: enlace compartido o valores por defecto */
var h=location.hash.match(/sim=([\w-]+)/),loaded=false;
if(h){try{var o=dec(h[1]);if(o&&o.s){SC=(o.sc||[]).slice(0,3).filter(function(x){return x&&x.s});applyState(o.s,true);loaded=true;renderSC();setTimeout(function(){root.scrollIntoView({behavior:'smooth'})},400);try{if(window.gtag)gtag('event','sim_shared_open')}catch(e){}}}catch(e){}}
if(loaded)calc();else{var b0=bankOf(st.banco);applyState(preset('equilibrado',{u:'',p:+el.p.value||0,b:st.banco,t:b0.t,y:Math.min(b0.y,b0.ymax),sis:'frances'}),true);root.querySelectorAll('[data-pre]').forEach(function(x){x.classList.toggle('on',x.dataset.pre==='equilibrado')});root.dataset.pre='equilibrado';calc()}
})();
/* Captura de datos, plan ilustrado (PDF + brochure) y Excel */
(function(){var dlg=document.getElementById('lead'),f=document.getElementById('lead-f');if(!dlg||!f)return;
function ced(v){if(!/^\d{10}$/.test(v))return false;var pr=+v.slice(0,2);if(!((pr>=1&&pr<=24)||pr===30))return false;if(+v[2]>5)return false;var s=0;for(var i=0;i<9;i++){var d=+v[i]*(i%2?1:2);if(d>9)d-=9;s+=d}return (10-s%10)%10===+v[9]}
function err(id,m){var e=f.querySelector('[data-for="'+id+'"]');if(e)e.textContent=m||''}
var ec=f.querySelector('#lf-ec'),cony=f.querySelector('#lf-cony');
ec.addEventListener('change',function(){var c=/Casado|Unión/.test(ec.value);cony.hidden=!c;f.querySelector('#lf-cn').required=c;f.querySelector('#lf-cc').required=c});
function open(canal){var L=window.simLast&&window.simLast();f.querySelector('#lf-canal').value=canal;f.querySelector('#lf-sim').value=L?L.txt:'';
 document.getElementById('lead-sum').innerHTML=L?('<b>'+(L.u?'Unidad '+L.u+' · ':'')+L.precio+'</b> · entrada '+L.ent+(L.n?' · '+L.n+' cuotas de '+L.cuota:'')+(L.saldo?' · saldo a la entrega '+L.saldo:'')):'';
 document.getElementById('lead-ok').hidden=true;f.querySelector('button[type=submit]').hidden=false;
 if(dlg.showModal)dlg.showModal();else dlg.setAttribute('open','');try{if(window.gtag)gtag('event','lead_form_open',{canal:canal})}catch(e){}}
document.querySelectorAll('[data-lead]').forEach(function(b){b.addEventListener('click',function(e){e.preventDefault();open(b.dataset.lead)})});
dlg.querySelector('.lead-x').addEventListener('click',function(){dlg.close()});
dlg.addEventListener('click',function(e){if(e.target===dlg)dlg.close()});
function load(src,test){return new Promise(function(res,rej){if(test())return res();var s=document.createElement('script');s.src=src;s.onload=function(){res()};s.onerror=function(){rej(new Error(src))};document.head.appendChild(s)})}
function dl(a,blob,name){a.href=URL.createObjectURL(blob);a.download=name;a.hidden=false}
f.addEventListener('submit',function(e){e.preventDefault();var fd=new FormData(f),d={};fd.forEach(function(v,k){d[k]=v});var ok=true;err('lf-ced');err('lf-cc');err('lf-wa');
 if(!ced(d.cedula||'')){err('lf-ced','Revisa tu número de cédula');ok=false}
 if(/Casado|Unión/.test(d.estado_civil)&&!ced(d.conyuge_cedula||'')){err('lf-cc','Revisa la cédula del cónyuge');ok=false}
 var wa=(d.whatsapp||'').replace(/\D/g,'');if(wa.length<9){err('lf-wa','Revisa tu número de WhatsApp');ok=false}
 if(!f.checkValidity()||!ok){f.reportValidity();return}
 var er=window.SKSEC?window.SKSEC.check(f):'';if(er){if(er!=='bot')f.querySelector('.lead-st').textContent=er;return}
 var st=f.querySelector('.lead-st'),bt=f.querySelector('button[type=submit]');bt.disabled=true;st.textContent='Generando tu plan…';
 var pack=window.simPack&&window.simPack();
 fd=new FormData(f);fetch(f.action,{method:'POST',body:fd,headers:{Accept:'application/json'}}).then(function(r){return r.json().then(function(j){if(!r.ok||String(j.success)==='false')throw 0},function(){if(!r.ok)throw 0})}).then(function(){
  var bl=document.getElementById('lo-bro'),bro=(bl&&window.SKSEC)?window.SKSEC.link(bl.dataset.k):'';if(bl&&bro){bl.href=bro;bl.hidden=false}
  try{if(window.gtag)gtag('event','generate_lead',{form:'plan_de_pagos',canal:d.canal})}catch(x){}
  bt.disabled=false;bt.hidden=true;st.textContent='';document.getElementById('lead-ok').hidden=false;
  var los=document.getElementById('lo-st'),lp=document.getElementById('lo-pdf'),lx=document.getElementById('lo-xls'),base=(pack&&pack.cur.u?'-'+pack.cur.u:'');
  var msg='Hola Skyline, soy '+d.nombre+'. Generé mi plan de pagos de Monteza Residences: '+(pack?pack.txt:'')+' Prefiero recibir la información por '+d.canal+'.';
  document.getElementById('lo-wa').href=window.SIM_WA+'?text='+encodeURIComponent(msg);
  if(!pack){los.textContent='Descarga el brochure y escríbenos para recibir tu plan.';return}
  pack.bro=bro;
  load('/assets/js/mzplan.js?v=1',function(){return !!window.MZPLAN}).then(function(){
   return window.MZPLAN.pdf(d,pack).then(function(blob){dl(lp,blob,'Monteza-Residences-Plan-y-Brochure'+base+'.pdf');lp.click();los.textContent='Tu PDF incluye tu plan ilustrado y el brochure del proyecto. El Excel te permite seguir jugando con los números.'},function(x){console.error('pdf',x);los.textContent='No pudimos armar el PDF; descarga el brochure y el Excel.'})
    .then(function(){return window.MZPLAN.xlsx(d,pack).then(function(blob){dl(lx,blob,'Monteza-Residences-Plan-de-Pagos'+base+'.xlsx')},function(x){console.error('xlsx',x)})})
  }).catch(function(x){console.error(x);los.textContent='Descarga el brochure y escríbenos por WhatsApp para recibir tu plan.'})
  .then(function(){if(d.canal==='whatsapp')setTimeout(function(){window.open(document.getElementById('lo-wa').href,'_blank')},1200)})
 }).catch(function(){bt.disabled=false;st.textContent='No pudimos registrar tus datos. Revisa tu conexión o escríbenos por WhatsApp al +593 96 300 2600.'})});
})();
