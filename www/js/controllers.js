angular.module('app.controllers', ['ionic.utils', 'ngCordova', 'ui.router'])
//login view controller
.controller('logInCtrl', function($scope, $ionicHistory, DownloadAll, $state) {
	$ionicHistory.clearCache();
	$scope.userData = {};
	
	$scope.login = function(){
		var response;
		if(!$scope.userData.username || !$scope.userData.pin){
			alert("Debe entrar un usuario y un numero de pin");
		}
		else{
			response = DownloadAll.login($scope.userData.username, $scope.userData.pin);
			console.log("response: ", response);
			if(response){
			console.log("Logging In");
			$state.go('cAAMpusInfraction.cAAMpusInfraction2');
		}else if(!response){
			alert("Usuario o Pin incorrecto");
		}
		}
		
	}
	

})
   //(1/5) Search for vehicle controller
   .controller('multaNueva14Ctrl', function($state, $scope, $localstorage, $rootScope, $ionicHistory, $ionicPlatform, DownloadAll) {
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
			if(r == true){
				$rootScope.position = -1;
				$state.go('registerVehicle');
				
			}
		}
		if(secondCheck){
			$ionicHistory.clearCache();
			$state.go('multaNueva25');
		}		
	}
};
	

})
   //(2/5) view vehicle information view
   .controller('multaNueva25Ctrl', function($scope, $rootScope, $localstorage, $ionicPlatform) {
		//console.log($rootScope.position);
		$scope.holdVehicles = $localstorage.getObject('vehicles');
		$scope.vehicle = $scope.holdVehicles.vehicles[$rootScope.position];
		console.log("Displaying vehicle information (2/5): ", $scope.vehicle);

		

	})
//   (3/5) choose infractions view controller
.controller('multaNueva35Ctrl', function($scope, $rootScope, $state, $localstorage, $ionicPlatform) {	
	$rootScope.infractions = [];
	$scope.hold = $localstorage.getObject('typeInfractions');
	$scope.assets = $scope.hold.infractions;
	console.log("assest: ", $scope.hold.infractions);	
	$scope.isChecked = false;
	$scope.selected = [];
	$scope.id_selected=[];
    //function to select type of violations
    $scope.checkedOrNot = function (asset, isChecked, index) {
    	if (isChecked) {        	
    		$scope.selected.push(asset);
    		$scope.id_selected.push(asset.id);
    		console.log("selected: ", $scope.selected);
    	} else {
    		var _index = $scope.selected.indexOf(asset);
    		$scope.selected.splice(_index, 1);
            //console.log("selected after remove: ", $scope.selected);
        } 
        $rootScope.infractions = $scope.selected;
        $rootScope.id_violations = $scope.id_selected;
   		//console.log("Options inide rootScope: ", $rootScope.infractions);
   	};
    //Function to go to next view
    $scope.nextView = function()
    {		
    	if($rootScope.infractions.length == 0){
    		alert("Debe escoger una infraccion!");
    	}
    	else
    	{
    		$state.go('multaNueva45');
    	}
    };

   
})
// (4/5) take picture and choose zones view controller
.controller('multaNueva45Ctrl', function($ionicHistory, $state, $scope, $cordovaCamera, $cordovaFile, $ionicSlideBoxDelegate, $rootScope, $localstorage, $ionicPlatform) {
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

	 // $rootScope.images = [];	
	 // var options = {
	 // 	quality : 50,
	 // 	destinationType: Camera.DestinationType.DATA_URL,      
	 // 	encodingType: Camera.EncodingType.JPEG,
	 // 	targetWidth: 120,
	 // 	targetHeight: 120,
	 // 	correctOrientation: true,
	 // 	saveToPhotoAlbum: true
	 // };
  //   //gives access to system camera. Allows up to three pictures to be taken
  //   $scope.takePicture = function(){
  //   	if($rootScope.images.length <= 2){   
  //   		$cordovaCamera.getPicture({options})
  //   		.then(function(data){				
		// 		//console.log('Camera data: ' + angular.toJson(data));
		// 		$scope.pictureURL = data;
		// 		$rootScope.images.push(data);
		// 		$ionicSlideBoxDelegate.update();
		// 		console.log("image array: ", $rootScope.images);
		// 	}, function(error){
		// 		//console.log('Camera error: ' + angular.toJson(error));
		// 	});
  //   	}
  //   	else{
  //   		alert("Solo se puede un maximo de tres fotos!");
  //   	}

  //   };

    $scope.comment = {};
    $scope.nextView = function()
    {		
    	if(e.length == 0){
    		alert("Debe escoger una Zona!");
    	}
    	else
    	{
    		$ionicHistory.clearCache();
    		$rootScope.main_comment = $scope.comment.main;
    		$state.go('multaNueva55');
    	}
    };

   


})
//(5/5) View Infraction Summary
.controller('multaNueva55Ctrl', function($state, $scope, $ionicHistory, $localstorage, $rootScope, $ionicSlideBoxDelegate, DownloadAll, $ionicPlatform) {
	$scope.selectedZone = $rootScope.selectedZone;
	$scope.holdVehicles = $localstorage.getObject('vehicles');
	$scope.vehicle = {};
	//console.log("position: ", $rootScope.position);
	if($rootScope.position == -1){
		$scope.vehicle = $rootScope.createdVehicle;
		console.log("created vehcile: ", $scope.vehicle)
	}
	else{
		$scope.vehicle = $scope.holdVehicles.vehicles[$rootScope.position];
	}	
	$scope.date = new Date();	
	$scope.infrac = $rootScope.infractions;
	$scope.id_violations = $rootScope.id_violations;
	$scope.images = $rootScope.images;
	$ionicSlideBoxDelegate.update();
	$scope.mainComment = $rootScope.main_comment;
	$scope.officer = DownloadAll.currentUser();
	console.log("officer name: ", $scope.officer);
	var n = $scope.officer.username.substring(0,3);
	var date = new Date();
	var month = ""+date.getMonth();	
	var dates = ""+date.getDate();
	var min =""+date.getMinutes();
	var hour = ""+date.getHours();
	var sec =""+date.getSeconds(); 
	$scope._id = n.concat(month,dates, hour,min,sec);
	//create infraction Object
	var infraction = {
		id: $scope._id,
		vehicle: $scope.vehicle,
		date: $scope.date,
		zone: $scope.selectedZone,
		violations: $scope.infrac,
		violations_id: $scope.id_violations,
		images: $scope.images,
		cancel_flag: false,
		main_comment: $scope.mainComment, 
		delete_comment: "",
		officer: $scope.officer.FirstName

	};	

// 	var monthNames = [
//   "January", "February", "March",
//   "April", "May", "June", "July",
//   "August", "September", "October",
//   "November", "December"
// ];

// var date = new Date();
// var day = date.getDate();
// var monthIndex = date.getMonth();
// var year = date.getFullYear();

// console.log(day, monthNames[monthIndex], year);
	
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
		console.log("Creating Infraction: ", infraction);
		$state.go('cAAMpusInfraction.multasDeHoy');	
	};

	
})

   //view todays infractions controller
   .controller('multasDeHoyCtrl', function($scope, $localstorage, $state, $ionicPlatform, $ionicHistory, DownloadAll) {
   	$ionicHistory.clearHistory();
   	$ionicHistory.clearCache();
   	$scope.holdInfractions = $localstorage.getObject('Infractions');
   	$scope.infractions = $scope.holdInfractions.loadInfractions;
   	$scope.userInfraction = [];
   	var User = DownloadAll.currentUser();
   	var officer = User.FirstName;
   	
   	for(var i=0; i< $scope.infractions.length;i++){
   		if($scope.infractions[i].officer == officer){
   			$scope.userInfraction.push($scope.infractions[i]);
   		}
   	}
   	console.log("Current user total Infractions: ", $scope.userInfraction.length);

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

//view infraction information view controller. takes care of cancel button and edit button
.controller('informaciNDeMultaCtrl', function($scope, $ionicModal, $stateParams, $filter ,$localstorage, $ionicHistory, $window, DownloadAll) {
	$ionicHistory.clearHistory();
	$ionicHistory.clearCache();   
	$ionicModal.fromTemplateUrl('templates/cancelInfraction.html', {
		scope: $scope
	}).then(function(cancel_Infraction) {
		$scope.cancel_Infraction = cancel_Infraction;
	});
	$scope.holdInfractions = $localstorage.getObject('Infractions');
	$scope.infractions = $scope.holdInfractions.loadInfractions;
	$scope.infraction = $filter('filter')($scope.infractions, {id:$stateParams.InfractionID})[0];
	
	$scope.deleteButton = !$scope.infraction.cancel_flag;
	$scope.editButton = !$scope.infraction.cancel_flag;
	$scope.deleteMessage = $scope.infraction.cancel_flag;
	$scope.deleteComment = $scope.infraction.cancel_flag;

	var infractions = [];
	$scope.comment = {};
	$scope.cancelInfraction = function(){
		$scope.cancel_Infraction.show();		 
	};
	$scope.closeCancel = function(){
		$scope.cancel_Infraction.hide();
	};
	$scope.editInfraction = function(){		
		$ionicHistory.clearCache();			
	};
	$scope.confirmCancel = function(){
		infractions = $localstorage.getObject('Infractions')
		if(!$scope.comment.main){
			alert("debe entrar un comentario de cancelacion");
		}
		else{
			for(var i=0; i < infractions.loadInfractions.length; i++)
			{             
				if(infractions.loadInfractions[i].id == $scope.infraction.id)
				{
					console.log("match. Now edit and remove old one" , infractions);
					infractions.loadInfractions.splice(i,1);
					$scope.infraction.cancel_flag = true;
					$scope.infraction.delete_comment = $scope.comment.main;
					infractions.loadInfractions.push($scope.infraction);
					DownloadAll.clearInfractions();
					for(var j =0; j< infractions.loadInfractions.length ; j++){
						console.log(j);
						DownloadAll.addEditedInfraction(infractions.loadInfractions[j]);
					}
				}
			}
	      //console.log("cancel flag pressed. Cancel flag in infraction changed. must disable cancel button");
	      $scope.cancel_Infraction.hide();
	      $scope.deleteButton = false;
	      $scope.editButton = false;
	      $scope.deleteMessage = true;
	      $scope.deleteComment  = true;
	  }
	};

})

//edit infraction view controller
.controller('editInfraction', function($state, $scope, $localstorage, $filter, $stateParams, DownloadAll, $ionicHistory) {
	$scope.holdInfractions = $localstorage.getObject('Infractions');
	$ionicHistory.clearCache();
	$ionicHistory.clearHistory();
	$scope.infractions = $scope.holdInfractions.loadInfractions;
	$scope.infraction = $filter('filter')($scope.infractions, {id:$stateParams.InfractionID})[0];
	console.log("Infraction chosen information: ", $scope.infraction);
	var infractions = [];
	$ionicHistory.clearCache();
	$ionicHistory.clearHistory();
	$scope.hold = $localstorage.getObject('typeInfractions');
	$scope.assets = $scope.hold.infractions;	
	$scope.isChecked = false;
	$scope.selected = [];
	$scope.IDselected = [];

	$scope.hasViolation = function(violation) {
		if ($scope.infraction.violations_id.indexOf(violation.id) !== -1){
			$scope.selected.push(violation);
			$scope.IDselected.push(violation.id);
		}
		return $scope.infraction.violations_id.indexOf(violation.id) !== -1;
	};
	$scope.checkedOrNot = function (asset, isChecked, index) {
		if (isChecked) {
			$scope.selected.push(asset);
			$scope.IDselected.push(asset.id);
			console.log("selected: ",  $scope.IDselected);
		} else {
			var _index = $scope.selected.indexOf(asset);
			$scope.selected.splice(_index, 1);
			$scope.IDselected.splice(_index, 1);
			console.log("selected after remove: ", $scope.selected);
		}
	};

	$scope.saveChanges = function(){
		console.log("trying to save", $scope.selected.length )
		if($scope.selected.length == 0){
			alert("Debe seleccionar alguna infraccion");
		}
		else{
			$ionicHistory.clearCache();
			$ionicHistory.clearHistory();
			infractions = $localstorage.getObject('Infractions')
			console.log("before looop: ", infractions.loadInfractions[1]);
			for(var i=0; i < infractions.loadInfractions.length; i++)
			{             
				if(infractions.loadInfractions[i].id == $scope.infraction.id)
				{

					infractions.loadInfractions.splice(i,1);
		             	//add new things to infraction
		             	$scope.infraction.violations = $scope.selected;
		             	$scope.infraction.violations_id =  $scope.IDselected;
		             	$scope.infraction.main_comment = $scope.infraction.main_comment;
		             	
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
		         $state.go('cAAMpusInfraction.multasDeHoy', {}, {reload: true});	
		     }
		 };
		})

.controller('multaNueva24Ctrl', function($scope) {

}) 


 //home  main menu view controller
 .controller('cAAMpusInfraction2Ctrl', function($scope, $state, $ionicPlatform, $ionicHistory) {
	//console.log("home");
	$ionicHistory.clearCache();
	$ionicHistory.clearHistory();
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

//Regsiter a new vehicle view controller
 .controller('newVehicleCtrl', function($scope, $state, $rootScope) {

 	$scope.vehicle = {
 		tablilla: "",
 		make: "",
 		modal: "",
 		Color: "",
 		permiso: "",
 		year: ""
 	};
 	$scope.colors = [
		{name: 'Amarillo'},
		{name: 'Anaranjado'},
		{name: 'Azul'},
		{name: 'Blanco'},
		{name: 'Gris'},
		{name: 'Negro'},
		{name: 'Rojo'},
		{name: 'Verde'},
		{name: 'Violeta'}
	];
	var e = "";
	var selectedColor = "";
	 $scope.showSelectValue = function(mySelect) {
	 	console.log("Selected Color: ", mySelect);	
	 	selectedColor = mySelect; 	
	 	e = "true";
	 };

 	$scope.nextView = function(){
 		if(!$scope.vehicle.tablilla || !$scope.vehicle.make || !$scope.vehicle.modal || !e ){
 			alert("Debe llenar todos los campos");
 		}
 		else{
 			$scope.vehicle.Color = selectedColor
 			$rootScope.createdVehicle = $scope.vehicle;
 			console.log("New Vehicle is Being Registered: ", $rootScope.createdVehicle);
 			$state.go('multaNueva35');
 		}
 		

 	}




 })

 .controller('informaciNDeUsuarioCtrl', function($scope) {

 })

 .controller('editarMultaCtrl', function($scope) {

 })


 