// Erstellt ein Modul mit Services (Factories) und einem zugeh�rigen Controller.
// F�r das Routing (config) muss die 'ngRoute'-Dependency gealden werden.
angular.module('dashboard', ['ngRoute']) 
//Erstelle den Service um auf die Kunden-API zuzugreifen. 
//Dazu mus die HTTP-Dependecy injected werden.
.factory('kundenService', ['$http', function($http){
	//Funktion, um bestehende Kunden �ber die API abzufragen.
	function getKunden(){
		return $http.get('api/kunden/')
		.catch(err=>console.log(err.toString()));
	}
	
	//Funktion, um neunen Kunden an die API zu senden.
	function saveKunde(kunde){
		return $http.post('api/kunden/', kunde)		
		.catch(err=>console.log(err.toString()));
	}

	// Der Service muss die definierten Funktionen f�r den Controller bereit stellen.
	return {getKunden, saveKunde};
}])
//Erstelle den Service um auf die Produkt-API zuzugreifen. 
//Dazu mus die HTTP-Dependecy injected werden.
.factory('produkteService', ['$http', function($http){
	//Funktion, um bestehende Produkte �ber die API abzufragen.
	function getProdukte(){
		return $http.get('api/produkte/')
		.catch(err=>console.log(err.toString()));
	}
	
	//Funktion, um bestehendes Produkt �ber die API upzudaten.
	function updateProdukt(produkt){
		return $http.put('api/produkte/'+produkt._id, produkt)		
		.catch(err=>console.log(err.toString()));
	}
	
	// Der Service muss die definierten Funktionen f�r den Controller bereit stellen.
	return {getProdukte, updateProdukt};
}])
//Erstelle den Service um auf die externe Jokes-API zuzugreifen. Dazu mus die HTTP-Dependecy injected werden.
.factory('witzeService', ['$http', function($http){
	function getWitz(){
		return $http.get('https://sv443.net/jokeapi/v2/joke/Programming?lang=de&blacklistFlags=nsfw,religious,political,racist,sexist&format=txt')		
		.catch(err=>console.log(err.toString()));
	};
	return {getWitz};
}])
// Erstelle den Controller f�r die Dashboar-App. Hier muss der Scope injected werden und alle Services, die verwendet werden sollen.
.controller('dashboardController', ['$scope', 'kundenService', 'produkteService', 'witzeService', function($scope, kundenService, produkteService, witzeService){
	console.log('Dashboard Controller is running');
	// Kunden werden asynchron abgefragt.
	kundenService.getKunden().then(res=>$scope.kunden = res.data);
	// Produkte werden asynchron abgefragt.
	produkteService.getProdukte().then(res=>$scope.produkte = res.data);
	
	// Wird mit Daten gef�llt, wenn die Anfrage bearbeitet wurde.
	$scope.kunden = [];
	$scope.produkte = [];
	
	// Funktion, um einen �ber das Formular eingetragenen Kunden zu erstellen.
	function erstelleKunde(kunde){
		// Input-Felder zur�cksetzen.
		$scope.kunde={};
		// Daten an Service weiterleiten.
		kundenService.saveKunde(kunde).then(
			// Aktualisiere den Scope, um die aktuellen Daten anzuzeigen.
			kundenService.getKunden().then(res=>$scope.kunden = res.data)
		);
	}
	// Die Funtion muss f�r den scope verf�gbar gemacht werden.
	$scope.erstelleKunde = (kunde) => erstelleKunde(kunde);
	
	// ClickListner f�r den '-'-Button.
	function reduziereBestand(produkteService, produkt){
		produkt.bestand = produkt.bestand - 1;
		produkteService.updateProdukt(produkt);
	}
	// Die Funtion muss f�r den scope verf�gbar gemacht werden.
	$scope.reduziereBestand = (produkt) => reduziereBestand(produkteService, produkt); 
	
	// ClickListner f�r den '+'-Button.
	function erhoeheBestand(produkteService, produkt){
		produkt.bestand = produkt.bestand + 1;
		produkteService.updateProdukt(produkt);
	}
	// Die Funtion muss f�r den scope verf�gbar gemacht werden.
	$scope.erhoeheBestand = (produkt) => erhoeheBestand(produkteService, produkt); 
	
	// Erzeuge einen Witz.
	witzeService.getWitz().then(res=>$scope.witz = res.data);
	//Lege den Witz in den scope.
	$scope.witz = 'haha';
}])
// Hier werden die Routes angelegt, die vom Nutzer angesteuert werden k�nnen sollen.
// Die hinterlegten Templates werden in '<div ng-view></div>' der index.html angezeigt.
// Bei gr��erne Projekten sollten zu den einzelnen Kompotenten auch (jeweils) eigene Modules angelegt werden, 
// damit nur die f�r die Anzeige ben�tigten Daten geladen werden.
.config(function($routeProvider){
	$routeProvider
	.when('/login', {
		templateUrl: 'components/login.component.html'
	})
	.when('/registration', {
		templateUrl: 'components/registration.component.html'
	})
	.when('/request', {
		templateUrl: 'components/request.component.html'
	})
		.when('/room-overview', {
			templateUrl: 'components/room-overview.component.html'
		})
		.when('/room-modify', {
			templateUrl: 'components/room-modify.component.html'
		})
		.when('/room-add', {
			templateUrl: 'components/room-add.component.html'
		})
		.when('/offer-create', {
			templateUrl: 'components/offer-create.component.html'
		})
		.when('/profile', {
			templateUrl: 'components/profile.component.html'
		})
	.otherwise({
		redirectTo: '/login'
	});
});

