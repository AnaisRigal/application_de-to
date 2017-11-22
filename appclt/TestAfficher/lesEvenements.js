/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
angular.module("app", ['ui.router'])
    
        .service('MonService', function () {
                var ID ;
                function EvenementSimple(id,nom) {
                    this.id = id;
                    this.nom = nom;
                  }
                EvenementSimple.prototype.print = function () {
                    return this.id + ' ' + this.nom;
                };
        })
    // Constructeur pour les événements simplifiés
    .component("afficherEvenement", {
        controller:["$scope","$http","$state","$stateParams", function($scope,$http,$state,$stateParams) { 
                //$scope.id=   $stateParams.param1;
                  $scope.id = ID;
                   // console.log( $scope.id);
                   var data = {id:$scope.id};
                   $http.get('/getEvent', {params:data}).then(function (response) {
                    if (response.data)
                        $scope.msg = "Post Data Submitted Successfully!";

                    }, function (response) {
                        $scope.msg = response;
                    });

                    
                        
                    
                    
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
                        ID = id;
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