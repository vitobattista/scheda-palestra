# Scheda Palestra

Web app per iPhone che mostra la scheda del personal trainer e permette di segnare reps, carico e RPE in palestra. Si aggiunge alla schermata Home, si apre a schermo intero e funziona anche senza connessione.

## Come funziona

- **Sul telefono** stanno la scheda (già convertita in JSON) e lo storico dei valori segnati. Durante l'allenamento non ci sono connessioni.
- **Il ponte** è un piccolo progetto Google Apps Script, non incluso in questo repository. Legge le schede .xlsx da Google Drive, le converte in JSON e conserva una copia online dello storico.
- **La sincronizzazione** è una sola chiamata: il telefono invia le modifiche e riceve lo storico unito e, solo se il file è cambiato, la scheda aggiornata. Parte all'apertura (se l'ultima è più vecchia di 5 minuti), quando l'app va in background con modifiche da inviare (invio senza attesa) e dal pulsante in alto.

## File

```
index.html              la web app
config.js               URL del ponte Apps Script
manifest.webmanifest    nome e icona per "Aggiungi alla schermata Home"
sw.js                   cache per aprire l'app anche senza campo
icons/                  icone dell'app
```

## Configurazione

1. Pubblica il ponte Apps Script come **App web** ("Esegui come: Me", "Chi ha accesso: Chiunque") e genera il codice di accesso con `impostaCodice()`.
2. Incolla l'URL che finisce con `/exec` in `config.js`. Il codice di accesso non va mai scritto in questo repository: si inserisce nell'app sul telefono.
3. **Settings → Pages** → Deploy from a branch → `main` / `(root)`.
4. Su iPhone: apri il sito in Safari → **Condividi → Aggiungi alla schermata Home** → apri l'app e inserisci il codice.

## Aggiornare la pagina

Dopo aver modificato i file aumenta `VERSION` in `sw.js` (es. `scheda-v3`), così l'iPhone scarica la versione nuova.
