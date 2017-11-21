/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
angular.module("app", ['ui.router'])

        .service('MonService', function () {
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
                var id=   $stateParams.params1;
                  
                    console.log(id);
                    
                   
                    
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
                    
                    this.ouvrirEvenement = function(event){
                        console.log(event);
                        $state.go("afficherEvenement",{param1: event});
                    };
                    
                    
                }],
                templateUrl: 'listeEvenements.html'  
            })
        .config(["$stateProvider", "$urlServiceProvider", function ($stateProvider, $urlServiceProvider) {
               $urlServiceProvider.rules.otherwise({state: 'evenements'});

                $stateProvider.state('evenements', {
                    url: '/evenements',
                    component : 'evenements'
                });
               $stateProvider.state('afficherEvenement', {
                    url: '/afficheEvenement',
                    component : 'afficherEvenement'
                });
            }]);