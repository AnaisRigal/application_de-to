
var app = angular.module('app', [])
app.controller('Create', function ($scope, $http) {
    $scope.nomEvenmt = null;
    $scope.description = null;
    $scope.msg = null;
    $scope.creneaux = []; 
    var compteurC = 0;

    // Créer un évènement 
    $scope.createEvent = function (nomEvenmt, description) {
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
        // Affichage de la page  
        document.getElementById("nomEvenmt").disabled = true
        document.getElementById("description").disabled = true
        document.getElementById("btnCreer").disabled = true
        document.getElementById("dateCrenau").disabled = false
        document.getElementById("heureDebut").disabled = false
        document.getElementById("btnAddCrenaux").disabled = false
    };

    // Créer un créneau (on passe le nom de l'événement en paramètres pour le mettre à jour 
    $scope.addCreneau = function (dateHeure) {
        compteurC = compteurC + 1;
        var data = {
            nomEvenmt: $scope.nomEvenmt,
            idCreneau : compteurC, 
            dateHeure: "Date : " + $scope.dateCreneau + ", heure : " + $scope.heureDebut
                    //ISODate("1999-11-10T00:00:00Z").getHours();
        };
        console.log(data);
        $http.patch('/patchEventAddCreneau', JSON.stringify(data)).then(function (response) {
            if (response.data)
                $scope.msg = "patch Data Submitted Successfully!";

        }, function (response) {
            $scope.msg = "Service not Exists";
        });
        $scope.creneaux.push("Date : " + $scope.dateCreneau + ", heure : " + $scope.heureDebut);
         $scope.dateCreneau = "";
         $scope.heureDebut = "" ;
    };
});


