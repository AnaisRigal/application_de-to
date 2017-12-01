/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
angular.module("app", ['ui.router'])

        .service('MonService',["$rootScope", function ($rootScope) {
                var ID_EVENEMENT ;
              //  var utilisateur = null;
             //    $rootScope.$broadcast("LOAD_MEMORY", utilisateur);
                function EvenementSimple(id,nom) {
                    this.id = id;
                    this.nom = nom;
                  }
                  console.log("slt");
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
        }])
    // Constructeur pour les événements simplifiés
    
    .component("afficherEvenement", {
        controller:["$scope","$http","$state","$stateParams", function($scope,$http,$state,$stateParams) { 
             /*   if(utilisateur === undefined){
                      $scope.messageConnection = "se connecter";
                  }else{
                      $scope.messageConnection = "se déconnecter";
                  }
                */
                //$scope.id=   $stateParams.param1;
                 $scope.message ="";
                  $scope.id = ID_EVENEMENT;
                   // console.log( $scope.id);
                  
                   var data = {id:$scope.id};
                   $http.get('/getEvent', {params:data}).then(function (response) {
                    if (response.data){
                        var d = response.data;
                        console.log(d);
                       // $scope.event = new Evenement(d.id,d.nom,d.description,d.idCreateur,d.creneaux,d.responses,d.creneauFinal);
                        
                        $scope.nom =d.nom ;
                        $scope.description = d.description;
                        $scope.idCreateur = d.idCreateur;
                        if (d.creneauFinal== null){
                             $scope.creneauFinal = "Aucun pour l'instant";
                        }else{
                            $scope.creneauFinal = d.creneauFinal.dateHeure;
                        }
                        
                        $scope.creneaux = d.creneaux;
                        $scope.reponses = d.reponses;
                        
                        if ($scope.creneauFinal == "Aucun pour l'instant"){
                            var quand = new Array();
                            for (c in $scope.creneaux){
                                var i = parseInt($scope.creneaux[c].idCreneau,10);
                                quand.push({idCreneau: i, dispo:"false"});
                            }
                            $scope.reponseVisiteur={idPers:"Visiteur",quand};
                            document.getElementById("nomVisiteur").type = "text";
                         }else{
                              document.getElementById("buttonCloturer").style.visibility = 'hidden';
                              document.getElementById("buttonEnvoi").style.visibility = 'hidden';
                              
                         }
                     }
                         
                    }, function (response) {
                        $scope.msg = response;
                        console.log(response);
                    });
                    
                $scope.changeValue = function(id){
                    console.log(id);
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
                    $scope.messageConnection = "se déconnecter";
                //    utilisateur = $scope.nomVisiteur;
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
                 $scope.gocloturer = function()
                    {
                        if ($scope.creneauFinal == "Aucun pour l'instant"){
                        $state.go("cloturer");
                        
                        }else{
                            $scope.message = "Non, on ne cloture pas un event cloturé !!!"
                        }
                    }
                   $scope.goToPageMesEvenement = function()
                    {
                        $state.go("evenement");
                    }
                   $scope.goToPageCreerEvenement = function()
                    {
                        $state.go("creerEvenement");
                    }
                    
                }],
                templateUrl: 'template/afficherEvenement.html'  
            })
         .component("cloturer", {
        controller:["$scope","$http","$state","$stateParams", function($scope,$http,$state,$stateParams) { 
                $scope.idSelection;
                 $scope.message ="";
                  $scope.id = ID_EVENEMENT;
                  
                   var data = {id:$scope.id};
                   $http.get('/getEvent', {params:data}).then(function (response) {
                    if (response.data){
                        var d = response.data;
                        
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
                        
                        $scope.nbPresent = new Array();
                        var idCreneauxMax = 0;
                        var max =0;
                        for (i_c in d.creneaux){
                            var c = d.creneaux[i_c];
                            var n = 0;
                            for (i_r in d.reponses){
                                var r = d.reponses[i_r];
                                for ( i_q in r.quand){
                                    var q =  r.quand[i_q];
                                    if (c.idCreneau === q.idCreneau){
                                        if(q.dispo==="true"){
                                           n+=1; 
                                        }
                                    }
                                }
                            }
                            
                            $scope.nbPresent.push(n);
                            if (n>max){
                                max = n;
                                idCreneauxMax = c.idCreneau;
                                $scope.dateHeureSelect = c.dateHeure;
                            }
                          //  console.log($scope.nbPresent);
                            
                        }
                        $scope.message = "Le créneaux où nous avons le plus de participant est le "+idCreneauxMax+" avec "+max+" participations";
                            $scope.idSelection = idCreneauxMax;
                            $scope.messageSelection = "Créneau sélectionné "+$scope.dateHeureSelect;
                        console.log($scope.nbPresent);
                         }
                         
                    }, function (response) {
                        $scope.msg = response;
                        console.log(response);
                    });
                    
               $scope.selectionner = function(id){
                   $scope.idSelection = id;
                   var creneauxMax;
                   for (i_c in  $scope.creneaux){
                            var c =  $scope.creneaux[i_c];
                            if (c.idCreneau === id){
                                $scope.dateHeureSelect = c.dateHeure
                            }
                        }
                    $scope.messageSelection = "Créneau sélectionné "+$scope.dateHeureSelect;
                }
                
                $scope.cloturer = function(){
                    var data = {
                        idCreneau:  $scope.idSelection,
                        dateHeure : $scope.dateHeureSelect,
                        idEvenement : ID_EVENEMENT};
                     $http.patch('/addCreneauxFinal', JSON.stringify(data)).then(function (response) {
                        if (response.data){
                            console.log("ajout créneau final réussi")
                        }

                    }, function (response) {
                        console.log(response);
                    });
                    $scope.message = "Votre réponse a bien été prise en compte, merci :) ";
                }
                   $scope.goToPageMesEvenement = function()
                    {
                        $state.go("evenement");
                    }
                   $scope.goToPageCreerEvenement = function()
                    {
                        $state.go("creerEvenement");
                    }
                    
                }],
                templateUrl: 'template/cloturer.html'  
            })   
        .component("evenements", {
        controller:["$scope","$http","$state", function($scope,$http,$state) { 
             /*     if(utilisateur === null){
                      $scope.messageConnection = "se connecter";
                  }else{
                      $scope.messageConnection = "se déconnecter";
                  }*/
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
                   
                    $scope.goToPageMesEvenement = function()
                    {
                        $state.go("evenement");
                    }
                    $scope.goToPageCreerEvenement = function()
                    {
                        $state.go("creerEvenement");
                    }
                    
                }],
                templateUrl: 'template/listeEvenements.html'  
            })
        .component("creerEvenement", {
        controller:["$scope","$http","$state", function($scope,$http,$state) { 
                   $scope.goToPageMesEvenement = function()
                    {
                        $state.go("evenement");
                    }
                    $scope.goToPageCreerEvenement = function()
                    {
                        $state.go("creerEvenement");
                    }
                }],
                templateUrl: 'template/creerEvenement.html'  
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
                
                $stateProvider.state('creerEvenement', {
                    url: '/creerEvenement',
                    component : 'creerEvenement'
                });
                $stateProvider.state('cloturer', {
                    url: '/cloturer',
                    component : 'cloturer'
                });
            }]);