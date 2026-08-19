/* ═══════════════════════════════════════════════════════════════
   09. I GUARDRAIL
   ═══════════════════════════════════════════════════════════════
   Un file solo, usato dal telefono E dal server. Non è un vezzo: due
   copie delle soglie divergono sempre, e il giorno che divergono
   l'app dice «va bene» e il server risponde «no» — o peggio il
   contrario. Il backend lo carica da qui (`src/09_guardrail.js`), la
   build lo mette nel pacchetto dell'app.

   ── DUE LIVELLI, PERCHÉ DUE SITUAZIONI DIVERSE ─────────────────
   Chi si imposta i numeri da solo non ha nessuno che lo guardi: le
   soglie sono strette e fuori da lì non si passa. Un professionista
   ha visitato la persona, sa cose che noi non sappiamo, e a volte ha
   ragioni cliniche vere per uscire dai valori consueti — una dieta
   molto ipocalorica sotto controllo medico esiste. Quindi può
   forzare, ma lasciando scritto perché.

   ── TRE ESITI, NON DUE ─────────────────────────────────────────
   `ok`        · il valore è nell'intervallo consueto
   `avviso`    · fuori dal consueto ma difendibile: la persona deve
                 confermare, lo studio deve motivare
   `vietato`   · fuori dal limite assoluto: non passa per nessuno,
                 nemmeno per un professionista

   Il limite assoluto è la parte che non si negozia, ed è una scelta
   che va spiegata: non è sfiducia verso i nutrizionisti. È che questo
   server esegue senza vedere la persona, e un 1200 digitato 120
   arriverebbe intatto sul telefono di qualcuno. Chi ha davvero
   bisogno di stare sotto quel limite ha davanti un caso che non si
   segue con un'app: lo seguirà fuori di qui, ed è giusto così.

   ── E UNA COSA CHE I GUARDRAIL NON SONO ────────────────────────
   Non sono sicurezza. Sul telefono chiunque può aprire gli strumenti
   del browser e scrivere quello che vuole. Servono a impedire un
   errore, non un inganno. Quello che conta davvero passa dal server. */
/* L'involucro NON comincia con una parentesi. In un pacchetto in cui i
   moduli si concatenano, un file che inizia con `(` viene letto come una
   chiamata su quello che c'era prima, se il modulo precedente non chiude
   con il punto e virgola: un guasto che compare a caso spostando l'ordine
   dei file. Cominciare con `var` toglie il problema alla radice. */
var GUARDRAIL=(function(){

/* consueto = l'intervallo in cui si sta senza dover spiegare niente
   assoluto = il muro, diverso per chi decide da solo e per chi è stato
              visitato da un professionista */
const SOGLIE={
  kcal:{
    consueto:[1400,4000],
    assoluto:{persona:[1200,5000],studio:[800,6000]},
    unita:"kcal",
    sotto:"Sotto le {min} kcal al giorno il corpo fatica a coprire i micronutrienti, e la massa magra se ne va insieme al grasso.",
    sopra:"Sopra le {max} kcal al giorno il conto probabilmente non torna: vale la pena ricontrollare i dati.",
    muroSotto:"Sotto le {min} kcal serve un percorso con controlli medici, non un'app.",
    muroSopra:"Sopra le {max} kcal c'è quasi certamente un errore di digitazione."},

  proteine:{
    consueto:[40,250], assoluto:{persona:[30,300],studio:[20,400]}, unita:"g",
    sotto:"Sotto i {min} g di proteine si perde massa magra insieme al peso.",
    sopra:"Oltre i {max} g di proteine il beneficio si ferma e il carico sui reni cresce.",
    muroSotto:"{min} g di proteine è sotto qualunque raccomandazione esistente.",
    muroSopra:"Oltre i {max} g c'è quasi certamente un errore."},

  grassi:{
    consueto:[35,180], assoluto:{persona:[25,220],studio:[15,300]}, unita:"g",
    sotto:"Sotto i {min} g di grassi l'assorbimento delle vitamine A, D, E e K peggiora, e gli ormoni ne risentono.",
    sopra:"Sopra i {max} g di grassi lo spazio per il resto si stringe parecchio.",
    muroSotto:"Sotto i {min} g di grassi al giorno i danni sono documentati: questo limite non si supera.",
    muroSopra:"Sopra i {max} g c'è quasi certamente un errore."},

  attivita:{
    consueto:[1.2,2.0], assoluto:{persona:[1.1,2.2],studio:[1.1,2.4]}, unita:"",
    sotto:"Un moltiplicatore così basso descrive una persona allettata.",
    sopra:"Un moltiplicatore così alto descrive un atleta professionista in preparazione.",
    muroSotto:"Valore fuori scala.",muroSopra:"Valore fuori scala."}
};

/* L'obiettivo di peso non si giudica in chilogrammi: dipende
   dall'altezza. Si ragiona in indice di massa corporea, che è un
   indicatore grezzo — non dice niente di massa magra e struttura — ma
   per fermare un errore di digitazione è esattamente quello che serve. */
const IMC={
  consueto:[19,27],
  assoluto:{persona:[17.5,35],studio:[16.5,40]}};

function num(v){const n=Number(String(v==null?"":v).replace(",","."));
  return Number.isFinite(n)?n:null;}
function riempi(t,o){return String(t).replace(/\{(\w+)\}/g,(_,k)=>o[k]);}

/* ── Il controllo ───────────────────────────────────────────────
   Restituisce sempre lo stesso oggetto, così chi lo usa non deve
   sapere quale campo sta controllando. */
function verifica(campo,valore,livello,contesto){
  const liv=(livello==="studio")?"studio":"persona";
  const n=num(valore);
  if(n===null)return {esito:"vietato",campo,messaggio:"Non è un numero."};

  if(campo==="obiettivoPeso"){
    const h=num((contesto||{}).altezza);
    if(!h||h<120||h>230)
      /* senza altezza non si può giudicare: si lascia passare invece di
         inventare un limite. Meglio nessun controllo che uno finto. */
      return {esito:(n>=30&&n<=300)?"ok":"vietato",campo,
        messaggio:(n>=30&&n<=300)?"":"Peso fuori scala."};
    const imc=n/Math.pow(h/100,2);
    const A=IMC.assoluto[liv];
    if(imc<A[0])return {esito:"vietato",campo,imc:+imc.toFixed(1),
      messaggio:"Quell'obiettivo porterebbe a un indice di massa corporea di "+imc.toFixed(1)+
        ". Sotto "+A[0]+" non è un percorso da seguire con un'app: serve un medico."};
    if(imc>A[1])return {esito:"vietato",campo,imc:+imc.toFixed(1),
      messaggio:"L'obiettivo sembra fuori scala rispetto all'altezza."};
    if(imc<IMC.consueto[0])return {esito:"avviso",campo,imc:+imc.toFixed(1),
      messaggio:"Quell'obiettivo porta a un indice di massa corporea di "+imc.toFixed(1)+
        ", sotto l'intervallo consueto. Può avere senso, ma vale la pena averne parlato con qualcuno."};
    if(imc>IMC.consueto[1])return {esito:"avviso",campo,imc:+imc.toFixed(1),
      messaggio:"Quell'obiettivo resta sopra l'intervallo consueto: va benissimo come tappa, se è una tappa."};
    return {esito:"ok",campo,imc:+imc.toFixed(1),messaggio:""};}

  const S=SOGLIE[campo];
  if(!S)return {esito:"ok",campo,messaggio:""};
  const A=S.assoluto[liv];
  if(n<A[0])return {esito:"vietato",campo,
    messaggio:riempi(S.muroSotto,{min:A[0],max:A[1]})};
  if(n>A[1])return {esito:"vietato",campo,
    messaggio:riempi(S.muroSopra,{min:A[0],max:A[1]})};
  if(n<S.consueto[0])return {esito:"avviso",campo,
    messaggio:riempi(S.sotto,{min:S.consueto[0],max:S.consueto[1]})};
  if(n>S.consueto[1])return {esito:"avviso",campo,
    messaggio:riempi(S.sopra,{min:S.consueto[0],max:S.consueto[1]})};
  return {esito:"ok",campo,messaggio:""};}

/* Un professionista può stare in `avviso`, ma deve lasciare scritto
   perché — e la motivazione la vedrà anche il paziente. Non è
   burocrazia: è la differenza fra una scelta clinica e una svista, e
   fra sei mesi quella riga dirà a entrambi cosa si stava facendo. */
const MOTIVO_MINIMO=15;

function motivoValido(m){
  return typeof m==="string"&&m.trim().length>=MOTIVO_MINIMO;}

return {SOGLIE,IMC,MOTIVO_MINIMO,verifica,motivoValido,num};
})();

if(typeof module==="object"&&module.exports){module.exports=GUARDRAIL;}
else{
  /* nel pacchetto dell'app le funzioni diventano globali, come tutto
     il resto dei moduli */
  /* `this` in un modulo può essere qualunque cosa: si dichiara, e il
     controllo dei tipi del backend (che importa questo file) resta pulito. */
  /** @type {any} */
  var _radice=(typeof globalThis!=="undefined")?globalThis:this;
  Object.keys(GUARDRAIL).forEach(function(k){_radice[k]=GUARDRAIL[k];});
}
