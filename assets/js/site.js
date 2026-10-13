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
fetch(f.action,{method:'POST',body:new FormData(f),headers:{Accept:'application/json'}}).then(function(r){if(r.ok){s.textContent='Recibimos tus datos. Te escribimos en menos de 24 horas laborables.';f.reset();}else{s.textContent='No se pudo enviar. Escríbenos por WhatsApp al +593 96 300 2600.';}b.disabled=false}).catch(function(){s.textContent='No se pudo enviar. Revisa tu conexión o escríbenos por WhatsApp.';b.disabled=false})})});
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
document.getElementById('contacto-mz').scrollIntoView({behavior:'smooth'});}
root.querySelectorAll('[data-tipo]').forEach(function(b){b.addEventListener('click',function(){st.tipo=b.dataset.tipo;root.querySelectorAll('[data-tipo]').forEach(function(x){x.setAttribute('aria-pressed',x===b)});draw()})});
root.querySelector('#f-nivel').addEventListener('change',function(e){st.nivel=e.target.value;draw()});
pr.addEventListener('input',function(){st.max=+pr.value;prl.textContent='hasta '+fmt(+pr.value);draw()});prl.textContent='hasta '+fmt(+pr.value);
root.querySelectorAll('th[data-k]').forEach(function(th){th.addEventListener('click',function(){var k=th.dataset.k;st.dir=st.sort===k?-st.dir:1;st.sort=k;draw()})});
root.querySelectorAll('.cell').forEach(function(c){c.addEventListener('click',function(){pick(c.dataset.u)})});
draw();
})();
