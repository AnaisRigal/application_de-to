/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var app = angular.module("app", [])
        .service('MonService', function () {

        })
// Constructeur pour les événements simplifiés

        .controller("MonCtrl", function($scope,$http) { 
                   $http({method: 'GET', url:'/events'}).then(function(data, status, headers, config) {
                    $scope.events = new Array();
                    for (var i = 0; i< data.data.length;i++){
                        console.log(data.data[i]);
                        var d = data.data[i];
                        var a = d.id+".  "+d.nom;
                        $scope.events.push(a);
                    }
                    console.log(data);
                    });
            
                });