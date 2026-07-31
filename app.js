// ====================================================================
// CONFIGURACIÓN DE FIREBASE (inventario compartido en tiempo real)
// ====================================================================
// Para que TODOS los móviles vean el mismo inventario a la vez:
// 1) Crea un proyecto gratis en https://console.firebase.google.com
// 2) Menú "Compilación" > "Realtime Database" > "Crear base de datos"
//    (elige la región más cercana, y modo de prueba para empezar).
// 3) En la pestaña "Reglas" de esa base de datos, pon:
//      { "rules": { ".read": true, ".write": true } }
//    (sencillo, sin cuentas propias de Firebase — la app ya tiene su
//    propio usuario/contraseña en index.html para filtrar curiosos).
// 4) En el icono de engranaje > "Configuración del proyecto" > baja
//    hasta "Tus apps" > icono web (</>) > registra una app > copia el
//    objeto de configuración que te da Firebase y pégalo aquí abajo,
//    sustituyendo estos valores de ejemplo.
// Si dejas esto sin rellenar, la app sigue funcionando con los datos
// guardados en el propio móvil (como hasta ahora), solo que sin
// compartir con nadie más.
const firebaseConfig = {
  apiKey: "AIzaSyBMUH4Z7-D5x1MbORks9uFg_aZiTC7t3DU",
  authDomain: "inventariooqa6.firebaseapp.com",
  databaseURL: "https://inventariooqa6-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "inventariooqa6"
};
let dbRef = null;
try{
  if(typeof firebase!=='undefined' && !firebaseConfig.apiKey.startsWith('PEGA_AQUI')){
    firebase.initializeApp(firebaseConfig);
    dbRef = firebase.database().ref('inventario-flota');
  }
}catch(e){ console.warn('Firebase no disponible, se usarán solo los datos de este móvil.', e) }

// ====================================================================
// DATOS INICIALES
// ====================================================================
// El 7º valor de cada consumible (true/false) marca si es un producto
// de envase que se abre y se va gastando poco a poco (aceite,
// anticongelante, limpiaparabrisas...) frente a uno que simplemente
// se cuenta por unidades (bombillas, cinta, grapas...).
const seed = [
  ['repuesto','ESPEJOS COMPLETOS EXPERT O COMPATIBLES IZQUIERDO',6,0,1,7],
  ['repuesto','ESPEJOS COMPLETOS EXPERT O COMPATIBLES DERECHO (MODELO POST-2024)',0,0,0,0],
  ['repuesto','ESPEJOS COMPLETOS EXPERT O COMPATIBLES DERECHO (MODELO PRE-2024)',4,0,0,4],
  ['repuesto','CRISTAL ESPEJO EXPERT IZQUIERDO',4,0,0,4],
  ['repuesto','CRISTAL ESPEJO EXPERT DERECHO',2,1,0,1],
  ['repuesto','ESPEJO IZQUIERDO DAÑADO EXPERT (PARA DESGUACE)',0,0,0,0],
  ['repuesto','ESPEJO DERECHO DAÑADO EXPERT (PARA DESGUACE)',2,0,0,2],
  ['repuesto','ESPEJOS COMPLETOS WOLSWAGEN IZQUIERDO',2,0,1,3],
  ['repuesto','ESPEJOS COMPLETOS WOLSWAGEN DERECHO',2,0,0,2],
  ['repuesto','ESPEJOS DAÑADOS WOLSWAGEN IZQUIERDO',0,0,0,0],
  ['repuesto','ESPEJOS DAÑADOS WOLSWAGEN DERECHO',1,0,0,1],
  ['repuesto','CRISTAL ESPEJO WOLSWAGEN IZQUIERDO',1,0,0,1],
  ['repuesto','CRISTAL ESPEJO WOLSWAGEN DERECHO',2,0,0,2],
  ['repuesto','PILOTO TRASERO EXPERT IZQUIERDO',1,0,0,1],
  ['repuesto','PILOTO TRASERO EXPERT IZQUIERDO DAÑADO',0,0,0,0],
  ['repuesto','PILOTO TRASERO EXPERT DERECHO',3,0,0,3],
  ['repuesto','PILOTO TRASERO EXPERT DERECHO DAÑADO',2,0,0,2],
  ['repuesto','CARCASAS ESPEJO EXPERT IZQUIERDA',5,0,0,5],
  ['repuesto','CARCASAS ESPEJO EXPERT DERECHA',1,0,0,1],
  ['repuesto','ANTINIEBLAS DELANTERO EXPERT',1,0,1,2],
  ['repuesto','PROTECTORES LATERALES EXPERT TRASERO IZQUIERDO*',2,0,0,2],
  ['repuesto','PROTECTORES LATERALES EXPERT TRASERO DERECHO*',5,0,0,5],
  ['repuesto','PROTECTORES LATERALES EXPERT DELANTERO IZQUIERDO*',1,0,0,1],
  ['repuesto','PROTECTORES LATERALES EXPERT DELANTERO DERECHO*',1,0,0,1],
  ['repuesto','TAPACUBOS PEUGEOT (MODELO ANTIGUO)',5,0,0,5],
  ['repuesto','TAPACUBOS PEUGEOT (MODELO NUEVO)',2,0,0,2],

  ['consumible','ACEITE 0W30',1,0,1,2,true],
  ['consumible','ACEITE 5W30',1,0,1,2,true],
  ['consumible','LIQUIDO FRENOS',2,0,1,3,true],
  ['consumible','ANTICONGELANTE VERDE',1,0,1,2,true],
  ['consumible','ANTICONGELANTE ROSA',1,0,0,1,true],
  ['consumible','DISOLVENTE',0,0,1,1,true],
  ['consumible','AGUA DESTILADA',8,0,1,8,true],
  ['consumible','BOMBILLAS POSICION DELANTERAS (UNIDADES)',5,0,0,5,false],
  ['consumible','BOMBILLAS MATRICULAS (UNIDADES)',8,0,0,8,false],
  ['consumible','LUZ UN POLO (INTERMITENTES, MARCHA ATRAS, ETC) (UNIDADES) TRANSPARENTES',9,0,0,9,false],
  ['consumible','LUZ UN POLO (INTERMITENTES, MARCHA ATRAS, ETC) (UNIDADES) NARANJAS',8,0,0,8,false],
  ['consumible','BOMBILLAS DOS POLOS (FRENO) (UNIDADES) (P21/5W)',12,0,0,12,false],
  ['consumible','BOMBILLAS DOS POLOS (ANTINIEBLA) (UNIDADES) (P21/4W)',2,0,0,2,false],
  ['consumible','LUZ H7',6,0,0,6,false],
  ['consumible','PULIMENTO',0,0,1,1,true],
  ['consumible','CINTA AISLANTE',3,0,0,3,false],
  ['consumible','LIMPIAPARABRISAS',2,0,1,3,true],
  ['consumible','MECHAS',10,0,0,10,false],
  ['consumible','WD40',0,0,1,1,true],
  ['consumible','GRAPAS MOLDURAS PEUGEOT (bolsa)',1,0,0,1,false],

  ['herramienta','COMPRESORES',2,'','',''],
  ['herramienta','MALETIN CARRACAS',1,'','',''],
  ['herramienta','SOLDADOR ESTAÑO',1,'','',''],
  ['herramienta','PISTOLA DE IMPACTO',1,'','',''],
  ['herramienta','BOCAS DE IMPACTO',3,'','',''],
  ['herramienta','CARGADOR DE BATERIA',1,'','',''],
  ['herramienta','SOPLADOR AIRE CALIENTE',1,'','',''],
  ['herramienta','SOLDADOR PLASTICO',1,'','',''],
  ['herramienta','GATO',1,'','',''],
  ['herramienta','MANOMETRO',2,'','',''],
  ['herramienta','MEDIDOR DIBUJO NEUMATICOS',2,'','',''],
  ['herramienta','MEDIDOR VOLTAJE BATERIA',1,'','',''],
  ['herramienta','BOLSA DE BRIDAS',2,'','',''],
  ['herramienta','PISTOLA SILICONA',1,'','',''],
  ['herramienta','PISTOLA SILICONA CALIENTE',1,'','',''],
  ['herramienta','TAPONES DE VALVULA',1,'','',1],
  ['herramienta','SPRAY LIMPIA-FRENOS',1,'','',1]
].map(([category,name,quantity,expense,open,total,tracksOpen],i)=>({id:`i${i}`,category,name,quantity,expense,open,total,tracksOpen:!!tracksOpen}));

// ====================================================================
// ESTADO Y PERSISTENCIA
// ====================================================================
let state = {items:seed, movements:[]};

function ensureTracksOpen(){
  const byName = {};
  seed.forEach(s=>{ byName[s.name] = s.tracksOpen });
  let changed = false;
  state.items.forEach(x=>{
    if(x.category==='consumible' && x.tracksOpen===undefined){
      x.tracksOpen = byName[x.name] ?? false;
      changed = true;
    }
  });
  return changed;
}

function loadLocalFallback(){
  try{ state = JSON.parse(localStorage.getItem('inventario-flota-v3')) || {items:seed, movements:[]} }
  catch{ state = {items:seed, movements:[]} }
  ensureTracksOpen();
}

function saveRemote(){
  if(dbRef) dbRef.set(state).catch(e=>console.error('No se pudo sincronizar con Firebase:', e));
}

function persist(){
  localStorage.setItem('inventario-flota-v3', JSON.stringify(state)); // copia local de respaldo
  saveRemote();
  render();
}

function asList(v){ return Array.isArray(v) ? v : Object.values(v||{}) }

function boot(){
  if(dbRef){
    dbRef.on('value', snap=>{
      const remote = snap.val();
      if(remote){
        state = { items: asList(remote.items), movements: asList(remote.movements) };
        if(ensureTracksOpen()) saveRemote();
      } else {
        loadLocalFallback();
        saveRemote(); // primera vez que se crea la base: sube lo que hubiera en este móvil (o el seed inicial)
      }
      render();
    }, err=>{
      console.error('Error de conexión con Firebase, uso los datos de este móvil:', err);
      loadLocalFallback();
      render();
    });
  } else {
    loadLocalFallback();
    render();
  }
}

// ====================================================================
// UTILIDADES
// ====================================================================
const $=s=>document.querySelector(s),
  esc=s=>String(s??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x])),
  group={repuesto:'MATERIAL',consumible:'PRODUCTOS',herramienta:'HERRAMIENTAS DISPONIBLES EN BASE OQA6'};

function optionList(filterFn){
  return state.items.filter(filterFn || (()=>true)).map(x=>`<option value="${x.id}">${esc(x.name)}</option>`).join('');
}
function fdate(x){ return new Intl.DateTimeFormat('es-ES',{dateStyle:'short',timeStyle:'short'}).format(new Date(x)) }

// Cantidad = stock cerrado. Abierto = para consumibles, 0/1 según si hay
// envase abierto en uso ahora mismo (o "usado" para repuestos, campo legado).
// Gasto: para repuestos es lo pendiente de descontar en el cierre semanal;
// para consumibles es solo un histórico informativo, ya no resta del Total.
function total(x){
  if(x.category==='herramienta') return x.total??'';
  if(x.category==='repuesto') return Number(x.quantity)-Number(x.expense||0)+Number(x.open||0);
  return Number(x.quantity)+Number(x.open||0);
}
function isOrderable(x){ return x.category==='repuesto' && !/DAÑADO|DESGUACE|PROTECTORES LATERALES/i.test(x.name) }
function isLowAlert(x){ let value=total(x); return value!==''&&Number(value)<=1&&!/DAÑADO|DESGUACE/i.test(x.name) }

// ====================================================================
// RENDER
// ====================================================================
function render(){
  const low=state.items.filter(x=>isOrderable(x)&&total(x)<=1),
    vehicle=[...state.movements].filter(x=>x.type==='expense'&&x.plate).reverse();
  $('#items-count').textContent=state.items.length;
  $('#low-count').textContent=low.length;
  $('#vehicle-expense-count').textContent=vehicle.reduce((n,x)=>n+Number(x.amount),0);
  $('#low-stock-list').innerHTML=low.length?low.map(x=>`<div class="low-row"><strong>${esc(x.name)}</strong><span class="stock">Total: ${total(x)}</span></div>`).join(''):'<p class="empty">No hay repuestos nuevos pendientes de pedir.</p>';
  $('#requests-list').innerHTML=low.length?low.map(x=>`<div class="request-row"><strong>${esc(x.name)}</strong><span>Total: ${total(x)}</span></div>`).join(''):'<p class="empty">No hay repuestos nuevos pendientes de pedir.</p>';
  $('#vehicle-expenses-list').innerHTML=vehicle.length?vehicle.map(x=>`<div class="movement-row"><div><strong>${esc(x.itemName)} · ${esc(x.plate)}</strong><small>${fdate(x.date)}</small>${x.reported?'<span class="exported">Exportado</span>':'<span class="exported">Pendiente de exportar</span>'}</div><span class="negative">−${x.amount}</span></div>`).join(''):'<p class="empty">Aún no hay gastos asociados a matrículas.</p>';
  let m=[...state.movements].reverse();
  $('#recent-list').innerHTML=movements(m.slice(0,5))||'<p class="empty">Aún no hay movimientos.</p>';
  $('#history-list').innerHTML=movements(m)||'<p class="empty">Aún no hay movimientos.</p>';
  document.querySelectorAll('#reposition-form .item-select').forEach(x=>x.innerHTML='<option value="">— Material —</option>'+optionList());
  $('#expense-item').innerHTML='<option value="">— Material —</option>'+optionList(x=>x.category!=='herramienta');
  renderInventory();
}
function movements(list){
  return list.map(x=>`<div class="movement-row"><div><strong>${x.type==='add'?'Reposición':'Gasto'} · ${esc(x.itemName)}</strong><small>${fdate(x.date)}${x.plate?` · ${esc(x.plate)}`:''}</small></div><span class="${x.type==='add'?'positive':'negative'}">${x.type==='add'?'+':'−'}${x.amount}</span></div>`).join('');
}
function renderInventory(){
  const term=$('#search').value.toLowerCase().trim(), filter=$('#category-filter').value;
  let rows=state.items.filter(x=>(filter==='all'||x.category===filter)&&x.name.toLowerCase().includes(term));
  let html='', last='';
  rows.forEach(x=>{
    if(x.category!==last){ last=x.category; html+=`<div class="table-group">${group[x.category]}<span>CANTIDAD · GASTO · ${x.category==='repuesto'?'USADO':'ABIERTO'} · TOTAL</span></div>` }
    html+=`<div class="item-row" data-id="${x.id}"><strong>${esc(x.name)}</strong><span>${x.quantity}</span><span>${x.expense}</span><span>${x.open}</span><span>${total(x)}</span></div>`;
  });
  $('#inventory-list').innerHTML=html||'<p class="empty">No se ha encontrado ningún material.</p>';
  document.querySelectorAll('#inventory-list .item-row').forEach(row=>row.onclick=()=>openEdit(row.dataset.id));
}
function screen(id){
  document.querySelectorAll('.screen').forEach(x=>x.classList.toggle('active',x.id===id));
  document.querySelectorAll('.nav-button').forEach(x=>x.classList.toggle('active',x.dataset.screen===id));
  scrollTo(0,0);
}
function toast(msg){
  let x=$('#toast'); x.textContent=msg; x.classList.add('show');
  clearTimeout(window.tt); window.tt=setTimeout(()=>x.classList.remove('show'),2500);
}

// ====================================================================
// ACCIONES
// ====================================================================
function addRows(){
  let rows=[...document.querySelectorAll('#reposition-form .restock-row')],
    valid=rows.map(row=>({id:row.querySelector('select').value,amount:Number(row.querySelector('input').value)})).filter(x=>x.id&&x.amount>0);
  if(!valid.length){ toast('Añade al menos un material y una cantidad'); return }
  valid.forEach(x=>{
    let item=state.items.find(i=>i.id===x.id);
    item.quantity=Number(item.quantity)+x.amount;
    state.movements.push({type:'add',itemName:item.name,amount:x.amount,date:new Date().toISOString(),plate:''});
  });
  persist();
  $('#reposition-form').reset();
  screen('dashboard');
  toast(`${valid.length} reposición(es) guardada(s)`);
}

function expense(){
  let id=$('#expense-item').value,
    amount=Number($('#expense-quantity').value),
    plate=$('#expense-plate').value.trim().toUpperCase();
  if(!id||!(amount>0)){ toast('Selecciona el material y una cantidad válida'); return }
  let item=state.items.find(x=>x.id===id);
  if(item.category==='consumible'){
    if(item.tracksOpen){
      // Se usa primero lo que ya está abierto; si no llega, se abre lo que
      // haga falta del almacén cerrado. "Abierto" nunca pasa de 1.
      let available=Number(item.quantity)+Number(item.open||0);
      if(available<amount){ toast(`Solo quedan ${available} unidades disponibles`); return }
      let remaining=available-amount;
      item.open=remaining>0?1:0;
      item.quantity=Math.max(0,remaining-item.open);
    } else {
      if(Number(item.quantity)<amount){ toast(`Solo quedan ${item.quantity} unidades`); return }
      item.quantity=Number(item.quantity)-amount;
    }
    item.expense=Number(item.expense||0)+amount; // histórico informativo, no resta del Total
  } else if(item.category==='repuesto'){
    if(total(item)<amount){ toast(`Solo quedan ${total(item)} unidades disponibles`); return }
    item.expense=Number(item.expense||0)+amount;
  } else {
    toast('Las herramientas no se registran como gasto'); return;
  }
  state.movements.push({type:'expense',itemName:item.name,amount,date:new Date().toISOString(),plate,reported:false});
  persist();
  $('#expense-form').reset();
  screen('dashboard');
  toast('Gasto registrado');
}

function addProduct(){
  let name=$('#new-product-name').value.trim(),
    category=$('#new-product-category').value,
    qty=Number($('#new-product-quantity').value);
  if(!name||!category){ toast('Escribe un nombre y elige un grupo'); return }
  if(!(qty>=0)) qty=0;
  if(state.items.some(x=>x.category===category&&x.name.toLowerCase()===name.toLowerCase())){
    toast('Ya existe ese material en ese grupo'); return;
  }
  let item={id:'i'+Date.now(), category, name, quantity:qty, tracksOpen:false};
  if(category==='herramienta'){ item.expense=''; item.open=''; item.total='' }
  else {
    item.expense=0; item.open=0;
    if(category==='consumible') item.tracksOpen=$('#new-product-tracks-open').checked;
  }
  state.items.push(item);
  if(qty>0) state.movements.push({type:'add',itemName:name,amount:qty,date:new Date().toISOString(),plate:''});
  persist();
  $('#new-product-form').reset();
  $('#track-open-row').style.display='none';
  screen('inventory');
  toast('Producto añadido al inventario');
}

let editingId=null;
function openEdit(id){
  let item=state.items.find(x=>x.id===id);
  if(!item) return;
  editingId=id;
  const isTool=item.category==='herramienta';
  $('#edit-product-category-label').textContent=({repuesto:'Repuesto',consumible:'Producto o consumible',herramienta:'Herramienta'})[item.category];
  $('#edit-product-name').value=item.name;
  $('#edit-product-quantity').value=item.quantity;
  $('#edit-expense-row').style.display=isTool?'none':'grid';
  $('#edit-open-row').style.display=isTool?'none':'grid';
  if(!isTool){
    $('#edit-product-expense').value=Number(item.expense)||0;
    $('#edit-product-open').value=Number(item.open)||0;
    $('#edit-open-label').textContent=item.category==='repuesto'?'Usado':'Abierto';
  }
  $('#edit-tracks-open-row').style.display=item.category==='consumible'?'flex':'none';
  if(item.category==='consumible') $('#edit-product-tracks-open').checked=!!item.tracksOpen;
  screen('edit-product');
}
function saveEdit(){
  let item=state.items.find(x=>x.id===editingId);
  if(!item) return;
  let name=$('#edit-product-name').value.trim();
  if(!name){ toast('El nombre no puede quedar vacío'); return }
  item.name=name;
  item.quantity=Number($('#edit-product-quantity').value)||0;
  if(item.category!=='herramienta'){
    item.expense=Number($('#edit-product-expense').value)||0;
    item.open=Number($('#edit-product-open').value)||0;
  }
  if(item.category==='consumible') item.tracksOpen=$('#edit-product-tracks-open').checked;
  persist();
  editingId=null;
  screen('inventory');
  toast('Cambios guardados');
}
function deleteEdit(){
  let item=state.items.find(x=>x.id===editingId);
  if(!item) return;
  if(!confirm(`¿Eliminar "${item.name}" del inventario? Esta acción no se puede deshacer.`)) return;
  state.items=state.items.filter(x=>x.id!==editingId);
  persist();
  editingId=null;
  screen('inventory');
  toast('Producto eliminado');
}

// ====================================================================
// EXPORTACIÓN A EXCEL
// ====================================================================
function dl(name,body,type='application/vnd.ms-excel;charset=utf-8'){let b=new Blob(['\ufeff',body],{type}),url=URL.createObjectURL(b),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),500)}
function xml(v){return String(v??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[x]))}
function excelCell(value,style='Data'){let type=typeof value==='number'?'Number':'String';return `<Cell ss:StyleID="${style}"><Data ss:Type="${type}">${xml(value)}</Data></Cell>`}
function excelRow(values,style='Data'){return `<Row>${values.map(v=>excelCell(v,style)).join('')}</Row>`}
function excelSection(title){return `<Row ss:Height="23"><Cell ss:MergeAcross="4" ss:StyleID="Section"><Data ss:Type="String">${xml(title)}</Data></Cell></Row>`}
function downloadStyledExcel(name,rows){let book=`<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Styles><Style ss:ID="Title"><Font ss:Bold="1" ss:Color="#FFFFFF" ss:Size="15"/><Interior ss:Color="#123C56" ss:Pattern="Solid"/><Alignment ss:Horizontal="Left" ss:Vertical="Center"/></Style><Style ss:ID="Sub"><Font ss:Italic="1" ss:Color="#42606F"/><Alignment ss:Horizontal="Left"/></Style><Style ss:ID="Section"><Font ss:Bold="1" ss:Color="#FFFFFF"/><Interior ss:Color="#1D6B94" ss:Pattern="Solid"/><Alignment ss:Horizontal="Left" ss:Vertical="Center"/></Style><Style ss:ID="Head"><Font ss:Bold="1" ss:Color="#173042"/><Interior ss:Color="#D9EDF4" ss:Pattern="Solid"/><Alignment ss:Horizontal="Center"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#8EA9B8"/></Borders></Style><Style ss:ID="Data"><Alignment ss:Vertical="Center"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8EB"/></Borders></Style><Style ss:ID="Low"><Font ss:Bold="1" ss:Color="#9D1F1F"/><Interior ss:Color="#FDE7E7" ss:Pattern="Solid"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5A4A4"/></Borders></Style><Style ss:ID="Request"><Font ss:Bold="1" ss:Color="#9D1F1F"/><Interior ss:Color="#FDE7E7" ss:Pattern="Solid"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5A4A4"/></Borders></Style><Style ss:ID="RequestHead"><Font ss:Bold="1" ss:Color="#FFFFFF"/><Interior ss:Color="#B63A3A" ss:Pattern="Solid"/><Alignment ss:Horizontal="Center"/></Style></Styles><Worksheet ss:Name="Inventario OQA6"><Table><Column ss:Width="420"/><Column ss:Width="75"/><Column ss:Width="75"/><Column ss:Width="85"/><Column ss:Width="75"/>${rows}</Table><WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel"><FreezePanes/><FrozenNoSplit/><SplitHorizontal>3</SplitHorizontal><ProtectObjects>False</ProtectObjects><ProtectScenarios>False</ProtectScenarios></WorksheetOptions></Worksheet></Workbook>`;let blob=new Blob([book],{type:'application/vnd.ms-excel'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),500)}
function zipBytes(entries){const enc=new TextEncoder(),parts=[],central=[];let offset=0,crc=b=>{let c=-1;for(let x of b){c^=x;for(let i=0;i<8;i++)c=c&1?(c>>>1)^0xedb88320:c>>>1}return(c^-1)>>>0},put=(a,p,n,s)=>{if(s===2)new DataView(a.buffer).setUint16(p,n,true);else new DataView(a.buffer).setUint32(p,n,true)};for(let e of entries){let n=enc.encode(e.name),d=enc.encode(e.data),c=crc(d),h=new Uint8Array(30+n.length);put(h,0,0x04034b50,4);put(h,4,20,2);put(h,14,c,4);put(h,18,d.length,4);put(h,22,d.length,4);put(h,26,n.length,2);h.set(n,30);parts.push(h,d);let z=new Uint8Array(46+n.length);put(z,0,0x02014b50,4);put(z,4,20,2);put(z,6,20,2);put(z,16,c,4);put(z,20,d.length,4);put(z,24,d.length,4);put(z,28,n.length,2);put(z,42,offset,4);z.set(n,46);central.push(z);offset+=h.length+d.length}let clen=central.reduce((n,x)=>n+x.length,0),end=new Uint8Array(22);put(end,0,0x06054b50,4);put(end,8,entries.length,2);put(end,10,entries.length,2);put(end,12,clen,4);put(end,16,offset,4);let all=[...parts,...central,end],size=all.reduce((n,x)=>n+x.length,0),out=new Uint8Array(size),p=0;for(let x of all){out.set(x,p);p+=x.length}return out}
function downloadXlsx(name,rows){let col=i=>String.fromCharCode(65+i),cell=(v,s,i,r)=>typeof v==='number'?`<c r="${col(i)}${r}" s="${s}"><v>${v}</v></c>`:`<c r="${col(i)}${r}" s="${s}" t="inlineStr"><is><t>${xml(v)}</t></is></c>`,sheetRows=rows.map((x,i)=>`<row r="${i+1}"${x.style===1?' ht="25" customHeight="1"':''}>${x.values.map((v,j)=>cell(v,x.style,j,i+1)).join('')}</row>`).join(''),merges=rows.map((x,i)=>x.merge?`<mergeCell ref="A${i+1}:E${i+1}"/>`:'').join(''),sheet=`<?xml version="1.0" encoding="UTF-8"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0"><pane ySplit="3" topLeftCell="A4" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><cols><col min="1" max="1" width="62" customWidth="1"/><col min="2" max="5" width="13" customWidth="1"/></cols><sheetData>${sheetRows}</sheetData><mergeCells count="${rows.filter(x=>x.merge).length}">${merges}</mergeCells></worksheet>`,styles=`<?xml version="1.0" encoding="UTF-8"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="5"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="15"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font><font><b/><color rgb="FF173042"/><name val="Calibri"/></font><font><b/><color rgb="FF9D1F1F"/><name val="Calibri"/></font><font><b/><color rgb="FFFFFFFF"/><name val="Calibri"/></font></fonts><fills count="7"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF123C56"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FF1D6B94"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFD9EDF4"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFFDE7E7"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFB63A3A"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="2"><border/><border><bottom style="thin"><color rgb="FFE2E8EB"/></bottom></border></borders><cellStyleXfs count="1"><xf/></cellStyleXfs><cellXfs count="9"><xf xfId="0"/><xf fontId="1" fillId="2" applyFont="1" applyFill="1"/><xf xfId="0"/><xf fontId="4" fillId="3" applyFont="1" applyFill="1"/><xf fontId="2" fillId="4" applyFont="1" applyFill="1" applyAlignment="1"><alignment horizontal="center"/></xf><xf borderId="1" applyBorder="1"/><xf fontId="3" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf fontId="4" fillId="6" applyFont="1" applyFill="1" applyAlignment="1"><alignment horizontal="center"/></xf><xf fontId="3" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/></cellXfs></styleSheet>`,files=[{name:'[Content_Types].xml',data:'<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>'},{name:'_rels/.rels',data:'<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>'},{name:'xl/workbook.xml',data:'<?xml version="1.0"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Inventario OQA6" sheetId="1" r:id="rId1"/></sheets></workbook>'},{name:'xl/_rels/workbook.xml.rels',data:'<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>'},{name:'xl/worksheets/sheet1.xml',data:sheet},{name:'xl/styles.xml',data:styles}],blob=new Blob([zipBytes(files)],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),500)}
function exportExcel(){
  if(!confirm('Se descargará el informe y se cerrará la semana de repuestos. Sus gastos se descontarán definitivamente de Cantidad y Gasto volverá a cero. ¿Continuar?')) return;
  let rows=[], add=(values,style=5,merge=false)=>rows.push({values,style,merge}), today=new Date().toLocaleString('es-ES');
  add(['INVENTARIO DE FLOTA · OQA6'],1,true);
  add([`Exportado el ${today}`],2,true);
  add([''],0);
  ['repuesto','consumible','herramienta'].forEach(c=>{
    add([c==='repuesto'?'REPUESTOS':c==='consumible'?'PRODUCTOS Y CONSUMIBLES':'HERRAMIENTAS DISPONIBLES'],3,true);
    add(['Artículo','Cantidad','Gasto',c==='repuesto'?'Usado':'Abierto','Total'],4);
    state.items.filter(x=>x.category===c).forEach(x=>add([x.name,x.quantity,x.expense,x.open,total(x)],isLowAlert(x)?6:5));
    add([''],0);
  });
  let weekly=state.movements.filter(x=>x.type==='expense'&&x.plate&&!x.reported);
  add(['GASTOS DE PIEZAS POR MATRÍCULA'],3,true);
  add(['Pieza','Unidades','Matrícula'],4);
  if(weekly.length) weekly.forEach(x=>add([x.itemName,x.amount,x.plate]));
  else add(['Sin gastos asociados a matrículas esta semana','','']);
  let requests=state.items.filter(x=>isOrderable(x)&&total(x)<=1);
  add([''],0);
  add(['PETICIONES DE REPUESTOS NUEVOS'],3,true);
  add(['Pieza nueva','Disponibles'],7);
  if(requests.length) requests.forEach(x=>add([x.name,total(x)],8));
  else add(['No hay peticiones pendientes',''],8);
  downloadXlsx(`inventario-flota-${new Date().toISOString().slice(0,10)}.xlsx`,rows);
  state.items.filter(x=>x.category==='repuesto').forEach(x=>{ x.quantity=Number(x.quantity)-Number(x.expense||0); x.expense=0 });
  weekly.forEach(x=>x.reported=true);
  persist();
  toast('Excel exportado y semana de repuestos cerrada');
}

// ====================================================================
// EVENTOS
// ====================================================================
document.querySelectorAll('[data-screen]').forEach(x=>x.onclick=()=>screen(x.dataset.screen));
$('#search').oninput=renderInventory;
$('#category-filter').onchange=renderInventory;
$('#reposition-form').onsubmit=e=>{e.preventDefault();addRows()};
$('#expense-form').onsubmit=e=>{e.preventDefault();expense()};
$('#new-product-form').onsubmit=e=>{e.preventDefault();addProduct()};
$('#new-product-category').onchange=()=>{ $('#track-open-row').style.display=$('#new-product-category').value==='consumible'?'flex':'none' };
$('#edit-product-form').onsubmit=e=>{e.preventDefault();saveEdit()};
$('#edit-delete-button').onclick=deleteEdit;
$('#export-button').onclick=exportExcel;
$('#export-history-button').onclick=exportExcel;
boot();
