# Project TODO

- [x] Homepage flagship con filiera Zlang → compilazione/contratto ZLB2 → runtime ZDOS → boot QEMU → Evidence Chain
- [x] Stati di verifica espliciti e distinti: VERIFIED, PREPARED, ROADMAP, NOT_VERIFIED
- [x] Registro consultabile di release, checksum, commit, boot proof e artefatti GitHub
- [x] Area Ecosystem per ZDOS, Zlang, zdos-organism, ZDOS Lab, ZDOS-SEC-PORTAL e Z-CYBERCORE
- [x] Sezione Security Operations default-deny/read-only con programmi, scope, evidenze, triage e disclosure
- [x] Collegamento esterno alla War Room autenticata senza replicare o bypassare l’autenticazione
- [x] Playground Zlang interattivo con profilo ZLB2 v2.5 e esempi sicuri
- [x] Validazione server-side delle istruzioni supportate da Zlang
- [x] Rifiuto chiaro server-side di sintassi sconosciuta, capacità non disponibili e percorsi non autorizzati
- [x] Sezione Retro Computing su Atari, Commodore e Amiga con fonti e avvertenze su ROM/BIOS/materiali proprietari
- [x] Navigazione responsive unificata per Runtime, Evidence, Ecosystem, Security e Retro Computing
- [x] Schema dati per catalogo evidenze con stati, checksum, commit, release, URL e provenienza
- [x] API pubbliche tipizzate per catalogo, evidenze, ecosistema e validazione Zlang
- [x] Test Vitest per validazione Zlang, rifiuti di sicurezza, stati evidenze e procedure API
- [x] Verifica responsive desktop/mobile e controllo console/browser logs
- [x] Checkpoint finale pronto per la pubblicazione manuale

## Follow-up emersi dalla verifica

- [x] Sostituire il placeholder `main` con SHA GitHub reali e completare i riferimenti ufficiali di release, artefatto e boot proof.
- [x] Aggiungere una navigazione mobile esplicita per Runtime, Evidence, Ecosystem, Security, Retro, GitHub e War Room.
- [x] Scrivere test Vitest per `evidence.list` e `ecosystem.list`, inclusa la verifica degli stati VERIFIED/PREPARED/ROADMAP/NOT_VERIFIED.
- [x] Salvare il checkpoint finale dopo la correzione dei gap.

## Migrazione VPS

- [ ] Raccogliere IP/hostname, provider, sistema operativo, versione Node, accesso SSH e modalità di autenticazione della VPS.
- [ ] Verificare compatibilità VPS, risorse, firewall, database e disponibilità di Docker o systemd.
- [ ] Preparare build e configurazione di produzione ripetibile per la webapp flagship.
- [ ] Eseguire deploy parallelo senza modificare subito i DNS di x-zdos.it.
- [ ] Configurare reverse proxy, HTTPS e DNS dopo verifica del servizio parallelo.
- [ ] Eseguire cutover controllato e mantenere rollback documentato.

## Autobuild VPS Ubuntu

- [x] Esportare il progetto flagship in un repository GitHub privato per il deploy VPS.
- [x] Creare uno script autobuild Ubuntu idempotente con variabili per dominio e directory.
- [x] Configurare Node.js, build production, systemd e Nginx senza cutover automatico.
- [x] Verificare il comando autobuild e consegnare una singola istruzione copiabile.

## Verifiche richieste sulla VPS

- [ ] Eseguire `deploy-vps.sh` su una VPS Ubuntu reale e verificare servizio, reverse proxy Nginx e assenza di cutover automatico.
- [ ] Documentare le variabili ambiente opzionali per OAuth, database, analytics e dominio pubblico.

## Blocco autenticazione VPS

- [ ] Autenticare GitHub CLI sulla VPS con il flusso device/browser senza esporre token.
- [ ] Ripetere clone privato e deploy dopo autenticazione.
- [ ] Verificare servizio systemd, endpoint locale e configurazione Nginx.

## Fix compatibilità Ubuntu

- [ ] Installare pnpm autonomamente quando `corepack` non è disponibile nella VPS Ubuntu.
- [ ] Pubblicare il fix nel bundle GitHub privato e riprendere il deploy dalla VPS.

## Fix PATH pnpm

- [ ] Rilevare e usare il percorso globale di pnpm dopo installazione npm, anche con PATH root minimale.
- [ ] Aggiornare il bundle GitHub privato e fornire il comando di ripresa.

## Fix systemd VPS

- [ ] Usare il percorso reale restituito da `command -v node` nell’unità systemd.
- [ ] Verificare avvio locale del servizio dopo il fix; il virtual host x-zdos.it esistente resta invariato.
