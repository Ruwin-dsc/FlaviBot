# FlaviBot
## version 1.0.0

Bot multi-functions

## Developers :

Flav and NoxFly.

## About

If you like our work and you want to support us, please make donations here :

[https://www.paypal.me/FlaviBot](https://www.paypal.me/FlaviBot)

# Liste des actions et endpoints

| Action        | Event         | Endpoint  |
| ------------- |:-------------:| ---------:|
| Récupérer config générale | Lors de la configuration du bot | `GET /config`     |
| Récupérer config du guild      | Lors de la configuration du bot pour un certain guild |   `GET /guilds?token=:guild_id`    |
| Maj des channels du guild | Si les channels ne correspondent pas à la config | `PUT /guilds/:id` |
| Serveur de support | Lorsque le bot doit envoyer des informations au serveur de support | `GET /support` |
| Message d'apparence | Lorsque le bot est ajouté sur un serveur | `GET /appearing` |
| Exécution d'une commande | Lorsqu'une commande est détectée | `POST /commands` |
| Enregistrement d'une erreur | Lorsqu'une erreur est détectée | `POST /errors` |