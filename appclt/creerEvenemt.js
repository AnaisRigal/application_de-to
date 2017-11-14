var app = angular.module("app", [])
        .service('MonService', function () {
            
        })

app.controller("Create", 'MonService' , function($scope, MonService){
	
	$scope.createEvent = function() {
            $scope.nomEvenmt="";
            $scope.description="";
	}
	
});
