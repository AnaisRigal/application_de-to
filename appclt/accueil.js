/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var app = angular.module("app", [])
        .service('MonService', function () {

        })

        .controller("MonCtrl", function($scope,$http) { 
            
                $scope.listeEvenements = function(){
                    $http({method: 'GET', url:'/events'}).then(function(data, status, headers, config) {
                    // code si réussite
                    console.log(data);
                    });
                    
                }
            
                });