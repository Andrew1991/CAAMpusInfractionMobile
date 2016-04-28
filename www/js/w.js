angular.module('app.controllers', ['ionic.utils','angular-md5', 'ngCordova', 'ui.router', 'base64', 'LocalForageModule'])
//login view controller
.controller('logInCtrl', function($scope, $ionicHistory, md5, DownloadAll, $state, $rootScope) {
	$ionicHistory.clearCache();
	$scope.userData = {};
	$rootScope.bool = true;
	$rootScope.clampWarn = false;
	$rootScope.create = false;
	$scope.login = function(){
		var response;
		if(!$scope.userData.username || !$scope.userData.pin){
			alert("Debe entrar un usuario y un numero de pin");
			console.log("No loggin information provided");
		}
		else{
			var pin = md5.createHash($scope.userData.pin);
			response = DownloadAll.login($scope.userData.username, pin);
			//console.log("response: ", response);
			if(response){
			console.log("Logging In Succesfull");
			$state.go('cAAMpusInfraction.cAAMpusInfraction2');
		}else if(!response){
			alert("Usuario o Pin incorrecto");
			console.log("Login Information Incorrect");
		}
		}
		
	}
	

})
   //(1/5) Search for vehicle controller
   .controller('multaNueva14Ctrl', function($state, $ionicHistory, $scope, $localstorage,
    $rootScope, $ionicHistory, $ionicPlatform, DownloadAll) {
   	$scope.vehicle = {};
	//searches for vechicle using licence plate number
	$rootScope.incorrectInformationComment = null
	$ionicHistory.clearHistory();
	$ionicHistory.clearCache();
		$scope.infractionCancel = function(){
		$ionicHistory.nextViewOptions({
			disableAnimate: true,
			disableBack: true,
			historyRoot: true

		});
		$rootScope.position = "";
		$rootScope.infractions = [];
		$rootScope.bool = true;
		$rootScope.clampWarn = false;
		$rootScope.createdVehicle = "";
		$rootScope.create = false;
		$ionicHistory.clearCache();
		$ionicHistory.clearHistory();
		$state.go('cAAMpusInfraction.cAAMpusInfraction2', {}, {reload: true});
	}
	 
	$scope.findVehicle = function() {
		var check = $scope.vehicle.plate_number;
		var secondCheck = false;
		if(!check){
			alert("Entre una tablilla!");
		}
		else {
			var plate_number = $scope.vehicle.plate_number;
			console.log('Searching Vehicle with licence plate number: ', plate_number);
			$scope.holdVehicles = $localstorage.getObject('vehicles');
		//searching vehicles:
		for(var i =0; i< $scope.holdVehicles.vehicles.length; i++)
		{
			if($scope.holdVehicles.vehicles[i].licensePlateID == plate_number)
			{
				//console.log("Vehicle Found");
				$rootScope.position = i;
				secondCheck =true;				
			}
		}
		if(!secondCheck){
			console.log("No vehicle found with licence plate: ", plate_number);
			var r = confirm("Tablilla no fue encontrado. Desea registrar el vehiculo?");
			if(r == true){
				$rootScope.position = -1;
				$rootScope.licencePlate = plate_number;
				$state.go('registerVehicle');
				
			}
		}
		if(secondCheck){
			$ionicHistory.clearCache();
			$ionicHistory.clearHistory();
			$state.go('multaNueva25', {}, {reload: true});
			
		}		
	}
};
	

})

   //(1.1/5) Regsiter a new vehicle view controller
 .controller('newVehicleCtrl', function($scope, $state, $ionicPlatform, $ionicHistory,
  $rootScope, DownloadAll, $localstorage, $filter) {
 	$scope.date = new Date();
 	$scope.user = DownloadAll.currentUser();
 	console.log("user: ", $scope.user._id);
 	$scope.vehicle = {
 		licensePlateID: $rootScope.licencePlate,
 		make: "",
 		model: "",
 		color: "",
 		creatorID: $scope.user._id,
 		createTime: $scope.date,
 		isRegistered: 0
 	};
 	$scope.infractionCancel = function(){
		$ionicHistory.nextViewOptions({
			disableAnimate: true,
			disableBack: true,
			historyRoot: true

		});
		$rootScope.position = "";
		$rootScope.infractions = [];
		$rootScope.bool = true;
		$rootScope.clampWarn = false;
		$rootScope.createdVehicle = "";
		$rootScope.create = false;
		$ionicHistory.clearCache();
		$ionicHistory.clearHistory();
		$state.go('cAAMpusInfraction.cAAMpusInfraction2', {}, {reload: true});
	}
	$ionicPlatform.registerBackButtonAction(function () {
					$ionicHistory.nextViewOptions({
					disableAnimate: true,
					disableBack: true,
					historyRoot: true
				});
				$rootScope.position = "";
				$rootScope.infractions = [];
				$rootScope.bool = true;
				$rootScope.clampWarn = false;
				$rootScope.createdVehicle = "";
				$rootScope.create = false;	

				$scope.IncorrectInfoButton = $rootScope.bool;
				$scope.reportedMessage = !$rootScope.bool; 
		   		if($state.current.name=="multaNueva25"){
		   			$ionicHistory.clearCache();
		   			$ionicHistory.clearHistory();

		   			$state.go('multaNueva14', {}, {reload: true});
		   		}
		   		else {
		   			navigator.app.backHistory();
		   		}	 
		   	}, 100);

 	$scope.edmundsAPI = $localstorage.getObject('edmundsAPI').edmundAPI;
 	
 	$scope.makes = [];
 	$scope.api = [];
 	$scope.models = [];
 	for(var i =0; i < $scope.edmundsAPI.length ; i++){ 		
 		$scope.makes.push($scope.edmundsAPI[i].name);
 		$scope.api.push($scope.edmundsAPI[i]);
  	}
  	$scope.makes.push("Otros")
  	//$scope.models = $filter('filter')($scope.api, {name: "Toyota"}, true)[0].models;
  	 //console.log($scope.models);

 	$scope.colors = [
		{name: 'Amarillo'},
		{name: 'Anaranjado'},
		{name: 'Azul'},
		{name: 'Blanco'},
		{name: 'Gris'},
		{name: 'Marron'},
		{name: 'Negro'},
		{name: 'Rojo'},
		{name: 'Verde'},
		{name: 'Violeta'}
	];
	var e = false;
	var m = false;
	var mo = false;
	var selectedColor = "";
	var selectedMake  = "";
	var selectedModel = "";
	//shows list of colors
	$scope.showMake = true
 	$scope.showModel = true
 	$scope.showMakeOtro = false
 	$scope.showModelOtro = false
	 $scope.showSelectValue = function(mySelect) {	 		
	 	selectedColor = mySelect; 	
	 	console.log("Selected Color: ", selectedColor);
	 	e = true;
	 };
	 selectMake = function(make) {
	 	 selectedMake = make;
	 	if(selectMake === "Otros"){
	 		
	 	}
	 	else{
	 		$scope.showModel = true
	 		$scope.showMake = true
	 		$scope.showMakeOtro = false
 			$scope.showModelOtro = false
 			$scope.vehicle.make = ""
 			$scope.vehicle.model = ""
	 	}
	 	console.log("Selected Make: ", selectedMake);
	 	m = true;
	 };
	 $scope.selectModel = function(model){
	 	selectedModel = model;
	 	selectedModel = selectedModel.replace(/^\s+|\s+$/g,'');
	 	console.log("Selected Model: ", selectedModel);
	 	mo = true;
	 };

	 //check input fields are filled. Take user to next step
 	$scope.nextView = function(){
 		if(!$scope.showModel){
 		 	selectedMake =	$scope.vehicle.make
 			selectedModel = $scope.vehicle.model  
 		}
 		if(!selectedColor || !selectedMake || !selectedModel ){
 			console.log(selectedColor, selectedModel, selectedMake)
 			alert("Debe llenar todos los campos");

 		}
 		else{
 			$scope.vehicle.color = selectedColor
 			$scope.vehicle.make = selectedMake
 			$scope.vehicle.model = selectedModel
 			$rootScope.createdVehicle = $scope.vehicle;
 			console.log("New Vehicle is Being Registered: ", $rootScope.createdVehicle);
 			$rootScope.create = true;
 			$state.go('multaNueva35');
 		}
 	}

	
 	$scope.refreshModels = function(make){		
		var make = make;
		make = make.replace(/^\s+|\s+$/g,'');
		if(make == "Otros"){			
			$scope.showModel = false	 		
	 		$scope.showMakeOtro = true
 			$scope.showModelOtro = true
 			$scope.vehicle.make = ""
 			$scope.vehicle.model = ""	 				
		}	
		else{
			$scope.models = $filter('filter')($scope.api, {name: make}, true)[0].models;
			selectMake(make);
		}	

		
		
		
	};




 })
   //(2/5) view vehicle information view
   .controller('multaNueva25Ctrl', function($scope, $ionicPlatform, 
   	$rootScope, $localstorage, $ionicPlatform, $rootScope, $ionicModal,
   	 $ionicHistory, $state, $ionicPopup) {
	 
	$scope.IncorrectInfoButton = $rootScope.bool;
	$scope.reportedMessage = !$rootScope.bool; 
	$scope.holdVehicles = $localstorage.getObject('vehicles');
	$scope.vehicle = $scope.holdVehicles.vehicles[$rootScope.position];
	console.log("Displaying vehicle information (2/5): ", $scope.vehicle);
	
	$scope.comment = {};
	if($scope.vehicle.infractionCount >= 3 && $scope.vehicle.isRegistered == 0 ){
		$ionicPopup.alert({title: 'Langosta',
   							template: 'Vehiculo No esta registrado y contiene 3 o mas multas. Puede proceder con una langosta si desea'});
		$rootScope.clampWarn = true;
		$scope.clampWarning = $rootScope.clampWarn;
		
	}
	if($scope.vehicle.perkingPermitProv == 1){
		$scope.prov = "Prov"
	}
	else{
		$scope.prov = ""
	}
	$ionicModal.fromTemplateUrl('templates/informacionIncorrecta.html', {
	scope: $scope
		}).then(function(incorrect_vehicle_info) {
			$scope.incorrect_vehicle_info = incorrect_vehicle_info;
	});
	$scope.infractionCancel = function(){
		$ionicHistory.nextViewOptions({
			disableAnimate: true,
			disableBack: true,
			historyRoot: true

		});
		$rootScope.position = "";
		$rootScope.infractions = [];
		$rootScope.bool = true;
		$rootScope.clampWarn = false;
		$rootScope.createdVehicle = "";
		$rootScope.incorrectInformationComment = null
		$rootScope.create = false;
		$ionicHistory.clearCache();
		$ionicHistory.clearHistory();
		$state.go('cAAMpusInfraction.cAAMpusInfraction2', {}, {reload: true});
	}
	$ionicPlatform.registerBackButtonAction(function () {
					$ionicHistory.nextViewOptions({
					disableAnimate: true,
					disableBack: true,
					historyRoot: true
				});
				$rootScope.position = "";
				$rootScope.infractions = [];
				$rootScope.bool = true;
				$rootScope.clampWarn = false;
				$rootScope.createdVehicle = "";
				$rootScope.create = false;
				$scope.vehicle = "";
				$scope.IncorrectInfoButton = $rootScope.bool;
				$scope.reportedMessage = !$rootScope.bool; 
		   		if($state.current.name=="multaNueva25"){
		   			$ionicHistory.clearCache();
		   			$ionicHistory.clearHistory();

		   			$state.go('multaNueva14', {}, {reload: true});
		   		}
		   		else {
		   			navigator.app.backHistory();
		   		}	 
		   	}, 100);
	//show incorrectInfo Popup
	$scope.incorrectInfo = function(){
		$scope.incorrect_vehicle_info.show();		 
	};
	//close incorrectInfo Popup
	$scope.closeCancel = function(){
		$scope.incorrect_vehicle_info.hide();
	};
	//confirm comment inserted for editing
	$scope.confirmReport = function(){
		
		if(!$scope.comment.informacionIncorecto){
			alert("debe entrar un comentario");
		}
		else{
			  $rootScope.incorrectInformationComment = $scope.comment.informacionIncorecto;
			  $rootScope.bool = false;
			  $scope.IncorrectInfoButton = $rootScope.bool;
			  $scope.reportedMessage = !$rootScope.bool; 
			  $scope.incorrect_vehicle_info.hide();
			} 
	};
		

	})
//   (3/5) choose infractions view controller
.controller('multaNueva35Ctrl', function($scope, $rootScope, $ionicHistory, $state,
 $localstorage, $ionicPlatform) {	
	$rootScope.infractions = [];
	$scope.clampWarning = $rootScope.clampWarn;
	$scope.hold = $localstorage.getObject('typeInfractions');
	$scope.assets = $scope.hold.violations;
	//console.log("assest: ", $scope.hold.infractions);	
	$scope.isChecked = false;
	$scope.selected = [];
	$scope.id_selected=[];
	$scope.fee=[];

	$scope.infractionCancel = function(){
		$ionicHistory.nextViewOptions({
			disableAnimate: true,
			disableBack: true,
			historyRoot: true

		});
		$rootScope.position = "";
		$rootScope.infractions = [];
		$rootScope.bool = true;
		$rootScope.clampWarn = false;
		$rootScope.createdVehicle = "";
		$rootScope.incorrectInformationComment = null
		$rootScope.create = false;
		$ionicHistory.clearCache();
		$ionicHistory.clearHistory();
		$state.go('cAAMpusInfraction.cAAMpusInfraction2', {}, {reload: true});
	}
	$ionicPlatform.registerBackButtonAction(function () {
				
		   		if($state.current.name=="multaNueva35"){
		   			
		   			$state.go('multaNueva25', {}, {reload: true});
		   		}
		   		else {
		   			navigator.app.backHistory();
		   		}	 
		   	}, 100);
    //function to select type of violations
    $scope.checkedOrNot = function (asset, isChecked, index) {
    	if (isChecked) {        	
    		$scope.selected.push(asset);
    		$scope.id_selected.push(asset._id);
    		$scope.fee.push(asset.fee);
    		console.log("selected Infraction ID: ", $scope.fee.max());
    	} else {
    		var _index = $scope.selected.indexOf(asset);
    		$scope.selected.splice(_index, 1);
    		$scope.id_selected.splice(_index, 1);;
    		$scope.fee.splice(_index, 1);;
            console.log("selected after remove: ", $scope.fee.max());
        } 
        $rootScope.infractions = $scope.selected;
        $rootScope.id_violations = $scope.id_selected;
        $rootScope.fee = $scope.fee.max();
   		console.log("Options inide rootScope: ", $rootScope.infractions);
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

	Array.prototype.max = function() {
  	return Math.max.apply(null, this);
	};
   
})
// (4/5) take picture and choose zones view controller
.controller('multaNueva45Ctrl', function($ionicHistory, $cordovaGeolocation, $base64, $state,
 $scope, $cordovaCamera, $cordovaFile, $ionicSlideBoxDelegate, $rootScope, 
 $localstorage, $ionicPlatform) {
   var posOptions = {timeout: 10000, enableHighAccuracy: false};
   $cordovaGeolocation.getCurrentPosition(posOptions)	
		   .then(function (position) {
			      var lat  = position.coords.latitude
			      var long = position.coords.longitude
			      console.log(lat + '   ' + long)

		   }, function(err) {
		      		console.log(err)
   });
	$rootScope.selectedZone;
	$scope.clampWarning = $rootScope.clampWarn;
	$scope.holdzones = $localstorage.getObject('zones');
	var e = "";
	 // console.log("Loading all possible zones: ", $scope.holdzones.zones);	 
	 $scope.zones = $scope.holdzones.zones;	 
	 $scope.infractionCancel = function(){
		$ionicHistory.nextViewOptions({
			disableAnimate: true,
			disableBack: true,
			historyRoot: true
		});

		$rootScope.position = "";
		$rootScope.infractions = [];
		$rootScope.bool = true;
		$rootScope.clampWarn = false;
		$rootScope.createdVehicle = "";
		$rootScope.create = false;
		$rootScope.incorrectInformationComment = null
		$ionicHistory.clearCache();
		$ionicHistory.clearHistory();
		$state.go('cAAMpusInfraction.cAAMpusInfraction2', {}, {reload: true});
	}
	 $scope.showSelectValue = function(mySelect) {
	 	console.log("Selected Zone: ", mySelect);
	 	//console.log("Selected ZoneID: ", id);
	 	$rootScope.selectedZone = mySelect;
	 	//console.log("Saved selected Zone: ", $rootScope.selectedZone);
	 	e = "true";
	 }
	 $rootScope.images = []; 
	
    //gives access to system camera. Allows up to three pictures to be taken
    $scope.takePicture = function(){
    	  document.addEventListener("deviceready", function () {

    var options = {
      quality: 100,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: false,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 900,
      targetHeight: 1000,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
	  correctOrientation:true
    }; 

    	if($rootScope.images.length <= 2){   
    		$cordovaCamera.getPicture(options).then(function(data){				
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

    });
}



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
.controller('multaNueva55Ctrl', function($state, $scope, $ionicHistory, $localstorage,
 $rootScope, $ionicSlideBoxDelegate, DownloadAll, $ionicPlatform) {
	$scope.selectedZone = $rootScope.selectedZone;
	$scope.holdVehicles = $localstorage.getObject('vehicles');
	$scope.vehicle = {};
	$scope.clampWarning = $rootScope.clampWarn;
	//console.log("position: ", $rootScope.position);
	if($rootScope.position == -1){
		$scope.vehicle = $rootScope.createdVehicle;
		console.log("created vehcile: ", $scope.vehicle)
	}
	else{
		$scope.vehicle = $scope.holdVehicles.vehicles[$rootScope.position];
	}	
	$scope.cantidadMonetaria = $rootScope.fee
	$scope.infrac = $rootScope.infractions;
	$scope.id_violations = $rootScope.id_violations;
	$scope.images = $rootScope.images;
	$scope.image = $rootScope.image;
	$ionicSlideBoxDelegate.update();
	$scope.mainComment = $rootScope.main_comment;
	$scope.officer = DownloadAll.currentUser();
	var incorrectVehicleInfo =  $rootScope.incorrectInformationComment;
	//console.log("officer name: ", $scope.officer);
	var ZoneID = $scope.selectedZone.substring(0,3);
	var n = $scope.officer.firstName.substring(0,3);
	var date = new Date();
	var month = ""+date.getMonth();	
	var dates = ""+date.getDate();
	var min =""+date.getMinutes();
	var hour = ""+date.getHours();
	var sec =""+date.getSeconds(); 
	var x = Math.floor((Math.random() * 10) + 1);
	$scope._id = n.concat(month,dates, hour,min,sec,x,$scope.vehicle.licensePlateID);
	//create infraction Object
	var highestViolation = "";
	console.log("ZoneId: ", ZoneID);
	for(var i =0; i<$scope.infrac.length ; i++){
		if($scope.infrac[i].fee == $rootScope.fee){
			highestViolation = $scope.infrac[i]._id;
		}
	}

   Number.prototype.padLeft = function(base,chr){
   var  len = (String(base || 10).length - String(this).length)+1;
   return len > 0? new Array(len).join(chr || '0')+this : this;
	}
	Date.prototype.addDays = function(days) {
		    this.setDate(this.getDate() + parseInt(days));
		    return this;
		};
	$scope.fecha = new Date()
	var d = new Date();
	var dd = new Date();
	if(dd.getDay() == 1 || dd.getDay() > 2 && dd.getDay() < 7){
		dd = dd.addDays(7)
	}
	else if(dd.getDay() == 0){
		dd = dd.addDays(5)
	}
	else if(dd.getDay() == 7){
		dd = dd.addDays(6)
	}
	else{
		dd = dd.addDays(7);
	}
	
	 createTime = [ d.getFullYear().padLeft(),
                    (d.getMonth()+1).padLeft(),
                    d.getDate()].join('-')+
                    ' ' +
                  [ d.getHours().padLeft(),
                    d.getMinutes().padLeft(),
                    d.getSeconds().padLeft()].join(':');
     citationDate = [ dd.getFullYear().padLeft(),
                    (dd.getMonth()+1).padLeft(),
                    dd.getDate()].join('-')+
                    ' ' +
                  [ dd.getHours().padLeft(),
                    dd.getMinutes().padLeft(),
                    dd.getSeconds().padLeft()].join(':');
      $scope.citation =  new Date(citationDate);
     console.log("citation day: ", citationDate);
     console.log("created time : ", createTime);

	var infraction = {
		infractionNumber: $scope._id,
		officerID: $scope.officer._id,		
		vehicle: $scope.vehicle,
		infractionStatusID: 6,
		zoneID: ZoneID, 
		feeAmount: $rootScope.fee,
		licensePlateID: $scope.vehicle.licensePlateID,
		highestViolation:highestViolation,
		isCancelled: false,
		mainComment: $scope.mainComment, 
		cancellationComment: null,
		flaggedComment: incorrectVehicleInfo,		
		creatorID: $scope.officer._id,
		createTime: createTime,
		citationDate: citationDate ,
		uploadTime: createTime,
		zone: $scope.selectedZone,
		violations_name: $scope.infrac,
		violations: $scope.id_violations,
		images: $scope.images,				
		officer: $scope.officer.firstName ,
		vehicleFound: $rootScope.position		
	};	

		

	$scope.infractionCancel = function(){
		$ionicHistory.nextViewOptions({
			disableAnimate: true,
			disableBack: true,
			historyRoot: true

		});
		$rootScope.position = "";
		$rootScope.infractions = [];
		$rootScope.bool = true;
		$rootScope.clampWarn = false;
		$rootScope.createdVehicle = "";
		$rootScope.create = false;
		$ionicHistory.clearCache();
		$ionicHistory.clearHistory();
		$state.go('cAAMpusInfraction.cAAMpusInfraction2', {}, {reload: true});
	}
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
		$rootScope.bool = true;
		$rootScope.clampWarn = false;
		console.log("create car : ", $rootScope.create);
		if($rootScope.create == true){
			var car = $rootScope.createdVehicle;
			DownloadAll.addUnregisteredVehicle(car);
			car = "";
		    $rootScope.incorrectInformationComment = null
			$rootScope.createdVehicle = "";
			$rootScope.create = false;
		}
		DownloadAll.addInfraction(infraction);
		console.log("Creating New Infraction: ", infraction);
		$state.go('cAAMpusInfraction.cAAMpusInfraction2');	
	};

	
})

   //view todays infractions controller
   .controller('multasDeHoyCtrl', function($scope, $cordovaNetwork, $ionicLoading, 
   	$localstorage, $state, $ionicPlatform, $timeout, $ionicHistory, DownloadAll, 
   	$ionicPopup, $localForage) {
   	   
   	var vehicles = $localstorage.getObject('UnregisteredVehicle').loadVehicle;
    $scope.userInfraction = [];
    $localForage.getItem('Infractions').then(function(data){  
    $scope.show = false;
		   
		   	if(data === null){	
		   		$scope.show = false;	   		
		   		$ionicPopup.alert({title: '0 Multas Para Procesar',
		   							template: 'No hay multas para procesar'});

		   	}
		   	else{
		   			$scope.infractions = data.loadInfractions;
				   	$scope.show = true;
				   	$scope.userInfraction = [];
				   	var User = DownloadAll.currentUser();
				   	var officer = User.firstName;
		   	for(var i=0; i< $scope.infractions.length;i++){
		   		if($scope.infractions[i].officer == officer){
		   			$scope.userInfraction.push($scope.infractions[i]);


		   		}


		   	}
		   	$state.go('cAAMpusInfraction.multasDeHoy')
		   	if($scope.userInfraction.length == 0){
		   		$ionicPopup.alert({title: '0 Multas Para Procesar',
		   							template: 'No hay multas sin procesar'});
		   	}
		   }
		   	

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

    show = function() {
		    $ionicLoading.show({
			      template: '<ion-spinner icon="spiral"></ion-spinner>'
			    });
		  };
  	hide = function(){
   			 $ionicLoading.hide();
 		 };
	var tempInfractions = []
   	$scope.uploadInfractions = function(){
            //$cordovaNetwork.isOnline()
   			 if(true){
   			 	// $ionicLoading.show({
						  //     template: '<ion-spinner  class="spinner-energized" icon="spiral"></ion-spinner>  		<style> .spinner svg {width: 60px;  height: 60px; }    </style>			  '
						  //   	});
   			    tempInfractions = []; 
   			 	var internet = true;
   			 	var noInternet = true	   	  			
					   	for(var i =0; i<$scope.infractions.length; i++) {
					   			var inf = $scope.infractions[i];
								if ($scope.infractions[i].vehicleFound == -1) {	
									DownloadAll.internetCheck()
						   			.then(function(e) {						   				
						   				
						   				return DownloadAll.UploadVehicles(JSON.stringify(inf.vehicle));
						   			}, function(e){
						   				console.log("console log 2");
						   				
						   				if(i == $scope.infractions.length){
												//$timeout(hide(), 6000);
												$localForage.clear(callAtTimeout(false, true))
												}	
						   				//tempInfractions.push(inf)
						   				
						   			})
									.then(function() {							
										return DownloadAll.UploadInfractions(JSON.stringify(inf));
									}, function(reason){
										console.log("Could not create vehicle");
										DownloadAll.UploadInfractions(JSON.stringify(inf));
																	
									})
									.then(function() {
										console.log("internet false 1" );
										if(internet){					   					

						   					internet = false						   					
						   				}
									}, function(reason){
										console.log("console log 5");
										//tempInfractions.push(inf)								
									});
								}
								else {
									console.log("inside else: Registered car :", inf)
						   			DownloadAll.internetCheck()
						   			.then(function(e) {
						   				console.log("Internet Available: ",  e);
						   				return DownloadAll.UploadInfractions(JSON.stringify(inf));
						   			}, function(e){
						   				console.log("No Internet Available pushing ", e);
										tempInfractions.push(inf)
						   				if(i == $scope.infractions.length){
												//$timeout(hide(), 6000);
												$localForage.clear(callAtTimeout(false, true))
												}					   				
						   				
						   				
						   			})
									.then(function() {
										console.log("Created Infraction internet ");
												console.log(i, $scope.infractions.length )
											if(i == $scope.infractions.length){
												//$timeout(hide(), 6000);
												$localForage.clear(callAtTimeout(true, false))
												}
									}, function(reason){
										if(reason.code == 404){
											console.log("multa ya existe");
										}
										
										if(reason.code != 404){
											tempInfractions.push(inf)
										}
										if(i == $scope.infractions.length && reason.code != 404){												
												$localForage.clear(callAtTimeout(false, true))
												}
										
									});
								}

						
						// else if(i == $scope.infractions.length && !noInternet){
						// 	alert("Multas no fueron procesadas. Trate de nuevo mas tarde")
						// }
						
						}
						
					 			
						
   			 	}
   			 else{
   			 	alert("Device not connected to Wifi/Internet")
   			 }  			
   		 
   		}
   		function hide(){
   			$ionicLoading.hide();
   		}
   		function callAtTimeout(success, fail) {
			    	
			   	    
			   	    console.log(tempInfractions)
			   	    $ionicHistory.nextViewOptions({
						disableAnimate: true,
						disableBack: true,
						historyRoot: true
					});	
			   	    $ionicLoading.hide();
					$ionicHistory.clearCache();
					$ionicHistory.clearHistory();			   	   	
			   	    DownloadAll.clearInfractions();
			   	    DownloadAll.DownloadVehicles();
			   	    if(tempInfractions.length != 0){
			   	    	DownloadAll.addEditedInfraction(tempInfractions)
			   	    }
			   	    if(success){
			   	    	alert("Multas subidas")
			   	    }
			   	    if(fail){
			   	    	alert("Error. Algunas Multas no fueron procesadas. Trate de nuevo mas tarde")
			   	    }
			   	    
			   	    $state.go('cAAMpusInfraction.cAAMpusInfraction2');
		}
   	
   })

//view infraction information view controller. takes care of cancel button and edit button
.controller('informaciNDeMultaCtrl', function($scope, $ionicSlideBoxDelegate, $ionicModal, $localForage, $stateParams, $filter ,$localstorage, $ionicHistory, $window, DownloadAll) {
	$ionicHistory.clearHistory();
	$ionicHistory.clearCache();   
	$scope.infractions = "";
	$scope.infraction = "";
	console.log($stateParams.InfractionID.infractionNumber)
	$ionicModal.fromTemplateUrl('templates/cancelInfraction.html', {
		scope: $scope
	}).then(function(cancel_Infraction) {
		$scope.cancel_Infraction = cancel_Infraction;
	});

	 $localForage.getItem('Infractions').then(function(data){
	 	$scope.infractions = "";
		$scope.infraction = "";
	//$scope.holdInfractions = $localstorage.getObject('Infractions');
	$scope.infractions = data.loadInfractions;	
	$scope.infraction = $filter('filter')($scope.infractions, {infractionNumber:$stateParams.InfractionID})[0];
	
	
	
	$scope.deleteButton = !$scope.infraction.isCancelled;
	$scope.editButton = !$scope.infraction.isCancelled;
	$scope.deleteMessage = $scope.infraction.isCancelled;
	$scope.deleteComment = $scope.infraction.isCancelled;
	$ionicSlideBoxDelegate.update();
	 }) 
	

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
		infractions = $scope.infractions;
		console.log("cancel button pressed. Infractions: ", infractions);
		if(!$scope.comment.main){
			alert("debe entrar un comentario de cancelacion");
		}
		else{
			for(var i=0; i < infractions.length; i++)
			{             
				if(infractions[i].infractionNumber == $scope.infraction.infractionNumber)
				{
					//console.log("match. Now edit and remove old one" , infractions);
					infractions.splice(i,1);
					$scope.infraction.isCancelled = true;
					$scope.infraction.infractionStatusID = 2;
					$scope.infraction.cancellationComment = $scope.comment.main;
					infractions.push($scope.infraction);
					DownloadAll.clearInfractions();
					
				}
			}
		  DownloadAll.addEditedInfraction(infractions);
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
.controller('editInfraction', function($state, $scope, $localForage, $localstorage, $filter, $stateParams, DownloadAll, $ionicHistory) {
	
	$ionicHistory.clearCache();
	$ionicHistory.clearHistory();
	$scope.infractions = "";
	$scope.infraction = "";
	 $localForage.getItem('Infractions').then(function(data){
	 		$scope.infractions = "";
			$scope.infraction = "";
			$scope.infractions = data.loadInfractions;
			$scope.infraction = $filter('filter')($scope.infractions, {infractionNumber:$stateParams.InfractionID})[0];
			$scope.hold = $localstorage.getObject('typeInfractions');
			$scope.assets = $scope.hold.violations;	
			$scope.isChecked = false;
			$scope.selected = [];
			$scope.IDselected = [];
			$scope.name = [];
			

	 })
	
			var infractions = [];
			$ionicHistory.clearCache();
			$ionicHistory.clearHistory();
			
	$scope.hasViolation = function(violation) {
		
		if ($scope.infraction.violations.indexOf(violation._id) !== -1){
			$scope.selected.push(violation);
			
			$scope.IDselected.push(violation._id);
			
		}
		return $scope.infraction.violations.indexOf(violation._id) !== -1;
	};
	$scope.checkedOrNot = function (asset, isChecked, index) {
		if (isChecked) {
			$scope.selected.push(asset);
			$scope.IDselected.push(asset._id);
			$scope.name.push(asset);
			
		} else {
			var _index = $scope.selected.indexOf(asset);
			$scope.selected.splice(_index, 1);
			$scope.IDselected.splice(_index, 1);
			$scope.name.splice(_index, 1);
			
		}
	};

	$scope.saveChanges = function(){
		infractions = $scope.infractions
		if($scope.selected.length == 0){
			alert("Debe seleccionar alguna infraccion");
		}
		else{
			$ionicHistory.clearCache();
			$ionicHistory.clearHistory();
			//infractions = $localstorage.getObject('Infractions')
			for(var i=0; i < infractions.length; i++)
			{             
				if(infractions[i].infractionNumber == $scope.infraction.infractionNumber)
				{

						infractions.splice(i,1);
		             	//add new things to infraction
		             	$scope.infraction.violations_name = $scope.selected;
		             	$scope.infraction.violations =  $scope.IDselected;		             	
		             	$scope.infraction.mainComment = $scope.infraction.mainComment;		             	
		             	infractions.push($scope.infraction);		             	
		      			DownloadAll.clearInfractions();               	
		             	
		             	$scope.infraction = "";
		             	$scope.IDselected = "";
		             	$scope.selected = "";
		             	$scope.infractions = "";
						$scope.infraction = "";
		             }
		         }  
		         DownloadAll.addEditedInfraction(infractions);
		         infractions = "";	
		         $ionicHistory.clearCache();
				 $ionicHistory.clearHistory();	
		         $state.go('cAAMpusInfraction.multasDeHoy', {}, {reload: true});	
		     }
		 };
		}) //35

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

 .controller('informaciNDeUsuarioCtrl', function($scope) {

 })

 .controller('cAAMpusInfractionCtrl', function($scope, $state, DownloadAll, $ionicHistory) {
 			$scope.user = DownloadAll.currentUser();
 			$scope.logout = function(){
		 			$ionicHistory.nextViewOptions({
					disableAnimate: true,
					disableBack: true,
					historyRoot: true
					});
					DownloadAll.logout();
					$state.go('logIn', {}, {reload: true});
 			}
 })


 