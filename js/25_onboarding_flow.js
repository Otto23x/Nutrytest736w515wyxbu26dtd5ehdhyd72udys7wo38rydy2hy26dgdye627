/* ═══════════════════════════════════════════════════════════════
   25. ONBOARDING CONVERSAZIONALE (Sprint 1)
   ═══════════════════════════════════════════════════════════════
   Dieci schermate, una domanda per schermata, tocco = avanti. Il
   percorso lungo resta al suo posto (si raggiunge da «Rifai il
   percorso guidato» e regge i collaudi storici): questo è ciò che
   incontra chi apre l'app per la prima volta.

   Tre principi, in ordine di importanza:
   1. NIENTE SI PERDE. Le risposte vivono in S.onb2, dentro lo stato
      già esistente: chi abbandona a metà riprende esattamente da lì.
   2. LA VOCE PROPONE, LA PERSONA DISPONE. Il parlato pre-compila e
      fa saltare schermate, ma ogni campo estratto è un chip che si
      può correggere o buttare prima di confermare.
   3. LA VOCE NON È MAI UN REQUISITO. Niente microfono, niente rete,
      niente chiave: si prosegue toccando, senza un messaggio di colpa.

   I numeri mostrati sono VERI: la proiezione del peso passa dal
   motore già collaudato (wizTargets), non da una stima inventata
   per far bella figura sulla schermata.                            */

/* Chi vede cosa. Il flusso breve è la porta d'ingresso per chi arriva
   nuovo. Chi aveva già cominciato il percorso lungo lo finisce dov'era:
   spostarlo a metà strada gli farebbe riscrivere quello che ha già dato. */
function onb2Attivo(){
  try{
    if(S.ui&&S.ui.onbLungo)return false;              /* scelta esplicita */
    if(S.onb2&&(S.onb2.step>0||S.onb2.done))return true;
    if(S.onboard&&S.onboard.started&&(S.onboard.step||0)>0)return false;
    return true;
  }catch(e){return false;}}
window.onb2Attivo=onb2Attivo;

/* ── Le quattro sezioni della barra ─────────────────────────────── */
function ONB2_SEZt(){return [
  {k:"profilo", t:tr("Obiettivo & profilo")},
  {k:"vita",    t:tr("La tua vita")},
  {k:"corpo",   t:tr("Movimento & cucina")},
  {k:"piano",   t:tr("Il tuo piano")}
];}

/* ── Le dieci schermate ──────────────────────────────────────────
   `k` è anche la chiave della risposta in S.onb2.ris e il campo del
   contratto di estrazione: un nome solo, così la voce sa cosa salta. */
function ONB2t(){return [
 {k:"obiettivo",sez:"profilo",tipo:"scelta",
  q:tr("Cosa vorresti fare?"),
  sub:tr("Da qui parte tutto il resto: il fabbisogno, il piano, il ritmo."),
  op:[["perdere",tr("Perdere peso"),tr("Con calma e senza fame nera")],
      ["mantenere",tr("Mantenere"),tr("Stare bene dove sono")],
      ["massa",tr("Mettere massa"),tr("Crescere, non solo pesare di più")]]},

 {k:"bio",sez:"profilo",tipo:"modulo",
  q:tr("Quattro numeri e non te li chiedo più"),
  sub:tr("Servono a calcolare quanto consumi in un giorno. È il numero su cui poggia tutto.")},

 {k:"pesoObiettivo",sez:"profilo",tipo:"numero",
  q:tr("Dove vorresti arrivare?"),
  sub:tr("Scrivi il peso che hai in mente: ti dico subito quanto ci vuole davvero."),
  unita:"kg",min:30,max:300},

 {k:"ritmi",sez:"vita",tipo:"scelta",
  q:tr("Com'è fatta la tua giornata?"),
  sub:tr("Gli orari veri contano più delle buone intenzioni: il piano si adatta a loro."),
  op:[["sedentario",tr("Seduto quasi tutto il giorno"),tr("Ufficio, scrivania, guida")],
      ["inPiedi",tr("In piedi o in movimento"),tr("Lavoro fisico, cammino molto")],
      ["turni",tr("A turni"),tr("Orari che cambiano di settimana in settimana")],
      ["studente",tr("Studio"),tr("Lezioni, biblioteca, pasti fuori")],
      ["casa",tr("A casa"),tr("Gestisco i miei orari")]]},

 {k:"cibo",sez:"vita",tipo:"scelta",sensibile:true,
  q:tr("Che rapporto hai con il cibo?"),
  sub:tr("Non c'è una risposta giusta. Serve solo a capire quando ti sarò utile."),
  op:[["sereno",tr("Sereno"),tr("Mangio quando ho fame, e va bene così")],
      ["nervoso",tr("Mangio quando sono teso"),tr("Le giornate storte si sentono a tavola")],
      ["noia",tr("Mangio per noia"),tr("Soprattutto la sera, davanti allo schermo")],
      ["sociale",tr("Mangio molto fuori"),tr("Cene, pranzi di lavoro, amici")]]},

 {k:"tentativi",sez:"vita",tipo:"scelta",
  q:tr("Ci hai già provato altre volte?"),
  sub:tr("Se è già successo, ne teniamo conto: si parte più morbidi."),
  op:[["mai",tr("È la prima volta"),tr("Comincio adesso")],
      ["qualcuno",tr("Qualche tentativo"),tr("Con alti e bassi")],
      ["molti",tr("Molti tentativi"),tr("Ho provato di tutto")],
      ["yoyo",tr("Ho ripreso tutto più volte"),tr("Scendo e risalgo")]]},

 {k:"attivita",sez:"corpo",tipo:"scelta",
  q:tr("Quanto ti muovi in una settimana normale?"),
  sub:tr("Il movimento entra nel bilancio: meglio dire come stanno le cose oggi."),
  op:[["fermo",tr("Poco o niente"),tr("Per ora zero allenamenti")],
      ["leggero",tr("Una o due volte"),tr("Camminate, qualcosa di leggero")],
      ["regolare",tr("Tre o quattro volte"),tr("Ci tengo, con una certa costanza")],
      ["intenso",tr("Cinque o più"),tr("Mi alleno sul serio")]]},

 {k:"cucina",sez:"corpo",tipo:"scelta",
  q:tr("Quanto tempo hai per cucinare?"),
  sub:tr("Un piano che non entra nella tua settimana non lo segue nessuno."),
  op:[["veloce",tr("Pochissimo"),tr("Cose pronte o da 10 minuti")],
      ["normale",tr("Il giusto"),tr("Mezz'ora, di solito")],
      ["amoCucinare",tr("Mi piace cucinare"),tr("Il tempo lo trovo volentieri")]]},

 {k:"motivazione",sez:"corpo",tipo:"scelta",
  q:tr("Perché proprio adesso?"),
  sub:tr("Te lo ricorderò nei giorni storti — sono le tue parole, non le mie."),
  op:[["salute",tr("Per la salute"),tr("Analisi, medico, prevenzione")],
      ["energia",tr("Per avere più energia"),tr("Arrivo a sera scarico")],
      ["estetica",tr("Per come mi vedo"),tr("Voglio ritrovarmi allo specchio")],
      ["evento",tr("Ho una data in mente"),tr("Un appuntamento che conta")]]},

 {k:"fine",sez:"piano",tipo:"fine",
  q:tr("Come vuoi che ti segua?"),
  sub:tr("Puoi cambiare idea quando vuoi, da Io.")}
];}

/* I const a livello globale non finiscono su window: qui servono anche
   fuori (collaudi, futuro riuso), quindi si espongono esplicitamente. */
/* Le due tabelle si ricostruiscono al cambio lingua e basta: dentro
   ci sono chiamate a tr(), che deve rispondere con la lingua di ADESSO.
   Costruirle una volta sola, all'avvio, le congelerebbe in italiano. */
let _o2tab=null,_o2sez=null,_o2lang=null;
function ONB2c(){const L=(typeof LANG!=="undefined")?LANG:"it";
  if(_o2lang!==L){_o2lang=L;_o2tab=ONB2t();_o2sez=ONB2_SEZt();}
  return _o2tab;}
function ONB2_SEZc(){ONB2c();return _o2sez;}
/* I const globali non finiscono su window: qui servono anche fuori
   (collaudi, riuso futuro), quindi si espongono come sola lettura. */
try{
  Object.defineProperty(window,"ONB2",{get:ONB2c,configurable:true});
  Object.defineProperty(window,"ONB2_SEZ",{get:ONB2_SEZc,configurable:true});
}catch(e){window.ONB2=ONB2c();window.ONB2_SEZ=ONB2_SEZc();}

/* Stato: nasce con default e non tocca nulla di quello che c'era.
   `maxVisto` esiste perché la barra non deve MAI tornare indietro:
   se torni a correggere una risposta, l'avanzamento resta quello
   raggiunto — l'occhio legge «quanto manca», non «dove sono». */
function onb2Stato(){
  if(!S.onb2||typeof S.onb2!=="object")S.onb2={};
  const o=S.onb2;
  if(o.v!==1)o.v=1;
  if(typeof o.step!=="number"||o.step<0||o.step>=ONB2c().length)o.step=0;
  if(typeof o.maxVisto!=="number"||o.maxVisto<o.step)o.maxVisto=o.step;
  if(!o.ris||typeof o.ris!=="object")o.ris={};
  if(!Array.isArray(o.saltate))o.saltate=[];
  if(o.done!==true)o.done=false;
  if(o.sensibili===undefined)o.sensibili=null;   /* null = mai chiesto */
  return o;}
window.onb2Stato=onb2Stato;

function onb2Salva(){try{save();}catch(e){}}

/* Indice della sezione di una schermata, per la barra segmentata */
function onb2SezIdx(i){
  const k=(ONB2c()[i]||ONB2c()[0]).sez;
  return Math.max(0,ONB2_SEZc().findIndex(s=>s.k===k));}

/* ── Barra segmentata: quattro tratti, uno per sezione ───────────── */
function onb2Barra(){
  const o=onb2Stato(),vis=Math.max(o.step,o.maxVisto);
  const sezCorr=onb2SezIdx(o.step);
  let seg="";
  ONB2_SEZc().forEach((s,si)=>{
    const tot=ONB2c().filter(x=>x.sez===s.k).length;
    const fatti=ONB2c().filter((x,xi)=>x.sez===s.k&&xi<=vis).length;
    const pc=Math.round(Math.min(1,fatti/tot)*100);
    seg+=`<div class="o2seg${si===sezCorr?" ora":""}"><i style="width:${pc}%"></i></div>`;});
  return `<div class="o2top">
    <span class="o2chip">${esc(ONB2_SEZc()[sezCorr].t)}</span>
    <div class="o2segs" role="progressbar" aria-valuenow="${vis+1}" aria-valuemin="1" aria-valuemax="${ONB2c().length}"
      data-passo="${o.step+1}" data-avanzamento="${Math.round((vis+1)/ONB2c().length*100)}">${seg}</div>
  </div>`;}

/* ── Il pulsante del microfono: c'è su ogni schermata, non chiede mai
   il permesso da solo e non promette nulla che non possa mantenere. */
function onb2Mic(campo){
  const ok=(typeof vocePossibile==="function")&&vocePossibile();
  if(!ok)return "";
  return `<button class="btn ghost small o2mic" id="o2mic_${esc(campo)}" type="button"
    onclick="onb2Voce('${esc(campo)}')" aria-label="${esc(tr("Rispondi a voce"))}">
    ${ic("mic",15)} ${esc(tr("Preferisci dirlo a voce?"))}</button>`;}

/* ── Render ─────────────────────────────────────────────────────── */
function renderOnb2(){
  const el=document.getElementById("pg-onb2");if(!el)return;
  const o=onb2Stato(),i=o.step,sc=ONB2c()[i];
  let c="";
  if(sc.tipo==="scelta")c=onb2Scelta(sc);
  else if(sc.tipo==="modulo")c=onb2Modulo(sc);
  else if(sc.tipo==="numero")c=onb2Numero(sc);
  else c=onb2Fine(sc);

  el.innerHTML=onb2Barra()+
   `<div class="o2wrap" data-passo="${i+1}" data-chiave="${esc(sc.k)}">
      <h1 class="o2q">${esc(sc.q)}</h1>
      ${sc.sub?`<p class="o2sub">${esc(sc.sub)}</p>`:""}
      ${c}
      <div class="o2nav">
        <button class="btn ghost small o2back" type="button" onclick="onb2Indietro()"
          aria-label="${esc(tr("Torna indietro"))}">${esc(tr("Indietro"))}</button>
        ${i===0?`<button class="btn ghost small" type="button" onclick="onb2Racconto()">${esc(tr("Raccontami tutto a voce"))}</button>`:""}
      </div>
    </div>`;
  try{if(typeof a11yLega==="function")a11yLega("onb2");}catch(e){}}
window.renderOnb2=renderOnb2;

/* Schermata a scelta: card larghe, un tocco e si va avanti. */
function onb2Scelta(sc){
  const o=onb2Stato(),val=o.ris[sc.k];
  let h="";
  if(sc.sensibile)h+=onb2Consenso();
  h+=onb2Chip(sc.k);
  h+=`<div class="o2ops">`+sc.op.map(([v,t,d])=>
    `<button class="o2op${val===v?" scelta":""}" type="button" onclick="onb2Rispondi('${esc(sc.k)}','${esc(v)}')">
       <b>${esc(t)}</b>${d?`<span>${esc(d)}</span>`:""}</button>`).join("")+`</div>`;
  h+=onb2Mic(sc.k);
  return h;}

/* Le sole quattro cose che non si possono dedurre da nient'altro. */
function onb2Modulo(sc){
  const o=onb2Stato(),b=o.ris.bio||{};
  return onb2Chip("bio")+
   `<div class="o2form">
      <label>${esc(tr("Sei…"))}</label>
      <select id="o2gen"><option value="m"${b.gen!=="f"?" selected":""}>${esc(tr("Uomo"))}</option>
        <option value="f"${b.gen==="f"?" selected":""}>${esc(tr("Donna"))}</option></select>
      <div class="grid2">
        <div><label>${esc(tr("Età"))}</label>
          <input type="number" id="o2eta" inputmode="numeric" min="14" max="100" value="${b.eta||""}" placeholder="42"></div>
        <div><label>${esc(tr("Altezza (cm)"))}</label>
          <input type="number" id="o2h" inputmode="numeric" min="120" max="230" value="${b.h||""}" placeholder="175"></div>
      </div>
      <label>${esc(tr("Peso di oggi (kg)"))}</label>
      <input type="number" id="o2w" inputmode="decimal" step="0.1" min="30" max="300" value="${b.w||""}" placeholder="80">
    </div>
    <button class="btn o2avanti" type="button" onclick="onb2Bio()">${esc(tr("Avanti"))}</button>`+
   onb2Mic("bio");}

/* Peso obiettivo + l'unico numero che conta: quanto ci vuole DAVVERO. */
function onb2Numero(sc){
  const o=onb2Stato(),val=o.ris[sc.k]||"";
  return onb2Chip(sc.k)+
   `<div class="o2form">
      <label>${esc(tr("Peso obiettivo"))} (${esc(sc.unita)})</label>
      <input type="number" id="o2goal" inputmode="decimal" step="0.1" min="${sc.min}" max="${sc.max}"
        value="${val}" placeholder="72" oninput="onb2Proiezione()">
    </div>
    <div class="o2ins" id="o2ins" aria-live="polite">${onb2ProiezioneHTML()}</div>
    <button class="btn o2avanti" type="button" onclick="onb2Goal()">${esc(tr("Avanti"))}</button>`+
   onb2Mic(sc.k);}

/* ── La proiezione: numeri veri, dal motore già collaudato ─────────
   wizTargets() legge WIZ.d, quindi si travasano lì le risposte e si
   chiede a lui. Nessuna formula duplicata: se un giorno cambia la
   formula del fabbisogno, cambia anche qui, da sola.               */
function onb2Targets(){
  const o=onb2Stato(),b=o.ris.bio||{};
  if(!(b.w>0)||!(b.h>0)||!(b.eta>0))return null;
  const attMap={fermo:1.25,leggero:1.375,regolare:1.55,intenso:1.725};
  const goalMap={perdere:"moderato",mantenere:"mantenimento",massa:"massa"};
  const salva=(typeof WIZ!=="undefined"&&WIZ)?WIZ.d:null;
  try{
    const nascita=new Date();nascita.setFullYear(nascita.getFullYear()-(+b.eta||30));
    WIZ.d={gen:b.gen||"m",dob:nascita.toISOString().slice(0,10),h:+b.h,w:+b.w,fat:null,
           act:attMap[o.ris.attivita]||1.375,goal:goalMap[o.ris.obiettivo]||"moderato"};
    return wizTargets();
  }catch(e){return null;}
  finally{if(salva)WIZ.d=salva;}}
window.onb2Targets=onb2Targets;

function onb2ProiezioneHTML(){
  const o=onb2Stato(),b=o.ris.bio||{},goal=+o.ris.pesoObiettivo||0;
  if(!goal||!(b.w>0))return `<span class="o2hint">${esc(tr("Appena scrivi il peso, ti dico quanto ci vuole."))}</span>`;
  const t=onb2Targets();
  if(!t)return `<span class="o2hint">${esc(tr("Appena scrivi il peso, ti dico quanto ci vuole."))}</span>`;
  const diff=Math.round((b.w-goal)*10)/10;
  if(Math.abs(diff)<0.5)
    return `<b>${esc(tr("Sei già dove volevi arrivare."))}</b><br><span class="o2hint">${esc(tr("Allora il piano serve a restarci: fabbisogno {k} kcal al giorno.",{k:t.tdee}))}</span>`;
  if(diff<0)
    return `<b>${esc(tr("Vuoi salire di {n} kg.",{n:Math.abs(diff)}))}</b><br><span class="o2hint">${esc(tr("Con {k} kcal al giorno e {p} g di proteine si cresce piano, che è il modo giusto.",{k:t.kcal,p:t.prot}))}</span>`;
  /* 7700 kcal ≈ 1 kg: è la stessa costante del motore di proiezione. */
  const defGiorno=Math.max(1,t.tdee-t.kcal);
  const sett=Math.max(1,Math.round(diff*7700/(defGiorno*7)));
  const mesi=Math.round(sett/4.33*10)/10;
  return `<b>${esc(tr("{n} kg in circa {s} settimane.",{n:diff,s:sett}))}</b>
    <span class="o2hint">${esc(mesi>=2?tr("Poco più di {m} mesi, andando piano e senza fame nera.",{m:mesi}):tr("Andando piano e senza fame nera."))}</span>
    <div class="o2mini">${esc(tr("Fabbisogno {t} kcal · piano {k} kcal · {p} g di proteine",{t:t.tdee,k:t.kcal,p:t.prot}))}</div>
    <div class="o2mini">${esc(tr("È una stima onesta, non una promessa: la ricalcolo insieme a te man mano."))}</div>`;}
window.onb2ProiezioneHTML=onb2ProiezioneHTML;

window.onb2Proiezione=()=>{
  const inp=document.getElementById("o2goal"),box=document.getElementById("o2ins");
  if(!inp||!box)return;
  const o=onb2Stato();o.ris.pesoObiettivo=+inp.value||0;
  box.innerHTML=onb2ProiezioneHTML();};

/* ── Consenso per il dato sensibile ──────────────────────────────
   Si chiede PRIMA di mostrare la domanda, con parole chiare, e la
   risposta si può dare anche saltando: nessuno è obbligato a
   raccontare come sta in mezzo a un questionario.                 */
function onb2Consenso(){
  const o=onb2Stato();
  if(o.sensibili===true)return `<div class="o2cons ok">${esc(tr("Grazie: resta sul tuo telefono e serve solo a scegliere le parole giuste."))}
    <button class="btn ghost small" type="button" onclick="onb2ConsensoSet(false)">${esc(tr("Ripensaci"))}</button></div>`;
  return `<div class="o2cons">
    <b>${esc(tr("Questa è una domanda personale."))}</b>
    <span>${esc(tr("La risposta resta sul tuo telefono e serve a una cosa sola: scegliere il tono giusto quando ti scrivo. Non la usiamo per altro e non esce da qui."))}</span>
    <div class="o2consb">
      <button class="btn small" type="button" onclick="onb2ConsensoSet(true)">${esc(tr("Va bene, chiedimi pure"))}</button>
      <button class="btn ghost small" type="button" onclick="onb2Salta()">${esc(tr("Preferisco non dirlo"))}</button>
    </div></div>`;}

window.onb2ConsensoSet=(v)=>{const o=onb2Stato();
  o.sensibili=!!v;
  if(!v)delete o.ris.cibo;
  onb2Salva();renderOnb2();};

/* ── Chip modificabili: quello che la voce ha capito ─────────────
   La voce propone, non decide. Ogni campo estratto si vede, si può
   correggere (tornando alla schermata) o buttare via.             */
function onb2Chip(k){
  const o=onb2Stato();
  if(!o.saltate.includes(k))return "";
  const et=onb2Etichetta(k);
  if(!et)return "";
  return `<div class="o2chips"><span class="o2chip2" data-campo="${esc(k)}">${esc(et)}
    <button type="button" class="o2chipx" onclick="onb2ChipTogli('${esc(k)}')"
      aria-label="${esc(tr("Correggi"))}">✕</button></span>
    <span class="o2hint">${esc(tr("L'ho preso dal tuo racconto: correggilo se ho capito male."))}</span></div>`;}

function onb2Etichetta(k){
  const o=onb2Stato(),v=o.ris[k];
  if(v==null||v==="")return "";
  if(k==="bio"){const b=v||{};
    return [b.gen==="f"?tr("Donna"):tr("Uomo"),b.eta?b.eta+" "+tr("anni"):"",b.h?b.h+" cm":"",b.w?b.w+" kg":""]
      .filter(Boolean).join(" · ");}
  if(k==="pesoObiettivo")return v+" kg";
  const sc=ONB2c().find(x=>x.k===k);
  if(sc&&sc.op){const t=sc.op.find(x=>x[0]===v);if(t)return t[1];}
  return String(v);}

window.onb2ChipTogli=(k)=>{const o=onb2Stato();
  delete o.ris[k];o.saltate=o.saltate.filter(x=>x!==k);
  onb2Salva();renderOnb2();};

/* ── Navigazione ────────────────────────────────────────────────── */
window.onb2Rispondi=(k,v)=>{
  const o=onb2Stato();
  const sc=ONB2c().find(x=>x.k===k);
  if(sc&&sc.sensibile&&o.sensibili!==true)return;   /* niente consenso, niente risposta */
  o.ris[k]=v;onb2Salva();onb2Avanti();};

window.onb2Bio=()=>{
  const g=id=>{const e=document.getElementById(id);return e?e.value:"";};
  const eta=+g("o2eta"),h=+g("o2h"),w=parseFloat(g("o2w"));
  if(!(eta>=14&&eta<=100)||!(h>=120&&h<=230)||!(w>=30&&w<=300))
    return dlgAlert(tr("Mi servono età, altezza e peso per calcolare qualcosa di vero. Sono gli unici numeri obbligatori."));
  const o=onb2Stato();
  o.ris.bio={gen:g("o2gen")||"m",eta,h,w};onb2Salva();onb2Avanti();};

window.onb2Goal=()=>{
  const e=document.getElementById("o2goal"),v=parseFloat(e?e.value:"");
  const o=onb2Stato();
  if(!(v>=30&&v<=300))return dlgAlert(tr("Scrivi il peso che hai in mente, anche di massima."));
  o.ris.pesoObiettivo=v;onb2Salva();onb2Avanti();};

/* Salta una schermata senza rispondere: succede col consenso negato
   e con le domande che non hanno una risposta per tutti. */
window.onb2Salta=()=>{const o=onb2Stato();
  if(ONB2c()[o.step]&&ONB2c()[o.step].sensibile&&o.sensibili===null)o.sensibili=false;
  onb2Salva();onb2Avanti();};

function onb2Avanti(){
  const o=onb2Stato();
  let n=o.step+1;
  /* Le schermate già risposte dal racconto si saltano: chiedere due
     volte la stessa cosa è il modo più rapido per far chiudere l'app. */
  while(n<ONB2c().length-1&&o.saltate.includes(ONB2c()[n].k)&&o.ris[ONB2c()[n].k]!=null)n++;
  o.step=Math.min(n,ONB2c().length-1);
  if(o.step>o.maxVisto)o.maxVisto=o.step;
  onb2Salva();renderOnb2();try{window.scrollTo(0,0);}catch(e){}}
window.onb2Avanti=onb2Avanti;

window.onb2Indietro=()=>{
  const o=onb2Stato();
  if(o.step<=0){                     /* dalla prima si esce, non si resta in trappola */
    return dlgAlert(tr("Siamo alla prima domanda: da qui si può solo andare avanti. Puoi chiudere l'app e riprendere quando vuoi, non perdi nulla."));}
  let n=o.step-1;
  while(n>0&&o.saltate.includes(ONB2c()[n].k)&&o.ris[ONB2c()[n].k]!=null)n--;
  o.step=n;                          /* maxVisto NON scende: la barra non torna indietro */
  onb2Salva();renderOnb2();try{window.scrollTo(0,0);}catch(e){}};

/* ── Voce ────────────────────────────────────────────────────────
   Si appoggia al motore vocale dell'app (voceIn): un solo microfono
   per tutta Nuvia. Qui si crea al volo un campo di testo nascosto,
   si ascolta, e alla fine si legge il testo col contratto nuovo.  */
window.onb2Voce=(campo)=>{
  if(typeof vocePossibile!=="function"||!vocePossibile())
    return dlgAlert(tr("Su questo telefono non posso accendere il microfono da solo. Puoi dettare con il microfono della tastiera, oppure rispondere toccando: è identico."));
  onb2Ascolta(campo,false);};

window.onb2Racconto=()=>{
  if(typeof vocePossibile!=="function"||!vocePossibile())
    return onb2RaccontoScritto();
  onb2Ascolta("racconto",true);};

/* Il campo dove atterra il parlato. Invisibile ma reale: voceIn
   scrive lì dentro, e da lì si legge quando la persona ha finito. */
function onb2Campo(){
  let ta=document.getElementById("o2voce");
  if(!ta){ta=document.createElement("textarea");ta.id="o2voce";
    ta.style.position="absolute";ta.style.left="-9999px";ta.setAttribute("aria-hidden","true");
    (document.getElementById("pg-onb2")||document.body).appendChild(ta);}
  return ta;}

function onb2Ascolta(campo,tutto){
  const ta=onb2Campo();ta.value="";
  const box=document.getElementById("pg-onb2");
  try{voceIn("o2voce","o2mic_"+campo);}catch(e){
    return dlgAlert(tr("Il microfono non è partito. Rispondi pure toccando: è identico."));}
  if(box&&!document.getElementById("o2stop")){
    const b=document.createElement("button");
    b.id="o2stop";b.className="btn o2stop";b.type="button";
    b.textContent=tutto?tr("Ho finito di raccontare"):tr("Ho finito");
    b.onclick=()=>{try{voceIn("o2voce","o2mic_"+campo);}catch(e){}
      const t=(document.getElementById("o2voce")||{}).value||"";
      b.remove();onb2Leggi(t,tutto);};
    box.appendChild(b);}}

function onb2RaccontoScritto(){
  const box=document.getElementById("pg-onb2");if(!box)return;
  if(document.getElementById("o2scritto"))return;
  const d=document.createElement("div");
  d.id="o2scritto";d.className="o2form";
  d.innerHTML=`<label>${esc(tr("Raccontami di te con parole tue"))}</label>
    <textarea id="o2testo" rows="4" placeholder="${esc(tr("es. Ho 42 anni, 178 cm per 95 kg, lavoro seduto, vorrei arrivare a 85 kg. La sera quando sono stanco mangio di più."))}"></textarea>
    <button class="btn small" type="button" onclick="onb2LeggiScritto()">${esc(tr("Leggi e compila"))}</button>`;
  box.appendChild(d);}
window.onb2RaccontoScritto=onb2RaccontoScritto;

window.onb2LeggiScritto=()=>{
  const e=document.getElementById("o2testo");
  onb2Leggi(e?e.value:"",true);};

/* ── Estrazione: contratto src/contratti/estrazione_onboarding.md ──
   Il modello PROPONE. Tutto ciò che non è nello schema, o è fuori
   intervallo, viene buttato via qui: meglio una domanda in più che
   un dato inventato dentro il calcolo del fabbisogno.             */
const ONB2_SCHEMA={
  obiettivo:{en:["perdere","mantenere","massa"]},
  sesso:{en:["m","f"]},
  eta:{n:[14,100]}, altezza:{n:[120,230]}, peso:{n:[30,300]}, pesoObiettivo:{n:[30,300]},
  ritmi:{en:["sedentario","inPiedi","turni","studente","casa"]},
  cibo:{en:["sereno","nervoso","noia","sociale"],sensibile:true},
  tentativi:{en:["mai","qualcuno","molti","yoyo"]},
  attivita:{en:["fermo","leggero","regolare","intenso"]},
  infortuni:{t:120}, attrezzatura:{en:["niente","casa","palestra"]},
  cucina:{en:["veloce","normale","amoCucinare"]},
  motivazione:{en:["salute","energia","estetica","evento"]}
};
window.ONB2_SCHEMA=ONB2_SCHEMA;

function onb2Valida(j){
  const out={};
  if(!j||typeof j!=="object"||Array.isArray(j))return out;
  Object.keys(j).forEach(k=>{
    const reg=ONB2_SCHEMA[k];
    if(!reg)return;                                   /* campo ignoto: via */
    const v=j[k];
    if(v==null||v==="")return;
    if(typeof v==="object")return;                    /* mai oggetti o liste */
    if(reg.en){if(reg.en.includes(String(v)))out[k]=String(v);return;}
    if(reg.n){const n=parseFloat(v);
      if(isFinite(n)&&n>=reg.n[0]&&n<=reg.n[1])out[k]=Math.round(n*10)/10;return;}
    if(reg.t){const t=String(v).replace(/<[^>]*>/g,"").trim().slice(0,reg.t);
      if(t)out[k]=t;return;}});
  return out;}
window.onb2Valida=onb2Valida;

/* Dai campi validati alle risposte delle schermate. Il dato sensibile
   entra SOLO col consenso già dato: senza, si scarta e si chiederà. */
function onb2Applica(v){
  const o=onb2Stato(),messi=[];
  const metti=(k,val)=>{if(val==null||val==="")return;
    o.ris[k]=val;if(!o.saltate.includes(k))o.saltate.push(k);messi.push(k);};
  metti("obiettivo",v.obiettivo);
  if(v.eta&&v.altezza&&v.peso)
    metti("bio",{gen:v.sesso||"m",eta:Math.round(v.eta),h:Math.round(v.altezza),w:v.peso});
  metti("pesoObiettivo",v.pesoObiettivo);
  metti("ritmi",v.ritmi);
  if(v.cibo&&o.sensibili===true)metti("cibo",v.cibo);
  metti("tentativi",v.tentativi);
  metti("attivita",v.attivita);
  metti("cucina",v.cucina);
  metti("motivazione",v.motivazione);
  if(v.infortuni)o.ris.infortuni=v.infortuni;
  if(v.attrezzatura)o.ris.attrezzatura=v.attrezzatura;
  onb2Salva();
  return messi;}
window.onb2Applica=onb2Applica;

async function onb2Leggi(testo,tutto){
  const t=String(testo||"").trim();
  const sc=document.getElementById("o2scritto");if(sc)sc.remove();
  if(!t)return toast(tr("Non ho sentito nulla. Rispondi pure toccando: è identico."));
  if(typeof aiOn!=="function"||!aiOn())
    return toast(tr("Per leggere il racconto mi serve la connessione. Nessun problema: rispondi toccando, ci mettiamo un attimo."));
  toast(tr("Leggo…"));
  try{
    const j=await onb2Chiedi(t);
    const v=onb2Valida(j);
    const messi=onb2Applica(v);
    renderOnb2();
    if(!messi.length)return toast(tr("Non ho capito abbastanza per compilare: andiamo con le domande, è un attimo."));
    if(tutto)onb2Avanti();
    toast(tr("Ho segnato {n} cose. Le vedi qui sopra: correggile se ho capito male.",{n:messi.length}));
  }catch(e){
    toast(tr("Non sono riuscito a leggere il racconto. Rispondi toccando: è identico."));}}
window.onb2Leggi=onb2Leggi;

/* Otto secondi e non uno di più: oltre, si prosegue a tocchi. */
function onb2Chiedi(testo){
  const q='Questa persona si racconta: """'+testo+'""". '+
    'Estrai SOLO ciò che dice davvero: non dedurre, non completare, non inventare. Campo non detto = null. '+
    'Rispondi SOLO con questo JSON, senza testo attorno: '+
    '{"obiettivo":"perdere|mantenere|massa|null","sesso":"m|f|null","eta":null,"altezza":null,"peso":null,'+
    '"pesoObiettivo":null,"ritmi":"sedentario|inPiedi|turni|studente|casa|null",'+
    '"cibo":"sereno|nervoso|noia|sociale|null","tentativi":"mai|qualcuno|molti|yoyo|null",'+
    '"attivita":"fermo|leggero|regolare|intenso|null","infortuni":null,'+
    '"attrezzatura":"niente|casa|palestra|null","cucina":"veloce|normale|amoCucinare|null",'+
    '"motivazione":"salute|energia|estetica|evento|null"}';
  return Promise.race([
    aiAskJSON(q,"onb2"),
    new Promise(r=>setTimeout(()=>r(null),8000))
  ]);}

/* ── Ultima schermata: come vuoi che ti segua ────────────────────── */
function onb2Fine(sc){
  const o=onb2Stato();
  return `<div class="o2ops">
    <button class="o2op" type="button" onclick="onb2Chiudi('piano')">
      <b>${esc(tr("Con un piano settimanale"))}</b>
      <span>${esc(tr("Ti preparo i pasti della settimana e la lista della spesa. Tu spunti."))}</span></button>
    <button class="o2op" type="button" onclick="onb2Chiudi('libera')">
      <b>${esc(tr("Alla giornata"))}</b>
      <span>${esc(tr("Niente piano rigido: linee guida del giorno e via."))}</span></button>
  </div>
  <div class="o2gen" id="o2gen" aria-live="polite" style="display:none">
    <div class="o2genbar"><i id="o2genb" style="width:0%"></i></div>
    <div class="o2gent" id="o2gent"></div>
  </div>`;}

/* Travaso finale: da S.onb2 alle chiavi di sempre. Si SCRIVE SOPRA
   solo ciò che la persona ha appena detto; il resto dello stato
   (e tutto ciò che c'era prima) resta intatto.                    */
function onb2Travasa(){
  const o=onb2Stato(),r=o.ris,b=r.bio||{};
  const attMap={fermo:1.25,leggero:1.375,regolare:1.55,intenso:1.725};
  const goalMap={perdere:"deciso",mantenere:"mantenimento",massa:"massa"};
  if(b.eta>0){const n=new Date();n.setFullYear(n.getFullYear()-b.eta);
    S.profile.dob=S.profile.dob||n.toISOString().slice(0,10);}
  if(b.gen)S.profile.gender=b.gen;
  if(b.h>0)S.profile.h=b.h;
  if(b.w>0)S.profile.w=b.w;
  if(r.pesoObiettivo>0)S.profile.goalW=r.pesoObiettivo;
  S.profile.act=attMap[r.attivita]||S.profile.act||1.375;
  if(r.obiettivo)S.diet.goal=goalMap[r.obiettivo]||S.diet.goal;
  S.ui.modalitaPasti=o.modalita||"piano";
  /* Il dato sensibile vive in un posto solo, con il suo consenso a fianco:
     così chi legge il codice sa sempre se può usarlo. */
  o.sensibili=(o.sensibili===true);
  if(!o.sensibili)delete o.ris.cibo;
  onb2Salva();}

window.onb2Chiudi=async(modo)=>{
  const o=onb2Stato();
  o.modalita=(modo==="libera")?"libera":"piano";
  onb2Travasa();
  if(modo==="libera"){
    o.done=true;S.onboard.done=true;onb2Salva();
    toast(tr("Fatto. Le linee guida del giorno arrivano prestissimo: intanto il diario è tuo."));
    return show("oggi");}
  /* Piano: si genera davvero. La barra racconta quello che succede,
     non finge di lavorare mentre non succede niente. */
  const box=document.getElementById("o2gen"),bar=document.getElementById("o2genb"),txt=document.getElementById("o2gent");
  if(box)box.style.display="block";
  const avanza=(i,nome)=>{
    if(bar)bar.style.width=Math.round((i)/7*100)+"%";
    if(txt)txt.textContent=tr("Sto componendo il tuo piano: {g}…",{g:nome});};
  if(typeof aiOn!=="function"||!aiOn()){
    o.done=true;S.onboard.done=true;onb2Salva();
    if(txt)txt.textContent=tr("Il piano lo generiamo appena c'è connessione: intanto il diario è già pronto.");
    return setTimeout(()=>show("oggi"),900);}
  try{
    const t=onb2Targets();
    if(!t)throw new Error("dati");
    const attMap={fermo:1.25,leggero:1.375,regolare:1.55,intenso:1.725};
    const goalMap={perdere:"moderato",mantenere:"mantenimento",massa:"massa"};
    const b=o.ris.bio||{};
    const nascita=new Date();nascita.setFullYear(nascita.getFullYear()-(+b.eta||30));
    const d={gen:b.gen||"m",dob:nascita.toISOString().slice(0,10),h:+b.h,w:+b.w,fat:null,
      act:attMap[o.ris.attivita]||1.375,goal:goalMap[o.ris.obiettivo]||"moderato",
      vita:o.ris.ritmi||"",sport:o.ris.attivita||"",intol:"",no:"",si:"",
      pronto:(o.ris.cucina==="veloce")?"pronto":"semplice",nPasti:5,colaz:"",liberi:1,note:""};
    const plan=await wizGenDays(d,t,avanza);
    /* Stesso meccanismo del percorso lungo: il piano diventa customPlan
       e la settimana riparte pulita. Niente scorciatoie: se un giorno
       cambia il modo di applicare un piano, cambia in un posto solo. */
    if(plan){S.customPlan=plan;PLAN=S.customPlan;S.permMeals={};
      S.customShop=null;S.week=freshWeek();
      try{S.ui.pianoProprio=0;}catch(e){}}
    if(b.w>0){try{S.profile.weights.push({d:iso(new Date()),w:b.w,fat:null,mus:null,pa:null,spo2:null});}catch(e){}}
    o.done=true;S.onboard.done=true;onb2Salva();
    if(bar)bar.style.width="100%";
    if(txt)txt.textContent=tr("Pronto. Buon inizio.");
    setTimeout(()=>show("oggi"),700);
  }catch(e){
    o.done=true;S.onboard.done=true;onb2Salva();
    if(txt)txt.textContent=tr("Il piano lo rifacciamo con calma da Piano: il diario intanto è già tuo.");
    setTimeout(()=>show("oggi"),1200);}};

/* Ripartire da capo: usato dalle impostazioni e dai collaudi. */
window.onb2Ricomincia=()=>{S.onb2={v:1,step:0,maxVisto:0,ris:{},saltate:[],done:false,sensibili:null};
  onb2Salva();show("onb2");};
