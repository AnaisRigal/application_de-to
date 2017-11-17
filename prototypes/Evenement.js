var listeEvenements = {};

// Constructeur pour les événements simplifiés
function EvenementSimple(id,nom) {
  // l'id de l'evenement
  this.id = id;
  //le nom de l'evenement
  this.nom = nom;
}

//Constructeur pour les créneaux
function Creneau(idCreneau,dateHeure){
	//l'id du creneau
	this.idCreneau = idCreneau;
	//date et heure composant le créneau
	this.dateHeure = new Date(dateHeure);
}

//Constructeur pour les créneaux
function Reponse(idPers,idCreneau,dispo){
	//l'id de la personne
	this.idPers = idPers;
	//l'id du creneau
	this.idCreneau = idCreneau;
	//la reponse
	this.dispo=dispo;
}

// Constructeur pour les événements
//id,nom,description,idCreateur,creneauFinal(idCreneau,dateHeure),creneaux(idCreneau, dateHeure),listeReponses(idPers,idCreneau,dispo)

function Evenement(id,nom,description,idCreateur,dateCreneau) {
  // l'id de l'evenement
  this.id = id;
  //le nom de l'evenement
  this.nom = nom;
  //la description de l'evenement
  this.description = description;
  //l'id du createur de l'evenement
  this.idCreateur = idCreateur;
  //le creneau final choisi
  this.creneauFinal = null;
  //liste de creneaux
  creneaux = new Creneau(1,dateCreneau);
	this.listeCreneaux = new Array();
	listeCreneaux.push(creneaux);
 
 
  //les réponses pour l'événement
  this.listeReponses = new Array();
  //pour garder en mémoire l'id des créneaux
  this.lastIdCreneau = 0;
  //fonctionst 
  this.ajouterCreneau =function(dateHeure){
      creneau = new Creneau((this.lastIdCreneau+1),dateHeure);
	  this.lastIdCreneau = this.lastIdCreneau+1;
      this.listeCreneaux.push(creneau);
  }
  this.ajouterReponse =function(idPers, idCreneaux, dispo){
      reponse = new Reponse(idPers, idCreneaux, dispo);
      this.listeReponses.push(reponse);
  }
}

//créer un nouvel événement
var creerEvenement = function(id,nom,description,idCreateur,creneauFinal,dateCreneau){
	if(typeof listeEvenements[id]==='undefined'){
		//création
		listeEvenements[id] = new Evenement(id,nom,description,idCreateur,creneauFinal,dateCreneau,idPers,idCreneau,dispo);
		return 1;
	}
	return 0;
}

var ajouterCreneau = function(id, dateHeure){
	if(typeof listeEvenements[id]==='undefined'){
		return 0;
	}
	listeEvenements[id].ajouterCreneau(dateHeure);
	return 1;
}

exports.creerEvenement = creerEvenement;
exports.ajouterCreneau = ajouterCreneau;