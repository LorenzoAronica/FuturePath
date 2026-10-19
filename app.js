'use strict';
/* FuturePath — MVP di orientamento esplorativo. Nessuna API, nessun invio dati. */
const STORAGE_KEY = 'futurepath:v1';
const TAG_NAMES = {
  tech: 'tecnologia', science: 'scienza e analisi', business: 'organizzazione e impresa',
  creative: 'creatività', communication: 'comunicazione', people: 'relazioni e ascolto',
  social: 'impatto sociale', practical: 'attività pratiche', music: 'musica e spettacolo',
  law: 'diritto e argomentazione', care: 'salute e cura', nature: 'ambiente e sostenibilità',
  tourism: 'ospitalità e culture'
};

// Un'opzione può assegnare fino a due interessi (2 punti al primo, 1 al secondo).
// Preferenze e vincoli NON vengono trattati come diagnosi o criteri di esclusione.
const QUESTIONS = [
  { title:'Se avessi un pomeriggio libero, quale progetto inizieresti?', note:'Non scegliere ciò che sembra più prestigioso: scegli ciò che ti incuriosisce.', options:[
    {text:'Creare un’app o provare nuove tecnologie', tags:['tech','science']},
    {text:'Organizzare un evento o un piccolo business', tags:['business','communication']},
    {text:'Aiutare le persone a risolvere un problema', tags:['people','social']},
    {text:'Comporre, disegnare o creare qualcosa di originale', tags:['creative','music']}
  ]},
  { title:'Quale attività ti dà più soddisfazione?', options:[
    {text:'Riuscire a risolvere un problema logico', tags:['science','tech']},
    {text:'Raccontare un’idea e convincere un pubblico', tags:['communication','business']},
    {text:'Ascoltare e capire una persona', tags:['people','care']},
    {text:'Costruire o riparare qualcosa con le mani', tags:['practical','tech']}
  ]},
  { title:'Quale contenuto guarderesti più volentieri?', options:[
    {text:'Tecnologia, videogiochi e innovazione', tags:['tech','creative']},
    {text:'Imprese, finanza e storie di fondatori', tags:['business','science']},
    {text:'Psicologia, società e comportamento umano', tags:['people','social']},
    {text:'Concerti, performance e backstage artistici', tags:['music','creative']}
  ]},
  { title:'Quando lavori in gruppo, cosa ti viene naturale?', options:[
    {text:'Analizzare il problema e trovare una soluzione', tags:['science','tech']},
    {text:'Dividere i ruoli e coordinare tutti', tags:['business','people']},
    {text:'Comunicare il progetto in modo coinvolgente', tags:['communication','creative']},
    {text:'Fare concretamente le cose e provarle', tags:['practical','tech']}
  ]},
  { title:'Su quale sfida del mondo ti piacerebbe lavorare?', options:[
    {text:'Creare tecnologie utili e accessibili', tags:['tech','social']},
    {text:'Proteggere l’ambiente e ridurre gli sprechi', tags:['nature','science']},
    {text:'Migliorare la salute e il benessere delle persone', tags:['care','people']},
    {text:'Dare spazio a nuove idee e talenti', tags:['creative','music']}
  ]},
  { title:'Quale ambiente ti incuriosisce di più?', options:[
    {text:'Un laboratorio di ricerca o uno studio tecnico', tags:['science','tech']},
    {text:'Un’azienda in cui si prendono decisioni', tags:['business','communication']},
    {text:'Un tribunale o un luogo di confronto pubblico', tags:['law','social']},
    {text:'Un teatro, uno studio creativo o un palco', tags:['music','creative']}
  ]},
  { title:'Quale materia approfondiresti anche fuori dalla scuola?', options:[
    {text:'Matematica, scienze o informatica', tags:['science','tech']},
    {text:'Economia, gestione o imprenditorialità', tags:['business','science']},
    {text:'Lingue, letteratura o comunicazione', tags:['communication','people']},
    {text:'Musica, arte o discipline espressive', tags:['music','creative']}
  ]},
  { title:'Quale risultato ti renderebbe più orgoglioso?', options:[
    {text:'Aver sviluppato un software utile', tags:['tech','practical']},
    {text:'Aver fatto crescere un progetto o un’impresa', tags:['business','communication']},
    {text:'Aver migliorato la vita di qualcuno', tags:['care','social']},
    {text:'Aver realizzato un’opera o un’esibizione', tags:['music','creative']}
  ]},
  { title:'Come preferisci affrontare una sfida complessa?', options:[
    {text:'Raccogliendo dati e ragionando passo passo', tags:['science','tech']},
    {text:'Parlando con le persone coinvolte', tags:['people','social']},
    {text:'Immaginando alternative originali', tags:['creative','communication']},
    {text:'Facendo un prototipo e testandolo subito', tags:['practical','tech']}
  ]},
  { title:'Quale esperienza ti attirerebbe maggiormente?', options:[
    {text:'Progettare una soluzione per il clima o l’energia', tags:['nature','science']},
    {text:'Gestire un evento o un’attività turistica', tags:['tourism','business']},
    {text:'Discutere e difendere una causa', tags:['law','communication']},
    {text:'Lavorare a un’esperienza creativa digitale', tags:['creative','tech']}
  ]},
  { title:'Quanto ti interessa approfondire la teoria?', note:'Questa è una preferenza, non una misura del tuo talento.', options:[
    {text:'Molto: mi piace studiare a fondo', mode:'universita'},
    {text:'Preferisco una combinazione di studio e laboratorio', mode:'its'},
    {text:'Vorrei imparare soprattutto lavorando', mode:'lavoro'},
    {text:'Non lo so ancora: voglio provare diverse strade', mode:'any'}
  ]},
  { title:'Quale competenza vorresti allenare di più?', options:[
    {text:'Comprendere dati e fenomeni', tags:['science','tech']},
    {text:'Gestire persone, progetti e risorse', tags:['business','people']},
    {text:'Scrivere, parlare e raccontare storie', tags:['communication','creative']},
    {text:'Realizzare qualcosa di concreto', tags:['practical','tech']}
  ]},
  { title:'Quale percorso dopo il diploma ti attira oggi?', note:'Potrai cambiare idea in qualsiasi momento.', options:[
    {text:'Un percorso universitario o accademico', mode:'universita'},
    {text:'Un ITS Academy con forte componente pratica', mode:'its'},
    {text:'Un percorso di lavoro, apprendistato o formazione breve', mode:'lavoro'},
    {text:'Sto ancora valutando tutte le opzioni', mode:'any'}
  ]},
  { title:'Saresti disponibile a studiare o lavorare lontano da casa?', note:'Non significa che tu debba già decidere una città.', options:[
    {text:'Sì, anche trasferendomi', mobility:'yes'},
    {text:'Preferirei rimanere vicino casa', mobility:'no'},
    {text:'Valuterei percorsi online o misti', mobility:'online'},
    {text:'Non lo so ancora', mobility:'unknown'}
  ]},
  { title:'Quanto conta il costo del percorso?', note:'Qui non chiediamo cifre o dati economici personali.', options:[
    {text:'Molto: vorrei privilegiare alternative sostenibili', budget:'high'},
    {text:'Abbastanza: voglio confrontare le spese', budget:'medium'},
    {text:'Per ora sto esplorando senza un budget definito', budget:'unspecified'},
    {text:'Non saprei: devo parlarne a casa', budget:'unknown'}
  ]},
  { title:'Quando vorresti iniziare a fare esperienza lavorativa?', options:[
    {text:'Dopo un percorso di studio approfondito', mode:'universita'},
    {text:'Presto, con stage e progetti pratici', mode:'its'},
    {text:'Il prima possibile, mentre continuo a imparare', mode:'lavoro'},
    {text:'Non ho ancora una preferenza', mode:'any'}
  ]},
  { title:'In quale ruolo ti immagini più facilmente?', options:[
    {text:'Analizzare e progettare soluzioni', tags:['tech','science']},
    {text:'Guidare un team o avviare iniziative', tags:['business','people']},
    {text:'Creare contenuti o progetti artistici', tags:['creative','music']},
    {text:'Lavorare sul campo, a contatto con situazioni reali', tags:['practical','tourism']}
  ]},
  { title:'Quale passo vorresti fare nel prossimo mese?', options:[
    {text:'Provare un corso pratico di tecnologia', tags:['tech','practical']},
    {text:'Parlare con studenti o professionisti', tags:['people','business']},
    {text:'Iniziare un progetto creativo personale', tags:['creative','communication']},
    {text:'Partecipare a un’attività scientifica o sociale', tags:['science','social']}
  ]}
];

const PATHS = [
  {id:'economia', type:'universita', title:'Economia e management', tags:['business','science','people'], description:'Per esplorare imprese, organizzazione, gestione e decisioni economiche.', examples:['Economia aziendale','Management','Economia e commercio'], question:'Ti piacerebbe gestire risorse e prendere decisioni?', project:'Organizza un piccolo progetto e calcolane costi e obiettivi.'},
  {id:'marketing', type:'universita', title:'Marketing e comunicazione', tags:['communication','creative','business'], description:'Per raccontare progetti, capire i pubblici e ideare strategie di comunicazione.', examples:['Scienze della comunicazione','Marketing','Media e pubblicità'], question:'Ti incuriosiscono brand, messaggi e relazioni con il pubblico?', project:'Progetta una piccola campagna per un evento scolastico.'},
  {id:'informatica', type:'universita', title:'Informatica e intelligenza artificiale', tags:['tech','science','practical'], description:'Per progettare software, analizzare problemi e capire le tecnologie digitali.', examples:['Informatica','Data science','Informatica applicata'], question:'Ti divertirebbe progettare e migliorare un programma?', project:'Completa un mini-progetto di programmazione in una settimana.'},
  {id:'ingegneria', type:'universita', title:'Ingegneria', tags:['science','tech','nature','practical'], description:'Per applicare matematica e scienza alla progettazione di sistemi e soluzioni.', examples:['Ingegneria informatica','Ingegneria gestionale','Ingegneria energetica'], question:'Ti piace unire ragionamento tecnico e progetti concreti?', project:'Indaga come funziona un oggetto e proponi un miglioramento.'},
  {id:'psicologia', type:'universita', title:'Psicologia e scienze umane', tags:['people','social','science'], description:'Per studiare comportamento, apprendimento e dinamiche tra persone.', examples:['Psicologia','Scienze dell’educazione','Sociologia'], question:'Ti interessa capire perché le persone pensano e agiscono in certi modi?', project:'Intervista due persone su un problema quotidiano, rispettando la privacy.'},
  {id:'sanita', type:'universita', title:'Salute e professioni sanitarie', tags:['care','science','people'], description:'Per esplorare percorsi dedicati a salute, cura, prevenzione e ricerca.', examples:['Medicina','Infermieristica','Fisioterapia'], question:'Ti interessano la scienza e il benessere delle persone?', project:'Partecipa a un incontro pubblico di orientamento sanitario.'},
  {id:'diritto', type:'universita', title:'Diritto e istituzioni', tags:['law','communication','social'], description:'Per analizzare regole, diritti e problemi di interesse collettivo.', examples:['Giurisprudenza','Scienze politiche','Servizi giuridici'], question:'Ti piace argomentare, confrontare posizioni e comprendere le regole?', project:'Leggi una notizia giuridica e ricostruisci le posizioni coinvolte.'},
  {id:'design', type:'universita', title:'Design e arti visive', tags:['creative','communication','tech'], description:'Per progettare esperienze, immagini e prodotti che uniscono estetica e utilità.', examples:['Design','Comunicazione visiva','Accademie di Belle Arti'], question:'Ti piace trasformare idee in qualcosa che altri possano vedere o usare?', project:'Crea un prototipo grafico di un servizio che vorresti esistesse.'},
  {id:'musica', type:'afam', title:'Musica e spettacolo', tags:['music','creative','communication'], description:'Per approfondire esecuzione, composizione, produzione e arti performative.', examples:['Conservatorio / AFAM','Produzione musicale','Discipline dello spettacolo'], question:'Ti immagini a creare, eseguire o produrre esperienze artistiche?', project:'Registra una performance e chiedi un feedback costruttivo.'},
  {id:'its-digitale', type:'its', title:'ITS Academy — Digitale', tags:['tech','practical','business'], description:'Per imparare competenze digitali applicate attraverso progetti e laboratori.', examples:['Sviluppo software','Cybersecurity','Tecnologie digitali'], question:'Preferisci imparare tecnologia realizzando progetti concreti?', project:'Prova un workshop pratico di sviluppo web o dati.'},
  {id:'its-industria', type:'its', title:'ITS Academy — Industria e sostenibilità', tags:['practical','science','nature'], description:'Per esplorare automazione, energia, manifattura e tecnologie applicate.', examples:['Automazione','Energia','Tecnologie industriali'], question:'Ti incuriosisce capire e migliorare sistemi reali?', project:'Cerca un laboratorio dimostrativo di automazione o sostenibilità.'},
  {id:'its-turismo', type:'its', title:'ITS Academy — Turismo e servizi', tags:['tourism','people','business'], description:'Per lavorare in organizzazione, ospitalità e servizi con un approccio operativo.', examples:['Hospitality','Turismo','Gestione dei servizi'], question:'Ti piace organizzare esperienze e lavorare con le persone?', project:'Intervista un professionista dell’ospitalità sulle sue attività.'},
  {id:'formazione-pratica', type:'lavoro', title:'Lavoro e formazione pratica', tags:['practical','tech','people'], description:'Per valutare apprendistato, formazione qualificata ed esperienza sul campo.', examples:['Apprendistato','Formazione regionale','Percorsi tecnici professionalizzanti'], question:'Ti trovi bene imparando direttamente da attività e persone esperte?', project:'Informati su un percorso formativo riconosciuto nella tua regione.'},
  {id:'impresa', type:'lavoro', title:'Progetti e imprenditorialità', tags:['business','creative','communication'], description:'Per sperimentare idee, attività autonome e competenze imprenditoriali, con formazione mirata.', examples:['Mini-impresa scolastica','Incubatori per giovani','Formazione in vendita e gestione'], question:'Ti entusiasma trasformare un problema in una soluzione da testare?', project:'Parla con 5 persone di un problema e scrivi una proposta di soluzione.'}
];
const TYPE_NAMES = {universita:'Università',afam:'AFAM / Arte e musica',its:'ITS Academy',lavoro:'Lavoro e formazione'};
const MODE_TYPES = {universita:['universita','afam'],its:['its'],lavoro:['lavoro']};

function freshState(){return {answers:{},index:0,latest:null,activePath:null,tasks:{},notes:'',updatedAt:null};}
function loadState(){try{const data=JSON.parse(localStorage.getItem(STORAGE_KEY));if(data && typeof data==='object')return {...freshState(),...data,answers:data.answers||{},tasks:data.tasks||{}};}catch(_){}return freshState();}
let state=loadState();let screen='home';let toastTimer=null;
function persist(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));return true;}catch(e){notify('Spazio di salvataggio non disponibile in questo browser.');return false;}}
function notify(message){const box=document.getElementById('toast');box.textContent=message;box.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>box.classList.remove('show'),3200);}
function escapeHtml(str){return String(str??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));}
function labelFor(id){const path=PATHS.find(x=>x.id===id);return path?path.title:'Percorso';}
function getAnswer(index){const val=state.answers[index];return Number.isInteger(val)&&val>=0&&val<QUESTIONS[index].options.length?val:null;}
function collect(){const weights={};Object.keys(TAG_NAMES).forEach(t=>weights[t]=0);let modes={universita:0,its:0,lavoro:0};let mobility='unknown',budget='unknown';QUESTIONS.forEach((q,i)=>{const idx=getAnswer(i);if(idx===null)return;const opt=q.options[idx];(opt.tags||[]).forEach((t,n)=>weights[t]+=(n===0?2:1));if(opt.mode&&opt.mode!=='any')modes[opt.mode]++;if(opt.mobility)mobility=opt.mobility;if(opt.budget)budget=opt.budget;});return {weights,modes,mobility,budget};}
function rankPaths(){const info=collect();const modePreference=Object.entries(info.modes).sort((a,b)=>b[1]-a[1])[0];const bestMode=(modePreference && modePreference[1]>=2)?modePreference[0]:null;
 const ranked=PATHS.map(path=>{const weighted=path.tags.reduce((acc,t,n)=>acc+(info.weights[t]||0)*(n===0?1.1:n===1?1:.82),0);const bonus=bestMode && MODE_TYPES[bestMode].includes(path.type)?4:0;return {...path,score:weighted+bonus,matched:path.tags.filter(t=>info.weights[t]>0).sort((a,b)=>info.weights[b]-info.weights[a])};}).sort((a,b)=>b.score-a.score);
 // Sono alternative da esplorare: la varietà è proposta solo per i percorsi quasi a pari punteggio.
 const chosen=ranked.slice(0,3);if(chosen.length===3){const types=new Set(chosen.map(p=>p.type==='afam'?'universita':p.type));if(types.size===1){const other=ranked.find(p=>!chosen.some(c=>c.id===p.id) && (p.type==='afam'?'universita':p.type)!==(chosen[0].type==='afam'?'universita':chosen[0].type) && p.score>=chosen[2].score*.9);if(other)chosen[2]=other;}}
 return {chosen,info};}
function completeTest(){if(QUESTIONS.some((_,i)=>getAnswer(i)===null)){notify('Rispondi a tutte le domande per continuare.');return;}
 const result=rankPaths();state.latest={pathIds:result.chosen.map(p=>p.id),tags:Object.entries(result.info.weights).sort((a,b)=>b[1]-a[1]).filter(x=>x[1]>0).slice(0,3).map(x=>x[0]),date:new Date().toISOString(),mobility:result.info.mobility,budget:result.info.budget};state.activePath=state.latest.pathIds[0];state.updatedAt=Date.now();persist();show('results');}
function show(name){if((name==='results'||name==='dashboard')&&!state.latest){show('home');notify('Completa prima il test per scoprire il tuo percorso.');return;}
 screen=name;document.querySelectorAll('.view').forEach(el=>el.hidden=(el.id!==`view-${name}`));if(name==='quiz')renderQuiz();if(name==='results')renderResults();if(name==='dashboard')renderDashboard();window.scrollTo({top:0,behavior:'instant'});}
function startQuiz(reset=false){if(reset){state.answers={};state.index=0;persist();}show('quiz');}
function renderQuiz(){state.index=Math.max(0,Math.min(QUESTIONS.length-1,Number(state.index)||0));const i=state.index,q=QUESTIONS[i],chosen=getAnswer(i);
 const phases=i<10?['01 / ESPLORA','INTERESSI E CURIOSITÀ']:i<14?['02 / CONOSCI','COME IMPARI']:['03 / DECIDI','LE TUE PRIORITÀ'];
 document.getElementById('quiz-counter').textContent=`DOMANDA ${i+1} DI ${QUESTIONS.length}`;document.getElementById('quiz-progress').style.width=`${((i+1)/QUESTIONS.length)*100}%`;
 document.getElementById('quiz-phase').textContent=phases[0]+' — '+phases[1];document.getElementById('quiz-title').textContent=q.title;
 document.getElementById('quiz-subtitle').textContent=q.note||'Rispondi d’istinto. Non ci sono risposte giuste o sbagliate.';
 document.getElementById('quiz-options').innerHTML=q.options.map((opt,n)=>`<button type="button" role="radio" aria-checked="${chosen===n}" class="quiz-option" data-answer="${n}"><span class="option-letter">${'ABCD'[n]}</span><span class="option-copy"><strong>${escapeHtml(opt.text)}</strong></span></button>`).join('');
 const next=document.getElementById('next-button');next.disabled=chosen===null;next.innerHTML=i===QUESTIONS.length-1?'Scopri i percorsi <span aria-hidden="true">↗</span>':'Continua <span aria-hidden="true">→</span>';
 document.querySelector('[data-action="prev"]').disabled=i===0;
}
function nextQuestion(){if(getAnswer(state.index)===null)return;if(state.index===QUESTIONS.length-1){completeTest();return;}state.index++;persist();renderQuiz();document.getElementById('quiz-title').focus({preventScroll:true});}
function stepBack(){if(state.index>0){state.index--;persist();renderQuiz();document.getElementById('quiz-title').focus({preventScroll:true});}}
const MOBILITY_TEXT={yes:'Aperto/a a trasferirti',no:'Preferisci restare vicino casa',online:'Interessato/a anche a formule online/miste',unknown:'Mobilità da valutare'};
const BUDGET_TEXT={high:'Confrontare i costi è prioritario',medium:'Vuoi confrontare le spese',unspecified:'Budget ancora aperto',unknown:'Costi da approfondire'};
function renderResults(){const latest=state.latest;if(!latest)return;document.getElementById('results-profile').innerHTML=[`Interessi: <b>${(latest.tags||[]).slice(0,2).map(t=>TAG_NAMES[t]).join(' · ')||'da scoprire'}</b>`,`<b>${MOBILITY_TEXT[latest.mobility]||MOBILITY_TEXT.unknown}</b>`,`<b>${BUDGET_TEXT[latest.budget]||BUDGET_TEXT.unknown}</b>`].map(t=>`<span class="profile-pill">${t}</span>`).join('');
 document.getElementById('results-list').innerHTML=latest.pathIds.map((id,n)=>{const path=PATHS.find(p=>p.id===id);if(!path)return '';const matches=path.tags.filter(t=>latest.tags.includes(t));return `<article class="result-card"><div class="result-rank">DIREZIONE ${String(n+1).padStart(2,'0')}</div><span class="result-type ${path.type}">${TYPE_NAMES[path.type]}</span><h3>${escapeHtml(path.title)}</h3><p>${escapeHtml(path.description)}</p><div class="interest-row">${path.tags.slice(0,3).map(t=>`<span class="interest-tag">${escapeHtml(TAG_NAMES[t])}</span>`).join('')}</div><div class="result-divider"></div><h4 class="card-subheading">Perché esplorarla</h4><ul class="card-list"><li>${matches.length?`Le tue risposte toccano ${escapeHtml(matches.map(t=>TAG_NAMES[t]).join(' e '))}.`:'È una possibilità da confrontare con le tue preferenze.'}</li><li>${escapeHtml(path.question)}</li></ul><h4 class="card-subheading">Da dove partire</h4><ul class="card-list">${path.examples.slice(0,2).map(x=>`<li>${escapeHtml(x)}</li>`).join('')}</ul><button class="btn btn-outline card-button" type="button" data-action="choose-path" data-path="${path.id}">Esplora la roadmap →</button></article>`;}).join('');}
function tasksFor(path){const academic=path.type==='universita'||path.type==='afam';const its=path.type==='its';const target=academic?'2 corsi o istituzioni formative':its?'2 ITS Academy e i loro percorsi':'2 opportunità di formazione o apprendistato';const official=academic?'Consulta Universitaly e il sito ufficiale dell’istituzione.':its?'Verifica i corsi ITS sui siti ufficiali degli istituti e del Ministero.':'Controlla i requisiti sui siti degli enti accreditati e delle aziende.';
 return [
  {time:'Questa settimana',title:'Chiarisci ciò che ti attira',text:`Scrivi tre motivi per cui ${path.title.toLowerCase()} ti incuriosisce e tre dubbi da sciogliere.`},
  {time:'Entro 2 settimane',title:'Confronta percorsi concreti',text:`Cerca ${target}. ${official}`},
  {time:'Entro 1 mese',title:'Prova qualcosa di vero',text:path.project},
  {time:'Entro 1 mese',title:'Parla con chi lo conosce',text:'Fai almeno tre domande a uno studente, un docente, un orientatore o un professionista del settore.'},
  {time:'Entro 2 mesi',title:'Verifica tempi, costi e accesso',text:'Controlla date ufficiali, requisiti di ingresso, eventuali selezioni, spese e possibilità di sostegno economico. Non basarti su informazioni non verificate.'},
  {time:'Entro 3 mesi',title:'Decidi il prossimo esperimento',text:'Confronta pro e contro delle opzioni. Puoi anche cambiare strada: è una scelta che si costruisce.'}
 ];}
function taskKey(id,n){return `${id}:${n}`;}
function tasksSummary(){if(!state.latest)return{done:0,total:0};let total=0,done=0;state.latest.pathIds.forEach(id=>{tasksFor(PATHS.find(p=>p.id===id)).forEach((_,i)=>{total++;if(state.tasks[taskKey(id,i)])done++;});});return {done,total};}
function renderDashboard(){const latest=state.latest;if(!latest)return;if(!latest.pathIds.includes(state.activePath)){state.activePath=latest.pathIds[0];persist();}const path=PATHS.find(p=>p.id===state.activePath);if(!path)return;const tally=tasksSummary();const percent=tally.total?Math.round(tally.done/tally.total*100):0;
 document.getElementById('dashboard-content').innerHTML=`<div class="dashboard-summary"><div><strong>${tally.done} di ${tally.total} tappe</strong><br><span>completate nelle tre direzioni</span></div><div class="small-progress" role="progressbar" aria-label="Progresso della roadmap" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percent}"><span style="width:${percent}%"></span></div></div><div class="dashboard-columns"><div class="roadmap-card"><h2>La tua roadmap</h2><p>Scegli una direzione per vedere cosa potresti fare nei prossimi mesi.</p><div class="path-switches">${latest.pathIds.map(id=>`<button type="button" class="path-switch ${id===path.id?'active':''}" aria-pressed="${id===path.id}" data-action="switch-path" data-path="${id}">${escapeHtml(labelFor(id))}</button>`).join('')}</div><div class="roadmap-list">${tasksFor(path).map((task,i)=>`<label class="task-row ${state.tasks[taskKey(path.id,i)]?'done':''}"><input type="checkbox" data-task="${taskKey(path.id,i)}" ${state.tasks[taskKey(path.id,i)]?'checked':''}/><span class="task-content"><span class="task-time">${escapeHtml(task.time)}</span><strong>${escapeHtml(task.title)}</strong><small>${escapeHtml(task.text)}</small></span></label>`).join('')}</div></div><aside class="notes-card"><h2>Le tue riflessioni</h2><p>Annota dubbi, idee, nomi di corsi o cose da chiedere. Le note restano su questo dispositivo.</p><label for="personal-notes" class="visually-hidden">Le tue note</label><textarea id="personal-notes" maxlength="4000" placeholder="Per esempio: ho scoperto un corso che mi interessa, voglio andare a un open day...">${escapeHtml(state.notes||'')}</textarea><button type="button" class="btn btn-primary" data-action="save-notes">Salva le note ✓</button><p class="notes-hint">Ricorda: controlla requisiti, date e costi sui siti ufficiali. Il test non è scientificamente validato.</p></aside></div>`;}
function deleteData(){if(!confirm('Vuoi cancellare tutte le risposte, le roadmap e le note salvate su questo browser?'))return;state=freshState();try{localStorage.removeItem(STORAGE_KEY);}catch(e){}show('home');notify('Dati locali cancellati.');}
function navScroll(id){show('home');requestAnimationFrame(()=>document.getElementById(id)?.scrollIntoView({behavior:'smooth'}));}
document.addEventListener('click',ev=>{
 const opt=ev.target.closest('[data-answer]');if(opt && screen==='quiz'){const n=Number(opt.dataset.answer);if(!Number.isInteger(n))return;state.answers[state.index]=n;persist();renderQuiz();document.querySelector(`[data-answer="${n}"]`)?.focus({preventScroll:true});return;}
 const button=ev.target.closest('[data-action]');if(!button)return;
 const action=button.dataset.action;switch(action){
  case'home':show('home');break;
  case'how':navScroll('how-section');break;
  case'resources':navScroll('resources-section');break;
  case'start':startQuiz(false);break;
  case'restart':if(confirm('Vuoi iniziare un nuovo test? I risultati precedenti resteranno visibili finché non completi il nuovo test.'))startQuiz(true);break;
  case'prev':stepBack();break;
  case'next':nextQuestion();break;
  case'results':show('results');break;
  case'dashboard':show('dashboard');break;
  case'choose-path':case'switch-path':if(PATHS.some(p=>p.id===button.dataset.path)){state.activePath=button.dataset.path;persist();show('dashboard');}break;
  case'print':window.print();break;
  case'save-notes':state.notes=document.getElementById('personal-notes')?.value.slice(0,4000)||'';if(persist())notify('Note salvate su questo dispositivo.');break;
  case'delete-data':deleteData();break;
 }
});
document.addEventListener('change',ev=>{if(ev.target.matches('[data-task]')){state.tasks[ev.target.dataset.task]=ev.target.checked;persist();renderDashboard();notify(ev.target.checked?'Tappa completata!':'Tappa riaperta.');}});
document.getElementById('year').textContent=String(new Date().getFullYear());
// Consente di tornare alla roadmap dopo aver chiuso o riaperto la pagina.
if(state.latest && location.hash==='#percorso')show('dashboard');
