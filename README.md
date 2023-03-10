# BC-iad

Esempio di applicazione Nodejs che espone metriche comprensibili da Prometheus. Applicazione DEMO che simula tre operazioni bancarie di base: prelievo, bonifico e investimento.
Tramite l'endpoint `/metrics` vengono esposte le metriche di base riguradanti NodeJs e metriche custom:

- Numero di transazioni fallite
- Numero di transazioni create
- Variazione dell'importo dei capitali
- Tempo di risposta della chiamata per creare nuove transazioni

## Stack applicativo

Per far partire tutto lo stack applicativo ci basta eseguire il comando:

```sh
docker compose -f ./services/compose.yaml -f ./services/compose-grafana.yaml -f ./services/compose-mongo.yaml -f ./services/compose-prometheus.yaml up -d
```

se si desidera fare modifiche al progetto e si vuole buildare il repo corrente per aggiornare l'immagine aggiungere l'opzione `--build` nel seguente modo:

```sh
docker compose -f ./services/compose.yaml -f ./services/compose-grafana.yaml -f ./services/compose-mongo.yaml -f ./services/compose-prometheus.yaml up --buil -d
```

Tutti i file compose dove vengono definiti i container si trovano sotto la cartella `/services` e le configurazioni di prometheus e grafana sono sotto `/services/configs`.
Ho esportato le dashborad customizzate per bc-iad sotto la cartella `/services/configs/dashboards` potete importarle su Grafana.

## Far partire l'applicazione

dopo aver istallato le dipendenze:
`npm i`
copiare il file `.env.example` e rinominarlo in `.env`

e startare il servizio:
`npm start`

## Fare traffico

Per iniziare a raccogliere metriche e fare traffico sull'applicazione ho creato uno script `zx` che fa una serie di chiamate parallele ogni tot tempo, come lanciarlo:

```sh
npx zx ./scripts/parallelCallsInterval.mjs --ms 10000 --times=3 --url http://localhost:3000/transactions
```

Con queste configurazioni lo script fa 3 chiamate in parallelo ogni 10s e crea randomicamente una transazione.

## Link utili

- [installare Docker](https://docs.docker.com/get-docker)
- [guida su come configurare cAdvisor](https://prometheus.io/docs/guides/cadvisor/)
- [guida su come configurare blackBox exporter](https://prometheus.io/docs/guides/multi-target-exporter/)
- [dashboard di Grafana](https://grafana.com/grafana/dashboards/)
