angular.module('app.services', ['ionic.utils'])

.factory('DownloadAll', function($http, $localstorage, $q){

	var theFactory = {};
  var loadInfractions = [];
  var holdInfractions = [];
  
  //connects to server. downloads all necessary database info needed and is stored locally
	theFactory.download = function() {
		return $http({
     		 method: 'GET',
      		 url: "http://cercapr.cloudapp.net/PHP/test6.php"
      		}).success(function(data){
      			theFactory.vehicles = data.vehicles;
      			theFactory.users = data.users;
            theFactory.zones = data.zones;
      			var vehicles = theFactory.vehicles;
      			var users = theFactory.users;
      			var zones = theFactory.zones
      			$localstorage.setObject('vehicles', {vehicles});            
      			$localstorage.setObject('users', {users});
            $localstorage.setObject('zones', {zones});   
      		});
	}
//restores all infractions that have been not been upploaded into the server
  theFactory.dailyInfractions = function(){
      var infractions = $localstorage.getObject('Infractions')
      for(var i=0; i < infractions.loadInfractions.length; i++)
      {
             loadInfractions.push(infractions.loadInfractions[i]);
      }
      console.log("Todays infractions loaded from memory")
  }
//adds a new infraction into our local database to await to be uploaded
  theFactory.addInfraction = function(infraction){

    console.log("Service recived the following infraction: ", infraction);
    loadInfractions.push(infraction);
    console.log("pushing infraction: ", loadInfractions);
    console.log("Total infractions :", loadInfractions.length);
    $localstorage.setObject('Infractions',{loadInfractions});

  }

   theFactory.addEditedInfraction = function(infraction){
    
    console.log("Service recived the following infraction: ", infraction);
    loadInfractions.push(infraction);
    console.log("pushing infraction: ", loadInfractions);
    console.log("Total infractions :", loadInfractions.length);
    $localstorage.setObject('Infractions',{loadInfractions});

  }
  theFactory.clearInfractions = function(){
    holdInfractions = loadInfractions;
    loadInfractions=[];
  }
  
      var infractions = [
           "Sin permiso de estacionamiento",
            "Permiso vencido",
            "Permiso no pegado al cristal",
           "Estacionado en area que no le corresponde",
           "Estacionado ocupando dos espacios",
           "Estacionado bloqueando otro vehiculo",
           "Estacionado en sitio no designado como area de estacionamiento",
           "Estacionado frente encintado amarillo",
           "Sobre la grama o en la acera",
           "Estacionado en area de carga y descarga",
           "No obedecer la senal del guardia",
           "No obedecer la rotulacion de transito",
           "Negligencia temeraria o imprudencia al conducir vehiculo de motor",
           "Silenciador ruidoso, aceleracion motor",
           "Estacionado area critica",
           "Estacionado area impedidos",
           "Estacionado rampa impedidos"
      ];
      console.log("Loaded Infractions");
      $localstorage.setObject('typeInfractions', {infractions});



	return theFactory;

})



.service('BlankService', [function(){

}]);

	// Vehicles.licence_plate = data.LicencePlate;
            // Vehicles.marca = data.Marca;
            // Vehicles.model = data.Model;
            // Vehicles.color = data.Color;
            // Vehicles.vin = data.Vin;