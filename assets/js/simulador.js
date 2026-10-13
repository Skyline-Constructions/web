/* Simulador de compra Monteza Residences · Skyline Constructions */
(function(){
var root=document.getElementById('simulador');if(!root)return;
var CFG=JSON.parse(document.getElementById('sim-cfg').textContent);
var U=CFG.units, B=CFG.bancos, MAXM=CFG.mesesEntrega, ENTMIN=CFG.entradaMin, TD=CFG.tasaDirecta;
var $=function(s){return root.querySelector(s)};
var money=function(v){return 'USD '+Math.round(v).toLocaleString('es-EC')};
var money2=function(v){return 'USD '+v.toLocaleString('es-EC',{minimumFractionDigits:2,maximumFractionDigits:2})};
var pct=function(v){return (Math.round(v*10)/10).toLocaleString('es-EC')+' %'};
var st={modo:'plazo',sis:'frances',banco:'pichincha',full:false};
var el={u:$('#s-unidad'),p:$('#s-precio'),e:$('#s-ent'),ev:$('#s-ent-v'),m:$('#s-meses'),mv:$('#s-meses-v'),c:$('#s-cuota'),
 bk:$('#h-banco'),t:$('#h-tasa'),y:$('#h-anios'),yv:$('#h-anios-v')};
// Opciones de unidades
var g={};U.forEach(function(u){if(!u.pvp)return;(g[u.tipo]=g[u.tipo]||[]).push(u)});
Object.keys(g).forEach(function(t){var og=document.createElement('optgroup');og.label=t;g[t].forEach(function(u){var o=document.createElement('option');o.value=u.id;o.textContent=u.id+' · '+u.nivel+' · '+u.area.toFixed(2)+' m² · '+money(u.pvp);og.appendChild(o)});el.u.appendChild(og)});
B.forEach(function(b){var o=document.createElement('option');o.value=b.id;o.textContent=b.n;el.bk.appendChild(o)});
function bank(){return B.find(function(b){return b.id===st.banco})}
function setBank(id){st.banco=id;el.bk.value=id;var b=bank();el.t.value=b.t;el.y.max=b.ymax;el.y.value=Math.min(b.y,b.ymax);calc()}
// Amortización
function amort(L,tasa,anios,sis){var n=anios*12,i=tasa/100/12,rows=[],s=L,c;
 if(L<=0)return rows;
 if(sis==='frances'){c=i?L*i/(1-Math.pow(1+i,-n)):L/n;for(var k=1;k<=n;k++){var it=s*i,ca=c-it;s-=ca;rows.push({k:k,c:c,i:it,a:ca,s:Math.max(0,s)})}}
 else{var ca2=L/n;for(var k2=1;k2<=n;k2++){var it2=s*i;s-=ca2;rows.push({k:k2,c:ca2+it2,i:it2,a:ca2,s:Math.max(0,s)})}}
 return rows}
function sum(r,k){return r.reduce(function(a,x){return a+x[k]},0)}
var last=null;
function calc(){
 var P=+el.p.value||0, e=Math.max(ENTMIN,+el.e.value), E=P*e/100, S=P-E;
 el.ev.textContent=e+' % · '+money(E);
 var n,cu,paid,saldo;
 if(st.modo==='plazo'){n=+el.m.value;cu=S/n;paid=S;saldo=0;el.mv.textContent=n+(n===1?' mes':' meses')}
 else if(st.modo==='cuota'){var c=Math.max(0,+el.c.value||0);if(c<=0){n=0;cu=0;paid=0;saldo=S}else{n=Math.min(MAXM,Math.ceil(S/c-1e-9));cu=c;paid=Math.min(S,c*n);saldo=S-paid;if(saldo<0.5)saldo=0}}
 else{n=0;cu=0;paid=0;saldo=S}
 var pagadoEntrega=E+paid, pctEnt=P?pagadoEntrega/P*100:0;
 // Resultados crédito directo
 $('#r-ent').textContent=money(E);
 $('#r-cuota').textContent=n?money2(cu):'—';
 var ult=S-cu*(n-1);
 $('#r-cuota-l').textContent=(st.modo==='cuota'&&saldo===0&&n>1&&Math.abs(ult-cu)>0.5)?'Cuota mensual sin intereses · la última, de '+money2(ult):'Cuota mensual directa · sin intereses';
 $('#r-n').textContent=n?n+(n===1?' cuota':' cuotas'):'Sin cuotas';
 $('#r-ent-pct').textContent=pct(pctEnt);
 $('#r-saldo').textContent=saldo>0?money(saldo):'USD 0';
 $('#r-bar').style.width=Math.min(100,pctEnt)+'%';
 $('#r-msg').innerHTML=saldo>0?'Recibes tus llaves con el <b>'+pct(pctEnt)+'</b> de tu departamento pagado. El saldo de <b>'+money(saldo)+'</b> lo cubres con crédito hipotecario, simulado abajo'+(saldo<P*0.1?', o con un pago final de ahorro antes de la entrega.':'.'):'Recibes tus llaves con tu departamento <b>100 % pagado</b>, sin deuda bancaria y sin intereses.';
 // Hipotecario
 var hip=$('#sim-hip'), b=bank(), tasa=+el.t.value, anios=+el.y.value;el.yv.textContent=anios+' años';
 hip.classList.toggle('off',saldo<=0);
 var warn=[];
 if(b.cap&&P>b.cap)warn.push('El precio de esta unidad ('+money(P)+') supera el tope de '+money(b.cap)+' para '+b.n+'. Elige otra entidad o una unidad dentro del tope.');
 if(b.min&&P<=b.min)warn.push('Con este precio la unidad corresponde al segmento VIS, no VIP.');
 if(b.loanMax&&saldo>b.loanMax)warn.push('El préstamo ('+money(saldo)+') supera el máximo de '+money(b.loanMax)+'; la diferencia debe cubrirse antes de la entrega.');
 if(anios>b.ymax)warn.push('Plazo máximo referencial para esta entidad: '+b.ymax+' años.');
 if(tasa>CFG.tasaMaxLegal)warn.push('La tasa supera la máxima legal vigente ('+String(CFG.tasaMaxLegal).replace('.',',')+' %).');
 $('#h-note').textContent=b.note;
 $('#h-warn').innerHTML=warn.map(function(w){return '<li>'+w+'</li>'}).join('');$('#h-warn').hidden=!warn.length;
 var rows=amort(saldo,tasa,anios,st.sis);
 var c1=rows.length?rows[0].c:0, ti=sum(rows,'i');
 $('#h-cuota').textContent=rows.length?money2(c1):'—';
 $('#h-cuota-l').textContent=st.sis==='frances'?'Cuota mensual fija':'Primera cuota (luego disminuye)';
 $('#h-int').textContent=money(ti);$('#h-tot').textContent=money(saldo+ti);
 $('#h-ing').textContent=rows.length?money(c1/CFG.relacionCuotaIngreso):'—';
 // Comparativo: 20 % de entrada + 80 % con banco referencial
 var ref=B.find(function(x){return x.id===CFG.bancoRef}), base=amort(P*(1-ENTMIN/100),ref.t,ref.y,'frances'), bi=sum(base,'i');
 var ahorro=bi-ti;
 renderSav(P,S,bi,ti);$('#c-base').textContent=money(bi);$('#c-plan').textContent=money(ti);$('#c-ahorro').textContent=money(Math.max(0,ahorro));
 $('#c-txt').innerHTML='Si financiaras el 80 % con un banco al '+String(ref.t).replace('.',',')+' % a '+ref.y+' años pagarías <b>'+money(bi)+'</b> en intereses. Con tu plan pagas <b>'+money(ti)+'</b>. '+(ahorro>1?'Te ahorras <b>'+money(ahorro)+'</b>, '+pct(ahorro/P*100)+' del precio de tu departamento.':'');
 // Tabla anual
 var tb=$('#h-tabla tbody'), html='';
 if(st.full){rows.forEach(function(r){html+='<tr><td>'+r.k+'</td><td>'+money2(r.c)+'</td><td>'+money2(r.i)+'</td><td>'+money2(r.a)+'</td><td>'+money2(r.s)+'</td></tr>'})}
 else{for(var yy=0;yy<anios;yy++){var sl=rows.slice(yy*12,yy*12+12);if(!sl.length)break;html+='<tr><td>Año '+(yy+1)+'</td><td>'+money2(sum(sl,'c'))+'</td><td>'+money2(sum(sl,'i'))+'</td><td>'+money2(sum(sl,'a'))+'</td><td>'+money2(sl[sl.length-1].s)+'</td></tr>'}}
 tb.innerHTML=html||'<tr><td colspan="5">Sin saldo a financiar.</td></tr>';
 $('#h-tabla thead th').textContent=st.full?'Mes':'Año';$('#h-tabla thead th:nth-child(2)').textContent=st.full?'Cuota':'Cuotas del año';
 last={P:P,e:e,E:E,S:S,n:n,cu:cu,saldo:saldo,pctEnt:pctEnt,b:b,tasa:tasa,anios:anios,rows:rows,c1:c1,ti:ti,u:el.u.value};
 // WhatsApp y formulario
 var txt='Hola Skyline, simulé mi compra en Monteza Residences: '+(last.u?'unidad '+last.u+', ':'')+'precio '+money(P)+', entrada '+e+' % ('+money(E)+')'+(n?', '+n+' cuotas directas de '+money2(cu):'')+(saldo>0?', saldo a la entrega '+money(saldo)+' con '+b.n+' al '+String(tasa).replace('.',',')+' % a '+anios+' años (cuota aprox. '+money2(c1)+')':', departamento pagado al 100 % a la entrega')+'. Quiero recibir mi plan de pagos.';
 $('#sim-wa').href=CFG.wa+'?text='+encodeURIComponent(txt);
 var f=document.getElementById('form-mz');if(f){var h=f.querySelector('[name=simulacion]');if(h)h.value=txt;if(last.u){var fu=f.querySelector('[name=unidad]');if(fu&&!fu.value)fu.value=last.u}}
}
// Eventos
el.u.addEventListener('change',function(){var u=U.find(function(x){return x.id===el.u.value});if(u&&u.pvp)el.p.value=u.pvp;calc()});
el.p.addEventListener('input',function(){el.u.value='';calc()});
[el.e,el.m,el.c,el.t,el.y].forEach(function(x){x.addEventListener('input',calc)});
el.bk.addEventListener('change',function(){setBank(el.bk.value)});
root.querySelectorAll('[data-modo]').forEach(function(b){b.addEventListener('click',function(){st.modo=b.dataset.modo;root.querySelectorAll('[data-modo]').forEach(function(x){x.setAttribute('aria-pressed',x===b)});$('#w-plazo').hidden=st.modo!=='plazo';$('#w-cuota').hidden=st.modo!=='cuota';calc()})});
root.querySelectorAll('[data-cuota]').forEach(function(b){b.addEventListener('click',function(){el.c.value=b.dataset.cuota;root.querySelectorAll('[data-cuota]').forEach(function(x){x.setAttribute('aria-pressed',x===b)});calc()})});
root.querySelectorAll('[data-sis]').forEach(function(b){b.addEventListener('click',function(){st.sis=b.dataset.sis;root.querySelectorAll('[data-sis]').forEach(function(x){x.setAttribute('aria-pressed',x===b)});calc()})});
$('#h-full').addEventListener('click',function(){st.full=!st.full;this.textContent=st.full?'Ver resumen anual':'Ver tabla mes a mes';calc()});
$('#h-csv').addEventListener('click',function(){if(!last)return;var L=[['Periodo','Concepto','Cuota (USD)','Interés (USD)','Capital (USD)','Saldo (USD)']];
 var s=last.P;L.push(['Mes 0','Entrada '+last.e+' %',last.E.toFixed(2),'0.00',last.E.toFixed(2),(s-=last.E).toFixed(2)]);
 for(var k=1;k<=last.n;k++){var c=Math.min(last.cu,last.S-last.cu*(k-1));if(c<=0)break;s-=c;L.push(['Mes '+k,'Crédito directo Skyline',c.toFixed(2),'0.00',c.toFixed(2),Math.max(0,s).toFixed(2)])}
 last.rows.forEach(function(r){L.push(['Hipoteca mes '+r.k,last.b.n,r.c.toFixed(2),r.i.toFixed(2),r.a.toFixed(2),r.s.toFixed(2)])});
 var csv='﻿'+L.map(function(r){return r.map(function(x){return '"'+String(x).replace(/"/g,'""')+'"'}).join(';')}).join('\n');
 var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));a.download='Monteza-plan-de-pagos'+(last.u?'-'+last.u:'')+'.csv';document.body.appendChild(a);a.click();a.remove()});
function renderSav(P,S,bi,ti){var box=document.getElementById('sav');if(!box)return;
 var ah=Math.max(0,bi-ti);var tot=document.getElementById('sv-total');var from=+(tot.dataset.v||0);tot.dataset.v=ah;
 var t0=null;function step(ts){if(!t0)t0=ts;var k=Math.min(1,(ts-t0)/700);tot.textContent=money(from+(ah-from)*(1-Math.pow(1-k,3)));if(k<1)requestAnimationFrame(step)}requestAnimationFrame(step);
 var ref=B.find(function(x){return x.id===CFG.bancoRef}),cb=amort(P*0.8,ref.t,ref.y,'frances');var c=cb.length?cb[0].c:0;
 document.getElementById('sv-eq').innerHTML=ah>1&&c?'Equivale a <b>'+Math.round(ah/c)+' cuotas</b> de hipoteca que ya no pagarás · '+pct(ah/P*100)+' del precio de tu departamento':'Sube tu cuota o tu entrada y mira cómo crece tu ahorro.';
 var mx=Math.max(bi,1);document.getElementById('sv-bank').style.width='100%';document.getElementById('sv-mine').style.width=Math.max(1.5,ti/mx*100)+'%';
 document.getElementById('sv-bank-v').textContent=money(bi);document.getElementById('sv-mine-v').textContent=money(ti);
 var b=bank(),tasa=+el.t.value,anios=+el.y.value,E=P-S,row='';
 [500,1000,1500,2000,2500,3000].forEach(function(q){var n=Math.min(MAXM,Math.ceil(S/q-1e-9)),sal=Math.max(0,S-q*n),r=amort(sal,tasa,anios,st.sis),i=sum(r,'i'),a=Math.max(0,bi-i);
  var on=st.modo==='cuota'&&+el.c.value===q;row+='<button type="button" class="stp'+(on?' on':'')+'" data-q="'+q+'"><span>Cuota '+money(q)+'</span><b>'+money(a)+'</b><small>'+(sal>0?'saldo '+money(sal):'pagado al 100 %')+'</small><i style="height:'+Math.max(6,a/Math.max(bi,1)*100)+'%"></i></button>'});
 var sv=document.getElementById('sv-steps');sv.innerHTML=row;
 sv.querySelectorAll('.stp').forEach(function(x){x.addEventListener('click',function(){var q=+x.dataset.q;st.modo='cuota';root.querySelectorAll('[data-modo]').forEach(function(m){m.setAttribute('aria-pressed',m.dataset.modo==='cuota')});$('#w-plazo').hidden=true;$('#w-cuota').hidden=false;el.c.value=q;root.querySelectorAll('[data-cuota]').forEach(function(m){m.setAttribute('aria-pressed',+m.dataset.cuota===q)});calc()})})}
window.simSetUnit=function(id){var u=U.find(function(x){return x.id===id});if(!u||!u.pvp)return;el.u.value=id;el.p.value=u.pvp;calc()};
setBank(st.banco);
})();
