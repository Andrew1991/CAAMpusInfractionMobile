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
           {id:0, description: "Sin permiso de estacionamiento"},
             {id:1, description:"Permiso vencido"},
             {id:2, description:"Permiso no pegado al cristal"},
           {id:3, description: "Estacionado en area que no le corresponde"},
           {id:4, description:"Estacionado ocupando dos espacios"},
           {id:5, description: "Estacionado bloqueando otro vehiculo"},
           {id:6, description: "Estacionado en sitio no designado como area de estacionamiento"},
            {id:7, description:"Estacionado frente encintado amarillo"},
           {id:8, description: "Sobre la grama o en la acera"},
            {id:9, description:"Estacionado en area de carga y descarga"},
            {id:10, description:"No obedecer la senal del guardia"},
           {id:11, description: "No obedecer la rotulacion de transito"},
           {id:12, description: "Negligencia temeraria o imprudencia al conducir vehiculo de motor"},
            {id:13, description:"Silenciador ruidoso, aceleracion motor"},
           {id:14, description: "Estacionado area critica"},
            {id:15, description:"Estacionado area impedidos"},
            {id:16, description:"Estacionado rampa impedidos"},
             {id:17, description:"Otros"},
              {id:18, description:"Langosta"}
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