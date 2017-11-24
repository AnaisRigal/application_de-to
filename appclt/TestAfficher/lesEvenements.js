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
                  $scope.id = ID_EVENEMENT;
                   // console.log( $scope.id);
                   
                   var data = {id:$scope.id};
                   $http.get('/getEvent', {params:data}).then(function (response) {
                    if (response.data){
                        var d = response.data;
                        
                       // $scope.event = new Evenement(d.id,d.nom,d.description,d.idCreateur,d.creneaux,d.responses,d.creneauFinal);
                        
                        $scope.nom =d.nom ;
                        $scope.description = d.description;
                        $scope.idCreateur = d.idCreateur;
                        if (d.creneauFinal== null){
                             $scope.creneauFinal = "Aucun pour l'instant"
                        }else{
                            $scope.creneauFinal = d.creneauFinal;
                        }
                        console.log(d.creneaux);
                        $scope.creneaux = d.creneaux;
                        console.log(d);
                        $scope.reponses = d.reponses;
                         }
                    }, function (response) {
                        $scope.msg = response;
                    });
                    
                $scope.changeValue = function(id){
                    console.log(id);
                        
                }
                    
                }],
                templateUrl: 'afficherEvenement.html'  
            })
            
        .component("evenements", {
        controller:["$scope","$http","$state", function($scope,$http,$state) { 
                    
                   $http({method: 'GET', url:'/events'}).then(function(data, status, headers, config) {
                    $scope.events = new Array();
                    for (var i = 0; i< data.data.length;i++){
                        console.log(data.data[i]);
                        var a = data.data[i];
                        //var a = "<a ng-click=\"ouvrirEvenement("+d.id+")\">  "+d.id+" "+d.nom+"</a>";
                        $scope.events.push(a);
                    }
                    console.log(data);
                    });
                    
                    this.ouvrirEvenement = function(id){
                        ID_EVENEMENT = id;
                        $state.go("afficherEvenement"
                        //,{param1: id}
                                );
                    };
                    
                    
                }],
                templateUrl: 'listeEvenements.html'  
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