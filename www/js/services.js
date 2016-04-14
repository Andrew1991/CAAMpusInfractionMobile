angular.module('app.services', ['ionic.utils'])

.factory('DownloadAll', function($http, $localstorage, $q, $filter, $ionicHistory){

	var theFactory = {};
  var loadInfractions = [];
  var holdInfractions = [];
  var userName = "";
  var users = "";
  var response = "";
 //links
  var vehiclesAPI = "http://162.243.3.45/CAAMpusInfractionAPI/CAAMpusInfractionAPI/public/api/v1/vehicles";
  var zonesAPI = "http://162.243.3.45/CAAMpusInfractionAPI/CAAMpusInfractionAPI/public/api/v1/zones";
  var usersAPI = "http://162.243.3.45/CAAMpusInfractionAPI/CAAMpusInfractionAPI/public/api/v1/users";
  var violationsAPI = "http://162.243.3.45/CAAMpusInfractionAPI/CAAMpusInfractionAPI/public/api/v1/violations";
  var edmundsAPI = "https://api.edmunds.com/api/vehicle/v2/makes?fmt=json&api_key=kwepp7rqza2hd2xkumq9hsuj";
  var infractionUploadAPI = "http://162.243.3.45/CAAMpusInfractionAPI/CAAMpusInfractionAPI/public/api/v1/infractions"
  //connects to server. downloads all vehicles from database  and is stored locally
  theFactory.DownloadVehicles = function() {
    return $http({
      method: 'GET',
      url: vehiclesAPI
    }).success(function(data){
     theFactory.vehicles = data.data;     
     var vehicles = theFactory.vehicles;     
     $localstorage.setObject('vehicles', {vehicles});          
   });
  }

   theFactory.DownloadEdmunds = function() {
    return $http({
      method: 'GET',
      url: edmundsAPI
    }).success(function(data){
     theFactory.vehicles = data.data;     
     var vehicles = theFactory.vehicles;     
     $localstorage.setObject('edmundsAPI', {edmundsAPI});          
   });
  }

  theFactory.DownloadZones = function() {
    return $http({
      method: 'GET',
      url: zonesAPI
    }).success(function(data){
     theFactory.zones = data.data;     
     var zones = theFactory.zones;     
     $localstorage.setObject('zones', {zones});          
   });
  }

   theFactory.DownloadUsers = function() {
    return $http({
      method: 'GET',
      url: usersAPI
    }).success(function(data){
     theFactory.users = data.data;     
     var users = theFactory.users;     
     $localstorage.setObject('users', {users});          
   });
  }

   theFactory.DownloadViolations = function() {
    return $http({
      method: 'GET',
      url: violationsAPI
    }).success(function(data){
     theFactory.violations = data.data;     
     var violations = theFactory.violations;     
     $localstorage.setObject('typeInfractions', {violations});          
   });
  }

  theFactory.UploadInfractions = function(infractions) {
     return $http({
      method: 'POST',
      url: infractionUploadAPI,
      data: infractions     
  })
  .success(function(data) {
      // handle success things
      console.log(data);
  })
  .error(function(data, status, headers, config) {
      // handle error things
      console.log(status);
  })
  }



  // theFactory.download = function() {
  //   return $http({
  //     method: 'GET',
  //     url: "http://cercapr.cloudapp.net/PHP/test6.php"
  //   }).success(function(data){
  //    theFactory.vehicles = data.vehicles;
  //    theFactory.users = data.users;
  //    theFactory.zones = data.zones;
  //    var vehicles = theFactory.vehicles;
  //    var users = theFactory.users;
  //    var zones = theFactory.zones
  //    $localstorage.setObject('vehicles', {vehicles});            
  //    $localstorage.setObject('users', {users});
  //    $localstorage.setObject('zones', {zones});   
  //  });
  // }
//restores all infractions that have been not been upploaded into the server
theFactory.dailyInfractions = function(){
  var infractions = $localstorage.getObject('Infractions')
  for(var i=0; i < infractions.loadInfractions.length; i++)
  {
   loadInfractions.push(infractions.loadInfractions[i]);
 }
}
//adds a new infraction into our local database to await to be uploaded
theFactory.addInfraction = function(infraction){

 // console.log("Service recived the following infraction: ", infraction);
  loadInfractions.push(infraction);
  console.log("pushing infraction: ", loadInfractions);
  console.log("Total infractions :", loadInfractions.length);
  $localstorage.setObject('Infractions',{loadInfractions});

}
//adds a new infraction that was recently edited
theFactory.addEditedInfraction = function(infraction){

  //console.log("Service recived the following infraction: ", infraction);
  loadInfractions.push(infraction);
  console.log("pushing infraction: ", loadInfractions);
  console.log("Total infractions :", loadInfractions.length);
  $localstorage.setObject('Infractions',{loadInfractions});

}
//clears all infractions
theFactory.clearInfractions = function(){
  holdInfractions = loadInfractions;
  loadInfractions=[];
}
//logs in a new user
theFactory.login = function(username, password){
   users = $localstorage.getObject('users').users;
   response = "";
  console.log(users);
  var user = $filter('filter')(users, {email:username})[0];
  if(user){
    console.log("username found" , user);
    if(user.pin == password){
      console.log("correct password");
      userName = user;
      console.log("username: ", userName);
      response = true;
    }
    else{
      console.log("Incorrect password");
      response = false;
    }
  }
  else{
    console.log("username not found");
    response = false;
  }
  return response;
}
//returns the current user that is logged in
theFactory.currentUser = function(){
  console.log("current user: ", userName);
  return userName;
}
//logs user out of application
theFactory.logout = function(){
  username = "";
  users = "";
  response = "";
  $ionicHistory.clearCache();
}


return theFactory;

})



.service('BlankService', [function(){

}]);

	// Vehicles.licence_plate = data.LicencePlate;
            // Vehicles.marca = data.Marca;
            // Vehicles.model = data.Model;
            // Vehicles.color = data.Color;
            // Vehicles.vin = data.Vin;

//php --info | grep error