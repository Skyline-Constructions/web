// Captación: UTM y eventos
var tk=function(n,p){try{if(window.gtag)gtag('event',n,p||{})}catch(e){}};
window.SKSEC=(function(){var W3K='a3fea86f-a37a-4ebf-aee4-a08fd27665d0';var DISP=/@(mailinator|yopmail|tempmail|temp-mail|guerrillamail|10minutemail|trashmail|sharklasers|getnada|dispostable|maildrop|throwawaymail|fakeinbox|mintemail|mohmal|emailondeck|moakt)\./i;
function prep(f){if(f.dataset.sec)return;f.dataset.sec=1;var h=document.createElement('div');h.setAttribute('aria-hidden','true');h.style.cssText='position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden';h.innerHTML='<label>No llenar<input type="text" name="botcheck" tabindex="-1" autocomplete="off"></label>';f.appendChild(h);var sj=f.querySelector('[name=_subject]');[['access_key',W3K],['subject',sj?sj.value:'Formulario web Skyline'],['from_name','Web Skyline Constructions']].forEach(function(p){if(f.querySelector('[name='+p[0]+']'))return;var i=document.createElement('input');i.type='hidden';i.name=p[0];i.value=p[1];f.appendChild(i)});f.dataset.t0=Date.now();
var n=document.createElement('p');n.className='legal sec-note';n.innerHTML='&#128274; Tus datos viajan cifrados y solo los usa Skyline Constructions. Nunca pedimos pagos ni claves por formularios, redes o mensajes.';f.appendChild(n)}
function tel(v){var d=(v||'').replace(/[^\d+]/g,'');if(/^09\d{8}$/.test(d))return d;if(/^\+?5939\d{8}$/.test(d))return d;if(/^\+\d{10,14}$/.test(d)&&!/^\+593/.test(d))return d;return ''}
function name(v){v=(v||'').trim();return /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' .-]{5,80}$/.test(v)&&v.split(/\s+/).length>=2}
function mail(v){return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v||'')&&!DISP.test(v)}
function check(f){var g=f.querySelector('[name=botcheck]');if(g&&g.value)return 'bot';
if(Date.now()-(+f.dataset.t0||0)<4000)return 'Tómate unos segundos para revisar tus datos y vuelve a enviar.';
try{var k='sk_sends',a=JSON.parse(localStorage.getItem(k)||'[]').filter(function(t){return Date.now()-t<600000});if(a.length>=4)return 'Ya recibimos varios envíos desde este equipo. Espera unos minutos o escríbenos por WhatsApp.';a.push(Date.now());localStorage.setItem(k,JSON.stringify(a))}catch(e){}
var n=f.querySelector('[name=nombre]');if(n&&!name(n.value)){n.focus();return 'Escribe tu nombre y apellido reales.'}
var m=f.querySelector('[name=email]');if(m&&(m.required||m.value)&&!mail(m.value)){m.focus();return 'Usa un correo válido (no aceptamos correos temporales).'}
var t=f.querySelector('[name=telefono],[name=whatsapp]');if(t&&(t.required||t.value)){var x=tel(t.value);if(!x){t.focus();return 'Revisa tu celular: 10 dígitos, por ejemplo 0991234567.'}t.value=x}
return ''}
function link(k){try{return atob(k)}catch(e){return ''}}
document.querySelectorAll('form[action*="web3forms"]').forEach(prep);
function wa(f){var t=[];new FormData(f).forEach(function(v,k){if(/^(_|access_key|subject|from_name|botcheck|landing|ref|pagina|utm_|gclid|fbclid)/.test(k)||!v)return;t.push(k.replace(/_/g,' ')+': '+v)});var sj=f.querySelector('[name=_subject]');return 'https://wa.me/593963002600?text='+encodeURIComponent('Hola Skyline, les escribo desde la web ('+(sj?sj.value:'formulario')+'):\n'+t.join('\n'))}
return {prep:prep,check:check,tel:tel,link:link,wa:wa}})();
(function(){try{var q=new URLSearchParams(location.search),k=['utm_source','utm_medium','utm_campaign','utm_content','gclid','fbclid'],st=JSON.parse(sessionStorage.getItem('sk_utm')||'{}');k.forEach(function(x){if(q.get(x))st[x]=q.get(x)});if(!st.landing)st.landing=location.pathname;if(!st.ref)st.ref=document.referrer||'directo';sessionStorage.setItem('sk_utm',JSON.stringify(st));
document.querySelectorAll('form[data-ajax]').forEach(function(f){Object.keys(st).forEach(function(x){var i=document.createElement('input');i.type='hidden';i.name=x;i.value=st[x];f.appendChild(i)});var i=document.createElement('input');i.type='hidden';i.name='pagina';i.value=location.pathname;f.appendChild(i)})}catch(e){}})();
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a');if(!a)return;if(a.href.indexOf('wa.me')>-1)tk('contact_whatsapp',{page:location.pathname});else if(a.href.indexOf('mailto:')===0)tk('contact_email');else if(a.hash==='#simulador')tk('cta_simulador',{page:location.pathname})});
(function(){
var m=document.querySelector('.menu'),n=document.querySelector('.nav');
if(m&&n)m.addEventListener('click',function(){var o=n.classList.toggle('open');m.setAttribute('aria-expanded',o)});
// Lightbox
var lb=document.createElement('div');lb.className='lb';lb.innerHTML='<button type="button">Cerrar</button><img alt="">';document.body.appendChild(lb);
lb.addEventListener('click',function(){lb.classList.remove('on')});
document.querySelectorAll('[data-zoom]').forEach(function(i){i.addEventListener('click',function(){lb.querySelector('img').src=i.dataset.zoom;lb.querySelector('img').alt=i.alt;lb.classList.add('on')})});
document.addEventListener('keydown',function(e){if(e.key==='Escape')lb.classList.remove('on')});
// Portfolio filter
var fb=document.querySelectorAll('[data-filter]');
fb.forEach(function(b){b.addEventListener('click',function(){var f=b.dataset.filter;fb.forEach(function(x){x.setAttribute('aria-pressed',x===b)});
document.querySelectorAll('[data-cat]').forEach(function(c){c.hidden=!(f==='todos'||c.dataset.cat.split(' ').indexOf(f)>-1)});document.querySelectorAll('.pf-h').forEach(function(h){var g=h.nextElementSibling;h.hidden=!g.querySelector('[data-cat]:not([hidden])')})})});
// Forms (Formspree)
document.querySelectorAll('form[data-ajax]').forEach(function(f){f.addEventListener('submit',function(e){e.preventDefault();var s=f.querySelector('[data-status]'),b=f.querySelector('button[type=submit]');var er=window.SKSEC.check(f);if(er){if(er!=='bot')s.textContent=er;return}if(!f.checkValidity()){f.reportValidity();return}b.disabled=true;s.textContent='Enviando…';
fetch(f.action,{method:'POST',body:new FormData(f),headers:{Accept:'application/json'}}).then(function(r){return r.json().then(function(j){return r.ok&&String(j.success)!=='false'},function(){return r.ok})}).then(function(ok){if(ok){var g=f.dataset.guide?window.SKSEC.link(f.dataset.guide):'';s.innerHTML=g?'¡Listo! <a href="'+g+'" download>Descarga aquí tu guía</a>. También te escribiremos por WhatsApp.':'Recibimos tus datos. Te escribimos en menos de 24 horas laborables.';if(g){var a=document.createElement('a');a.href=g;a.download='';document.body.appendChild(a);a.click();a.remove()}f.reset();tk(g?'download_guide':'generate_lead',{form:(f.querySelector('[name=_subject]')||{}).value||'form'});}else{fb()}b.disabled=false}).catch(function(){fb();b.disabled=false});function fb(){var u=window.SKSEC.wa(f);s.innerHTML='No pudimos enviar el formulario. <a href="'+u+'" target="_blank" rel="noopener"><b>Envíanos tus datos por WhatsApp</b></a> y te atendemos de inmediato.';tk('lead_fallback_whatsapp',{form:(f.querySelector('[name=_subject]')||{}).value||'form'});var g=f.dataset.guide?window.SKSEC.link(f.dataset.guide):'';if(g){s.innerHTML+=' <a href="'+g+'" download>Descarga aquí tu guía</a>.'}}})});
// Inventory
var root=document.getElementById('inventario');if(!root)return;
var U=JSON.parse(document.getElementById('inv-data').textContent);
var st={tipo:'todos',nivel:'todos',max:Infinity,sort:'id',dir:1,sel:null};
var fmt=function(v){return v==null?'Consultar':'USD '+v.toLocaleString('es-EC')};
var tb=root.querySelector('tbody'),sum=root.querySelector('.inv-sum'),pr=root.querySelector('#f-precio'),prl=root.querySelector('#f-precio-v');
var prices=U.map(function(u){return u.pvp}).filter(Boolean);var pmax=Math.max.apply(0,prices),pmin=Math.min.apply(0,prices);
pr.min=Math.floor(pmin/1000)*1000;pr.max=Math.ceil(pmax/1000)*1000;pr.step=1000;pr.value=pr.max;
function ok(u){return (st.tipo==='todos'||u.tipo===st.tipo)&&(st.nivel==='todos'||u.nivel===st.nivel)&&(u.pvp==null||u.pvp<=st.max)}
function draw(){var L=U.filter(ok).sort(function(a,b){var x=a[st.sort],y=b[st.sort];if(x==null)return 1;if(y==null)return -1;return (x>y?1:x<y?-1:0)*st.dir});
tb.innerHTML=L.map(function(u){return '<tr><td><b>'+u.id+'</b></td><td>'+u.tipo+'</td><td>'+u.nivel+'</td><td>'+u.area.toFixed(2)+' m²</td><td>'+(u.abierta?u.abierta.toFixed(2)+' m²':'—')+'</td><td class="pr">'+fmt(u.pvp)+'</td><td><span class="st st-'+u.estado[0].toLowerCase()+'">'+u.estado+'</span></td><td><button type="button" data-u="'+u.id+'">Me interesa</button></td></tr>'}).join('')||'<tr><td colspan="8">No hay unidades con esos filtros. Amplía el precio máximo o cambia el tipo.</td></tr>';
var d=L.filter(function(u){return u.estado==='Disponible'}).length;sum.innerHTML='<b>'+L.length+'</b> unidades con estos filtros · <b>'+d+'</b> disponibles'+(L.length?' · desde <b>'+fmt(Math.min.apply(0,L.map(function(u){return u.pvp||Infinity})))+'</b>':'');
root.querySelectorAll('.cell').forEach(function(c){var u=U.find(function(x){return x.id===c.dataset.u});c.classList.toggle('off',!ok(u));c.classList.toggle('sel',st.sel===u.id)});
tb.querySelectorAll('button[data-u]').forEach(function(b){b.addEventListener('click',function(){pick(b.dataset.u)})});}
function pick(id){var u=U.find(function(x){return x.id===id});st.sel=id;draw();
var f=document.getElementById('form-mz');f.querySelector('[name=unidad]').value=u.id+' · '+u.tipo+' · '+u.nivel+' · '+u.area.toFixed(2)+' m² · '+fmt(u.pvp);
f.querySelector('[name=tipo]').value=u.tipo;
document.getElementById('pick').innerHTML='Unidad seleccionada: <b>'+u.id+'</b> · '+u.tipo+' · '+u.nivel+' · '+u.area.toFixed(2)+' m²'+(u.abierta?' + '+u.abierta.toFixed(2)+' m² de patio o balcón':'')+' · <b>'+fmt(u.pvp)+'</b>';
document.getElementById('pick').hidden=false;
var w=document.getElementById('wa-mz');w.href='https://wa.me/593963002600?text='+encodeURIComponent('Hola Skyline, me interesa la unidad '+u.id+' ('+u.tipo+', '+u.area.toFixed(2)+' m², '+fmt(u.pvp)+') de Monteza Residences.');
if(window.simSetUnit)window.simSetUnit(id);document.getElementById('contacto-mz').scrollIntoView({behavior:'smooth'});}
root.querySelectorAll('[data-tipo]').forEach(function(b){b.addEventListener('click',function(){st.tipo=b.dataset.tipo;root.querySelectorAll('[data-tipo]').forEach(function(x){x.setAttribute('aria-pressed',x===b)});draw()})});
root.querySelector('#f-nivel').addEventListener('change',function(e){st.nivel=e.target.value;draw()});
pr.addEventListener('input',function(){st.max=+pr.value;prl.textContent='hasta '+fmt(+pr.value);draw()});prl.textContent='hasta '+fmt(+pr.value);
root.querySelectorAll('th[data-k]').forEach(function(th){th.addEventListener('click',function(){var k=th.dataset.k;st.dir=st.sort===k?-st.dir:1;st.sort=k;draw()})});
root.querySelectorAll('.cell').forEach(function(c){c.addEventListener('click',function(){pick(c.dataset.u)})});
draw();
})();
// Revelado al hacer scroll
(function(){var r=document.querySelectorAll('[data-reveal]');if(!r.length||!('IntersectionObserver' in window))return;document.documentElement.classList.add('js');
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:.08});r.forEach(function(x){io.observe(x)})})();
// Visor de tipologías Monteza
document.querySelectorAll('[data-viewer]').forEach(function(root){(function(){
var T=JSON.parse(root.querySelector('script[type="application/json"]').textContent),cur=0,idx=0;
var $=function(s){return root.querySelector(s)},media=$('.tp-media'),thumbs=$('.tp-thumbs');
function show(i){var t=T[cur];idx=(i+t.items.length)%t.items.length;var it=t.items[idx];
 media.innerHTML=it.k==='img'?'<img src="'+it.src+'" alt="'+it.cap+'" data-zoom="'+it.src+'">':'<video src="'+it.src+'" poster="'+it.th+'" autoplay muted loop playsinline controls></video>';
 var im=media.querySelector('img');if(im)im.addEventListener('click',function(){var lb=document.querySelector('.lb');if(lb){lb.querySelector('img').src=it.src;lb.classList.add('on')}});
 $('.tp-cap').textContent=it.cap+(it.k==='vid'?' · video':'');$('.tp-count').textContent=(idx+1)+' / '+t.items.length;
 thumbs.querySelectorAll('button').forEach(function(b,j){b.setAttribute('aria-current',j===idx)})}
function tipo(i){cur=i;var t=T[i];root.querySelectorAll('.tp-tab').forEach(function(b,j){b.setAttribute('aria-selected',j===i)});
 $('.tp-tag').textContent=t.tag;$('.tp-name').textContent=t.n;$('.tp-sub').textContent=t.area?t.sub+' · '+t.area:t.sub;$('.tp-desc').textContent=t.d;
 $('.tp-ras').innerHTML=t.rasgos.map(function(r){return '<li>'+r+'</li>'}).join('');
 if(t.desde!==undefined)$('.tp-desde').innerHTML=t.desde?'Desde <b>'+t.desde+'</b> en preventa':'Precio según unidad · consulta el inventario';
 thumbs.innerHTML=t.items.map(function(it,j){return '<button type="button" role="listitem" aria-label="'+it.cap+'"><img src="'+it.th+'" alt="" loading="lazy">'+(it.k==='vid'?'<span class="play">▶</span>':'')+'</button>'}).join('');
 thumbs.querySelectorAll('button').forEach(function(b,j){b.addEventListener('click',function(){show(j)})});show(0)}
root.querySelectorAll('.tp-tab').forEach(function(b,i){b.addEventListener('click',function(){tipo(i)})});
$('.tp-nav.prev').addEventListener('click',function(){show(idx-1)});$('.tp-nav.next').addEventListener('click',function(){show(idx+1)});
root.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')show(idx-1);if(e.key==='ArrowRight')show(idx+1)});
var x0=null;media.addEventListener('touchstart',function(e){x0=e.touches[0].clientX},{passive:true});
media.addEventListener('touchend',function(e){if(x0===null)return;var dx=e.changedTouches[0].clientX-x0;if(Math.abs(dx)>40)show(idx+(dx<0?1:-1));x0=null},{passive:true});
tipo(0)})()});
// Contadores animados
(function(){var c=document.querySelectorAll('[data-count]');if(!c.length||!('IntersectionObserver' in window))return;
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;var el=e.target,n=+el.dataset.count,t0=null;io.unobserve(el);
function f(ts){if(!t0)t0=ts;var k=Math.min(1,(ts-t0)/1400);el.textContent=Math.round(n*(1-Math.pow(1-k,3)));if(k<1)requestAnimationFrame(f)}requestAnimationFrame(f)})},{threshold:.4});
c.forEach(function(x){x.textContent='0';io.observe(x)})})();
// Solicitud por servicio
(function(){var d=document.getElementById('svc');if(!d)return;var sel=d.querySelector('#svc-s'),wa=d.querySelector('#svc-wa'),base=wa.href.split('?')[0];
function upd(){wa.href=base+'?text='+encodeURIComponent('Hola Skyline Constructions, quiero información sobre: '+sel.value+'.')}
sel.addEventListener('change',upd);
var fe=d.querySelector('#svc-fecha');if(fe){var t=new Date();t.setDate(t.getDate()+1);fe.min=t.toISOString().slice(0,10);fe.value=fe.min}
window.openCita=function(sv,diag){sel.value=sv;upd();var sm=d.querySelector('#svc-sum'),dg=d.querySelector('#svc-diag');if(sm){sm.hidden=!diag;sm.innerHTML=diag?'<b>Tu diagnóstico:</b> '+diag:''}if(dg)dg.value=diag||'';if(d.showModal)d.showModal();else d.setAttribute('open','')};
document.querySelectorAll('[data-serv]').forEach(function(b){b.addEventListener('click',function(){sel.value=b.dataset.serv;upd();var sm=d.querySelector('#svc-sum');if(sm)sm.hidden=true;if(d.showModal)d.showModal();else d.setAttribute('open','');try{if(window.gtag)gtag('event','service_form_open',{servicio:b.dataset.serv})}catch(e){}})});
d.querySelector('.lead-x').addEventListener('click',function(){d.close()});d.addEventListener('click',function(e){if(e.target===d)d.close()});
var q=new URLSearchParams(location.search).get('servicio');if(q){[].some.call(sel.options,function(o){if(o.text===q){sel.value=q;upd();d.showModal&&d.showModal();return true}})}})();
(function(){var s=document.getElementById('c-s'),q=new URLSearchParams(location.search).get('servicio');if(s&&q){[].some.call(s.options,function(o){if(o.text===q){s.value=q;return true}})}})();

// Diagnóstico interactivo
(function(){var q=document.getElementById('quiz');if(!q)return;var a=[],steps=q.querySelectorAll('.qz-step'),bar=q.querySelector('.qz-bar i'),res=q.querySelector('.qz-res');
var R={comprar:['Monteza Residences','Tu hogar, con 0 % de interés mientras construimos.','Suites y departamentos de 3 dormitorios en San Isidro del Inca con 20 % de entrada y hasta 36 cuotas sin intereses. En la asesoría simulamos tu plan de pagos con tu presupuesto real.','/portafolio/monteza-residences/#simulador'],
invertir:['Monteza Residences','Invierte en planos y deja que el tiempo trabaje a tu favor.','Las suites de 1 dormitorio son el formato con mayor crecimiento de búsquedas en Quito. Te mostramos números de arriendo del sector y tu plan de pagos.','/portafolio/monteza-residences/'],
terreno:['Socio inmobiliario','Tú pones el terreno. Nosotros, todo lo demás.','No vendas tu terreno al precio de hoy: conviértelo en un proyecto conjunto. Skyline aporta ingenierías, arquitectura, finanzas, marketing y ventas, y al vender la ganancia se comparte según lo pactado por escrito.','/services/socio-inmobiliario/'],
construir:['Construcción y ejecución de obra','Tu proyecto, con un solo responsable de principio a fin.','Presupuesto abierto, cronograma, control de calidad NEC e informe mensual. En la asesoría revisamos tu idea y te damos una ruta clara.','/services/#ejecucion-proyectos'],
vender:['Venta y arriendo de tu propiedad','Vende o arrienda más rápido, al precio correcto.','Valoramos tu inmueble con datos de mercado y lo comercializamos con fotografía profesional y campañas digitales segmentadas.','/services/#corretaje'],
gestion:['Gestión de proyectos','Que tu obra cumpla plazo, presupuesto y calidad.','Coordinamos y supervisamos tu proyecto con reportes mensuales de avance físico y financiero.','/services/#gestion-proyectos']};
var T={explorando:'Explorar con un experto te ahorra meses de dudas.',comparando:'Compara con números, no con suposiciones.',decidir:'Los mejores resultados llegan a quien decide con información.'};
var L={explorando:'Explorando ideas',comparando:'Comparando opciones',decidir:'Listo para decidir este mes',seguridad:'Seguridad y respaldo',dinero:'Precio y financiamiento',rapidez:'Rapidez',calidad:'Calidad y diseño'};
function show(i){steps.forEach(function(s,j){s.hidden=j!==i});res.hidden=i<3;bar.style.width=(Math.min(i,3)/3*100)+'%'}
function open(){a=[];show(0);if(q.showModal)q.showModal();else q.setAttribute('open','');try{gtag('event','quiz_start')}catch(e){}}
document.querySelectorAll('[data-quiz]').forEach(function(b){b.addEventListener('click',function(){var n=document.getElementById('nudge');if(n)n.hidden=true;open()})});
q.querySelectorAll('.qz-o').forEach(function(b){b.addEventListener('click',function(){var st=+b.closest('.qz-step').dataset.step;a[st]=b.dataset.v;
 if(st<2)return show(st+1);var r=R[a[0]];q.querySelector('.qz-t').textContent=r[1];q.querySelector('.qz-d').textContent=r[2];q.querySelector('.qz-h').textContent=T[a[1]];q.querySelector('.qz-more').href=r[3];show(3);
 try{gtag('event','quiz_complete',{objetivo:a[0]})}catch(e){}})});
q.querySelector('.qz-go').addEventListener('click',function(){var r=R[a[0]],t=q.querySelector('[data-step="0"] [data-v="'+a[0]+'"]').textContent;q.close();window.openCita&&window.openCita(r[0],t+' · '+L[a[1]]+' · prioridad: '+L[a[2]])});
q.querySelector('.lead-x').addEventListener('click',function(){q.close()});q.addEventListener('click',function(e){if(e.target===q)q.close()});
// Invitación suave: al 55 % de lectura o al intentar salir (una vez por sesión)
var n=document.getElementById('nudge'),seen=false;try{seen=sessionStorage.getItem('sk-nudge')}catch(e){}
function nudge(){if(seen||!n||document.querySelector('dialog[open]'))return;seen=1;try{sessionStorage.setItem('sk-nudge','1')}catch(e){}n.hidden=false;try{gtag('event','nudge_show')}catch(e){}}
if(n){n.querySelector('.nx').addEventListener('click',function(){n.hidden=true});
 addEventListener('scroll',function(){if(scrollY/(document.body.scrollHeight-innerHeight)>.55)nudge()},{passive:true});
 document.addEventListener('mouseout',function(e){if(!e.relatedTarget&&e.clientY<5)nudge()})}
var wk=document.getElementById('cb-week');if(wk){var d=new Date(),f=new Date(d);f.setDate(d.getDate()+((5-d.getDay()+7)%7||7));wk.textContent='Agenda abierta hasta el viernes '+f.getDate()+' de '+f.toLocaleDateString('es-EC',{month:'long'})}
})();
// Tema claro / oscuro
(function(){var b=document.getElementById('thm');if(!b)return;var h=document.documentElement;
function lab(){var c=h.dataset.theme==='claro';b.setAttribute('aria-label',c?'Cambiar a tema oscuro':'Cambiar a tema claro');b.setAttribute('aria-pressed',c);
 document.querySelectorAll('img[src*="-negativo"],img[data-neg]').forEach(function(i){if(!i.closest('.keep-dark')&&!i.closest('.hero')&&!i.closest('.feature')&&!i.closest('.lp-hero')){if(!i.dataset.neg)i.dataset.neg=i.getAttribute('src');var pos=i.dataset.neg.replace('horizontal-negativo','horizontal-color-claro').replace('vertical-negativo','vertical-color-claro');i.src=c?pos:i.dataset.neg}})}
b.addEventListener('click',function(){h.dataset.theme=h.dataset.theme==='claro'?'oscuro':'claro';try{localStorage.setItem('sk-theme',h.dataset.theme)}catch(e){}lab();try{gtag('event','theme_change',{tema:h.dataset.theme})}catch(e){}});lab()})();

(function(){var b=document.getElementById('ck');if(!b)return;var v='';try{v=localStorage.getItem('sk-consent')||''}catch(e){}
function set(x){try{localStorage.setItem('sk-consent',x)}catch(e){}if(window.gtag)gtag('consent','update',{analytics_storage:x==='all'?'granted':'denied'});b.hidden=true}
if(!v)setTimeout(function(){b.hidden=false},800);
b.querySelectorAll('[data-ck]').forEach(function(k){k.addEventListener('click',function(){set(k.dataset.ck)})});
document.querySelectorAll('.ck-open').forEach(function(k){k.addEventListener('click',function(){b.hidden=false})})})();

/* Showcase: banners en movimiento */
(function(){var w=document.querySelector('.showcase');if(!w)return;
var S=[].slice.call(w.querySelectorAll('.sc-slide')),D=[].slice.call(w.querySelectorAll('.sc-dot')),cnt=w.querySelector('.sc-count b'),i=0,user=false,inView=true,hover=false;
var red=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches,save=navigator.connection&&navigator.connection.saveData;
w.style.setProperty('--dur','7s');if(red)w.classList.add('static');
function load(k){var s=S[(k+S.length)%S.length];if(!s)return;s.querySelectorAll('[data-src]').forEach(function(m){if(m.tagName==='VIDEO'){if(red||save)return;m.src=m.dataset.src}else m.src=m.dataset.src;m.removeAttribute('data-src')})}
function vids(){S.forEach(function(s,k){var v=s.querySelector('video');if(!v)return;if(k===i&&inView&&!red&&!save&&v.src){var p=v.play();if(p&&p.catch)p.catch(function(){})}else v.pause()})}
function state(){var p=user||hover||!inView||document.hidden;w.classList.toggle('paused',p||red);vids()}
function go(n,src){var prev=i;i=(n+S.length)%S.length;if(i===prev)return;load(i);load(i+1);
S[prev].classList.remove('on');S[prev].classList.add('out');S[prev].setAttribute('aria-hidden','true');setTimeout(function(){S[prev].classList.remove('out')},1150);
S[i].classList.add('on');S[i].removeAttribute('aria-hidden');
D.forEach(function(d,k){d.classList.toggle('on',k===i);if(k===i){var b=d.querySelector('.sc-bar i');b.style.animation='none';void b.offsetWidth;b.style.animation=''}});
cnt.textContent=('0'+(i+1)).slice(-2);state();if(src&&window.gtag)gtag('event','showcase_nav',{slide:i+1,via:src})}
D.forEach(function(d,k){d.addEventListener('click',function(){go(k,'dot')});d.querySelector('.sc-bar i').addEventListener('animationend',function(){if(k===i)go(i+1)})});
w.querySelector('.sc-next').addEventListener('click',function(){go(i+1,'next')});w.querySelector('.sc-prev').addEventListener('click',function(){go(i-1,'prev')});
var pb=w.querySelector('.sc-pause');pb.addEventListener('click',function(){user=!user;pb.setAttribute('aria-pressed',user);pb.setAttribute('aria-label',user?'Reanudar el carrusel':'Pausar el carrusel');state()});
w.addEventListener('mouseenter',function(){hover=true;state()});w.addEventListener('mouseleave',function(){hover=false;state()});
w.addEventListener('focusin',function(){hover=true;state()});w.addEventListener('focusout',function(e){if(!w.contains(e.relatedTarget)){hover=false;state()}});
w.addEventListener('keydown',function(e){if(e.key==='ArrowRight')go(i+1,'key');if(e.key==='ArrowLeft')go(i-1,'key')});
var x0=null;w.addEventListener('touchstart',function(e){x0=e.touches[0].clientX},{passive:true});w.addEventListener('touchend',function(e){if(x0===null)return;var dx=e.changedTouches[0].clientX-x0;if(Math.abs(dx)>45)go(i+(dx<0?1:-1),'swipe');x0=null},{passive:true});
document.addEventListener('visibilitychange',state);
if('IntersectionObserver' in window)new IntersectionObserver(function(es){inView=es[0].isIntersecting;state()},{threshold:.25}).observe(w);
w.querySelectorAll('.sc-slide a,.sc-slide button').forEach(function(a){a.addEventListener('click',function(){if(window.gtag)gtag('event','showcase_click',{slide:i+1,cta:a.textContent.trim()})})});
load(0);load(1);state()})();
/* Barra de progreso de lectura */
(function(){var b=document.querySelector('.scroll-prog');if(!b)return;var t=false;function u(){var h=document.documentElement,m=h.scrollHeight-innerHeight;b.style.setProperty('--p',m>0?Math.min(1,scrollY/m):0);t=false}addEventListener('scroll',function(){if(!t){t=true;requestAnimationFrame(u)}},{passive:true});u()})();
