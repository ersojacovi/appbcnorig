// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var exampleapp=angular.module('app', ['ionic', 'app.controllers', 'app.routes', 'app.services', 'app.directives','pascalprecht.translate','ngCordova','jett.ionic.filter.bar','credit-cards'])

// *****************************************************************************************************************

.config(function($stateProvider, $urlRouterProvider, $translateProvider) {
    /* ********************** TRADUCCIONES *********************** */
    $translateProvider.translations('En', {
        hello_message: "Howdy",
        goodbye_message: "Goodbye",
        properties: "Properties",
        property:"Property",
        home:" Home",
        search: "Search",
        favs:"Properties",
        restaurants: "Places",
        chat: "Useful info",
        gifts: "Offers",
        youarehere:"You Are Here!",
        languages:"Languages",
        back:"Back",
        reserva:"Check Availability",
        un_dormitorio:"1 Bedroom",
        dos_dormitorios:"2 Bedrooms",
        tres_dormitorios:"3 Bedrooms",
        cuatro_dormitorios:"4 Bedrooms",
        cinco_dormitorios:"5+ Bedrooms",
        checkin:"Checkin",
        checkout:"Checkout",
        persons:"Guests",
        submit:"Booking Confirnation",
        cancel:"Cancel",
        Username:"Username",
        Psw:"Password",
        todate:"To ",
        nameclient:"Name",
        surnameclient:"Surname",
        phoneclient:"Phone",
        addressclient:"Address",
        passportclient:"Passport",
        emailclient:"Email"
    });

   $translateProvider.translations('Es', {
        hello_message: "Hola",
        goodbye_message: "Adios",
        properties: "Propiedades",
        property:"Propiedad",
        home: "Inicio",
        search: "Buscar",
        favs:"Propiedades",
        restaurants: "Sitios de interes",
        chat: "Informacion",
        gifts:"Ofertas",
        youarehere:"Está aquí!",
        languages:"Idiomas",
        back:"Volver",
        reserva:"Comprueba Disponibilidad",
        un_dormitorio:"1 Dormitorio",
        dos_dormitorios:"2 Dormitorios",
        tres_dormitorios:"3 Dormitorios",
        cuatro_dormitorios:"4 Dormitorios",
        cinco_dormitorios:"5+ Dormitorios",
        checkin:"Entrada",
        checkout:"Salida",
        persons:"Personas",
        submit:"Confirmar reserva",
        cancel:"Cancelar",
        Username:"Usuario",
        Psw:"Password",
        todate:"Hasta ",
        nameclient:"Nombre",
        surnameclient:"Apellidos",
        phoneclient:"Telefono",
        addressclient:"Direccion",
        passportclient:"Dni",
        emailclient:"Email"
    });

    $translateProvider.translations('Fr', {
        hello_message: "Bonjour",
        goodbye_message: "Adieu",
        properties: "Proprietes",
        property:"Propriete",
        home: "Initiation",
        search: "Recherche",
        favs:"Propriétés",
        restaurants: "Lieux d'interêt",
        chat: "Information",
        gifts:"Offres",
        youarehere:"Vous etes ici!",
        languages:"Langues",
        back:"Revenir",
        reserva:"Check Disponible",
        un_dormitorio:"1 chambre",
        dos_dormitorios:"2 chambres",
        tres_dormitorios:"3 chambres",
        cuatro_dormitorios:"4 chambres",
        cinco_dormitorios:"5+ chambres",
        checkin:"Checkin",
        checkout:"Check-out",
        persons:"Personnes",
        submit:"Confirmer reservation",
        cancel:"Annuler",
        Username:"Username",
        Psw:"Mot de passe",
        todate:"A ",
        nameclient:"Prénom",
        surnameclient:"Nom",
        phoneclient:"Portable",
        addressclient:"Rue",
        passportclient:"Passport",
        emailclient:"Email"
      });
    $translateProvider.translations('It', {
        hello_message: "Chao",
        goodbye_message: "Chao",
        properties: "Proprieta",
        property:"Proprieta",
        home: "Iniziazione",
        search: "Ricerca",
        favs:"Proprieta",
        restaurants: "Luoghi",
        chat: "Informazione",
        gifts:"Offerte",
        youarehere:"Tu sei qui!",
        languages:"Le lingue",
        back:"Ritorno",
        reseerva:"Controllo Disponibilità",
        un_dormitorio:"1 camera",
        dos_dormitorios:"2 camere",
        tres_dormitorios:"3 camere",
        cuatro_dormitorios:"4 camere",
        cinco_dormitorios:"5+ camere",
        checkin:"Checkin",
        checkout:"Check-out",
        persons:"Persone",
        submit:"Confirmare riserva",
        cancel:"cancellare",
        Username:"Nome",
        Psw:"Password",
        odate:"A ",
        nameclient:"Nomi",
        surnameclient:"Cognomi",
        phoneclient:"Cellulare",
        addressclient:"Indirizzo",
        passportclient:"Passport",
        emailclient:"Email"
      });

    $translateProvider.preferredLanguage("En");
    $translateProvider.fallbackLanguage("En");
    $translateProvider.useSanitizeValueStrategy('sanitize');
})

// *****************************************************************************************************************

.run(function($ionicPlatform, $translate,$window) {
  $ionicPlatform.ready(function() {
    if (ionic.Platform.isIOS())
    {
      ionic.Platform.fullScreen();
      if (window.StatusBar) {
        return StatusBar.hide();
      }
    }
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if($window.cordova && $window.cordova.plugins.Keyboard) {
      $window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      $window.cordova.plugins.Keyboard.disableScroll(true);
    }
    if($window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    //console.log("window.stripe ", window.stripe);
    //alert (JSON.stringify(window.stripe));

    if(typeof navigator.globalization !== "undefined") {
      navigator.globalization.getPreferredLanguage(function(language) {
        $translate.use((language.value).split("-")[0]).then(function(data) {
          console.log("SUCCESS -> " + data);
        }, function(error) {
          console.log("ERROR -> " + error);
        });
      }, null);
    }
  });
})
