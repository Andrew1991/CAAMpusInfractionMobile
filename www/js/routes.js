angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

  
      
    .state('cAAMpusInfraction', {
      url: '/side-menu',
      abstract:true,
      templateUrl: 'templates/cAAMpusInfraction.html'
    })
      
    
      
        
    .state('logIn', {
      url: '/login',
      templateUrl: 'templates/logIn.html'
    })
        
      
    
      
        
    .state('multaNueva14', {
      url: '/new_ticket1',
      templateUrl: 'templates/multaNueva14.html',
      controller: 'multaNueva14Ctrl'
    })   
    
      
        
    .state('cAAMpusInfraction.multasDeHoy', {
      url: '/todays_tickets',      
      views: {
        'side-menu21': {
          templateUrl: 'templates/multasDeHoy.html',
          controller: 'multasDeHoyCtrl',
        }
      }
    })
        
      
    
      
        
    .state('multaNueva24', {
      url: '/new_ticket2',
      templateUrl: 'templates/multaNueva24.html'
    })
        
      
    
      
        
    .state('multaNueva35', {
      url: '/new_ticket3',
      templateUrl: 'templates/multaNueva35.html',
      controller: 'multaNueva35Ctrl'
    })
        
      
    
      
        
    .state('multaNueva55', {
      url: '/new_ticket5',
      templateUrl: 'templates/multaNueva55.html',
      controller: 'multaNueva55Ctrl'
    })

     .state('registerVehicle', {
      url: '/new_vehicle',
      templateUrl: 'templates/newVehicle.html',
      controller: 'newVehicleCtrl'
    })
        
      
    
      
        
    .state('informaciNDeMulta', {
      url: '/view_ticket/:InfractionID',
      templateUrl: 'templates/informaciNDeMulta.html',
      controller: 'informaciNDeMultaCtrl'
    })

    .state('editInfraction', {
      url: '/infraction_edit/:InfractionID',
      templateUrl: 'templates/editInfraction.html',
      controller: 'editInfraction'
    })    
      
        
    .state('multaNueva45', {
      url: '/new_ticket4',
      templateUrl: 'templates/multaNueva45.html',
      controller: 'multaNueva45Ctrl'
    })
        
      
    
      
        
    .state('cAAMpusInfraction.cAAMpusInfraction2', {
      url: '/start',
      controller: 'cAAMpusInfraction2Ctrl',
            views: {
        'side-menu21': {
          templateUrl: 'templates/cAAMpusInfraction2.html',
          controller: 'cAAMpusInfraction2Ctrl'
        }
      }
    })
        
      
    
      
        
    .state('multaNueva25', {
      url: '/new_ticket2_unregistered',
      templateUrl: 'templates/multaNueva25.html',
       controller: 'multaNueva25Ctrl'
    })
        
      
    
      
        
    .state('cAAMpusInfraction.informaciNDeUsuario', {
      url: '/user_info',
      views: {
        'side-menu21': {
          templateUrl: 'templates/informaciNDeUsuario.html'
        }
      }
    })
        
      
    
      
        
    .state('editarMulta', {
      url: '/edit_ticket',
      templateUrl: 'templates/editarMulta.html'
    })
        
      
    ;

  // if none of the above states are matched, use this as the fallback
  
  $urlRouterProvider.otherwise('/login');
  

  

});