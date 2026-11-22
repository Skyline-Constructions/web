/* Simulador de compra Monteza Residences · Skyline Constructions · v2 (3 pasos) */
(function(){
var root=document.getElementById('simulador');if(!root)return;
var CFG=JSON.parse(document.getElementById('sim-cfg').textContent);
var U=CFG.units.filter(function(u){return u.pvp&&/dispon/i.test(u.estado||'Disponible')}), B=CFG.bancos, MAXM=CFG.mesesEntrega||36, ENTMIN=CFG.entradaMin||5, SUG=CFG.entradaSug||20;
var PRIV=['pichincha','pacifico','produbanco','otra'];
var $=function(s){return root.querySelector(s)};
var gN=window.SKN||function(n,d){d=d||0;var s=Math.abs(+n||0).toFixed(d).split('.');s[0]=s[0].replace(/\B(?=(\d{3})+(?!\d))/g,'.');return (n<0?'-':'')+s.join(',')};
var money=function(v){return 'USD '+gN(Math.round(v))};
var money2=function(v){return 'USD '+gN(v,2)};
var pct=function(v){var r=Math.round(v*10)/10;return gN(r,r%1?1:0)+' %'};
function bankOf(id){return B.find(function(b){return b.id===id})||B[0]}
function unitOf(id){return U.find(function(x){return x.id===id})}
function amort(L,tasa,anios,sis){var n=anios*12,i=tasa/100/12,rows=[],s=L,c;if(L<=0)return rows;
 if(sis==='frances'){c=i?L*i/(1-Math.pow(1+i,-n)):L/n;for(var k=1;k<=n;k++){var it=s*i,ca=c-it;s-=ca;rows.push({k:k,c:c,i:it,a:ca,s:Math.max(0,s)})}}
 else{var ca2=L/n;for(var k2=1;k2<=n;k2++){var it2=s*i;s-=ca2;rows.push({k:k2,c:ca2+it2,i:it2,a:ca2,s:Math.max(0,s)})}}
 return rows}
function sum(r,k){return r.reduce(function(a,x){return a+x[k]},0)}
/* Motor de cálculo (sin cambios respecto a v1) */
function simulate(s){
 var P=Math.max(0,+s.p||0), e=Math.min(100,Math.max(ENTMIN,+s.e||SUG)), E=P*e/100, S=P-E, n,cu,paid,saldo;
 if(s.modo==='plazo'){n=Math.max(1,Math.min(MAXM,+s.n||MAXM));cu=S/n;paid=S;saldo=0}
 else if(s.modo==='cuota'){var c=Math.max(0,+s.c||0);if(c<=0||S<=0){n=0;cu=0;paid=0;saldo=S}else{n=Math.min(MAXM,Math.ceil(S/c-1e-9));cu=c;paid=Math.min(S,c*n);saldo=S-paid;if(saldo<0.5)saldo=0}}
 else{n=0;cu=0;paid=0;saldo=S}
 if(S<=0){n=0;cu=0;paid=0;saldo=0}
 var b=bankOf(s.b), tasa=+s.t, anios=+s.y, rows=amort(saldo,tasa,anios,s.sis||'frances');
 var c1=rows.length?rows[0].c:0, ti=sum(rows,'i');
 var ref=bankOf(CFG.bancoRef), base=amort(P*0.8,ref.t,ref.y,'frances'), bi=sum(base,'i'), cb=base.length?base[0].c:0;
 var ult=n?S-cu*(n-1):0, pagado=E+paid, pctEnt=P?pagado/P*100:0, warn=[];
 if(saldo>0){
 if(b.cap&&P>b.cap)warn.push('El precio de esta unidad ('+money(P)+') supera el tope de '+money(b.cap)+' para '+b.n+'. Elige otra entidad o una suite.');
 if(b.min&&P<=b.min)warn.push('Con este precio la unidad corresponde al segmento VIS, no VIP.');
 if(b.loanMax&&saldo>b.loanMax)warn.push('El préstamo ('+money(saldo)+') supera el máximo de '+money(b.loanMax)+'. Sube tu entrada o tus cuotas durante la obra en '+money(saldo-b.loanMax)+'.');
 if(PRIV.indexOf(b.id)>=0&&saldo>P*0.8+1)warn.push('Los bancos suelen financiar hasta el 80 %. Te faltan '+money(saldo-P*0.8)+' antes de la entrega: súmalos en cuotas sin intereses durante la obra.');
 if(anios>b.ymax)warn.push('Plazo máximo referencial para esta entidad: '+b.ymax+' años.');
 if(tasa>CFG.tasaMaxLegal)warn.push('La tasa supera la máxima legal vigente ('+String(CFG.tasaMaxLegal).replace('.',',')+' %).');}
 return {s:s,u:s.u||'',unit:unitOf(s.u),P:P,e:e,E:E,S:S,n:n,cu:cu,ult:ult,paid:paid,saldo:saldo,pagado:pagado,pctEnt:pctEnt,b:b,tasa:tasa,anios:anios,sis:s.sis||'frances',rows:rows,c1:c1,ti:ti,bi:bi,cb:cb,ahorro:Math.max(0,bi-ti),total:P+ti,ing:c1/CFG.relacionCuotaIngreso,warn:warn,modo:s.modo};
}
function round50(v){return Math.max(100,Math.ceil(v/50)*50)}
function preset(k,base){var P=base.p,s={u:base.u,p:P,b:base.b,t:base.t,y:base.y,sis:base.sis};
 if(k==='ligero'){s.e=5;s.modo='cuota';s.c=round50(P*0.15/MAXM);s.n=MAXM}
 else if(k==='equilibrado'){s.e=20;s.modo='cuota';s.c=round50(P*0.2/MAXM);s.n=MAXM}
 else{s.e=20;s.modo='plazo';s.n=MAXM;s.c=0}
 var bk=bankOf(s.b);if(bk.cap&&P>bk.cap||bk.min&&P<=bk.min){s.b='pichincha';s.t=bankOf('pichincha').t;s.y=Math.min(s.y,20)}
 return s}
var PRESET_N={ligero:'Empieza ligero',equilibrado:'Equilibrado (sugerido)',cero:'Cero deuda'};

/* Estado de la interfaz */
var st={tipo:'1 dormitorio',u:'',e:SUG,m:'directo',n:MAXM,b:'pichincha',y:20,x:0,t:null,sis:'frances'};
var ENT=[5,10,20,30], MESES=[12,24,36], ANIOS=[10,15,20,25,30], EXTRA=[0,300,500,1000,1500];
var el={u:$('#s2-unidad'),bk:$('#s2-banco'),t:$('#s2-tasa')};
function minOf(t){return Math.min.apply(null,U.filter(function(u){return u.tipo===t}).map(function(u){return u.pvp}))}
$('#t1-min').textContent=money(minOf('1 dormitorio'));$('#t3-min').textContent=money(minOf('3 dormitorios'));
function fillUnits(){var html='<option value="">Precio desde · '+money(minOf(st.tipo))+'</option>';
 U.filter(function(u){return u.tipo===st.tipo}).sort(function(a,b){return a.pvp-b.pvp||a.id.localeCompare(b.id)}).forEach(function(u){html+='<option value="'+u.id+'">'+u.id+' · '+u.nivel+' · '+gN(u.area,2)+' m²'+(u.abierta?' + '+gN(u.abierta,1)+' m² abiertos':'')+' · '+money(u.pvp)+'</option>'});
 el.u.innerHTML=html;el.u.value=st.u&&unitOf(st.u)&&unitOf(st.u).tipo===st.tipo?st.u:''}
function price(){var u=unitOf(st.u);return u?u.pvp:minOf(st.tipo)}
function eligible(b,P){return !(b.cap&&P>b.cap)&&!(b.min&&P<=b.min)}
function fillBanks(){var P=price(),html='';B.forEach(function(b){var ok=eligible(b,P);html+='<option value="'+b.id+'"'+(ok?'':' disabled')+'>'+b.n+(ok?'':' · no aplica a este precio')+'</option>'});el.bk.innerHTML=html;
 if(!eligible(bankOf(st.b),P)){st.b='pichincha';st.t=null}el.bk.value=st.b}
function chips(box,vals,cur,lab,attr){box.innerHTML=vals.map(function(v){var on=v===cur;return '<button type="button" class="s2-chip'+(attr==='e'&&v===SUG?' rec':'')+'" data-'+attr+'="'+v+'" aria-pressed="'+on+'">'+lab(v)+'</button>'}).join('')}
function state(){var b=bankOf(st.b),t=st.t!=null?st.t:b.t,y=Math.min(st.y,b.ymax),s={u:st.u,p:price(),e:st.e,b:st.b,t:t,y:y,sis:st.sis,n:st.n,c:0};
 if(st.m==='directo'){s.modo='plazo'}else if(st.x>0){s.modo='cuota';s.c=st.x}else{s.modo='banco'}return s}
var last=null,used=false;function used1(){if(used)return;used=true;try{if(window.gtag)gtag('event','simulator_use')}catch(e){}}
function li(k,v,s){return '<li><span>'+k+'</span><b>'+v+'</b>'+(s?'<small>'+s+'</small>':'')+'</li>'}
function render(){
 var s=state(),r=simulate(s);last=r;var P=r.P,b=r.b;
 document.querySelectorAll('.s2-tipo').forEach(function(x){x.setAttribute('aria-checked',x.dataset.tipo===st.tipo)});
 $('#s2-precio').textContent=money(P)+(st.u?' · unidad '+st.u:' · precio desde');
 chips($('#s2-ent'),ENT,st.e,function(v){return '<b>'+v+' %</b><small>'+money(P*v/100)+'</small>'+(v===SUG?'<i>ideal</i>':'')},'e');
 var tip=$('#s2-ent-tip');
 if(st.e<SUG)tip.innerHTML='Con el '+st.e+' % ('+money(r.E)+') separas tu departamento. Los bancos piden el '+SUG+' % de entrada: puedes completarlo en cuotas <b>sin intereses</b> durante la obra.';
 else if(st.e===SUG)tip.innerHTML='<b>Recomendado.</b> El '+SUG+' % es la entrada que piden los bancos y te da acceso a mejores tasas.';
 else tip.innerHTML='<b>Excelente.</b> Mientras más entrada das, menos deuda y menos intereses.';
 document.querySelectorAll('.s2-modo').forEach(function(x){x.setAttribute('aria-checked',x.dataset.m===st.m)});
 $('#s2-sub-directo').hidden=st.m!=='directo';$('#s2-sub-banco').hidden=st.m!=='banco';
 chips($('#s2-meses'),MESES,st.n,function(v){return '<b>'+v+' meses</b><small>'+money((P-r.E)/v)+'/mes</small>'},'n');
 chips($('#s2-anios'),ANIOS.filter(function(a){return a<=b.ymax}),Math.min(st.y,b.ymax),function(v){return '<b>'+v+' años</b>'},'y');
 chips($('#s2-extra'),EXTRA,st.x,function(v){return '<b>'+(v?money(v)+'/mes':'No, gracias')+'</b>'},'x');
 $('#s2-bnote').textContent=b.note;el.t.value=r.tasa;
 document.querySelectorAll('[data-sis]').forEach(function(x){x.setAttribute('aria-pressed',x.dataset.sis===st.sis)});
 /* Resultado */
 var u=r.unit;$('#r2-unit').innerHTML=(u?'<b>'+u.id+'</b> · '+u.tipo+' · '+gN(u.area,2)+' m²':'<b>'+(st.tipo==='1 dormitorio'?'Suite · 1 dormitorio':'3 dormitorios')+'</b> · precio desde')+'<br>Precio de preventa: <b>'+money(P)+'</b>';
 var big,bl,bs;
 if(r.saldo<=0){bl='Cuota mensual sin intereses';big=money(r.cu);bs='durante '+r.n+(r.n===1?' mes':' meses')+' · recibes tu departamento 100 % pagado'}
 else{bl='Cuota de tu hipoteca, aprox.';big=money(r.c1);bs='al mes por '+r.anios+' años con '+b.n.replace(/ ·.*/,'')+(r.n?' · más '+money(r.cu)+'/mes sin intereses durante la obra':'')}
 $('#r2-big-l').textContent=bl;$('#r2-big').textContent=big;$('#r2-big-s').textContent=bs;
 var res=P*ENTMIN/100,t='';
 t+=li('Hoy · reserva ('+ENTMIN+' %)',money(Math.min(res,r.E)),'Separas tu departamento');
 if(r.E-res>0.5)t+=li('Al firmar la promesa',money(r.E-res),'Completas tu entrada del '+r.e+' %');
 if(r.n)t+=li('Durante la obra',r.n+' × '+money(r.cu),'Cuotas mensuales sin intereses');
 if(r.saldo<=0)t+=li('Entrega de llaves','100 % pagado','Sin deuda y sin intereses');
 else t+=li('Entrega de llaves','Hipoteca de '+money(r.saldo),'Aprox. '+money(r.c1)+'/mes · ingreso familiar sugerido '+money(r.ing));
 $('#r2-time').innerHTML=t;
 var w=$('#r2-warn');w.innerHTML=r.warn.map(function(x){return '<li>'+x+'</li>'}).join('');w.hidden=!r.warn.length;
 $('#b2-l').textContent=bl;$('#b2-v').textContent=big;
 /* Detalle */
 $('#s2-more').hidden=r.saldo<=0;
 $('#d2-cuota').textContent=r.rows.length?money2(r.c1)+(r.sis==='aleman'?' (1.ª cuota)':''):'—';$('#d2-int').textContent=money(r.ti);$('#d2-tot').textContent=money(r.saldo+r.ti);$('#d2-ah').textContent=money(r.ahorro);
 var ref=bankOf(CFG.bancoRef);$('#d2-txt').innerHTML='Si financiaras el 80 % del precio con un banco al '+String(ref.t).replace('.',',')+' % a '+ref.y+' años pagarías <b>'+money(r.bi)+'</b> en intereses. Con tu plan pagas <b>'+money(r.ti)+'</b>.'+(r.ahorro>1?' Te ahorras <b>'+money(r.ahorro)+'</b>.':'');
 var html='';for(var yy=0;yy<r.anios;yy++){var sl=r.rows.slice(yy*12,yy*12+12);if(!sl.length)break;html+='<tr><td>Año '+(yy+1)+'</td><td>'+money2(sum(sl,'c'))+'</td><td>'+money2(sum(sl,'i'))+'</td><td>'+money2(sum(sl,'a'))+'</td><td>'+money2(sl[sl.length-1].s)+'</td></tr>'}
 $('#d2-tabla tbody').innerHTML=html||'<tr><td colspan="5">Sin saldo a financiar.</td></tr>';
 var txt=summary(r)+' Quiero recibir mi plan de pagos.';var wa=$('#sim-wa');wa.href=CFG.wa+'?text='+encodeURIComponent(txt);wa.dataset.txt=txt;
 var f=document.getElementById('form-mz');if(f){var h=f.querySelector('[name=simulacion]');if(h)h.value=txt;if(r.u){var fu=f.querySelector('[name=unidad]');if(fu&&!fu.value)fu.value=r.u}}
}
function summary(r){return 'Hola Skyline, simulé mi compra en Monteza Residences: '+(r.u?'unidad '+r.u+', ':(st.tipo==='1 dormitorio'?'suite de 1 dormitorio, ':'departamento de 3 dormitorios, '))+'precio '+money(r.P)+', entrada '+r.e+' % ('+money(r.E)+')'+(r.n?', '+r.n+' cuotas sin intereses de '+money2(r.cu):'')+(r.saldo>0?', saldo a la entrega '+money(r.saldo)+' con '+r.b.n+' al '+String(r.tasa).replace('.',',')+' % a '+r.anios+' años (cuota aprox. '+money2(r.c1)+')':', departamento pagado al 100 % a la entrega')+'.'}
/* Eventos */
root.addEventListener('click',function(e){var x=e.target.closest('button');if(!x||!root.contains(x))return;var d=x.dataset,ch=false;
 if(d.tipo){st.tipo=d.tipo;st.u='';fillUnits();fillBanks();ch=true}
 else if(d.e){st.e=+d.e;ch=true}else if(d.m){st.m=d.m;ch=true}else if(d.n){st.n=+d.n;ch=true}
 else if(d.y){st.y=+d.y;ch=true}else if(d.x!==undefined&&x.classList.contains('s2-chip')){st.x=+d.x;ch=true}else if(d.sis){st.sis=d.sis;ch=true}
 if(ch){used1();render()}});
el.u.addEventListener('change',function(){used1();st.u=el.u.value;fillBanks();render()});
el.bk.addEventListener('change',function(){used1();st.b=el.bk.value;st.t=null;var b=bankOf(st.b);st.y=Math.min(st.y,b.ymax);render()});
el.t.addEventListener('input',function(){var v=parseFloat(String(el.t.value).replace(',','.'));if(!isNaN(v)){st.t=v;render()}});
/* Compartir */
function enc(o){return btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
function dec(t){t=t.replace(/-/g,'+').replace(/_/g,'/');while(t.length%4)t+='=';return JSON.parse(decodeURIComponent(escape(atob(t))))}
function shareURL(){return location.origin+location.pathname+'#sim='+enc({v:2,st:st})}
$('#sh-copy').addEventListener('click',function(){var u=shareURL(),m=$('#sh-st');function ok(){m.textContent='Enlace copiado: pégalo en WhatsApp o correo.'}
 if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(u).then(ok,function(){prompt('Copia este enlace:',u)});else prompt('Copia este enlace:',u);try{if(window.gtag)gtag('event','sim_share',{via:'link'})}catch(e){}});
/* Barra flotante en celular */
var bar=document.getElementById('s2-bar'),resV=false,stepsV=false;
if('IntersectionObserver' in window&&bar){var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.target.id==='s2-res')resV=x.isIntersecting;else stepsV=x.isIntersecting});bar.hidden=!(stepsV&&!resV&&innerWidth<901);document.body.classList.toggle('s2-on',!bar.hidden)});io.observe($('#s2-res'));io.observe($('.s2-steps'))}
/* API para inventario, PDF y Excel */
window.simSetUnit=function(id){var u=unitOf(id);if(!u)return;st.tipo=u.tipo;st.u=id;fillUnits();fillBanks();render()};
window.SIM_WA=CFG.wa;
window.simPack=function(){var cur=state(),r=simulate(cur);
 return {cur:r,txt:summary(r),scen:[],presets:['ligero','equilibrado','cero'].map(function(k){var o=simulate(preset(k,cur));o.label=PRESET_N[k];o.key=k;return o}),
  units:U,bancos:B,cfg:CFG,share:shareURL(),amort:amort,simulate:simulate}};
window.simLast=function(){var p=window.simPack(),r=p.cur;return {u:r.u,precio:money(r.P),ent:money(r.E),n:r.n,cuota:r.n?money2(r.cu):'',saldo:r.saldo>0?money(r.saldo):'',txt:p.txt}};
/* Estado inicial: enlace compartido o valores por defecto */
var h=location.hash.match(/sim=([\w-]+)/);
if(h){try{var o=dec(h[1]);if(o&&o.st){Object.keys(st).forEach(function(k){if(o.st[k]!==undefined)st[k]=o.st[k]});setTimeout(function(){root.scrollIntoView({behavior:'smooth'})},400)}}catch(e){}}
fillUnits();fillBanks();render();
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
 fd=new FormData(f);fetch(f.action,{method:'POST',body:fd,headers:{Accept:'application/json'}}).then(function(r){return r.json().then(function(j){return r.ok&&String(j.success)!=='false'},function(){return r.ok})},function(){return false}).then(function(sent){window.SK_SENT=sent;if(!sent){try{if(window.gtag)gtag('event','lead_fallback_whatsapp')}catch(x){}}
  var bl=document.getElementById('lo-bro'),bro=(bl&&window.SKSEC)?window.SKSEC.link(bl.dataset.k):'';if(bl&&bro){bl.href=bro;bl.hidden=false}
  try{if(window.gtag)gtag('event','generate_lead',{form:'plan_de_pagos',canal:d.canal})}catch(x){}
  bt.disabled=false;bt.hidden=true;st.textContent='';document.getElementById('lead-ok').hidden=false;
  var los=document.getElementById('lo-st'),lp=document.getElementById('lo-pdf'),lx=document.getElementById('lo-xls'),base=(pack&&pack.cur.u?'-'+pack.cur.u:'');
  var msg='Hola Skyline, soy '+d.nombre+'. Generé mi plan de pagos de Monteza Residences: '+(pack?pack.txt:'')+' Prefiero recibir la información por '+d.canal+'.';
  document.getElementById('lo-wa').href=window.SIM_WA+'?text='+encodeURIComponent(msg);
  if(!pack){los.textContent='Descarga el brochure y escríbenos para recibir tu plan.';return}
  pack.bro=bro;
  load('/assets/js/mzplan.js?v=2',function(){return !!window.MZPLAN}).then(function(){
   return window.MZPLAN.pdf(d,pack).then(function(blob){dl(lp,blob,'Monteza-Residences-Plan-y-Brochure'+base+'.pdf');lp.click();los.textContent='Tu PDF incluye tu plan ilustrado y el brochure del proyecto. El Excel te permite seguir jugando con los números.'},function(x){console.error('pdf',x);los.textContent='No pudimos armar el PDF; descarga el brochure y el Excel.'})
    .then(function(){return window.MZPLAN.xlsx(d,pack).then(function(blob){dl(lx,blob,'Monteza-Residences-Plan-de-Pagos'+base+'.xlsx')},function(x){console.error('xlsx',x)})})
  }).catch(function(x){console.error(x);los.textContent='Descarga el brochure y escríbenos por WhatsApp para recibir tu plan.'})
  .then(function(){if(d.canal==='whatsapp'||!window.SK_SENT)setTimeout(function(){window.open(document.getElementById('lo-wa').href,'_blank')},1200)})
 }).catch(function(){bt.disabled=false;st.textContent='No pudimos registrar tus datos. Revisa tu conexión o escríbenos por WhatsApp al +593 96 300 2600.'})});
})();
