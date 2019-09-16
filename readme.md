# PeinturJS

Essais pour re-développer Peintur en Node JS, avec Express et une base de
données SQlite.


## Améliorations

### Terminer màj suite à posts

* POST /parametres/edit => màj Tableaux.Xxxxxx
* POST /parametres/edit => màj Tableaux.Points en fonction de Taille

### Controles de saisie

* Côté client (package express-validator ?)
* Côté serveur (package express-validator)
* AntiForgeryToken (https://github.com/expressjs/csurf)


## TODO (plus tard)

### Organisation du code

* Utiliser Nodemon pour éviter arrêts / redémarrages
* Avoir routes/tableaux.js et routes/parametres.js
* Avoir models/tableaux.js et models/parametres.js ?
* Bidouille "callback" pour loadOptions() => utiliser "sqlite-async" ?
* Surcouche à "sqlite3" pour db.query() "compatible" avec celui de "pg"

### EJS

* Layout en EJS => ejs-mate (ex ejs-locals ?) ou express-ejs-layout ?
* Problème des URLs relatives pour les vues partielles
