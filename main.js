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

app.get('/API/test', function (req, res) {
    res.send('test');
});


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
                var toto = new EvenementSimple(o.id, o.nom,o.description);
                r.push(toto);
                //  console.log(toto);
            });
            //res.send(r);
            db.close();
            res.send(r);
        });
    });
});

app.post('/createEvent', function (req, res) {
    MongoClient.connect("mongodb://localhost/mobilitedb", function (err, db) {


        if (err) {
            return console.error('Connection failed', err);
        }
        var nomRecu = new String;
        var descriptionRecue = new String;
        nomRecu = req.param("nomEvenmt");
        descriptionRecue = req.param("description");


        var objNew = {id: "12", nom: nomRecu, description: descriptionRecue};

        db.collection("evenements").insert(objNew, null, function (error, results) {
            if (error)
                throw error;

            console.log("L'événement a bien été inséré");
        });
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
            var toto = new EvenementSimple(doc.id, doc.nom,doc.description);
            console.log(toto);
        })
       /* db.collection("evenements").findOne({id: parseInt(pid,10)}).toArray(function (error, results) {
            if (error)
                throw error;

            results.forEach(function (o, i) {
                var toto = new EvenementSimple(o.id, o.nom,o.description);
                  console.log(toto);
            });
            //res.send(r);
            db.close();
        });
*/
        
    });
});



app.listen(8080, function () {
    console.log("ça roule")
});