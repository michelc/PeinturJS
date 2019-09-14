const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

// Création du serveur Express
const app = express();

// Configuration du serveur
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));

// Connexion à la base de donnée SQlite
const db_name = path.join(__dirname, "data", "peintur.db");
const db = new sqlite3.Database(db_name, err => {
  if (err) return console.error(err.message);
  console.log("Connexion réussie à 'peintur.db'");
});

// Démarrage du serveur
app.listen(3000, () => {
  console.log("Serveur démarré (http://localhost:3000/) !");
});

const renderView = (res, view_name, model) => {
  res.render(view_name + ".ejs", { model: model });
}

// GET /
app.get("/", (req, res) => {
  const sql = "SELECT Tableau_ID, Nom, Annee, Technique, Sujet FROM Tableaux ORDER BY Nom, Tableau_ID";
  db.all(sql, [], (err, rows) => {
    if (err) return console.error(err.message);
    renderView(res, "tableaux/index", rows);
  });
});

// GET /tableaux/print
app.get("/tableaux/print", (req, res) => {
  const sql = "SELECT * FROM Tableaux ORDER BY Nom, Tableau_ID";
  db.all(sql, [], (err, rows) => {
    if (err) return console.error(err.message);
    const model = rows.map(one => {
      return {
        Tableau_ID: one.Tableau_ID,
        Nom: one.Nom,
        Annee: one.Annee === "1900" ? "" : one.Annee,
        Technique: one.Technique === "(aucun)" ? "" : one.Technique,
        Sujet: one.Sujet === "(aucun)" ? "" : one.Sujet,
        Support: one.Support === "(aucun)" ? "" : one.Support,
        Cadre: one.Cadre === "(aucun)" ? "" : one.Cadre,
        Stockage: one.Stockage === "(aucun)" ? "" : one.Stockage,
        Taille: one.Taille === "(aucun)" ? "" : (one.Points === 0 ? "!" + one.Taille : one.Taille).replace(/ /, ""),
        Commentaires: one.Commentaires === null ? "" : "*"
      };
    });
    renderView(res, "tableaux/print", model);
  });
});

// GET /tableaux/prix
app.get("/tableaux/prix", (req, res) => {
  db.all("SELECT Tableau_ID, Nom, Points, Technique, Taille, Cadre FROM Tableaux ORDER BY Nom, Tableau_ID", [], (err, rows) => {
    if (err) return console.error(err.message);
    db.get("SELECT * FROM Cotes WHERE Nom LIKE 'Officiel%'", [], (err, cote) => {
      if (err) return console.error(err.message);
      const model = rows.map(one => {
        return {
          Tableau_ID: one.Tableau_ID,
          Nom: one.Nom,
          Prix: one.Points * cote.Valeur,
          Technique: one.Technique,
          Taille: one.Taille.replace(/ /, ""),
          Cadre: one.Cadre === "Non" ? "" : one.Cadre
        };
      });
      renderView(res, "tableaux/prix", model);
    });
  });
});

// GET /tableaux/details/5
app.get("/tableaux/details/:id", (req, res) => {
  const id = req.params.id;
  let sql = "SELECT * FROM Tableaux WHERE Tableau_ID = ?";
  db.get(sql, id, (err, tableau) => {
    if (err) return console.error(err.message);
      sql = "SELECT * FROM Cotes ORDER BY Nom";
      db.all(sql, [], (err, cotes) => {
        if (err) return console.error(err.message);
        let prix = "";
        for (const cote of cotes) {
          if (cote.Nom.startsWith("Officielle")) {
            prix = ` => Prix = ${cote.Valeur * tableau.Points} €` + prix;
          } else {
            prix += ` &nbsp; / &nbsp; ${cote.Nom} = ${cote.Valeur * tableau.Points}`;
          }
        }
        tableau.Prix = prix;
        renderView(res, "tableaux/details", tableau);
      });
    });
});

const selectOptions = (entite, tableau, callback) => {
  const sql =  `SELECT Nom FROM ${entite}s ORDER BY Nom`;
  db.all(sql, [], (err, rows) => {
    if (err) return console.error(err.message);
    const list = rows.map(one => one.Nom);
    let nom = tableau[entite];
    list.push("(autre)");
    if (!rows.includes(nom)) rows.unshift(nom);
    if (!nom) nom = "(autre)";
    const choices = list.map(one => {
      return {
        Id: one,
        Caption: one,
        Selected: (one === nom)
      };
    });
    tableau[entite + "s"] = choices;
    if (callback) callback();
  });
}

const loadOptions = async (tableau, callback) => {
  db.serialize(() => {
    selectOptions("Technique", tableau);
    selectOptions("Sujet", tableau);
    selectOptions("Support", tableau);
    selectOptions("Cadre", tableau);
    selectOptions("Stockage", tableau);
    selectOptions("Taille", tableau, callback);
  });
}

// GET /tableaux/create
app.get("/tableaux/create", (req, res) => {
  tableau = {
    Support: "Toile",
    Cadre: "Non"
  };
  loadOptions(tableau, () => {
    renderView(res, "tableaux/create", tableau);
  });
});

// GET /tableaux/edit/5
app.get("/tableaux/edit/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM Tableaux WHERE Tableau_ID = ?";
  db.get(sql, id, (err, tableau) => {
    if (err) return console.error(err.message);
    loadOptions(tableau, () => {
      renderView(res, "tableaux/edit", tableau);
    });
  });
});

// GET /tableaux/delete/5
app.get("/tableaux/delete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM Tableaux WHERE Tableau_ID = ?";
  db.get(sql, id, (err, row) => {
    if (err) return console.error(err.message);
    renderView(res, "tableaux/delete", row);
  });
});

// POST /tableaux/delete/5
app.post("/tableaux/delete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM Tableaux WHERE Tableau_ID = ?";
  db.get(sql, id, (err, row) => {
    if (err) return console.error(err.message);
    res.redirect("/tableaux");
  });
});

const parametreModel = (table) => {
  var param = {
    Table: table,
    Route: `/parametres/${table}`,
    Type: table.substr(0, table.length - 1),
    Parametres: null,
    Complement: ""
  };
  if (param.Type == "taille") param.Complement = "Points";
  if (param.Type == "cote") param.Complement = "Côte";
  param.Type = param.Type == "cote" ? "côte" : param.Type;
  return param;
}

// GET /parametres/totos
app.get("/parametres/:table", (req, res) => {
  const param = parametreModel(req.params.table);
  const sql = `SELECT * FROM ${param.Table} ORDER BY Nom`;
  db.all(sql, [], (err, rows) => {
    if (err) return console.error(err.message);
    param.Parametres = rows;
    renderView(res, "parametres/index", param);
  });
});

// GET /parametres/totos/create
app.get("/parametres/:table/create", (req, res) => {
  const param = parametreModel(req.params.table);
  renderView(res, "parametres/create", param);
});

// POST /parametres/totos/create
app.post("/parametres/:table/create", (req, res) => {
  const param = parametreModel(req.params.table);
  const sql = `INSERT INTO ${param.Table} (Nom, Valeur) VALUES (?, ?)`;
  const data = [req.body.Nom, req.body.Valeur];
  if (!param.Complement) data[1] = null;
  db.run(sql, data, err => {
    if (err) return console.error(err.message);
    res.redirect(param.Route);
  });
});

// GET /parametres/totos/edit/5
app.get("/parametres/:table/edit/:id", (req, res) => {
  const param = parametreModel(req.params.table);
  const id = req.params.id;
  const sql = `SELECT * FROM ${param.Table} WHERE ID = ?`;
  db.get(sql, id, (err, row) => {
    if (err) return console.error(err.message);
    param.ID = row.ID;
    param.Nom = row.Nom;
    param.Valeur = row.Valeur;
    renderView(res, "parametres/edit", param);
  });
});

// POST /parametres/totos/edit/5
app.post("/parametres/:table/edit/:id", (req, res) => {
  const param = parametreModel(req.params.table);
  const sql = `UPDATE ${param.Table} SET Nom = ?, Valeur = ? WHERE ID = ?`;
  const data = [req.body.Nom, req.body.Valeur, req.params.id];
  if (!param.Complement) data[1] = null;
  db.run(sql, data, err => {
    if (err) return console.error(err.message);
    res.redirect(param.Route);
  });
});

// GET /parametres/totos/delete/5
app.get("/parametres/:table/delete/:id", (req, res) => {
  const param = parametreModel(req.params.table);
  const id = req.params.id;
  const sql = `SELECT * FROM ${param.Table} WHERE ID = ?`;
  db.get(sql, id, (err, row) => {
    if (err) return console.error(err.message);
    param.ID = row.ID;
    param.Nom = row.Nom;
    param.Valeur = row.Valeur;
    renderView(res, "parametres/delete", param);
  });
});

// POST /parametres/totos/delete/5
app.post("/parametres/:table/delete/:id", (req, res) => {
  const param = parametreModel(req.params.table);
  const id = req.params.id;
  const sql = `DELETE FROM ${param.Table} WHERE ID = ?`
  db.run(sql, id, err => {
    if (err) return console.error(err.message);
    res.redirect(param.Route);
  });
});
