# PeinturJS

Essais pour re-développer Peintur en Node JS, avec Express et une base de
données SQlite.


## Améliorations

### Terminer màj suite à posts

* POST /tableaux/xxxx => màj Points en fonction de Taille
* POST /parametres/edit => màj Tableaux.Xxxxxx
* POST /parametres/edit => màj Tableaux.Points en fonction de Taille

### Controles de saisie

* Côté client (package express-validator ?)
* Côté serveur (package express-validator)
* AntiForgeryToken

### Controles des routes

* `:id` n'est pas défini => BadRequest

### Fonctionalités

* Navigation avant / après dans GET /tableaux/details/5


## TODO (plus tard)

### Organisation du code

* Avoir routes/tableaux.js
* Avoir routes/parametres.js
* Revoir bidouille "callback" pour loadOptions()
* Surcouche à "sqlite3" pour db.query() comme celui de "pg"

### EJS

* Chercher s'il existe un truc pour faire des "layouts" en EJS
* Problème des URLs relatives pour les vues partielles

