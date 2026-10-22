/* Monteza Residences · Plan de pagos ilustrado (PDF + brochure) y Excel membretado · Skyline Constructions */
(function(){
var IMG='/assets/img/plan/';
var C={carb:[29,29,27],oro:[255,201,97],ace:[125,95,37],horm:[244,243,239],acero:[94,92,87],lin:[214,212,206],niebla:[180,177,168],bco:[255,255,255],gris:[201,199,192]};
function money(v){return 'USD '+Math.round(v||0).toLocaleString('es-EC')}
function money2(v){return 'USD '+(v||0).toLocaleString('es-EC',{minimumFractionDigits:2,maximumFractionDigits:2})}
function pct(v){return (Math.round((v||0)*10)/10).toLocaleString('es-EC')+' %'}
function load(src,test){return new Promise(function(res,rej){if(test())return res();var s=document.createElement('script');s.src=src;s.onload=function(){res()};s.onerror=function(){rej(new Error(src))};document.head.appendChild(s)})}
function dataURL(url){return fetch(url).then(function(r){if(!r.ok)throw new Error(url);return r.blob()}).then(function(b){return new Promise(function(res){var fr=new FileReader();fr.onload=function(){res(fr.result)};fr.readAsDataURL(b)})})}
function imgs(list){var o={};return Promise.all(list.map(function(n){return dataURL(IMG+n).then(function(d){o[n]=d},function(){o[n]=null})})).then(function(){return o})}
function startMonth(){var d=new Date();return new Date(d.getFullYear(),d.getMonth()+1,1)}
function mlabel(d){var s=d.toLocaleDateString('es-EC',{month:'short',year:'numeric'}).replace('.','');return s.charAt(0).toUpperCase()+s.slice(1)}
function addM(d,k){return new Date(d.getFullYear(),d.getMonth()+k,1)}
function mask(c){c=String(c||'');return c.length>4?'••••••'+c.slice(-4):c}
function tipoTxt(r){return r.unit?(r.unit.tipo+' · '+r.unit.area.toFixed(2).replace('.',',')+' m2'+(r.unit.abierta?' + '+String(r.unit.abierta).replace('.',',')+' m2 exteriores':'')+' · '+r.unit.nivel):'Precio libre'}

/* ============================ PDF ============================ */
function pdf(d,pack){
 return load('/assets/js/jspdf.umd.min.js',function(){return !!window.jspdf}).then(function(){return imgs(['cover.jpg','mz-dark.png','sk-claro.png','sk-neg.png','t-suite.jpg','t-3d.jpg'])}).then(function(I){
 var J=new window.jspdf.jsPDF({unit:'mm',format:'a4',compress:true}),W=210,H=297,M=14,r=pack.cur,y;
 J.setProperties({title:'Monteza Residences · Plan de pagos de '+d.nombre,author:'Skyline Constructions',subject:'Plan de pagos personalizado',creator:'skylineconstructions.build'});
 function fill(c){J.setFillColor(c[0],c[1],c[2])}function ink(c){J.setTextColor(c[0],c[1],c[2])}function draw(c){J.setDrawColor(c[0],c[1],c[2])}
 function font(sz,b){J.setFont('helvetica',b?'bold':'normal');J.setFontSize(sz)}
 function op(a){try{J.setGState(new J.GState({opacity:a}))}catch(e){}}
 function band(title,kick){fill(C.carb);J.rect(0,0,W,24,'F');fill(C.oro);J.rect(0,24,W,1.2,'F');if(I['mz-dark.png'])J.addImage(I['mz-dark.png'],'PNG',M,3.5,50,17.5);font(7.5,true);ink(C.oro);J.text((kick||'Plan de pagos personalizado').toUpperCase(),W-M,11,{align:'right'});font(13);ink(C.bco);J.text(title,W-M,18.5,{align:'right'});y=36;ink(C.carb)}
 function need(h){if(y+h>H-18){J.addPage();band('Tu plan de pagos')}}
 function h2(t,sub){need(22);font(16,true);ink(C.carb);J.text(t,M,y);y+=5;if(sub){font(9.5);ink(C.acero);var ls=J.splitTextToSize(sub,W-2*M);J.text(ls,M,y+1);y+=ls.length*4.4+2}fill(C.oro);J.rect(M,y,18,1,'F');y+=7;ink(C.carb)}
 function kpi(x,yy,w,h,lab,val,sub,dark){fill(dark?C.carb:C.horm);J.roundedRect(x,yy,w,h,2,2,'F');font(7.2,true);ink(dark?C.oro:C.acero);J.text(lab.toUpperCase(),x+4,yy+6,{charSpace:.3});font(dark?15:13.5,true);ink(dark?C.bco:C.carb);J.text(val,x+4,yy+14.5);if(sub){font(7.5);ink(dark?C.niebla:C.acero);J.text(J.splitTextToSize(sub,w-8),x+4,yy+19.5)}}
 /* ---------- Página 1: portada y resumen ---------- */
 band('Monteza Residences');
 if(I['cover.jpg']){J.addImage(I['cover.jpg'],'JPEG',0,25.2,W,92)}else{fill(C.horm);J.rect(0,25.2,W,92,'F')}
 op(.78);fill(C.carb);J.rect(0,84,W,33.2,'F');op(1);
 font(8,true);ink(C.oro);J.text('PREPARADO PARA '+String(d.nombre||'').toUpperCase(),M,93,{charSpace:.5});
 font(20,true);ink(C.bco);J.text('Tu nuevo hogar en San Isidro del Inca',M,103);
 font(9.5);ink([230,229,225]);J.text((r.u?'Unidad '+r.u+' · ':'')+tipoTxt(r)+' · '+new Date().toLocaleDateString('es-EC',{day:'numeric',month:'long',year:'numeric'}),M,111);
 y=124;var kw=(W-2*M-9)/4;
 kpi(M,y,kw,25,'Precio de preventa',money(r.P),r.u?'Unidad '+r.u:'Precio simulado');
 kpi(M+kw+3,y,kw,25,'Separas hoy con',money(r.E),r.e+' % de entrada'+(r.e<20?' · sugerido 20 %':''));
 kpi(M+2*(kw+3),y,kw,25,'Cuota sin intereses',r.n?money(r.cu):'—',r.n?r.n+' cuotas mientras construimos':'Sin cuotas directas',true);
 kpi(M+3*(kw+3),y,kw,25,'Pagado a la entrega',pct(r.pctEnt),r.saldo>0?'Saldo '+money(r.saldo)+' con banco':'Llaves 100 % pagadas');
 /* línea de tiempo */
 y=163;font(14,true);ink(C.carb);J.text('Tu camino hasta las llaves',M,y);fill(C.oro);J.rect(M,y+3,18,1,'F');
 var ty=y+19,xs=[M+12,M+12+(W-2*M-24)/3,M+12+2*(W-2*M-24)/3,W-M-12];draw(C.gris);J.setLineWidth(1.1);J.line(xs[0],ty,xs[3],ty);
 var st=[['HOY','Reserva y entrada',money(r.E),r.e+' % del precio'],
  ['DURANTE LA OBRA',r.n?r.n+' cuotas de':'Sin cuotas directas',r.n?money(r.cu):'—',r.n?'0 % de interés · '+money(r.paid)+' en total':'Puedes sumar cuotas cuando quieras'],
  ['ENTREGA DE LLAVES','Habrás pagado',pct(r.pctEnt),money(r.pagado)+' de '+money(r.P)],
  ['DESPUÉS',r.saldo>0?'Hipoteca de':'Tu departamento',r.saldo>0?money(r.c1)+'/mes':'Sin deudas',r.saldo>0?r.anios+' años · '+r.b.n.replace(/ ·.*/,''):'Cero intereses bancarios']];
 st.forEach(function(s,i){var x=xs[i];fill(i===2?C.oro:C.carb);J.circle(x,ty,5.2,'F');font(9,true);ink(i===2?C.carb:C.oro);J.text(String(i+1),x,ty+1.2,{align:'center'});
  var al=i===0?'left':(i===3?'right':'center'),xx=i===0?x-5:(i===3?x+5:x);font(6.8,true);ink(C.ace);J.text(s[0],xx,ty+11,{align:al,charSpace:.4});font(8.5);ink(C.acero);J.text(s[1],xx,ty+16,{align:al});font(12.5,true);ink(C.carb);J.text(s[2],xx,ty+22,{align:al});font(7.4);ink(C.acero);J.text(J.splitTextToSize(s[3],40),xx,ty+27,{align:al})});
 /* composición */
 y=ty+42;font(10.5,true);ink(C.carb);J.text('¿Cómo se paga tu departamento?',M,y);y+=4;var bw=W-2*M,parts=[[r.E,C.carb,'Entrada'],[r.paid,C.oro,'Cuotas sin intereses'],[r.saldo,C.gris,'Crédito hipotecario']],x0=M;
 parts.forEach(function(p){if(p[0]<=0)return;var w=bw*p[0]/r.P;fill(p[1]);J.rect(x0,y,w,9,'F');if(w>16){font(7.5,true);ink(p[1]===C.carb?C.bco:C.carb);J.text(pct(p[0]/r.P*100),x0+w/2,y+5.8,{align:'center'})}x0+=w});
 y+=14;x0=M;parts.forEach(function(p){fill(p[1]);J.rect(x0,y-2.6,3,3,'F');font(7.8);ink(C.acero);var t=p[2]+': '+money(p[0]);J.text(t,x0+4.5,y);x0+=J.getTextWidth(t)+12});
 y+=12;fill(C.horm);J.roundedRect(M,y,W-2*M,19,2,2,'F');font(12.5);ink(C.carb);J.text('“Lo que hoy es un plano, mañana es tu dirección.”',M+6,y+8.5);font(8);ink(C.acero);J.text('Quien compra en planos elige primero, paga mientras se construye y llega a la entrega con menos deuda.',M+6,y+14.5);
 /* ---------- Página 2: ahorro y alternativas ---------- */
 J.addPage();band('Lo que ganas comprando en planos','Tu ahorro');
 fill(C.carb);J.roundedRect(M,y,W-2*M,34,2,2,'F');font(8,true);ink(C.oro);J.text('CON TU PLAN TE AHORRAS EN INTERESES',M+7,y+8,{charSpace:.5});font(28,true);ink(C.oro);J.text(money(r.ahorro),M+7,y+21);
 font(9);ink([230,229,225]);J.text(r.ahorro>1&&r.cb?'Equivale a '+Math.round(r.ahorro/r.cb)+' cuotas de hipoteca que ya no pagarás · '+pct(r.ahorro/r.P*100)+' del precio':'Sube tu cuota o tu entrada y mira cómo crece tu ahorro.',M+7,y+29);
 y+=42;font(10.5,true);ink(C.carb);J.text('Intereses que pagarías',M,y);y+=5;var mx=Math.max(r.bi,r.ti,1),lw=60,bw2=W-2*M-lw-30;
 [['Si financias el 80 % con banco',r.bi,C.gris],['Con tu plan Monteza',r.ti,C.oro]].forEach(function(b){font(8.5);ink(C.acero);J.text(b[0],M,y+5);fill(C.horm);J.rect(M+lw,y,bw2,7,'F');fill(b[2]);J.rect(M+lw,y,Math.max(1,bw2*b[1]/mx),7,'F');font(9,true);ink(C.carb);J.text(money(b[1]),W-M,y+5,{align:'right'});y+=11});
 font(7.3);ink(C.acero);var ref=pack.bancos.find(function(b){return b.id===pack.cfg.bancoRef})||{t:7.5,y:20};J.text('Referencia: 20 % de entrada y 80 % con banco al '+String(ref.t).replace('.',',')+' % a '+ref.y+' años, sistema francés.',M,y+1);y+=10;
 /* alternativas */
 h2('Tres maneras de comprar tu departamento','Mismo departamento, distintas formas de pagarlo. Elige la que se ajusta a tu presupuesto: siempre puedes adelantar cuotas.');
 var al=pack.presets.slice();var cw=(W-2*M-6)/3;
 al.forEach(function(p,i){var x=M+i*(cw+3),rec=p.key==='equilibrado',h=68;fill(rec?C.carb:C.horm);J.roundedRect(x,y,cw,h,2,2,'F');if(rec){fill(C.oro);J.roundedRect(x+cw-26,y+3,23,5.5,1,1,'F');font(6.5,true);ink(C.carb);J.text('SUGERIDO',x+cw-14.5,y+6.8,{align:'center'})}
  font(11,true);ink(rec?C.oro:C.carb);J.text(p.label.replace(' (sugerido)',''),x+4,y+9);
  var rows=[['Entrada',p.e+' % · '+money(p.E)],['Cuotas sin intereses',p.n?p.n+' × '+money(p.cu):'—'],['Pagado a la entrega',pct(p.pctEnt)],['Hipoteca',p.saldo>0?money(p.c1)+'/mes':'Sin deuda'],['Intereses',money(p.ti)],['Costo total',money(p.total)]],yy=y+15;
  rows.forEach(function(q,k){font(7);ink(rec?C.niebla:C.acero);J.text(q[0],x+4,yy);font(k===5?10.5:9.5,true);ink(rec?C.bco:C.carb);J.text(q[1],x+4,yy+4.3);yy+=8.6});});
 y+=74;font(7.3);ink(C.acero);J.text(J.splitTextToSize('Empieza ligero: 5 % de entrada y cuotas que te llevan al 20 % pagado a la entrega, el mínimo que suelen pedir los bancos. Equilibrado: 20 % de entrada y cuotas que duplican lo pagado antes de la hipoteca. Cero deuda: 20 % y el saldo en 36 cuotas sin intereses.',W-2*M),M,y);y+=12;
 /* escalera del ahorro */
 need(52);font(10.5,true);ink(C.carb);J.text('La escalera del ahorro: ¿cuánto ahorras según tu cuota mensual?',M,y);y+=6;
 var qs=[500,1000,1500,2000,2500,3000],sw=(W-2*M-15)/6,mxa=Math.max(r.bi,1);
 qs.forEach(function(q,i){var n=Math.min(pack.cfg.mesesEntrega,Math.ceil(r.S/q-1e-9)),sal=Math.max(0,r.S-q*n),rr=pack.amort(sal,r.tasa,r.anios,r.sis),it=rr.reduce(function(a,x){return a+x.i},0),a=Math.max(0,r.bi-it),hh=Math.max(2,28*a/mxa),x=M+i*(sw+3);
  fill(C.horm);J.rect(x,y,sw,30,'F');fill(C.oro);J.rect(x,y+30-hh,sw,hh,'F');font(8.5,true);ink(C.carb);J.text(money(a),x+sw/2,y+30-hh-1.5,{align:'center'});font(7.5);ink(C.acero);J.text('Cuota '+money(q),x+sw/2,y+35,{align:'center'});J.text(sal>0?'saldo '+money(sal):'100 % pagado',x+sw/2,y+39,{align:'center'})});
 y+=46;
 /* ---------- Escenarios guardados ---------- */
 if(pack.scen&&pack.scen.length){J.addPage();band('Tus escenarios comparados','Comparativo');
  h2('Compara y decide con números','Los escenarios que guardaste en el simulador. El de menor costo total aparece resaltado.');
  var sc=pack.scen,best=sc.reduce(function(a,x,i){return x.total<sc[a].total?i:a},0),lab=['Unidad','Tipo','Precio','Entrada','Cuotas sin intereses','Pagado a la entrega','Entidad','Hipoteca mensual','Intereses','Costo total'],cw2=(W-2*M-46)/sc.length;
  font(8.5,true);fill(C.carb);J.rect(M,y,W-2*M,9,'F');ink(C.oro);sc.forEach(function(s,i){J.text(s.label.replace(' (sugerido)','').slice(0,34),M+46+i*cw2+2,y+6)});y+=9;
  lab.forEach(function(L,k){var vals=sc.map(function(s){return [s.u||'—',s.unit?s.unit.tipo:'Precio libre',money(s.P),s.e+' % · '+money(s.E),s.n?s.n+' × '+money(s.cu):'—',pct(s.pctEnt),s.saldo>0?s.b.n.replace(/ ·.*/,''):'—',s.saldo>0?money(s.c1):'Sin deuda',money(s.ti),money(s.total)][k]});
   if(k%2===0){fill(C.horm);J.rect(M,y,W-2*M,8,'F')}fill(C.oro);op(.25);J.rect(M+46+best*cw2,y,cw2,8,'F');op(1);font(8);ink(C.acero);J.text(L,M+2,y+5.4);font(8.5,k===9);ink(C.carb);vals.forEach(function(v,i){J.text(String(v),M+46+i*cw2+2,y+5.4)});y+=8});
  y+=6}
 /* ---------- Cronograma ---------- */
 J.addPage();band('Tu cronograma de pagos','Mes a mes');
 h2('Pagos mientras construimos','Fechas estimadas a partir del próximo mes. Las cuotas del crédito directo Skyline no tienen intereses.');
 var sm=startMonth(),cols=[M,M+14,M+48,M+112,M+150],hdr=['N.º','Mes','Concepto','Pago','Saldo por pagar'];
 function th(){fill(C.carb);J.rect(M,y,W-2*M,8,'F');font(8,true);ink(C.oro);hdr.forEach(function(h,i){J.text(h,i>=3?(i===3?M+140:W-M-2):cols[i]+2,y+5.5,{align:i>=3?'right':'left'})});y+=8}
 th();var saldo=r.P,ac=0,k=0;
 function tr(n,mes,con,pago,sal,hl){if(y>H-26){J.addPage();band('Tu cronograma de pagos','Mes a mes');th()}if(hl){fill(C.oro);op(.3);J.rect(M,y,W-2*M,7,'F');op(1)}else if(k%2){fill(C.horm);J.rect(M,y,W-2*M,7,'F')}font(8,!!hl);ink(C.carb);J.text(String(n),cols[0]+2,y+4.8);J.text(mes,cols[1]+2,y+4.8);J.text(con,cols[2]+2,y+4.8);J.text(pago,M+140,y+4.8,{align:'right'});J.text(sal,W-M-2,y+4.8,{align:'right'});y+=7;k++}
 saldo-=r.E;tr(0,mlabel(addM(sm,-1)),'Reserva y entrada ('+r.e+' %)',money2(r.E),money2(saldo),true);
 for(var i=1;i<=r.n;i++){var c=Math.min(r.cu,r.S-r.cu*(i-1));if(c<=0.004)break;saldo-=c;tr(i,mlabel(addM(sm,i-1)),'Cuota directa sin intereses',money2(c),money2(Math.max(0,saldo)))}
 tr('',mlabel(addM(sm,Math.max(r.n,1))),'Entrega de llaves · '+(r.saldo>0?'saldo con crédito hipotecario':'pagado al 100 %'),r.saldo>0?money2(r.saldo):'USD 0,00','USD 0,00',true);
 if(r.rows&&r.rows.length){y+=8;need(40);h2('Tu crédito hipotecario, año por año',r.b.n+' · tasa referencial '+String(r.tasa).replace('.',',')+' % · '+r.anios+' años · sistema '+(r.sis==='frances'?'francés (cuota fija)':'alemán (cuota decreciente)')+'. Ingreso familiar sugerido: '+money(r.ing)+'.');
  hdr=['Año','Cuotas del año','Interés','Capital','Saldo'];cols=[M,M+20,M+70,M+110,M+150];
  var th2=function(){fill(C.carb);J.rect(M,y,W-2*M,8,'F');font(8,true);ink(C.oro);J.text('Año',M+2,y+5.5);J.text('Cuotas del año',M+70,y+5.5,{align:'right'});J.text('Interés',M+110,y+5.5,{align:'right'});J.text('Capital',M+150,y+5.5,{align:'right'});J.text('Saldo',W-M-2,y+5.5,{align:'right'});y+=8};th2();k=0;
  for(var a=0;a<r.anios;a++){var sl=r.rows.slice(a*12,a*12+12);if(!sl.length)break;if(y>H-26){J.addPage();band('Tu cronograma de pagos','Mes a mes');th2()}if(k%2){fill(C.horm);J.rect(M,y,W-2*M,7,'F')}font(8);ink(C.carb);
   J.text('Año '+(a+1),M+2,y+4.8);J.text(money2(sl.reduce(function(x,q){return x+q.c},0)),M+70,y+4.8,{align:'right'});J.text(money2(sl.reduce(function(x,q){return x+q.i},0)),M+110,y+4.8,{align:'right'});J.text(money2(sl.reduce(function(x,q){return x+q.a},0)),M+150,y+4.8,{align:'right'});J.text(money2(sl[sl.length-1].s),W-M-2,y+4.8,{align:'right'});y+=7;k++}}
 if(r.warn&&r.warn.length){y+=4;need(10+r.warn.length*10);font(9,true);ink(C.ace);J.text('Para tener en cuenta',M,y);y+=5;font(8);ink(C.carb);r.warn.forEach(function(w){var ls=J.splitTextToSize('• '+w,W-2*M);J.text(ls,M,y);y+=ls.length*4+1})}
 /* ---------- Próximos pasos ---------- */
 J.addPage();band('Próximos pasos','Tu hoja de ruta');
 h2('Cinco pasos para asegurar tu departamento');
 [['Elige y separa tu unidad','Con tu reserva bloqueamos el precio de preventa de la unidad que elegiste.'],['Firma la promesa de compraventa','Detalla unidad, precio, plan de pagos, plazos y garantías. Léela con calma: te explicamos cada cláusula.'],['Paga tus cuotas sin intereses','Mientras construimos, cada cuota reduce lo que necesitarás del banco.'],['Precalifica tu crédito','Te acompañamos con Banco Pichincha, Banco del Pacífico, Produbanco, BIESS o Miti-Miti VIS/VIP.'],['Recibe tus llaves','Entrega con actas, planos y garantías. Bienvenido a San Isidro del Inca.']].forEach(function(p,i){fill(i===0?C.oro:C.carb);J.circle(M+5,y+1,4.5,'F');font(9,true);ink(i===0?C.carb:C.oro);J.text(String(i+1),M+5,y+2.2,{align:'center'});font(10.5,true);ink(C.carb);J.text(p[0],M+14,y+1.5);font(8.6);ink(C.acero);J.text(J.splitTextToSize(p[1],W-2*M-14),M+14,y+6.5);y+=16});
 y+=2;fill(C.horm);J.roundedRect(M,y,(W-2*M-4)/2,48,2,2,'F');var x2=M+(W-2*M-4)/2+4;fill(C.carb);J.roundedRect(x2,y,(W-2*M-4)/2,48,2,2,'F');
 font(10,true);ink(C.carb);J.text('Ten a mano',M+5,y+8);font(8.4);ink(C.acero);J.text(['• Cédula de identidad (y la de tu cónyuge)','• Certificado de votación','• Respaldo de ingresos (rol de pagos o declaraciones)','• Precalificación bancaria: te ayudamos a obtenerla'],M+5,y+15,{lineHeightFactor:1.7});
 font(8,true);ink(C.oro);J.text('LAS PREVENTAS NO ESPERAN',x2+5,y+8,{charSpace:.5});font(12.5,true);ink(C.bco);J.text(J.splitTextToSize('Las primeras unidades salen al mejor precio.',(W-2*M-4)/2-10),x2+5,y+16);font(8.6);ink([230,229,225]);J.text('Escríbenos y separa la tuya hoy:',x2+5,y+31);font(11,true);ink(C.oro);J.textWithLink('WhatsApp +593 96 300 2600',x2+5,y+38,{url:(pack.cfg.wa||'https://wa.me/593963002600')});font(8);ink([230,229,225]);J.textWithLink('Abrir mi simulación en línea',x2+5,y+44,{url:pack.share});
 y+=58;if(I['sk-claro.png'])J.addImage(I['sk-claro.png'],'PNG',M,y,42,17.5);font(7.4);ink(C.acero);J.text(J.splitTextToSize('Simulación referencial; no constituye oferta, reserva ni aprobación de crédito. El crédito directo está sujeto a la aprobación de Skyline Constructions, a la firma de la promesa de compraventa y al cronograma de obra; las cuotas se pagan hasta la entrega, con un máximo de 36 meses. Las condiciones hipotecarias son referenciales a octubre de 2026 y las define cada entidad según tu perfil; no incluyen seguros, avalúo ni gastos legales. Precios sujetos a cambio y disponibilidad. Fechas estimadas.',W-2*M-50),M+50,y+3);
 y+=24;fill(C.horm);J.roundedRect(M,y,W-2*M,14,2,2,'F');font(8.2,true);ink(C.ace);J.text('Seguridad:',M+4,y+6);font(8.2);ink(C.carb);J.text(J.splitTextToSize('Skyline Constructions solo recibe pagos en cuentas a nombre de la empresa y con contrato firmado. Nunca te pediremos depósitos a cuentas personales. Canales oficiales: skylineconstructions.build · +593 96 300 2600.',W-2*M-26),M+22,y+6);
 /* pies de página */
 var np=J.getNumberOfPages();for(var pi=1;pi<=np;pi++){J.setPage(pi);font(6.6);ink([140,138,130]);J.text('Documento personal para '+d.nombre+' · C.I. '+mask(d.cedula)+' · '+new Date().toLocaleDateString('es-EC')+' · Monteza Residences, un proyecto de Skyline Constructions · skylineconstructions.build',M,H-7);J.text(pi+' / '+np,W-M,H-7,{align:'right'})}
 var bytes=J.output('arraybuffer');
 if(!pack.bro)return new Blob([bytes],{type:'application/pdf'});
 return load('/assets/js/pdf-lib.min.js',function(){return !!window.PDFLib}).then(function(){return fetch(pack.bro)}).then(function(res){if(!res.ok)throw 0;return res.arrayBuffer()}).then(function(bb){var L=window.PDFLib;
  return Promise.all([L.PDFDocument.load(bytes),L.PDFDocument.load(bb)]).then(function(ds){var plan=ds[0],bro=ds[1];return plan.copyPages(bro,bro.getPageIndices()).then(function(pp){pp.forEach(function(p){plan.addPage(p)});plan.setTitle('Monteza Residences · Plan de pagos y brochure');plan.setAuthor('Skyline Constructions');return plan.save()})})})
  .then(function(out){return new Blob([out],{type:'application/pdf'})},function(){return new Blob([bytes],{type:'application/pdf'})})
 })}

/* ============================ EXCEL ============================ */
function xlsx(d,pack){
 return load('/assets/js/exceljs.min.js',function(){return !!window.ExcelJS}).then(function(){return imgs(['mz-dark.png','sk-neg.png'])}).then(function(I){return build(window.ExcelJS,d,pack,I)}).then(function(wb){return wb.xlsx.writeBuffer()}).then(function(b){return new Blob([b],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})})}
function build(X,d,pack,I){
 var r=pack.cur,wb=new X.Workbook();wb.creator='Skyline Constructions';wb.company='Skyline Constructions';wb.title='Monteza Residences · Plan de pagos';wb.created=new Date();wb.calcProperties={fullCalcOnLoad:true};
 var CARB='FF1D1D1B',ORO='FFFFC961',ACE='FF7D5F25',HORM='FFF4F3EF',INP='FFFFF2CC',LIN='FFD6D4CE',ACERO='FF5E5C57',F='Arial';
 var USD='"USD "#,##0;-"USD "#,##0',USD2='"USD "#,##0.00',PCT='0.0%';
 var imM=I['mz-dark.png']?wb.addImage({base64:I['mz-dark.png'],extension:'png'}):null,imS=I['sk-neg.png']?wb.addImage({base64:I['sk-neg.png'],extension:'png'}):null;
 function head(ws,title,cols,lastCol){ws.views=[{showGridLines:false,state:'frozen',ySplit:6}];
  for(var rr=1;rr<=5;rr++){ws.getRow(rr).height=rr===1||rr===5?8:20;for(var c=1;c<=cols;c++)ws.getCell(rr,c).fill={type:'pattern',pattern:'solid',fgColor:{argb:CARB}}}
  for(var c2=1;c2<=cols;c2++)ws.getCell(6,c2).fill={type:'pattern',pattern:'solid',fgColor:{argb:ORO}};ws.getRow(6).height=4;
  if(imM!=null)ws.addImage(imM,{tl:{col:1,row:0.6},ext:{width:205,height:72}});if(imS!=null)ws.addImage(imS,{tl:{col:lastCol,row:0.7},ext:{width:150,height:62}});
  ws.getCell(8,2).value=title;ws.getCell(8,2).font={name:F,size:17,bold:true,color:{argb:CARB}};
  ws.getCell(9,2).value='Preparado para '+d.nombre+' · '+new Date().toLocaleDateString('es-EC',{day:'numeric',month:'long',year:'numeric'})+' · Monteza Residences, San Isidro del Inca, Quito';ws.getCell(9,2).font={name:F,size:9,color:{argb:ACERO}};
  ws.pageSetup={paperSize:9,orientation:'portrait',fitToPage:true,fitToWidth:1,fitToHeight:0,margins:{left:.4,right:.4,top:.5,bottom:.6,header:.2,footer:.3}};
  ws.headerFooter={oddFooter:'&8Skyline Constructions · Monteza Residences · Documento personal para '+d.nombre+' · Simulación referencial · Página &P de &N'}}
 function sec(ws,row,t,c1,c2){ws.mergeCells(row,c1||2,row,c2||3);var c=ws.getCell(row,c1||2);c.value=t;c.font={name:F,size:11,bold:true,color:{argb:'FFFFFFFF'}};c.fill={type:'pattern',pattern:'solid',fgColor:{argb:CARB}};c.alignment={vertical:'middle',indent:1};ws.getRow(row).height=20}
 function lab(ws,a,t,sub){var c=ws.getCell(a);c.value=t;c.font={name:F,size:10,color:{argb:'FF1D1D1B'}};c.alignment={vertical:'middle',wrapText:true};c.border={bottom:{style:'thin',color:{argb:LIN}}}}
 function val(ws,a,v,fmt,o){o=o||{};var c=ws.getCell(a);c.value=v;c.numFmt=fmt||'General';c.font={name:F,size:o.big?14:10,bold:!!(o.bold||o.big),color:{argb:o.color||'FF1D1D1B'}};c.alignment={horizontal:'right',vertical:'middle'};c.border={bottom:{style:'thin',color:{argb:LIN}}};
  if(o.inp){c.fill={type:'pattern',pattern:'solid',fgColor:{argb:INP}};c.protection={locked:false};c.border={top:{style:'thin',color:{argb:'FFE0C27A'}},bottom:{style:'thin',color:{argb:'FFE0C27A'}},left:{style:'thin',color:{argb:'FFE0C27A'}},right:{style:'thin',color:{argb:'FFE0C27A'}}}}
  if(o.fill)c.fill={type:'pattern',pattern:'solid',fgColor:{argb:o.fill}};return c}
 function note(ws,a,t,o){o=o||{};var c=ws.getCell(a);c.value=t;c.font={name:F,size:o.size||9,italic:!o.bold,bold:!!o.bold,color:{argb:o.color||ACERO}};c.alignment={wrapText:true,vertical:'top'}}
 var units=pack.units,banks=pack.bancos,N=units.length+11;
 /* ---- Inventario ---- */
 var ws=wb.addWorksheet('Mi plan',{properties:{tabColor:{argb:'FFFFC961'}}}),cr=wb.addWorksheet('Cronograma',{properties:{tabColor:{argb:'FFFFC961'}}}),hp=wb.addWorksheet('Hipoteca',{properties:{tabColor:{argb:'FF5E5C57'}}}),es=wb.addWorksheet('Escenarios',{properties:{tabColor:{argb:'FFFFC961'}}}),iv=wb.addWorksheet('Inventario',{properties:{tabColor:{argb:'FF5E5C57'}}}),bk=wb.addWorksheet('Bancos',{properties:{tabColor:{argb:'FF5E5C57'}}});iv.columns=[{width:2},{width:12},{width:16},{width:16},{width:12},{width:14},{width:15},{width:15},{width:18},{width:2}];
 head(iv,'Unidades disponibles y precios de preventa',9,7);
 var hr=11;['Unidad','Planta','Tipo','Área útil (m²)','Exterior (m²)','PVP (USD)','Entrada 20 %','Cuota 36 meses sin intereses'].forEach(function(h,i){var c=iv.getCell(hr,i+2);c.value=h;c.font={name:F,bold:true,size:9,color:{argb:'FFFFFFFF'}};c.fill={type:'pattern',pattern:'solid',fgColor:{argb:CARB}};c.alignment={wrapText:true,vertical:'middle'}});iv.getRow(hr).height=30;
 units.forEach(function(u,i){var rr=hr+1+i,row=[u.id,u.nivel,u.tipo,u.area,u.abierta||0,u.pvp];row.forEach(function(v,j){var c=iv.getCell(rr,j+2);c.value=v;c.font={name:F,size:9};if(j===3||j===4)c.numFmt='0.00';if(j===5)c.numFmt=USD;if(i%2)c.fill={type:'pattern',pattern:'solid',fgColor:{argb:HORM}}});
  var e=iv.getCell(rr,8);e.value={formula:'G'+rr+'*0.2',result:u.pvp*0.2};e.numFmt=USD;e.font={name:F,size:9};var q=iv.getCell(rr,9);q.value={formula:'G'+rr+'*0.8/36',result:u.pvp*0.8/36};q.numFmt=USD;q.font={name:F,size:9};if(i%2){e.fill=q.fill={type:'pattern',pattern:'solid',fgColor:{argb:HORM}}}});
 note(iv,'B'+(hr+units.length+2),'Precios de preventa referenciales, sujetos a cambio y disponibilidad. Elige una unidad en la hoja "Mi plan" y el precio se actualiza solo.');
 /* ---- Bancos ---- */
 bk.columns=[{width:2},{width:34},{width:12},{width:12},{width:12},{width:80},{width:2}];
 head(bk,'Entidades y tasas referenciales',6,5);
 ['Entidad','Tasa anual','Plazo (años)','Plazo máx.','Condición y fuente'].forEach(function(h,i){var c=bk.getCell(11,i+2);c.value=h;c.font={name:F,bold:true,size:9,color:{argb:'FFFFFFFF'}};c.fill={type:'pattern',pattern:'solid',fgColor:{argb:CARB}}});
 banks.forEach(function(b,i){var rr=12+i;[b.n,b.t/100,b.y,b.ymax,b.note].forEach(function(v,j){var c=bk.getCell(rr,j+2);c.value=v;c.font={name:F,size:9};c.alignment={wrapText:true,vertical:'top'};if(j===1)c.numFmt='0.00%'})});
 var BK1=12,BK2=11+banks.length;
 /* ---- Mi plan ---- */
 wb.views=[{activeTab:0}];
 ws.columns=[{width:2},{width:44},{width:20},{width:3},{width:38},{width:20},{width:2}];
 head(ws,'Tu plan de pagos personalizado',7,5);
 note(ws,'B10','Las celdas amarillas son editables: cambia la unidad, la entrada, las cuotas o el banco y el plan se recalcula solo.',{color:ACE,bold:true});ws.mergeCells('B10:F10');
 sec(ws,12,'1 · Tu departamento');
 lab(ws,'B13','Unidad (elige de la lista)');val(ws,'C13',r.u||'',null,{inp:true});ws.getCell('C13').dataValidation={type:'list',allowBlank:true,formulae:['Inventario!$B$12:$B$'+(11+units.length)],showErrorMessage:false};
 lab(ws,'B14','Tipo');val(ws,'C14',{formula:'IFERROR(VLOOKUP(C13,Inventario!$B$12:$G$'+(11+units.length)+',3,FALSE),"Precio libre")',result:r.unit?r.unit.tipo:'Precio libre'});
 lab(ws,'B15','Área útil (m²)');val(ws,'C15',{formula:'IFERROR(VLOOKUP(C13,Inventario!$B$12:$G$'+(11+units.length)+',4,FALSE),"—")',result:r.unit?r.unit.area:'—'},'0.00');
 lab(ws,'B16','Precio de preventa (USD) · o escribe otro precio');val(ws,'C16',{formula:'IFERROR(VLOOKUP(C13,Inventario!$B$12:$G$'+(11+units.length)+',6,FALSE),'+Math.round(r.P)+')',result:r.P},USD,{inp:true,bold:true});
 sec(ws,18,'2 · Entrada y cuotas sin intereses');
 lab(ws,'B19','Reserva o entrada (mínimo 5 % · sugerido 20 %)');val(ws,'C19',r.e/100,'0%',{inp:true,bold:true});ws.getCell('C19').dataValidation={type:'decimal',operator:'between',formulae:[0.05,1],showErrorMessage:true,errorTitle:'Entrada',error:'La entrada va del 5 % al 100 %.'};
 lab(ws,'B20','Entrada (USD)');val(ws,'C20',{formula:'C16*C19',result:r.E},USD);
 lab(ws,'B21','Saldo para pagar en cuotas');val(ws,'C21',{formula:'C16-C20',result:r.S},USD);
 lab(ws,'B22','Número de cuotas mensuales (máximo 36)');val(ws,'C22',r.n,'0',{inp:true});ws.getCell('C22').dataValidation={type:'whole',operator:'between',formulae:[0,36],showErrorMessage:true,error:'Entre 0 y 36 cuotas.'};
 lab(ws,'B23','Cuota mensual sin intereses (USD)');val(ws,'C23',r.modo==='plazo'?{formula:'IF(C22>0,ROUND(C21/C22,2),0)',result:r.cu}:Math.round(r.cu*100)/100,USD2,{inp:true,bold:true});
 lab(ws,'B24','Pagado en cuotas');val(ws,'C24',{formula:'MIN(C21,C22*C23)',result:r.paid},USD);
 lab(ws,'B25','Pagado a la entrega de llaves');val(ws,'C25',{formula:'C20+C24',result:r.pagado},USD,{bold:true});
 lab(ws,'B26','Porcentaje pagado a la entrega');val(ws,'C26',{formula:'IF(C16>0,C25/C16,0)',result:r.pctEnt/100},PCT,{bold:true,color:ACE});
 lab(ws,'B27','Saldo a la entrega (crédito hipotecario)');val(ws,'C27',{formula:'MAX(0,C16-C25)',result:r.saldo},USD,{bold:true});
 sec(ws,29,'3 · Crédito hipotecario para el saldo');
 lab(ws,'B30','Entidad (elige de la lista)');val(ws,'C30',r.b.n,null,{inp:true});ws.getCell('C30').dataValidation={type:'list',allowBlank:true,formulae:['Bancos!$B$'+BK1+':$B$'+BK2],showErrorMessage:false};ws.getCell('C30').alignment={horizontal:'left',shrinkToFit:true};
 lab(ws,'B31','Tasa anual');val(ws,'C31',{formula:'IFERROR(VLOOKUP(C30,Bancos!$B$'+BK1+':$C$'+BK2+',2,FALSE),'+(r.tasa/100)+')',result:r.tasa/100},'0.00%',{inp:true});
 lab(ws,'B32','Plazo (años)');val(ws,'C32',r.anios,'0',{inp:true});
 lab(ws,'B33','Cuota mensual fija (sistema francés)');val(ws,'C33',{formula:'IF(C27>0,PMT(C31/12,C32*12,-C27),0)',result:r.sis==='frances'?r.c1:0},USD2,{bold:true});
 lab(ws,'B34','Intereses totales');val(ws,'C34',{formula:'IF(C27>0,C33*C32*12-C27,0)',result:r.sis==='frances'?r.ti:0},USD);
 lab(ws,'B35','Total pagado al banco');val(ws,'C35',{formula:'C27+C34',result:r.saldo+(r.sis==='frances'?r.ti:0)},USD);
 lab(ws,'B36','Ingreso familiar sugerido (cuota ≤ 35 % del ingreso)');val(ws,'C36',{formula:'C33/0.35',result:r.sis==='frances'?r.c1/0.35:0},USD);
 sec(ws,38,'4 · Tu ahorro por comprar en planos');
 var ref=pack.bancos.find(function(b){return b.id===pack.cfg.bancoRef})||{t:7.5,y:20};
 lab(ws,'B39','Intereses si financias el 80 % con banco ('+String(ref.t).replace('.',',')+' % a '+ref.y+' años)');val(ws,'C39',{formula:'PMT('+(ref.t/100)+'/12,'+(ref.y*12)+',-C16*0.8)*'+(ref.y*12)+'-C16*0.8',result:r.bi},USD);
 lab(ws,'B40','Intereses con tu plan');val(ws,'C40',{formula:'C34',result:r.ti},USD);
 lab(ws,'B41','TU AHORRO EN INTERESES');ws.getCell('B41').font={name:F,size:11,bold:true,color:{argb:ACE}};val(ws,'C41',{formula:'MAX(0,C39-C40)',result:r.ahorro},USD,{big:true,color:ACE,fill:'FFFFF6E0'});ws.getRow(41).height=24;
 lab(ws,'B42','Costo total de tu departamento (precio + intereses)');val(ws,'C42',{formula:'C16+C34',result:r.total},USD,{bold:true});
 /* panel derecho */
 sec(ws,12,'Tu plan en una mirada',5,6);
 [['Separas hoy con','C20',USD],['Cuota mensual sin intereses','C23',USD2],['Pagado a la entrega','C26',PCT],['Hipoteca mensual','C33',USD2],['Ahorro en intereses','C41',USD]].forEach(function(p,i){var rr=13+i*2;var a=ws.getCell('E'+rr);a.value=p[0];a.font={name:F,size:9,color:{argb:ACERO}};var b=ws.getCell('F'+rr);b.value={formula:p[1]};b.numFmt=p[2];b.font={name:F,size:13,bold:true,color:{argb:i===4?ACE:'FF1D1D1B'}};b.alignment={horizontal:'right'};});
 ws.mergeCells('E24:F27');note(ws,'E24',{formula:'IF(C19<0.2,"Empiezas con poco y completas la diferencia en cuotas sin intereses. Llegar al 20 % antes de la entrega baja tu hipoteca y te abre las mejores tasas.",IF(C19=0.2,"Gran decisión: el 20 % es la entrada que piden los bancos y te abre las mejores tasas.","Excelente: cada punto extra de entrada reduce tu deuda y tus intereses."))'},{color:ACE,size:9.5});
 ws.mergeCells('E29:F31');note(ws,'E29',{formula:'IF(AND(C27>C16*0.8,C30<>"Crédito Miti-Miti · VIS"),"Atención: los bancos suelen financiar hasta el 80 % del valor. Sube tus cuotas o tu entrada para llegar al 20 % pagado a la entrega.","")'},{color:'FFB0413E',bold:true});
 ws.mergeCells('E33:F36');note(ws,'E33','Tasas referenciales a octubre de 2026. Cada entidad define la tasa y el plazo según tu perfil. No incluyen seguros, avalúo ni gastos legales.');
 ws.mergeCells('B44:F46');note(ws,'B44','Simulación referencial; no constituye oferta, reserva ni aprobación de crédito. El crédito directo Skyline está sujeto a aprobación, a la firma de la promesa de compraventa y al cronograma de obra (máximo 36 cuotas hasta la entrega). Precios sujetos a cambio y disponibilidad. Pagos solo a cuentas a nombre de Skyline Constructions con contrato firmado. Canales oficiales: skylineconstructions.build · WhatsApp +593 96 300 2600.');
 ws.getCell('B48').value={text:'Abrir mi simulación en línea',hyperlink:pack.share};ws.getCell('B48').font={name:F,size:10,bold:true,color:{argb:ACE},underline:true};
 ws.getCell('E48').value={text:'Separar mi unidad por WhatsApp',hyperlink:(pack.cfg.wa||'https://wa.me/593963002600')};ws.getCell('E48').font={name:F,size:10,bold:true,color:{argb:ACE},underline:true};
 for(var rr=13;rr<=42;rr++){if(!ws.getRow(rr).height)ws.getRow(rr).height=18}
 ws.addConditionalFormatting({ref:'C26',rules:[{type:'dataBar',minLength:0,maxLength:100,cfvo:[{type:'num',value:0},{type:'num',value:1}],color:{argb:'FFFFC961'}}]});
 /* ---- Cronograma ---- */
 cr.columns=[{width:2},{width:8},{width:14},{width:40},{width:18},{width:18},{width:18},{width:2}];
 head(cr,'Cronograma de pagos mientras construimos',8,6);
 note(cr,'B10','Fechas estimadas desde el próximo mes. Se actualiza con los valores de la hoja "Mi plan".');cr.mergeCells('B10:G10');
 ['N.º','Mes','Concepto','Pago (USD)','Pagado acumulado','Saldo por pagar'].forEach(function(h,i){var c=cr.getCell(12,i+2);c.value=h;c.font={name:F,bold:true,size:9,color:{argb:'FFFFFFFF'}};c.fill={type:'pattern',pattern:'solid',fgColor:{argb:CARB}}});
 var sm=startMonth();
 function crow(rr,n,mes,con,pago,acum,sal,hl){[n,mes,con,pago,acum,sal].forEach(function(v,j){var c=cr.getCell(rr,j+2);c.value=v;c.font={name:F,size:9,bold:!!hl};if(j===1)c.numFmt='mmm yyyy';if(j>=3)c.numFmt=USD2;if(hl)c.fill={type:'pattern',pattern:'solid',fgColor:{argb:'FFFFF6E0'}};else if(rr%2)c.fill={type:'pattern',pattern:'solid',fgColor:{argb:HORM}}})}
 crow(13,0,addM(sm,-1),'Reserva y entrada',{formula:"'Mi plan'!C20",result:r.E},{formula:'E13',result:r.E},{formula:"'Mi plan'!C16-F13",result:r.S},true);
 var acc=r.E;for(var k=1;k<=36;k++){var rr2=13+k,pay=k<=r.n?Math.max(0,Math.min(r.cu,r.S-r.cu*(k-1))):0;acc+=pay;
  crow(rr2,k,{formula:'EDATE(C13,'+k+')',result:addM(sm,k-1)},{formula:'IF(B'+rr2+"<='Mi plan'!$C$22,\"Cuota directa sin intereses\",\"—\")",result:k<=r.n?'Cuota directa sin intereses':'—'},{formula:'IF(B'+rr2+"<='Mi plan'!$C$22,MAX(0,MIN('Mi plan'!$C$23,'Mi plan'!$C$21-'Mi plan'!$C$23*(B"+rr2+'-1))),0)',result:pay},{formula:'F'+(rr2-1)+'+E'+rr2,result:acc},{formula:"MAX(0,'Mi plan'!$C$16-F"+rr2+')',result:Math.max(0,r.P-acc)})}
 crow(50,'',{formula:"EDATE(C13,MAX(1,'Mi plan'!C22)+1)",result:addM(sm,Math.max(1,r.n))},'Entrega de llaves · saldo con crédito hipotecario',{formula:"'Mi plan'!C27",result:r.saldo},{formula:'F49+E50',result:r.P},0,true);
 /* ---- Hipoteca ---- */
 hp.columns=[{width:2},{width:8},{width:18},{width:18},{width:18},{width:20},{width:2}];
 head(hp,'Tabla de amortización del crédito hipotecario',7,5);
 note(hp,'B10',"Sistema francés (cuota fija) con los datos de la hoja \"Mi plan\". Tasa y plazo referenciales.");hp.mergeCells('B10:F10');
 ['Mes','Cuota','Interés','Capital','Saldo'].forEach(function(h,i){var c=hp.getCell(12,i+2);c.value=h;c.font={name:F,bold:true,size:9,color:{argb:'FFFFFFFF'}};c.fill={type:'pattern',pattern:'solid',fgColor:{argb:CARB}}});
 hp.getCell('F13').value={formula:"'Mi plan'!C27",result:r.saldo};hp.getCell('F13').numFmt=USD2;hp.getCell('B13').value=0;
 var fr=r.sis==='frances'?r.rows:pack.amort(r.saldo,r.tasa,r.anios,'frances');
 for(var m=1;m<=360;m++){var rr3=13+m,q=fr[m-1];var on="IF(B"+rr3+"=\"\",\"\",";
  hp.getCell('B'+rr3).value={formula:"IF(AND("+m+"<='Mi plan'!$C$32*12,'Mi plan'!$C$27>0),"+m+',"")',result:q?m:''};
  hp.getCell('C'+rr3).value={formula:on+"'Mi plan'!$C$33)",result:q?q.c:''};hp.getCell('D'+rr3).value={formula:on+'F'+(rr3-1)+"*'Mi plan'!$C$31/12)",result:q?q.i:''};
  hp.getCell('E'+rr3).value={formula:on+'C'+rr3+'-D'+rr3+')',result:q?q.a:''};hp.getCell('F'+rr3).value={formula:on+'MAX(0,F'+(rr3-1)+'-E'+rr3+'))',result:q?q.s:''};
  ['B','C','D','E','F'].forEach(function(cc){var c=hp.getCell(cc+rr3);c.font={name:F,size:9};if(cc!=='B')c.numFmt=USD2})}
 /* ---- Escenarios ---- */
 var list=[r].concat(pack.presets).concat(pack.scen||[]),nc=list.length;
 es.columns=[{width:2},{width:30}].concat(list.map(function(){return {width:21}})).concat([{width:2}]);
 head(es,'Compara formas de comprar',nc+2,nc);
 note(es,'B10','Tu plan, tres alternativas sugeridas y los escenarios que guardaste en el simulador. La columna resaltada es la de menor costo total.');es.mergeCells(10,2,10,nc+1);
 var bestI=list.reduce(function(a,x,i){return x.total<list[a].total?i:a},0);
 var labs=['Escenario','Unidad','Tipo','Precio','Entrada (%)','Entrada (USD)','Cuotas sin intereses','Cuota mensual','Pagado a la entrega','Saldo con banco','Entidad','Hipoteca mensual','Intereses','Costo total'];
 labs.forEach(function(L,i){var rr=12+i,c=es.getCell(rr,2);c.value=L;c.font={name:F,size:9,bold:i===0||i===13,color:{argb:i===0?'FFFFFFFF':'FF1D1D1B'}};if(i===0)c.fill={type:'pattern',pattern:'solid',fgColor:{argb:CARB}};
  list.forEach(function(s,j){var v=[j===0?'Tu plan':s.label,s.u||'—',s.unit?s.unit.tipo:'Precio libre',s.P,s.e/100,s.E,s.n,s.n?s.cu:0,s.pctEnt/100,s.saldo,s.saldo>0?s.b.n:'—',s.saldo>0?s.c1:0,s.ti,s.total][i],c2=es.getCell(rr,j+3);c2.value=v;c2.font={name:F,size:9.5,bold:i===0||i===13,color:{argb:i===0?(j===bestI?'FF1D1D1B':'FFFFFFFF'):'FF1D1D1B'}};c2.alignment={horizontal:'right',wrapText:true};
   if([3,5,9,12,13].indexOf(i)>=0)c2.numFmt=USD;if(i===7||i===11)c2.numFmt=USD2;if(i===4||i===8)c2.numFmt='0.0%';
   if(i===0)c2.fill={type:'pattern',pattern:'solid',fgColor:{argb:j===bestI?ORO:CARB}};else if(j===bestI)c2.fill={type:'pattern',pattern:'solid',fgColor:{argb:'FFFFF6E0'}};else if(i%2)c2.fill={type:'pattern',pattern:'solid',fgColor:{argb:HORM}}})});
 es.getRow(12).height=30;
 note(es,'B27','Valores calculados al momento de la simulación. Para recalcular con otros datos usa la hoja "Mi plan" o el simulador en línea.');es.mergeCells(27,2,27,nc+1);
 /* orden y protección */
 wb.worksheets.forEach(function(w){w.protect('',{selectLockedCells:true,selectUnlockedCells:true,formatColumns:true,formatRows:true})});
 return wb}
window.MZPLAN={pdf:pdf,xlsx:xlsx,build:build};
})();
