angular.module('app.services', ['ionic.utils', 'LocalForageModule'])

.factory('DownloadAll', function($http, $exceptionHandler, $localstorage, $localForage, $q, $filter, $ionicHistory){

	var theFactory = {};
  var loadInfractions = [];
  var loadVehicle = [];
  var holdInfractions = [];
  var userName = "";
  var users = "";
  var response = "";
 //links
  var vehiclesAPI = "http://dev.uprm.edu/guardia/CAAMpusInfractionAPI/public/api/v1/vehicles";
  var zonesAPI = "http://dev.uprm.edu/guardia/CAAMpusInfractionAPI/public/api/v1/zones";
  var usersAPI = "http://dev.uprm.edu/guardia/CAAMpusInfractionAPI/public/api/v1/users";
  var violationsAPI = "http://dev.uprm.edu/guardia/CAAMpusInfractionAPI/public/api/v1/violations";
  var edmundsAPI = "https://api.edmunds.com/api/vehicle/v2/makes?fmt=json&api_key=kwepp7rqza2hd2xkumq9hsuj";
  var infractionUploadAPI = "http://dev.uprm.edu/guardia/CAAMpusInfractionAPI/public/api/v1/infractions"
  //connects to server. downloads all vehicles from database  and is stored locally
  theFactory.DownloadVehicles = function() {
    return $http({
      method: 'GET',
      url: vehiclesAPI
    }).success(function(data){
     theFactory.vehicles = data.data;     
     var vehicles = theFactory.vehicles; 
     console.log("downloaded vehicle")    
     $localstorage.setObject('vehicles', {vehicles});          
   });
  }

   theFactory.DownloadEdmunds = function() {
    return $http({
      method: 'GET',
      url: edmundsAPI
    }).success(function(data){
     // console.log("edmunds: ", data);
     theFactory.e = data.makes;     
     var edmundAPI = theFactory.e; 
     console.log("downloaded DownloadEdmunds")     
     $localstorage.setObject('edmundsAPI', {edmundAPI});          
   });
  }

  theFactory.DownloadZones = function() {
    return $http({
      method: 'GET',
      url: zonesAPI
    }).success(function(data){
     theFactory.zones = data.data;     
     var zones = theFactory.zones; 
     console.log("downloaded zones")      
     $localstorage.setObject('zones', {zones});          
   });
  }

   theFactory.DownloadUsers = function() {
    return $http({
      method: 'GET',
      url: usersAPI
    }).success(function(data, status){
         theFactory.users = data.data;     
         var users = theFactory.users;  
         console.log("downloaded users")   
         $localstorage.setObject('users', {users}); 
         console.log(status) ;         
   })
}

   theFactory.DownloadViolations = function() {
    return $http({
      method: 'GET',
      url: violationsAPI
    }).success(function(data){
     theFactory.violations = data.data;     
     var violations = theFactory.violations; 
     console.log("downloaded infractions")    
     $localstorage.setObject('typeInfractions', {violations});          
   });
  }

  theFactory.UploadInfractions = function(infractions) {
     var df = $q.defer();
    $http.post(infractionUploadAPI, infractions)
      .success(function(data){
            console.log("Success. Infraction created.");            
            df.resolve(data);
    })
      .error(function(err, status) {
            df.reject(err);
            console.log("upload infraction status: ", status);
    });
    return df.promise;
  }

  theFactory.internetCheck = function(infractions){
    var df = $q.defer();
     $http({
      method: 'GET',
      url: zonesAPI
    }).success(function(data, status){
      //console.log("service network",status)
      df.resolve(status);

    }).error(function(err, status) {
            df.reject(status);
            console.log("service network ", status);

    });
     return df.promise;
  }


  theFactory.UploadVehicles = function(vehicles) {
     
    var df = $q.defer();
    $http.post(vehiclesAPI, vehicles)
        .success(function(data){
                console.log("Success. Vehicle created.");
                df.resolve(data);
        })
        .error(function(err){
                df.reject(err.message);
                console.log(err.message)     
        });
    return df.promise;
  };
  

//restores all infractions that have been not been upploaded into the server
theFactory.dailyInfractions = function(){
   $localForage.getItem('Infractions').then(function(data){ 
     for(var i=0; i < data.loadInfractions.length; i++){
        loadInfractions.push(data.loadInfractions[i]);
        console.log("Loaded Daily INfractions")
     }   
        
      })
}
theFactory.dailyUnregisteredVechiles = function(){
  var vehicles = $localstorage.getObject('UnregisteredVehicle');
  for(var i=0; i < vehicles.loadVehicle.length; i++)
  {
   loadVehicle.push(vehicles.loadVehicle[i]);
 }
}
//adds a new infraction into our local database to await to be uploaded
theFactory.addInfraction = function(infraction){
 // console.log("Service recived the following infraction: ", infraction);
  loadInfractions.push(infraction); 
  console.log("loadInfractions size: ", loadInfractions.length)
  $localForage.setItem('Infractions',{loadInfractions});

}

theFactory.addUnregisteredVehicle = function(vehicle){
 // console.log("Service recived the following infraction: ", infraction);
  loadVehicle.push(vehicle); 
  $localstorage.setObject('UnregisteredVehicle',{loadVehicle});

}
//adds a new infraction that was recently edited
theFactory.addEditedInfraction = function(infraction){
  console.log("Service recived the following infraction: ", infraction);
 
  for(var i =0 ; i<infraction.length;i++){
     loadInfractions.push(infraction[i]);
  }   
  $localForage.setItem('Infractions',{loadInfractions});
  
}
//clears all infractions
theFactory.clearInfractions = function(){  
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
