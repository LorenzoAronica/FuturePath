# FuturePath — versione 1.0

Sito statico e gratuito per l'orientamento **esplorativo** dopo il diploma.

## Cosa fa

- Questionario guidato con 18 domande.
- Presenta tre direzioni da esplorare (università, AFAM, ITS Academy, lavoro/formazione pratica).
- Per ogni direzione fornisce motivazioni, esempi di studi e possibili attività.
- Roadmap con 6 attività per ciascuna direzione, spuntabili nel tempo.
- Spazio note salvato insieme ai risultati nel browser con `localStorage`.
- Responsive per smartphone e desktop. Nessun account, server, pagamento o API.

**Importante:** non è un test psicometrico validato e **non utilizza un modello AI** in questa versione. I risultati derivano da regole trasparenti basate sulle risposte e devono essere considerati spunti di ricerca, non previsioni né raccomandazioni definitive. Le denominazioni dei percorsi sono esempi da verificare su fonti ufficiali.

## Pubblicazione su GitHub Pages

1. Scarica ed estrai il file ZIP.
2. Crea un repository GitHub pubblico, ad esempio `futurepath`.
3. Carica nella **radice del repository** i file `index.html`, `styles.css`, `app.js` e `README.md` (non lo ZIP e non la cartella esterna).
4. Premi **Commit changes**.
5. Vai su **Settings → Pages → Build and deployment**. Seleziona **Deploy from a branch**, poi `main` e `/(root)` e premi Save.
6. Dopo la pubblicazione visita `https://TUO-USERNAME.github.io/futurepath/`.

Non impostare il repository come progetto Node/React: bastano questi tre file web.

## Come funziona il salvataggio

I dati restano esclusivamente nel browser in uso (localStorage). Non c'è sincronizzazione tra dispositivi. L'eliminazione dei dati del browser può cancellare tutto. Per cancellarli dall'app premi «Cancella i miei dati» in fondo alla pagina. Se la memoria locale è disabilitata, il test funziona ma i dati potrebbero non essere conservati.

## Fonti di orientamento consultabili

- [Universitaly — orientamento universitario](https://www.universitaly.it/it/orientamento-universitario)
- [Excelsiorienta — Unioncamere](https://excelsiorienta.unioncamere.it/)
- [UNICA — Ministero dell'Istruzione e del Merito](https://unica.istruzione.gov.it/)

Verificare sempre requisiti, disponibilità, prezzi, scadenze e sedi presso gli istituti di riferimento. Non sono presenti database aggiornati in tempo reale.

## Tecnologia

HTML, CSS e JavaScript puro. Nessuna dipendenza esterna. Per personalizzare i contenuti del test e i percorsi, modifica gli array `QUESTIONS` e `PATHS` nel file `app.js`.
