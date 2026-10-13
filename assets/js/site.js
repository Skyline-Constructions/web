// Captación: UTM y eventos
var tk=function(n,p){try{if(window.gtag)gtag('event',n,p||{})}catch(e){}};
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
document.querySelectorAll('form[data-ajax]').forEach(function(f){f.addEventListener('submit',function(e){e.preventDefault();var s=f.querySelector('[data-status]'),b=f.querySelector('button[type=submit]');b.disabled=true;s.textContent='Enviando…';
fetch(f.action,{method:'POST',body:new FormData(f),headers:{Accept:'application/json'}}).then(function(r){if(r.ok){var g=f.dataset.guide;s.innerHTML=g?'¡Listo! <a href="'+g+'" download>Descarga aquí tu guía</a>. También te escribiremos por WhatsApp.':'Recibimos tus datos. Te escribimos en menos de 24 horas laborables.';if(g){var a=document.createElement('a');a.href=g;a.download='';document.body.appendChild(a);a.click();a.remove()}f.reset();tk(g?'download_guide':'generate_lead',{form:(f.querySelector('[name=_subject]')||{}).value||'form'});}else{s.textContent='No se pudo enviar. Escríbenos por WhatsApp al +593 96 300 2600.';}b.disabled=false}).catch(function(){s.textContent='No se pudo enviar. Revisa tu conexión o escríbenos por WhatsApp.';b.disabled=false})})});
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
document.querySelectorAll('[data-serv]').forEach(function(b){b.addEventListener('click',function(){sel.value=b.dataset.serv;upd();if(d.showModal)d.showModal();else d.setAttribute('open','');try{if(window.gtag)gtag('event','service_form_open',{servicio:b.dataset.serv})}catch(e){}})});
d.querySelector('.lead-x').addEventListener('click',function(){d.close()});d.addEventListener('click',function(e){if(e.target===d)d.close()});
var q=new URLSearchParams(location.search).get('servicio');if(q){[].some.call(sel.options,function(o){if(o.text===q){sel.value=q;upd();d.showModal&&d.showModal();return true}})}})();
(function(){var s=document.getElementById('c-s'),q=new URLSearchParams(location.search).get('servicio');if(s&&q){[].some.call(s.options,function(o){if(o.text===q){s.value=q;return true}})}})();
