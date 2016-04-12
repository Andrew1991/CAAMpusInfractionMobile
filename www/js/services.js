angular.module('app.services', ['ionic.utils'])

.factory('DownloadAll', function($http, $localstorage, $q, $filter, $ionicHistory){

	var theFactory = {};
  var loadInfractions = [];
  var holdInfractions = [];
  var userName = "";
  var users = "";
  var response = "";
  //connects to server. downloads all vehicles from database  and is stored locally
  theFactory.DownloadVehicles = function() {
    return $http({
      method: 'GET',
      url: "http://162.243.3.45/CAAMpusInfractionAPI/CAAMpusInfractionAPI/public/api/v1/vehicles"
    }).success(function(data){
     theFactory.vehicles = data.data;     
     var vehicles = theFactory.vehicles;     
     $localstorage.setObject('vehicles', {vehicles});          
   });
  }

  theFactory.DownloadZones = function() {
    return $http({
      method: 'GET',
      url: "http://162.243.3.45/CAAMpusInfractionAPI/CAAMpusInfractionAPI/public/api/v1/zones"
    }).success(function(data){
     theFactory.zones = data.data;     
     var zones = theFactory.zones;     
     $localstorage.setObject('zones', {zones});          
   });
  }

   theFactory.DownloadUsers = function() {
    return $http({
      method: 'GET',
      url: "http://162.243.3.45/CAAMpusInfractionAPI/CAAMpusInfractionAPI/public/api/v1/user"
    }).success(function(data){
     theFactory.users = data.data;     
     var users = theFactory.users;     
     $localstorage.setObject('users', {users});          
   });
  }

   theFactory.DownloadViolations = function() {
    return $http({
      method: 'GET',
      url: "http://162.243.3.45/CAAMpusInfractionAPI/CAAMpusInfractionAPI/public/api/v1/violation"
    }).success(function(data){
     theFactory.violations = data.data;     
     var violations = theFactory.violations;     
     $localstorage.setObject('typeInfractions', {violations});          
   });
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

