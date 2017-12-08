/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var metier = require('./metier');

//déclaration du prototype
var evenement = require('./prototypes/Evenement');
// déclarations de variables
var MongoClient = require("mongodb").MongoClient;

var express = require('express');
var app = express();

var bodyParser = require('body-parser');

app.use(bodyParser.json());

var idMax = 0;

// static
// partie page WEB 
app.use(express.static(__dirname + "/appclt"));

// pour tester les objets /////////////////////////////////////////////////////////////  
// Constructeur pour les événements simplifiés
function EvenementSimple(id, nom, description) {
    // l'id de l'evenement
    this.id = id;
    //le nom de l'evenement
    this.nom = nom;
    //le nom de l'evenement
    this.description = description;
}

// pour tester les objets /////////////////////////////////////////////////////////////  
// Constructeur pour les  
function MsgToDisplay(idEvenement, msg) {
    this.idEvenement = idEvenement;
    this.msg = msg;
}



app.get('/API/test', function (req, res) {
    res.send('test');
});

// Fait une liste d'évènements
app.get('/events', function (req, res) {
    MongoClient.connect("mongodb://localhost/mobilitedb", function (err, db) {
        if (err) {
            return console.error('Connection failed', err);
        }
        var r = new Array();
        db.collection("evenements").find({}).toArray(function (error, results) {
            if (error)
                throw error;

            results.forEach(function (o, i) {
                var toto = new EvenementSimple(o.id, o.nom);
                r.push(toto);
                //  console.log(toto);
            });
            //res.send(r);
            db.close();
            res.send(r);
        });
    });
});

// Crée un nouvel évènement
app.post('/createEvent', function (req, res) {
    MongoClient.connect("mongodb://localhost/mobilitedb", function (err, db) {
        if (err) {
            return console.error('Connection failed', err);
        }
        var nomRecu = new String;
        var descriptionRecue = new String;
        nomRecu = req.param("nomEvenmt");
        descriptionRecue = req.param("description");
        createur = req.param("idCreateur");
        idMax+=1;
        var objNew = {id: idMax, nom: nomRecu, description: descriptionRecue,idCreateur:createur, creneaux: []};
        db.collection("evenements").insert(objNew, null, function (error, results) {
            if (error)
                throw error;
            console.log("L'événement a bien été inséré");
        });
    });
});

app.patch('/patchEventAddCreneau', function (req, res) {
    console.log("Tentative d'ajout du créneau");

    MongoClient.connect("mongodb://localhost/mobilitedb", function (err, db) {
        if (err) {
            return console.error('Connection failed', err);
        }
        var dateHeureRecue = new String;
        var nomEventRecu = new String;
        var idCrenauxRecu = new String;
        dateHeureRecue = req.param("dateHeure");
        nomEventRecu = req.param("nomEvenmt");
        idCrenauxRecu = req.param("idCreneau");
        console.log("Tentative d'ajout du créneau");
        var objNew = {idCreneau: idCrenauxRecu, dateHeure: dateHeureRecue};
        db.collection("evenements").update({nom: nomEventRecu}, {$addToSet: {creneaux: objNew}}, function (error, results) {
            if (error)
                throw error;
            console.log("Le créneau a bien été ajouté à l'évènement");
        });
    });
});


app.patch('/addReponse', function (req, res) {

    MongoClient.connect("mongodb://localhost/mobilitedb", function (err, db) {
        if (err) {
            return console.error('Connection failed', err);
        }
        var reponseVisiteur = req.param("reponseVisiteur");
        var rep;
        var qd = new Array();
        for (i in reponseVisiteur.quand){
            qd.push({idCreneau : reponseVisiteur.quand[i].idCreneau,
                dispo :reponseVisiteur.quand[i].dispo}); 
        }
        rep = {idPers : reponseVisiteur.idPers, quand : qd }; 
        var idEvenement = req.param("idEvenement");
        console.log(rep+" "+idEvenement);
        db.collection("evenements").update({id: idEvenement}, {$addToSet: {reponses: rep}}, function (error, results) {
            if (error)
                throw error;
            console.log("Le créneau a bien été ajouté à l'évènement");
        });
    });
});

app.patch('/addCreneauxFinal', function (req, res) {

    MongoClient.connect("mongodb://localhost/mobilitedb", function (err, db) {
        if (err) {
            return console.error('Connection failed', err);
        }
        var idEvenement =  req.param("idEvenement");
        var idCreneau = req.param("idCreneau");
         var dateHeure = req.param("dateHeure");
       var update = {idCreneau : idCreneau, dateHeure : dateHeure};
        db.collection("evenements").update({id: idEvenement}, {$set: {creneauFinal:update}}, function (error, results) {
            if (error)
                throw error;
            console.log("Le créneau final a bien été ajouté à l'évènement");
        });
            
        db.close();
        });
    });

app.patch('/ajoutNotif', function (req, res) {

    MongoClient.connect("mongodb://localhost/mobilitedb", function (err, db) {
        if (err) {
            return console.error('Connection failed', err);
        }
        var idEvenement =  req.param("idEvenement");
        var nom = req.param("nom");
         var idPers = req.param("idPers");
        
               db.collection("users").update({idUser: idPers}, {$push: {notifs:{idEvenement:idEvenement,msg:nom+" a été cloturé !"}}}, function (error, results) {
                    if (error)
                        throw error;
                    console.log("Modification des notifs de "+idPers);
                });
         
        db.close();
        });
    });


app.get('/getEvent', function (req, res) {
    MongoClient.connect("mongodb://localhost/mobilitedb", function (err, db) {
        if (err) {
            return console.error('Connection failed', err);
        }
        var pid  = req.param("id");
        console.log(pid);
        db.collection("evenements").findOne({id:parseInt(pid,10)}).then(function(doc){
            var toto = new Evenement(doc.id, doc.nom,doc.description,doc.idCreateur,doc.creneaux,doc.reponses,doc.creneauFinal);
            res.send(toto);
        })
        db.close();
    });
});

app.get('/eventsCrees', function (req, res) {
    MongoClient.connect("mongodb://localhost/mobilitedb", function (err, db) {
        if (err) {
            return console.error('Connection failed', err);
        }
        
        var p  = req.param("idPers")
         var r = new Array();
        db.collection("evenements").find({idCreateur:p}).toArray(function (error, results) {
            if (error)
                throw error;
            results.forEach(function (o, i) {
                var toto = new EvenementSimple(o.id, o.nom);
                r.push(toto);
            });
            db.close();
            res.send(r);
        });
    });
});

app.get('/eventsParticipes', function (req, res) {
    MongoClient.connect("mongodb://localhost/mobilitedb", function (err, db) {
        if (err) {
            return console.error('Connection failed', err);
        }
        
        var p  = req.param("idPers")
         var r = new Array();
        db.collection("evenements").find({"reponses.idPers":p}).toArray(function (error, results) {
            if (error)
                throw error;
            results.forEach(function (o, i) {
                var toto = new EvenementSimple(o.id, o.nom);
                r.push(toto);
            });
            db.close();
            res.send(r);
        });
    });
});

app.get('/msgToDisplay', function (req, res) {
    MongoClient.connect("mongodb://localhost/mobilitedb", function (err, db) {
        if (err) {
            return console.error('Connection failed', err);
        }
        
        
        var p  = req.param("idPers")
         var r = new Array();
          db.collection("users").findOne({idUser:p }).then(function(doc){
            var toto = {afficherNotif:doc.afficherNotif,notif:doc.notifs};
            res.send(toto);
        })
        
    });
});

app.listen(8080, function () {
    console.log("Démarrage de l'application");
     MongoClient.connect("mongodb://localhost/mobilitedb", function (err, db) {
        if (err) {
            return console.error('Connection failed', err);
        }
        
        var r = 0;
        db.collection("evenements").find({}).sort({"id":-1}).limit(1).toArray(function (error, results) {
            if (error)
                throw error;

            results.forEach(function (o, i) {
                r = o.id;
                
            });
            idMax = r;
            console.log("L'id maximum est "+idMax);
            db.close();
            
        });
    });
});




   

function Evenement(id,nom,description,idCreateur,creneaux,reponses,creneauxFinal) {
  // l'id de l'evenement
  this.id = id;
  //le nom de l'evenement
  this.nom = nom;
  //la description de l'evenement
  this.description = description;
  //l'id du createur de l'evenement
  this.idCreateur = idCreateur;
  //le creneau final choisi
  this.creneauFinal = creneauxFinal;
  //liste de creneaux
  this.creneaux = creneaux;
 //liste de creneaux
  this.reponses = reponses;
 
  //les réponses pour l'événement
  this.listeReponses = new Array();
  //pour garder en mémoire l'id des créneaux
  this.lastIdCreneau = 0;
  //fonctionst 
  this.ajouterCreneau =function(dateHeure){
      creneau = new Creneau((this.lastIdCreneau+1),dateHeure);
      this.lastIdCreneau = this.lastIdCreneau+1;
      this.listeCreneaux.push(creneau);
  }
  this.ajouterReponse =function(idPers, idCreneaux, dispo){
      reponse = new Reponse(idPers, idCreneaux, dispo);
      this.listeReponses.push(reponse);
  }
}
