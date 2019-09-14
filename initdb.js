const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Code pour exécuter une requête
const executeSql = (sql, messageOk) => {
  db.run(sql, (err) => {
    if (err) return console.error(err.message);
    console.log(messageOk);
  });
}

// Code pour créer la table des tableaux
const createTableaux = () => {
  let sql =
  `CREATE TABLE IF NOT EXISTS Tableaux (
    Tableau_ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Nom VARCHAR(100) NOT NULL,
    Annee VARCHAR(10) NOT NULL,
    Technique VARCHAR(20) NOT NULL,
    Sujet VARCHAR(20) NOT NULL,
    Support VARCHAR(20) NOT NULL,
    Cadre VARCHAR(20) NOT NULL,
    Stockage VARCHAR(20) NOT NULL,
    Taille VARCHAR(20) NOT NULL,
    Points INT NOT NULL,
    Poids DECIMAL(18, 2),
    Commentaires TEXT
  );`;
  executeSql(sql, "Création table Tableaux");
}

// Code pour créer les tables de paramètres
const createParametres = (table_name) => {
  let sql =
  `CREATE TABLE IF NOT EXISTS ${table_name} (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Nom VARCHAR(20) NOT NULL,
    Valeur INT
  );`;
  executeSql(sql, `Création table ${table_name}`);
}

// Code pour créer les paramètres
const insertParametres = (table_name, nom, valeur) => {
  let sql = `INSERT INTO ${table_name} (Nom, Valeur) VALUES (?, ?)`;
  db.run(sql, [nom, valeur], (err) => {
    if (err) return console.error(err.message);
  });
}

// Connexion (voire création) base de donnée SQlite
const db_name = path.join(__dirname, "data", "peintur.db");
const db = new sqlite3.Database(db_name, err => {
  if (err) return console.error(err.message);
  console.log("Connexion réussie à 'peintur.db'");
});

// Création (sérialisée) des tables
db.serialize(() => {
  createTableaux();
  createParametres("Cadres");
  createParametres("Cotes");
  createParametres("Stockages");
  createParametres("Sujets");
  createParametres("Supports");
  createParametres("Tailles");
  createParametres("Techniques");
});

// Insertion des paramètres Cadres
db.serialize(() => {
  insertParametres("Cadres", "Américain", null);
  insertParametres("Cadres", "Non", null);
  insertParametres("Cadres", "Oui", null);
  insertParametres("Cadres", "Sous-verre", null);
});

// Insertion des paramètres Cotes
db.serialize(() => {
  insertParametres("Cotes", "Officielle", 20);
  insertParametres("Cotes", "Expo", 20);
  insertParametres("Cotes", "Amis", 15);
});

// Insertion des paramètres Stockages
db.serialize(() => {
  insertParametres("Stockages", "Atelier", null);
  insertParametres("Stockages", "Atelier carton ", null);
  insertParametres("Stockages", "Carton Ch. Bas ", null);
  insertParametres("Stockages", "Cheminée ", null);
  insertParametres("Stockages", "Couloir", null);
  insertParametres("Stockages", "Cuisine", null);
  insertParametres("Stockages", "Atelier devant carré ", null);
  insertParametres("Stockages", "Atelier mur", null);
  insertParametres("Stockages", "Mur bureau ", null);
  insertParametres("Stockages", "Atelier mur fond ", null);
  insertParametres("Stockages", "Mur salon", null);
  insertParametres("Stockages", "Atelier sur armoire  ", null);
  insertParametres("Stockages", "Atelier pendu", null);
  insertParametres("Stockages", "Salon", null);
  insertParametres("Stockages", "Atelier sur carré", null);
  insertParametres("Stockages", "Vendu", null);
});

// Insertion des paramètres Sujets
db.serialize(() => {
  insertParametres("Sujets", "Abstrait", null);
  insertParametres("Sujets", "Fleur", null);
  insertParametres("Sujets", "Nature morte", null);
  insertParametres("Sujets", "Paysage", null);
  insertParametres("Sujets", "Portrait", null);
});

// Insertion des paramètres Supports
db.serialize(() => {
  insertParametres("Supports", "Carton", null);
  insertParametres("Supports", "Contreplaqué", null);
  insertParametres("Supports", "Papier", null);
  insertParametres("Supports", "Toile", null);
});

// Insertion des paramètres Tailles
db.serialize(() => {
  insertParametres("Tailles", "10 x 10", 1);
  insertParametres("Tailles", "18 x 13", 1);
  insertParametres("Tailles", "19 x 19", 2);
  insertParametres("Tailles", "20 x 14", 1);
  insertParametres("Tailles", "20 x 20", 2);
  insertParametres("Tailles", "24 x 18", 2);
  insertParametres("Tailles", "27 x 19", 3);
  insertParametres("Tailles", "27 x 22", 3);
  insertParametres("Tailles", "28 x 20", 3);
  insertParametres("Tailles", "30 x 21", 3);
  insertParametres("Tailles", "30 x 24", 4);
  insertParametres("Tailles", "30 x 30", 5);
  insertParametres("Tailles", "32 x 24", 4);
  insertParametres("Tailles", "36 x 26", 5);
  insertParametres("Tailles", "37 x 20", 5);
  insertParametres("Tailles", "37 x 32", 6);
  insertParametres("Tailles", "39 x 28", 6);
  insertParametres("Tailles", "40 x 30", 6);
  insertParametres("Tailles", "40 x 40", 8);
  insertParametres("Tailles", "41 x 33", 6);
  insertParametres("Tailles", "43 x 20", 5);
  insertParametres("Tailles", "44 x 32,5", 8);
  insertParametres("Tailles", "46 x 38", 8);
  insertParametres("Tailles", "50 x 32,5", 8);
  insertParametres("Tailles", "50 x 40", 8);
  insertParametres("Tailles", "50 x 50", 10);
  insertParametres("Tailles", "54 x 38", 10);
  insertParametres("Tailles", "54 x 46", 10);
  insertParametres("Tailles", "60 x 60", 15);
  insertParametres("Tailles", "61 x 46", 12);
  insertParametres("Tailles", "61 x 50", 12);
  insertParametres("Tailles", "65 x 54", 15);
  insertParametres("Tailles", "70 x 50", 20);
  insertParametres("Tailles", "80 x 60", 25);
});

// Insertion des paramètres Techniques
db.serialize(() => {
  insertParametres("Techniques", "Acrylique", null);
  insertParametres("Techniques", "Aquarelle", null);
  insertParametres("Techniques", "Dessin", null);
  insertParametres("Techniques", "Huile", null);
  insertParametres("Techniques", "Couteau", null);
  insertParametres("Techniques", "Mixte", null);
});
