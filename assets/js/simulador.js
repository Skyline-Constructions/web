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
var last=null,used=false;function used1(){if(used)return;used=true;try{if(window.gtag)gtag('event','simulator_use')}catch(e){}}
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
 window.SIM_WA=CFG.wa; window.simLast=function(){var ah=Math.max(0,bi-ti);return {raw:last,u:last.u,e:e,precio:money(P),ent:money(E),n:n,cuota:n?money2(cu):'',pagado:money(E+paid),pct:pct(pctEnt),saldo:saldo>0?money(saldo):'',hip:rows.length?money2(c1):'',int:money(ti),ing:rows.length?money(c1/CFG.relacionCuotaIngreso):'',base:money(bi),ahorro:money(ah),m2:money2,txt:$('#sim-wa').dataset.txt||''}};
 // WhatsApp y formulario
 var txt='Hola Skyline, simulé mi compra en Monteza Residences: '+(last.u?'unidad '+last.u+', ':'')+'precio '+money(P)+', entrada '+e+' % ('+money(E)+')'+(n?', '+n+' cuotas directas de '+money2(cu):'')+(saldo>0?', saldo a la entrega '+money(saldo)+' con '+b.n+' al '+String(tasa).replace('.',',')+' % a '+anios+' años (cuota aprox. '+money2(c1)+')':', departamento pagado al 100 % a la entrega')+'. Quiero recibir mi plan de pagos.';
 $('#sim-wa').href=CFG.wa+'?text='+encodeURIComponent(txt);$('#sim-wa').dataset.txt=txt;
 var f=document.getElementById('form-mz');if(f){var h=f.querySelector('[name=simulacion]');if(h)h.value=txt;if(last.u){var fu=f.querySelector('[name=unidad]');if(fu&&!fu.value)fu.value=last.u}}
}
// Eventos
el.u.addEventListener('change',function(){var u=U.find(function(x){return x.id===el.u.value});if(u&&u.pvp)el.p.value=u.pvp;calc()});
el.p.addEventListener('input',function(){el.u.value='';calc()});
[el.e,el.m,el.c,el.t,el.y].forEach(function(x){x.addEventListener('input',function(){used1();calc()})});
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
/* Captura de datos y plan de pagos en PDF */
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
function loadPDF(cb){if(window.jspdf)return cb();var s=document.createElement('script');s.src='/assets/js/jspdf.umd.min.js';s.onload=function(){cb()};s.onerror=function(){cb(true)};document.head.appendChild(s)}
function makePDF(d,L){var J=new window.jspdf.jsPDF({unit:'mm',format:'a4'}),y=0,W=210;
 function hdr(){J.setFillColor(29,29,27);J.rect(0,0,W,30,'F');J.setFillColor(255,201,97);J.rect(0,30,W,1.5,'F');J.setTextColor(255,201,97);J.setFontSize(9);J.text('SKYLINE CONSTRUCTIONS',14,12);J.setTextColor(255,255,255);J.setFontSize(18);J.text('Monteza Residences · Plan de pagos',14,22);y=42;J.setTextColor(29,29,27)}
 function row(a,b,bold){if(y>275){J.addPage();hdr()}J.setFontSize(10);J.setFont('helvetica',bold?'bold':'normal');J.text(String(a),14,y);J.text(String(b),196,y,{align:'right'});J.setDrawColor(214,212,206);J.line(14,y+2,196,y+2);y+=7}
 function title(t){if(y>260){J.addPage();hdr()}y+=3;J.setFont('helvetica','bold');J.setFontSize(12);J.setTextColor(125,95,37);J.text(t,14,y);J.setTextColor(29,29,27);y+=8}
 hdr();J.setFontSize(10);J.setFont('helvetica','normal');J.text('Cliente: '+d.nombre,14,y);J.text('Cédula: '+d.cedula,196,y,{align:'right'});y+=6;J.text('Fecha: '+new Date().toLocaleDateString('es-EC'),14,y);J.text('WhatsApp: '+d.whatsapp,196,y,{align:'right'});y+=8;
 title('Tu compra');row('Unidad',L.u||'Por definir');row('Precio de preventa',L.precio,true);row('Entrada ('+L.e+' %)',L.ent);
 title('Crédito directo Skyline · 0 % de interés');row('Número de cuotas',L.n||0);row('Cuota mensual',L.cuota||'—',true);row('Pagado a la entrega',L.pagado+' ('+L.pct+')');row('Saldo a la entrega',L.saldo||'USD 0',true);
 if(L.raw.saldo>0){title('Saldo con crédito hipotecario');row('Entidad',L.raw.b.n);row('Tasa anual referencial',String(L.raw.tasa).replace('.',',')+' %');row('Plazo',L.raw.anios+' años');row('Cuota mensual aproximada',L.hip,true);row('Intereses totales',L.int);row('Ingreso familiar sugerido',L.ing)}
 title('Tu ahorro por comprar en planos');row('Intereses si financias el 80 % con banco',L.base);row('Intereses con tu plan',L.int||'USD 0');row('Ahorro en intereses',L.ahorro,true);
 if(L.raw.n){title('Cronograma del crédito directo');var s=L.raw.S;for(var k=1;k<=L.raw.n;k++){var c=Math.min(L.raw.cu,s);s-=c;row('Cuota '+k,L.m2(c)+'   ·   saldo '+L.m2(Math.max(0,s)))}}
 if(L.raw.rows&&L.raw.rows.length){title('Resumen anual del crédito hipotecario');for(var a=0;a<L.raw.anios;a++){var sl=L.raw.rows.slice(a*12,a*12+12);if(!sl.length)break;var ci=sl.reduce(function(x,r){return x+r.c},0),ii=sl.reduce(function(x,r){return x+r.i},0);row('Año '+(a+1),'cuotas '+L.m2(ci)+' · interés '+L.m2(ii)+' · saldo '+L.m2(sl[sl.length-1].s))}}
 y+=4;if(y>255){J.addPage();hdr()}J.setFontSize(8);J.setTextColor(94,92,87);J.text(J.splitTextToSize('Simulación referencial; no constituye oferta ni aprobación de crédito. El crédito directo está sujeto a aprobación de Skyline Constructions y a la firma de la promesa de compraventa; cuotas hasta la entrega, máximo 36 meses. Condiciones hipotecarias referenciales a octubre de 2026, definidas por cada entidad. Precios sujetos a cambio y disponibilidad. Brochure: skylineconstructions.build/assets/docs/Monteza-Residences-Brochure.pdf · WhatsApp +593 96 300 2600',182),14,y);
 return J}
f.addEventListener('submit',function(e){e.preventDefault();var fd=new FormData(f),d={};fd.forEach(function(v,k){d[k]=v});var ok=true;err('lf-ced');err('lf-cc');err('lf-wa');
 if(!ced(d.cedula||'')){err('lf-ced','Revisa tu número de cédula');ok=false}
 if(/Casado|Unión/.test(d.estado_civil)&&!ced(d.conyuge_cedula||'')){err('lf-cc','Revisa la cédula del cónyuge');ok=false}
 var wa=(d.whatsapp||'').replace(/\D/g,'');if(wa.length<9){err('lf-wa','Revisa tu número de WhatsApp');ok=false}
 if(!f.checkValidity()||!ok){f.reportValidity();return}
 var st=f.querySelector('.lead-st'),bt=f.querySelector('button[type=submit]');bt.disabled=true;st.textContent='Generando tu plan…';
 var L=window.simLast&&window.simLast();
 fetch(f.action,{method:'POST',body:fd,headers:{Accept:'application/json'}}).catch(function(){}).then(function(){
  try{if(window.gtag)gtag('event','generate_lead',{form:'plan_de_pagos',canal:d.canal})}catch(x){}
  loadPDF(function(fail){bt.disabled=false;bt.hidden=true;st.textContent='';var ok2=document.getElementById('lead-ok');ok2.hidden=false;
   var name='Plan-de-pagos-Monteza'+(L&&L.u?'-'+L.u:'')+'.pdf',lp=document.getElementById('lo-pdf');
   var done=false;if(!fail&&L){try{var J=makePDF(d,L),url=URL.createObjectURL(J.output('blob'));lp.href=url;lp.download=name;lp.hidden=false;lp.click();done=true}catch(x){console.error('pdf',x)}}if(!done){lp.hidden=true}
   var msg='Hola Skyline, soy '+d.nombre+'. Generé mi plan de pagos de Monteza Residences: '+(L?L.txt:'')+' Prefiero recibir la información por '+d.canal+'.';
   document.getElementById('lo-wa').href=window.SIM_WA+'?text='+encodeURIComponent(msg);
   if(d.canal==='whatsapp')setTimeout(function(){window.open(document.getElementById('lo-wa').href,'_blank')},900)})})});
})();
