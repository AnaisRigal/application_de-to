/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
angular.module("app", ['ui.router'])

        .service('MonService', ["$rootScope", function ($rootScope) {
                var ID_EVENEMENT;
                // var etat_connexion = "se déconnecter";
                //var utilisateur = "null";
                //    $rootScope.$broadcast("LOAD_MEMORY", utilisateur);
                function EvenementSimple(id, nom) {
                    this.id = id;
                    this.nom = nom;
                }
                console.log("slt");
                EvenementSimple.prototype.print = function () {
                    return this.id + ' ' + this.nom;
                };

                function Evenement(id, nom, description, idCreateur, creneaux, reponses, creneauxFinal) {
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
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        .component("afficherEvenement", {
            controller: ["$scope", "$http", "$state", "$stateParams", function ($scope, $http, $state, $stateParams) {
                    $scope.message = "";
                    $scope.id = ID_EVENEMENT;

                    var data = {id: $scope.id};
                    $http.get('/getEvent', {params: data}).then(function (response) {
                        if (response.data) {
                            var d = response.data;

                            $scope.nom = d.nom;
                            $scope.description = d.description;
                            $scope.idCreateur = d.idCreateur;
                            if (d.creneauFinal == null) {
                                $scope.creneauFinal = "Aucun pour l'instant";
                            } else {
                                $scope.creneauFinal = d.creneauFinal.dateHeure;
                            }

                            $scope.creneaux = d.creneaux;
                            $scope.reponses = d.reponses;

                            if ($scope.creneauFinal == "Aucun pour l'instant") {
                                var quand = new Array();
                                for (c in $scope.creneaux) {
                                    var i = parseInt($scope.creneaux[c].idCreneau, 10);
                                    quand.push({idCreneau: i, dispo: "false"});
                                }
                                $scope.reponseVisiteur = {idPers: "Visiteur", quand};
                                document.getElementById("nomVisiteur").type = "text";
                            } else {
                                document.getElementById("buttonCloturer").style.visibility = 'hidden';
                                document.getElementById("buttonEnvoi").style.visibility = 'hidden';

                            }
                        }

                    }, function (response) {
                        $scope.msg = response;
                        console.log(response);
                    });
                    
                    
                    $scope.changeValue = function (id) {
                        console.log(id);
                        for (qd in $scope.reponseVisiteur.quand) {
                            q = $scope.reponseVisiteur.quand[qd];
                            if (q.idCreneau == id) {
                                if (q.dispo == "false")
                                    q.dispo = "true";
                                else
                                    q.dispo = "false";
                            }
                        }
                    }

                    $scope.soumettre = function () {
                         $scope.reponseVisiteur.idPers = document.getElementById("nomVisiteur").value;
                        $scope.messageConnection = "se déconnecter";
                        var data = {
                            idEvenement: ID_EVENEMENT,
                            reponseVisiteur: $scope.reponseVisiteur}
                        $http.patch('/addReponse', JSON.stringify(data)).then(function (response) {
                            if (response.data)
                                $scope.msg = "patch Data Submitted Successfully!";

                        }, function (response) {
                            $scope.msg = "Service not Exists";
                        });

                        $scope.message = "Votre réponse a bien été prise en compte, merci :) ";
                    }
                    $scope.gocloturer = function ()
                    {
                        if ($scope.creneauFinal == "Aucun pour l'instant") {
                            $state.go("cloturer");

                        } else {
                            $scope.message = "Non, on ne cloture pas un event cloturé !!!"
                        }
                    }
                    
                    if (document.cookie == "") {
                        $scope.messageConnection = "se connecter";
                    } else {
                        document.getElementById("nomVisiteur").value = document.cookie;
                        document.getElementById("nomVisiteur").disabled = true;
                        $scope.messageConnection = "se déconnecter";
                        if (document.cookie!=$scope.idCreateur)
                            document.getElementById("buttonCloturer").disabled = true;
                        
                    }
                    
                    $scope.goToPageMesEvenement = function ()
                    {
                        $state.go("mesEvenements");
                    }
                    $scope.goToPageCreerEvenement = function ()
                    {
                         if (document.cookie == "") {
                             $state.go("connexion");
                         } else {
                             $state.go("creerEvenement");
                         }
                    }

                }],
            templateUrl: 'template/afficherEvenement.html'
        })
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        .component("cloturer", {
            controller: ["$scope", "$http", "$state", "$stateParams", function ($scope, $http, $state, $stateParams) {
                    $scope.idSelection;
                    $scope.message = "";
                    $scope.id = ID_EVENEMENT;
                    
                    var data = {id: $scope.id};
                    $http.get('/getEvent', {params: data}).then(function (response) {
                        if (response.data) {
                            var d = response.data;

                            $scope.nom = d.nom;
                            $scope.description = d.description;
                            $scope.idCreateur = d.idCreateur;
                            if (d.creneauFinal == null) {
                                $scope.creneauFinal = "Aucun pour l'instant"
                            } else {
                                $scope.creneauFinal = d.creneauFinal;
                            }

                            $scope.creneaux = d.creneaux;
                            $scope.reponses = d.reponses;

                            $scope.nbPresent = new Array();
                            var idCreneauxMax = 0;
                            var max = 0;
                            for (i_c in d.creneaux) {
                                var c = d.creneaux[i_c];
                                var n = 0;
                                for (i_r in d.reponses) {
                                    var r = d.reponses[i_r];
                                    for (i_q in r.quand) {
                                        var q = r.quand[i_q];
                                        if (c.idCreneau === q.idCreneau) {
                                            if (q.dispo === "true") {
                                                n += 1;
                                            }
                                        }
                                    }
                                }

                                $scope.nbPresent.push(n);
                                if (n > max) {
                                    max = n;
                                    idCreneauxMax = c.idCreneau;
                                    $scope.dateHeureSelect = c.dateHeure;
                                }
                                //  console.log($scope.nbPresent);

                            }
                            $scope.message = "Le créneaux où nous avons le plus de participant est le " + idCreneauxMax + " avec " + max + " participations";
                            $scope.idSelection = idCreneauxMax;
                            $scope.messageSelection = "Créneau sélectionné " + $scope.dateHeureSelect;
                            console.log($scope.nbPresent);
                        }

                    }, function (response) {
                        $scope.msg = response;
                        console.log(response);
                    });

                    $scope.selectionner = function (id) {
                        $scope.idSelection = id;
                        var creneauxMax;
                        for (i_c in  $scope.creneaux) {
                            var c = $scope.creneaux[i_c];
                            if (c.idCreneau === id) {
                                $scope.dateHeureSelect = c.dateHeure
                            }
                        }
                        $scope.messageSelection = "Créneau sélectionné " + $scope.dateHeureSelect;
                    }

                    $scope.cloturer = function () {
                        var data = {
                            idCreneau: $scope.idSelection,
                            dateHeure: $scope.dateHeureSelect,
                            idEvenement: ID_EVENEMENT};
                        $http.patch('/addCreneauxFinal', JSON.stringify(data)).then(function (response) {
                            if (response.data) {
                                console.log("ajout créneau final réussi")
                            }

                        }, function (response) {
                            console.log(response);
                        });
                        $scope.message = "Votre réponse a bien été prise en compte, merci :) ";
                    }
                    $scope.messageConnection = "se déconnecter";
                    $scope.goToPageMesEvenement = function ()
                    {
                        $state.go("mesEvenements");
                    }
                    $scope.goToPageCreerEvenement = function ()
                    {
                        if (document.cookie == "") {
                             $state.go("connexion");
                         } else {
                             $state.go("creerEvenement");
                         }
                    }

                }],
            templateUrl: 'template/cloturer.html'
        })
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        .component("evenements", {
            controller: ["$scope", "$http", "$state", function ($scope, $http, $state) {

                    $http({method: 'GET', url: '/events'}).then(function (data, status, headers, config) {
                        $scope.events = new Array();
                        for (var i = 0; i < data.data.length; i++) {

                            var a = data.data[i];
                            //var a = "<a ng-click=\"ouvrirEvenement("+d.id+")\">  "+d.id+" "+d.nom+"</a>";
                            $scope.events.push(a);
                        }

                    });
                    // $scope.messageConnection = etat_connexion;
                    this.ouvrirEvenement = function (id) {
                        ID_EVENEMENT = id;
                        $state.go("afficherEvenement"
                                //,{param1: id}
                                );
                    };
                    $scope.connexion = function ()
                    {
                        if (document.cookie != "") {
                            document.cookie = "";
                            $scope.messageConnection = "se connecter";
                        } else {
                            $state.go("connexion");
                        }
                    }

                    if (document.cookie == "") {
                        $scope.messageConnection = "se connecter";
                    } else {
                        $scope.messageConnection = "se déconnecter";
                    }
                    $scope.goToPageMesEvenement = function ()
                    {
                        $state.go("mesEvenements");
                    }
                    $scope.goToPageCreerEvenement = function ()
                    {
                        if (document.cookie == "") {
                             $state.go("connexion");
                         } else {
                             $state.go("creerEvenement");
                         }
                    }

                }],
            templateUrl: 'template/listeEvenements.html'
        })
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        .component("creerEvenement", {
            controller: ["$scope", "$http", "$state", function ($scope, $http, $state) {
                    
                    $scope.nomEvenmt = null;
                    $scope.description = null;
                    $scope.msg = null;
                    $scope.creneaux = [];
                    var compteurC = 0;

                    // Créer un évènement 
                    $scope.createEvent = function (nomEvenmt, description) {
                        var data = {
                            nomEvenmt: $scope.nomEvenmt,
                            description: $scope.description,
                            idCreateur : document.cookie
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
                            idCreneau: compteurC,
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
                        $scope.heureDebut = "";
                    };
                    if (document.cookie == "") {
                        $scope.messageConnection = "se connecter";
                    } else {
                        $scope.messageConnection = "se déconnecter";
                    }
                    $scope.goToPageMesEvenement = function ()
                    {
                        $state.go("mesEvenements");
                    }
                    $scope.goToPageCreerEvenement = function ()
                    {
                        if (document.cookie == "") {
                             $state.go("connexion");
                         } else {
                             $state.go("creerEvenement");
                         }
                    }
                }],
            templateUrl: 'template/creerEvenement.html'
        })
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        .component("connexion", {
            controller: ["$scope", "$http", "$state", function ($scope, $http, $state) {

                    $scope.entrez = function ()
                    {
                        document.cookie = $scope.prenom;
                        console.log($scope.prenom + " est connecté ! ");
                        $state.go("evenements");
                    }


                    $scope.goToPageMesEvenement = function ()
                    {
                        $state.go("mesEvenements");
                    }
                    $scope.goToPageCreerEvenement = function ()
                    {
                        if (document.cookie == "") {
                             $state.go("connexion");
                         } else {
                             $state.go("creerEvenement");
                         }
                    }
                }],
            templateUrl: 'template/connexion.html'
        })
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        .component("mesEvenements", {
            controller: ["$scope", "$http", "$state", function ($scope, $http, $state) {

                    if (document.cookie != "") {
                        var data = {idPers: document.cookie};
                         $scope.messageConnection = "se déconnecter";
                        $http.get('/eventsCrees', {params: data}).then(function (response) {
                            if (response.data) {
                                var d = response.data;
                                $scope.eventsCreer = new Array();
                                for (var i = 0; i < d.length; i++) {
                                    var a = d[i];
                                    $scope.eventsCreer.push(a);
                                }
                            }
                        }, function (response) {
                            console.log(response);
                        });
                        
                         $http.get('/eventsParticipes', {params: data}).then(function (response) {
                            if (response.data) {
                                var d = response.data;
                                $scope.eventsParticiper = new Array();
                                for (var i = 0; i < d.length; i++) {
                                    var a = d[i];
                                    $scope.eventsParticiper.push(a);
                                }
                            }
                        }, function (response) {
                            console.log(response);
                        });
                    } else {
                        $state.go("connexion");
                    }
                    
                    this.ouvrirEvenement = function (id) {
                        ID_EVENEMENT = id;
                        $state.go("afficherEvenement"
                                //,{param1: id}
                                );
                    };


                    $scope.goToPageMesEvenement = function ()
                    {
                        $state.go("mesEvenements");
                    }
                    $scope.goToPageCreerEvenement = function ()
                    {
                       if (document.cookie == "") {
                             $state.go("connexion");
                         } else {
                             $state.go("creerEvenement");
                         }
                    }
                }],
            templateUrl: 'template/mesEvenements.html'
        })

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        .config(["$stateProvider", "$urlServiceProvider", function ($stateProvider, $urlServiceProvider) {
                $urlServiceProvider.rules.otherwise({state: 'evenements'});

                $stateProvider.state('evenements', {
                    url: '/evenements',
                    component: 'evenements',
                    /* params: {
                     param1: null
                     }*/
                });
                $stateProvider.state('afficherEvenement', {
                    url: '/afficheEvenement',
                    component: 'afficherEvenement'
                });

                $stateProvider.state('creerEvenement', {
                    url: '/creerEvenement',
                    component: 'creerEvenement'
                });
                $stateProvider.state('cloturer', {
                    url: '/cloturer',
                    component: 'cloturer'
                });

                $stateProvider.state('connexion', {
                    url: '/connexion',
                    component: 'connexion'
                });

                $stateProvider.state('mesEvenements', {
                    url: '/mesEvenements',
                    component: 'mesEvenements'
                });
            }]);