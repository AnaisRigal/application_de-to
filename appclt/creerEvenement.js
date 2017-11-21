
var app = angular.module('app', [])
    app.controller('Create', function ($scope, $http) {
        $scope.nomEvenmt = null;
        $scope.description = null;
        $scope.msg = null;
        $scope.createEvent = function (nomEvenmt,description) {
            var data = {
                nomEvenmt: $scope.nomEvenmt,
                description: $scope.description
            };
            console.log(data);
            $http.post('/createEvent', JSON.stringify(data)).then(function (response) {
                if (response.data)
                    $scope.msg = "Post Data Submitted Successfully!";
                    
            }, function (response) {
                $scope.msg = "Service not Exists";
            });
            
            document.getElementById("nomEvenmt").disabled = true
                    document.getElementById("description").disabled = true
                    document.getElementById("btnCreer").disabled = true
                    document.getElementById("nomCrenaux").disabled = false
                    document.getElementById("descCrenaux").disabled = false
                    document.getElementById("addCrenaux").disabled = false
        };
    });


