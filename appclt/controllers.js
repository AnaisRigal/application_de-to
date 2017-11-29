/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
angular.module("app", ['ui.router'])

        .service('MonService', function () {
                var ID_EVENEMENT ;
                
                function EvenementSimple(id,nom) {
                    this.id = id;
                    this.nom = nom;
                  }
                  
                EvenementSimple.prototype.print = function () {
                    return this.id + ' ' + this.nom;
                };
                
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
                  }
        })
    // Constructeur pour les événements simplifiés
    .component("afficherEvenement", {
        controller:["$scope","$http","$state","$stateParams", function($scope,$http,$state,$stateParams) { 
                //$scope.id=   $stateParams.param1;
                 $scope.message ="";
                  $scope.id = ID_EVENEMENT;
                   // console.log( $scope.id);
                  
                   var data = {id:$scope.id};
                   $http.get('/getEvent', {params:data}).then(function (response) {
                    if (response.data){
                        var d = response.data;
                        console.log("hey");
                       // $scope.event = new Evenement(d.id,d.nom,d.description,d.idCreateur,d.creneaux,d.responses,d.creneauFinal);
                        
                        $scope.nom =d.nom ;
                        $scope.description = d.description;
                        $scope.idCreateur = d.idCreateur;
                        if (d.creneauFinal== null){
                             $scope.creneauFinal = "Aucun pour l'instant"
                        }else{
                            $scope.creneauFinal = d.creneauFinal;
                        }
                        
                        $scope.creneaux = d.creneaux;
                        $scope.reponses = d.reponses;
                        
                        var quand = new Array();
                        for (c in $scope.creneaux){
                            var i = parseInt($scope.creneaux[c].idCreneau,10);
                            quand.push({idCreneau: i, dispo:"false"});
                        }
                        $scope.reponseVisiteur={idPers:"Visiteur",quand};
                      
                         }
                         
                    }, function (response) {
                        $scope.msg = response;
                        console.log(response);
                    });
                    
                $scope.changeValue = function(id){
                    for (qd in $scope.reponseVisiteur.quand){
                        q = $scope.reponseVisiteur.quand[qd];
                        console.log(q);
                        if (q.idCreneau==id){
                            if (q.dispo == "false")
                                q.dispo = "true";
                            else 
                                q.dispo ="false";
                        }
                    }
                    console.log(id);
                    console.log($scope.reponseVisiteur);
                    
                }
                
                $scope.soumettre = function(){
                    $scope.reponseVisiteur.idPers = $scope.nomVisiteur;
                    console.log($scope.reponseVisiteur);
                     var data = {
                        idEvenement: ID_EVENEMENT,
                        reponseVisiteur:$scope.reponseVisiteur }
                    $http.patch('/addReponse', JSON.stringify(data)).then(function (response) {
                        if (response.data)
                            $scope.msg = "patch Data Submitted Successfully!";

                    }, function (response) {
                        $scope.msg = "Service not Exists";
                    });
                    $scope.message = "Votre réponse a bien été prise en compte, merci :) ";
                }
                  
                   
                    
                }],
                templateUrl: 'template/afficherEvenement.html'  
            })
            
        .component("evenements", {
        controller:["$scope","$http","$state", function($scope,$http,$state) { 
                    
                   $http({method: 'GET', url:'/events'}).then(function(data, status, headers, config) {
                    $scope.events = new Array();
                    for (var i = 0; i< data.data.length;i++){
                        
                        var a = data.data[i];
                        //var a = "<a ng-click=\"ouvrirEvenement("+d.id+")\">  "+d.id+" "+d.nom+"</a>";
                        $scope.events.push(a);
                    }
                   
                    });
                    
                    this.ouvrirEvenement = function(id){
                        ID_EVENEMENT = id;
                        $state.go("afficherEvenement"
                        //,{param1: id}
                                );
                    };
                    
                    
                }],
                templateUrl: 'template/listeEvenements.html'  
            })
        .config(["$stateProvider", "$urlServiceProvider", function ($stateProvider, $urlServiceProvider) {
               $urlServiceProvider.rules.otherwise({state: 'evenements'});

                $stateProvider.state('evenements', {
                    url: '/evenements',
                    component : 'evenements',
                   /* params: {
                        param1: null
                    }*/
                });
               $stateProvider.state('afficherEvenement', {
                    url: '/afficheEvenement',
                    component : 'afficherEvenement'
                });
            }]);