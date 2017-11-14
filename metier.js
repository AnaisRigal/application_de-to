/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
// Constructeur pour les Positions





var getAllEvenements = function getAllEvenements(res){
    

    MongoClient.connect("mongodb://localhost/mobilitedb", function (err, db) {
        if (err) {
            return console.error('Connection failed', err);
        }
        var r = new Array();
        var d = db.collection("evenements").find({}).toArray(function (error, results) {
           if (error) throw error;
            
             results.forEach(function(o, i) {
                    var toto= new Position(o.id, o.nom);
                     r.push(toto);
                   //  console.log(toto);
                });
             //res.send(r);
             db.close();
             
           // res.send(r);
             });
    console.log(d);
     return d;
   });         
};

exports.getAllEvenements = getAllEvenements;