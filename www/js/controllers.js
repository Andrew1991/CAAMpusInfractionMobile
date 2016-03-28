angular.module('app.controllers', ['ionic.utils', 'ngCordova', 'ui.router'])
     
.controller('logInCtrl', function($scope, $ionicHistory) {
	$ionicHistory.clearCache();

})
   //(1/5)
.controller('multaNueva14Ctrl', function($state, $scope, $localstorage, $rootScope, $ionicHistory) {
	

	$scope.vehicle = {};
	//searches for vechicle using licence plate number
	$scope.findVehicle = function() {
		var check = $scope.vehicle.plate_number;
		var secondCheck = false;
		if(!check){
			alert("Entre una tablilla!");
		}
		else {
		var plate_number = $scope.vehicle.plate_number;
		console.log('Finding Vehicle with licence plate number: ', plate_number);
		$scope.holdVehicles = $localstorage.getObject('vehicles');
		//searching vehicles:
		for(var i =0; i< $scope.holdVehicles.vehicles.length; i++)
		{
			if($scope.holdVehicles.vehicles[i].tablilla == plate_number)
			{
				console.log("Vehicle Found");
				$rootScope.position = i;
				secondCheck =true;				
			}
		}
		if(!secondCheck){
				console.log("No vehicle found with licence plate: ", plate_number);
				var r = confirm("Tablilla no fue encontrado. Desea registrar el vehiculo?");
			}
		if(secondCheck){
			    $ionicHistory.clearCache();
				$state.go('multaNueva25');
			}
		
	  }

	}

})
   //(2/5)
.controller('multaNueva25Ctrl', function($scope, $rootScope, $localstorage) {
		//console.log($rootScope.position);
		$scope.holdVehicles = $localstorage.getObject('vehicles');
		$scope.vehicle = $scope.holdVehicles.vehicles[$rootScope.position];
		console.log("Displaying vehicle information (2/5): ", $scope.vehicle);

})
//   (3/5)
.controller('multaNueva35Ctrl', function($scope, $rootScope, $state, $localstorage) {
	
	$rootScope.infractions = [];
	$scope.hold = $localstorage.getObject('typeInfractions');
	$scope.assets = $scope.hold.infractions;
	console.log("assest: ", $scope.hold.infractions);	
	$scope.isChecked = false;
    $scope.selected = [];
    //function to select type of violations
    $scope.checkedOrNot = function (asset, isChecked, index) {
        if (isChecked) {
            $scope.selected.push(asset);
            console.log("selected: ", $scope.selected);
        } else {
            var _index = $scope.selected.indexOf(asset);
            $scope.selected.splice(_index, 1);
            //console.log("selected after remove: ", $scope.selected);
        } 
        $rootScope.infractions = $scope.selected;
   		//console.log("Options inide rootScope: ", $rootScope.infractions);
    };
    //goes to next view
	$scope.nextView = function()
	{		
		if($rootScope.infractions.length == 0){
			alert("Debe escoger una infraccion!");
		}
		else
		{
			$state.go('multaNueva45');
		}
	}


})
// (4/5)
.controller('multaNueva45Ctrl', function($state, $scope, $cordovaCamera, $cordovaFile, $ionicSlideBoxDelegate, $rootScope, $localstorage) {
	 $scope.pictureURL = 'http://placehold.it/300x300';	
	 $rootScope.selectedZone;
	 $scope.holdzones = $localstorage.getObject('zones');
	 var e = "";
	 // console.log("Loading all possible zones: ", $scope.holdzones.zones);
	 
	 $scope.zones = $scope.holdzones.zones;	 
	 $scope.showSelectValue = function(mySelect) {
     			console.log("Selected Zone: ", mySelect);
     			$rootScope.selectedZone = mySelect;
     			console.log("Saved selected Zone: ", $rootScope.selectedZone);
     			e = "true";
     			
			}

	$rootScope.images = [];
	console.log("(4/5 images", $rootScope.images);
	 var options = {
	  quality : 50,
      destinationType: Camera.DestinationType.DATA_URL,      
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 120,
      targetHeight: 120,
      correctOrientation: true,
      saveToPhotoAlbum: true
    };

	$scope.takePicture = function(){
		if($rootScope.images.length <= 2){   
			$cordovaCamera.getPicture({options})
			.then(function(data){
				
				//console.log('Camera data: ' + angular.toJson(data));
				$scope.pictureURL = data;
				$rootScope.images.push(data);
				$ionicSlideBoxDelegate.update();
				console.log("image array: ", $rootScope.images);
			}, function(error){
				//console.log('Camera error: ' + angular.toJson(error));
			});
		}
		else{
			alert("Solo se puede un maximo de tres fotos!");
		}
			
	};

	$scope.nextView = function()
	{		
		if(e.length == 0){
			alert("Debe escoger una Zona!");
		}
		else
		{
			$state.go('multaNueva55');
		}
	}
		

})


//(5/5)
.controller('multaNueva55Ctrl', function($state, $scope, $ionicHistory, $localstorage, $rootScope, $ionicSlideBoxDelegate, DownloadAll) {
	$scope.selectedZone = $rootScope.selectedZone;
	$scope.holdVehicles = $localstorage.getObject('vehicles');
	$scope.vehicle = $scope.holdVehicles.vehicles[$rootScope.position];
	
	$scope.date = new Date();	
	$scope.infrac = $rootScope.infractions;
	$scope.images = $rootScope.images;
	$ionicSlideBoxDelegate.update();

	//create infraction Object
	 var infraction = {
	 	id: $scope.vehicle.tablilla,
	 	vehicle: $scope.vehicle,
	 	date: $scope.date,
	 	zone: $scope.selectedZone,
	 	violations: $scope.infrac,
	 	images: $scope.images,
	 	cancel_flag: false
	 };
	
	
	//Submits New Infraction
	$scope.submitInfraction = function(){
		$ionicHistory.nextViewOptions({
			 disableAnimate: true,
			 disableBack: true,
			 historyRoot: true

		});	
		$ionicHistory.clearCache();
		$rootScope.position = "";
		$rootScope.infractions = [];
		 DownloadAll.addInfraction(infraction);
		$state.go('cAAMpusInfraction.multasDeHoy');	
	}//<-ends submitInfraction() (erase all data [images, position, ext])



})

   //multas de hoy
.controller('multasDeHoyCtrl', function($scope, $localstorage, $state, $ionicPlatform, $ionicHistory) {

	$scope.holdInfractions = $localstorage.getObject('Infractions');
	$scope.infractions = $scope.holdInfractions.loadInfractions;	
	$ionicPlatform.registerBackButtonAction(function () {
		 if($state.current.name=="cAAMpusInfraction.multasDeHoy"){
		 	$ionicHistory.clearCache();
       		 $state.go('cAAMpusInfraction.cAAMpusInfraction2');
   		 }
    	else {
      		navigator.app.backHistory();
    		}	 
		}, 100);

})

//informacion de multa
.controller('informaciNDeMultaCtrl', function($scope, $stateParams, $filter ,$localstorage) {
	$scope.holdInfractions = $localstorage.getObject('Infractions');
	$scope.infractions = $scope.holdInfractions.loadInfractions;
	$scope.infraction = $filter('filter')($scope.infractions, {id:$stateParams.InfractionID})[0];
	console.log("Infraction chosen information: ", $scope.infraction.id);
	var infractions = [];

	$scope.cancelInfraction = function(){
		  infractions = $localstorage.getObject('Infractions')
	      for(var i=0; i < infractions.loadInfractions.length; i++)
	       {             
	             if(infractions.loadInfractions[i].id == $scope.infraction.id)
	             {
		             	console.log("match. Now edit and remove old one" , infractions);
		             	infractions.loadInfractions.splice(i,1);
		             	$scope.infraction.cancel_flag = true;
		             	infractions.loadInfractions.push($scope.infraction);
	             }
	      }
	      console.log("cancel flag pressed. Cancel flag in infraction changed. must disable cancel button");
	}

})
   
.controller('multaNueva24Ctrl', function($scope) {

}) 
   

   
.controller('cAAMpusInfraction2Ctrl', function($scope, $state, $ionicPlatform, $ionicHistory) {
	console.log("home");
	$ionicPlatform.registerBackButtonAction(function () {
		 if($state.current.name=="cAAMpusInfraction.cAAMpusInfraction2"){
		 	$ionicHistory.clearCache();
		 	//console.log("dale back");
       		 navigator.app.exitApp();
   		 }
    	else {
      		navigator.app.backHistory();
    		}	 
		}, 100);

})

.controller('editInfraction', function($state, $scope, $localstorage, $filter, $stateParams, DownloadAll) {
	$scope.holdInfractions = $localstorage.getObject('Infractions');
	$scope.infractions = $scope.holdInfractions.loadInfractions;
	$scope.infraction = $filter('filter')($scope.infractions, {id:$stateParams.InfractionID})[0];
	console.log("Infraction chosen information: ", $scope.infraction);
	var infractions = [];

	$scope.hold = $localstorage.getObject('typeInfractions');
	$scope.assets = $scope.hold.infractions;	
	$scope.isChecked = false;
    $scope.selected = [];
    $scope.checkedOrNot = function (asset, isChecked, index) {
        if (isChecked) {
            $scope.selected.push(asset);
            console.log("selected: ", $scope.selected);
        } else {
            var _index = $scope.selected.indexOf(asset);
            $scope.selected.splice(_index, 1);
            console.log("selected after remove: ", $scope.selected);
        }
    };

    $scope.saveChanges = function(){
    	 infractions = $localstorage.getObject('Infractions')
    	 console.log("before looop: ", infractions.loadInfractions[1]);
	      for(var i=0; i < infractions.loadInfractions.length; i++)
	       {             
	             if(infractions.loadInfractions[i].id == $scope.infraction.id)
	             {
		             	//console.log("match. Now edit and remove old one" , infractions);
		             	infractions.loadInfractions.splice(i,1);
		             	//console.log("After splice: ", infractions.loadInfractions);
		             	$scope.infraction.violations = $scope.selected;
		             	// console.log($scope.infraction);
		             	// console.log(infractions.loadInfractions);
		             	 infractions.loadInfractions.push($scope.infraction);
		             	 console.log("after push :", infractions.loadInfractions);
		             	// $localstorage.clear('Infractions');
		             	DownloadAll.clearInfractions();
		             	for(var j =0; j< infractions.loadInfractions.length ; j++){
		             		console.log(j);
		             		DownloadAll.addEditedInfraction(infractions.loadInfractions[j]);
		             	}

	             }
	      }
	      		//console.log("sending: ", $scope.infraction.id);
    	        // $state.go('informaciNDeMulta', {id:$scope.infraction.id});
    	        $state.go('cAAMpusInfraction.multasDeHoy');	
};

})

.controller('informaciNDeUsuarioCtrl', function($scope) {

})
   
.controller('editarMultaCtrl', function($scope) {

})
 