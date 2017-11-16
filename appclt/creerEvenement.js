
var app = angular.module('app', [])
        .controller('Create', ['$scope',
            function ($scope) {


                $scope.createEvent = function() {
                    $scope.nomEvenmt="";
                    $scope.description="";
                    console.log("Hey");
                }

            }]);

