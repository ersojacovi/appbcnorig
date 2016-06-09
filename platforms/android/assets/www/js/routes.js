angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js

  $ionicConfigProvider.tabs.position('bottom');

  $stateProvider

  /* ****** */
	/* INICIO */
	/* ****** */
    .state('tabsController.inicio', {
      cache: false,
      url: '/page2',
      views: {
        'tab1': {
          templateUrl: 'templates/inicio.html',
          controller: 'inicioCtrl',
        }
      }
    })

	/* *********** */
 	/* PROPIEDADES */
	/* *********** */

    // Listado de ubicaciones (calabria, paseo de gracia, rambla catalunya)
    .state('tabsController.propiedades', {
      cache: false,
      url: '/page3',
      views: {
        'tab2': {
          templateUrl: 'templates/propiedades.html',
          controller: 'propiedadesCtrl'
        }
      }
    })

    // Propiedades de una ubicación escogida
    .state('tabsController.propsxubicacion',{
      cache: false,
      url:'/propsxubicacion/:id',
      views: {
        'tab2': {
            templateUrl: 'templates/propsxubicacion.html',
            controller:'propsxubicacionCtrl'
        }
      }
    })

    //Ficha de una propiedad
    .state('tabsController.propiedad',{
      cache: false,
      url:'/propiedad/:id',
      views: {
        'tab2': {
            templateUrl: 'templates/propiedad.html',
            controller:'propiedadCtrl'
        }
      }
    })

    // Pantalla para reservar 
    .state('tabsController.reservar',{
      cache: false,
      url:'/reserva/:id',
      views: {
        'tab2': {
            templateUrl: 'templates/reserva.html',
            controller:'reservasCtrl'
        }
      }
    })



    /* .state('propiedad',{
      cache: false,
      url:'/propiedad/:id',
      templateUrl: 'templates/propiedad.html',
      controller:'propiedadCtrl'
    })*/

  /* ********************** */
  /* LUGARES INTERES (MAPA) */
	/* ********************** */
    .state('tabsController.lugaresinteres', {
      cache: false,
      url: '/page4',
      views: {
        'tab3': {
          templateUrl: 'templates/places.html',
          controller: 'MapController'
        }
      }
    })

	/* *************************** */
	/* OFERTA DE LOS COLABORADORES */
	/* *************************** */
    .state('tabsController.ofertas', {
      cache: false,
      url: '/page5',
      views: {
        'tab5': {
          templateUrl: 'templates/ofertas.html',
          controller: 'ofertaCtrl'
        }
      }
    })

	/* ******************** */
  /* TELEFONOS DE INTERES */
	/* ******************** */
    .state('tabsController.interes', {
      cache: false,
      url: '/page6',
      views: {
        'tab6': {
          templateUrl: 'templates/interes.html',
          controller: 'interesCtrl'
        }
      }
    })

  /* ********* */
  /* FAVORITOS */
  /* ********* */
  .state('tabsController.favorites', {
    cache: false,
    url: '/page7',
    views: {
      'tab7': {
        templateUrl: 'templates/favoritos.html',
        controller: 'FavoritesCtrl'
      }
    }
  })

  /* **** */
	/* TABS */
	/* **** */
    .state('tabsController', {
      url: '/page1',
      abstract:true,
      templateUrl: 'templates/tabsController.html'
    })

  /* ***** */
  /* LOGIN */
  /* ***** */

  /*   .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
    });
  */

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/page1/page2');
    //$urlRouterProvider.otherwise('/login');

});
