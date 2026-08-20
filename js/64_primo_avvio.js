/* ═══════════════════════════════════════════════════════════════
   64. IL PRIMO AVVIO — l'account, e dove finiscono i dati
   ═══════════════════════════════════════════════════════════════
   Chiesto dal founder il 19/08/2026: «voglio provarla come se fosse
   pubblicata». Giusto: il primo avvio è la schermata che decide se
   una persona resta, e finora si saltava direttamente alle domande.

   ── COSA CHIEDE, E PERCHÉ ─────────────────────────────────────
   Una cosa sola: l'account Google. Serve a due scopi che vanno
   detti chiaramente, perché sono i due che interessano davvero:

   1. IL BACKUP SU DRIVE. I dati non stanno sui nostri server —
      questo è il punto di tutta l'app — quindi il posto sicuro è
      il TUO Drive. E qui va detta una cosa scomoda invece di
      nasconderla: **se cancelli quei file dal Drive, i dati sono
      persi.** Non ne abbiamo una copia. È il prezzo di non
      averli noi, e chi lo scopre dopo si sente ingannato.
   2. RITROVARE L'ABBONAMENTO. Cambi telefono, reinstalli, e con
      la stessa email ritrovi quello che hai pagato. Senza,
      dovresti ricomprare — ed è il motivo per cui l'email si
      chiede ORA e non quando serve.

   ── E COSA NON CHIEDE ─────────────────────────────────────────
   Non una password nostra (non abbiamo conti nostri), non i dati
   di salute (quelli si chiedono dopo, e restano sul telefono),
   non il permesso alle notifiche (si chiede quando servono).

   ── I CAMPI TECNICI ───────────────────────────────────────────
   Client ID e chiave Gemini stanno in fondo, dietro «impostazioni
   di prova», e A PUBBLICAZIONE AVVENUTA SPARISCONO: la chiave
   arriva dal nostro backend e l'OAuth è configurato una volta per
   tutte. Sono lì perché il founder possa provare il percorso vero,
   non perché un utente debba vederli.                              */

const PRIMO_KEY="nuvia_primo";

function primoFatto(){
  try{return localStorage.getItem(PRIMO_KEY)==="1";}catch(e){return false;}}
window.primoFatto=primoFatto;

window.primoSalta=()=>{
  try{localStorage.setItem(PRIMO_KEY,"1");}catch(e){}
  render(cur);};

/* Serve mostrarla? Solo a chi non l'ha ancora vista e non ha già
   un conto: chi torna non deve rifare la strada. */
window.primoServe=()=>{
  if(primoFatto())return false;
  try{if(S.conto&&S.conto.email)return false;}catch(e){}
  return true;};

/* ── la schermata ─────────────────────────────────────────────── */
window.primoHTML=()=>{
  const cid=(S.drive&&S.drive.cid)||"";
  const key=(S.ai&&S.ai.key)||"";
  /* «collegato» vuol dire: c'è un gettone valido E il backup è acceso */
  let collegato=false;
  try{collegato=!!(typeof DTOKEN!=="undefined"&&DTOKEN&&S.drive&&S.drive.on);}catch(e){}

  return `<div class="primo">
    <div class="primo-logo"><img src="assets/marchio.png" alt="" width="72" height="72" onerror="this.style.display='none'"></div>
    <h1 class="primo-t">${esc(tr("Prima di cominciare"))}</h1>
    <p class="primo-s">${esc(tr("Una cosa sola, e poi si parte."))}</p>

    <div class="card">
      <h2>${esc(tr("Collega il tuo Google"))}</h2>
      <div class="primo-perche">
        <div class="pp">
          <b>${esc(tr("Per non perdere niente"))}</b>
          <span>${esc(tr("I tuoi dati non stanno sui nostri server: stanno sul tuo telefono e, se vuoi, sul TUO Drive. È il posto più sicuro che c'è, perché è tuo."))}</span>
        </div>
        <div class="pp">
          <b>${esc(tr("Per ritrovare l'abbonamento"))}</b>
          <span>${esc(tr("Cambi telefono o reinstalli l'app: con la stessa email ritrovi quello che hai pagato. Senza, dovresti ricomprarlo."))}</span>
        </div>
      </div>

      <div class="primo-avviso">
        ${ic("chiedi",17)}
        <span>${esc(tr("Se un giorno cancelli quei file dal tuo Drive, i dati sono persi: noi non ne abbiamo una copia. È il prezzo di non averli noi, ed è giusto che tu lo sappia adesso."))}</span>
      </div>

      ${collegato
        ? `<div class="primo-ok">${ic("star",18)} ${esc(tr("Collegato."))}</div>
           <div class="mtools"><button class="btn" onclick="primoSalta()">${esc(tr("Avanti"))}</button></div>`
        : `<div class="mtools"><button class="btn" onclick="primoCollega()">${esc(tr("Entra con Google"))}</button></div>
           <button class="btn ghost small" onclick="primoSenza()">${esc(tr("Più tardi"))}</button>`}
    </div>

    <details class="primo-tec">
      <summary>${esc(tr("Impostazioni di prova"))}</summary>
      <div class="hint">${esc(tr("Servono solo finché l'app non è pubblicata: dopo, la chiave arriva dal nostro server e il collegamento è già configurato. Un utente non vedrà mai questa parte."))}</div>
      <label style="margin-top:12px">CLIENT_ID (Google Cloud)</label>
      <input type="text" id="primoCid" value="${esc(cid)}" placeholder="…apps.googleusercontent.com">
      <label style="margin-top:12px">${esc(tr("Chiave Gemini"))}</label>
      <input type="password" id="primoKey" value="${esc(key)}" placeholder="AIza…">
      <div class="mtools"><button class="btn ghost small" onclick="primoTecSalva()">${esc(tr("Salva le impostazioni"))}</button></div>
    </details>
  </div>`;};

window.primoTecSalva=()=>{
  const cid=(document.getElementById("primoCid")||{}).value||"";
  const key=(document.getElementById("primoKey")||{}).value||"";
  S.drive=S.drive||{};S.ai=S.ai||{};
  if(cid.trim())S.drive.cid=cid.trim();
  if(key.trim())S.ai.key=key.trim();
  save();
  toast(tr("Salvate. Ora «Entra con Google» funziona."));
  render(cur);};

window.primoCollega=()=>{
  const cid=(S.drive&&S.drive.cid)||"";
  if(!cid)return dlgAlert(tr("Per provare il collegamento serve il CLIENT_ID, che trovi nelle impostazioni di prova qui sotto. A pubblicazione avvenuta sarà già configurato."));
  try{
    if(typeof driveConnect==="function")driveConnect();
    else dlgAlert(tr("Il collegamento non è disponibile in questo momento."));
  }catch(e){dlgAlert(tr("Il collegamento non è riuscito. Puoi proseguire e collegarlo più tardi da Sistema."));}};

/* «Più tardi» è una scelta legittima, non un ripiego: l'app funziona
   tutta anche senza account. Si dice cosa si perde, e si va avanti. */
window.primoSenza=async()=>{
  const ok=await dlgConfirm(
    tr("Senza account l'app funziona tutta, ma i dati restano solo su questo telefono: se lo perdi o lo cambi, ricominci da capo. Puoi collegarlo quando vuoi da Sistema."),
    {ok:tr("Vado avanti così"),ko:tr("Aspetta, lo collego")});
  if(ok)primoSalta();};
