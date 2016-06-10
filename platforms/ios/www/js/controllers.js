angular.module('app.controllers', ['ionic','ngCordova','ui.bootstrap','jett.ionic.filter.bar','ksSwiper','LocalStorageModule','ionic-datepicker','credit-cards'])

/* ********************* */
/* CONTROLADOR DE INICIO */
/* ********************* */
.controller('inicioCtrl', function($scope, $translate, PortadaService, PropService, $timeout,  $ionicFilterBar, FavoritesService, $ionicPopup) {

  console.log("INICIO");

  $scope.$on('$ionicView.beforeEnter', function(){
    PortadaService.GetPortadas($translate).then(function(regs){
      $scope.regs = regs.data;
    });
    PropService.GetProps().then(function(props){
  		$scope.props = props.data;
  	});
  });
  var filterBarInstance;

  $scope.showFilterBar = function () {
    filterBarInstance = $ionicFilterBar.show({
      items: $scope.regs,
      update: function (filteredItems, filterText) {
        $scope.regs = filteredItems;
        if (filterText) {
          console.log(filterText);
        }
      }
    });
  };

  $scope.refreshItems = function () {
    if (filterBarInstance) {
      filterBarInstance();
      filterBarInstance = null;
    }

    $timeout(function () {
      $scope.regs=regs.data;
      $scope.$broadcast('scroll.refreshComplete');
    }, 1000);
  };

  // AÑADIR PROPIEDAD A FAVORITOS
  $scope.addFavorite = function(favorite) {
    //console.log("-"+JSON.stringify(favorite)+"-");
    FavoritesService.add(favorite);
    $scope.favorites = FavoritesService.getFavorites();
    //console.log("-"+JSON.stringify($scope.favorites)+"-");
    //console.log("esfav:"+FavoritesService.isFavorite(favorite));
    var alertPopup = $ionicPopup.alert({
      title: favorite['nameprop'],
      template: '<img src="img/props_hd/'+favorite.idprop+'/'+favorite.imagen+'"><br/>Added to favorites! ;)'
    });
  };


  // COMPRUEBA SI PROPIEDAD ESTÁ EN FAVORITOS
  $scope.isfavorite=function(idprop) {
    //console.log("esfav: "+idprop+"-"+FavoritesService.isFavorite(idprop));
    return FavoritesService.isFavorite(idprop);
  }


  // BORRA PROPIEDAD DE FAVORITOS
  $scope.deleteFavorite = function(property) {
      //console.log("-"+JSON.stringify(property)+"-");
      $scope.favorites = FavoritesService.deleteByProperty(property);
      //console.log("-"+JSON.stringify($scope.favorites)+"-");
      //console.log("ya no es favorito "+ property['idprop']);
      var alertPopup = $ionicPopup.alert({
        title: property['nameprop'],
        template: '<img src="img/props_hd/'+property.idprop+'/'+property.imagen+'"><br/>Deleted from favorites! :('
      });
  }

})

/* ************************** */
/* CONTROLADOR DE PROPIEDADES */
/* ************************** */
/* .controller('propiedadesCtrl', function($scope,PropService,$translate) {
	PropService.GetProps().then(function(props){
		$scope.props = props.data;
	});
})*/

.controller('propiedadesCtrl', function($scope,UbicacionesService,$translate) {
  console.log("LISTA DE UBICACIONES");
	UbicacionesService.GetUbicaciones().then(function(ubicaciones){
		$scope.locations = ubicaciones.data;
	});
})


/* *************************************** */
/* CONTROLADOR DE PROIEDADES POR UBICACION */
/* *************************************** */
.controller('propsxubicacionCtrl', function($scope,PropService,$stateParams,FavoritesService,$ionicPopup){
  console.log("PROPIEDADES DE UNA UBICACION");
  var ubicId=$stateParams.id;
  $scope.propsxubicacion=PropService.GetPropsxUbicacion(ubicId);

  // AÑADIR PROPIEDAD A FAVORITOS
  $scope.addFavorite = function(favorite) {
    //console.log("-"+JSON.stringify(favorite)+"-");
    FavoritesService.add(favorite);
    $scope.favorites = FavoritesService.getFavorites();
    //console.log("-"+JSON.stringify($scope.favorites)+"-");
    //console.log("esfav:"+FavoritesService.isFavorite(favorite));
    var alertPopup = $ionicPopup.alert({
      title: favorite['nameprop'],
      template: '<img src="img/props_hd/'+favorite.idprop+'/'+favorite.imagen+'"><br/>Added to favorites! ;)'
    });
  };

  // COMPRUEBA SI PROPIEDAD ESTÁ EN FAVORITOS
  $scope.isfavorite=function(idprop) {
    //console.log("esfav: "+idprop+"-"+FavoritesService.isFavorite(idprop));
    return FavoritesService.isFavorite(idprop);
  };


})

/* **************************** */
/* CONTROLADOR DE UNA PROPIEDAD */
/* **************************** */
.controller("propiedadCtrl", function($scope,$stateParams,PropService,DatesService,$log, $cordovaGeolocation, $ionicLoading , $ionicPlatform,$ionicHistory, FavoritesService,$cordovaSocialSharing,$translate,$http, $ionicPopup){
    console.log("UNA PROPIEDAD");

    var propId = $stateParams.id;
    //console.log("idprop="+propId);
    $scope.prop = PropService.GetProp(propId);

      /* **************** SWIPER ************* */

      $scope.swiper = {};

      $scope.onReadySwiper = function (swiper) {
        swiper.on('slideChangeStart', function () {
            console.log('slide start');
        });

        swiper.on('onSlideChangeEnd', function () {
            console.log('slide end');
        });
      };

    /* ************** CARROUSEL *********** */
    var nimages=$scope.prop['nimages'];
    //console.log(nimages);
    $scope.myInterval = 3000;
    $scope.noWrapSlides = false;
    var slides = $scope.slides = [];
    for (var i=1; i<=nimages; i++) {
      slides.push({
        image: 'img/props_hd/' + propId + '/bcnapartmentrentals-' + propId + '-' + i + '.jpg'
      });
    }

    /* ***************** AMENITIES ************** */

    var amenities=$scope.prop['pfeatures'];
    var amenities_count = 0;
    for(var e in amenities)
    {
        if(amenities.hasOwnProperty(e))
        {
            amenities_count++;
        }
    }

    var imgamenities=$scope.imgamenities=[];
    for (var i=0; i<amenities_count; i++) {
      //console.log(amenities[i]);
      var amenity=amenities[i];
      if(amenity!=116)
      {
        imgamenities.push({
          image:'img/features/'+amenity+'.png'
        });
      }
    }

    /* **************** MAPA ******************** */

    if ($scope.map!=undefined){
      $scope.map.remove();
    }

    var bcnpoint = L.icon({ iconUrl: 'img/bcnpoint.png',popupAnchor:[0,-37], iconAnchor:[17, 34]});

    var cloudmade = new L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
          attribution: 'Tiles Courtesy of MapBox',
          id: 'mapbox.streets-basic',
          accessToken: 'pk.eyJ1IjoieGF2aWVyY29zbyIsImEiOiJjaW5oYW93OTIwMDB5dnhseWQ2dGlkMjRtIn0.6tQwjQGUM0Zp9G7mmbOggg'
    });

    $scope.map = new L.map('maprop',{dragging:true,maxZoom:16,minZoom:16,layers:[cloudmade]}).setView([$scope.prop['latitude'], $scope.prop['longitude']], 16);

    var marker = new L.marker([$scope.prop['latitude'], $scope.prop['longitude']],{icon: bcnpoint}).addTo($scope.map);

    /* ************** RELACIONADOS ****************** */

    var relatedp=$scope.prop['relacionados'];
    var related_count = 0;
    for(var e in relatedp)
    {
        if(relatedp.hasOwnProperty(e))
        {
            related_count++;
        }
    }

    var relprops=$scope.relprops=[];
    for (var i=0; i<related_count; i++) {
      var rel_prop=relatedp[i];
      ///console.log(rel_prop);
      relprops.push({
        idprop:rel_prop['idprop'],
        imagen:rel_prop['imagen'],
        nameprop:rel_prop['nameprop'],
        minprecio:rel_prop['minprecio'],
        estrellas:rel_prop['estrellas'],
        numhab:rel_prop['numhab']
      });
    }

    /* ********** FAVORITOS ********** */

    // Add a new favorite using the service
    $scope.addFavorite = function(favorite) {
      FavoritesService.add(favorite);
      $scope.favorites = FavoritesService.getFavorites();
      var alertPopup = $ionicPopup.alert({
        title: favorite['nameprop'],
        template: '<img src="img/props_hd/'+favorite.idprop+'/'+favorite.imagen+'"><br/>Added to favorites! ;)'
      });
    };

    $scope.isfavorite=function(idprop) {
      //console.log("esfav: "+idprop+"-"+FavoritesService.isFavorite(idprop));
      return FavoritesService.isFavorite(idprop);
    }

    $scope.deleteFavorite = function(property) {
        //console.log("-"+JSON.stringify(property)+"-");
        $scope.favorites = FavoritesService.deleteByProperty(property);
        //console.log("-"+JSON.stringify($scope.favorites)+"-");
        //console.log("ya no es favorito "+ property['idprop']);
        var alertPopup = $ionicPopup.alert({
          title: property['nameprop'],
          template: '<img src="img/props_hd/'+property.idprop+'/'+property.imagen+'"><br/>Deleted from favorites! :('
        });
    }


    /* ********* VOLVER A LA PÁGINA ANTERIOR ********* */
    $scope.goBack = function(){
      $ionicHistory.goBack();
      $ionicHistory.clearHistory();
    }

  /* ************** COMPARTIR ************* */
    $scope.shareAnywhere = function() {
       $cordovaSocialSharing.share("This is your message", "This is your subject", "www/imagefile.png", "http://blog.nraboy.com");
   }

   $scope.shareViaTwitter = function(message, image, link) {
       $cordovaSocialSharing.canShareVia("twitter", message, image, link).then(function(result) {
           $cordovaSocialSharing.shareViaTwitter(message, image, link);
       }, function(error) {
           alert("Cannot share on Twitter");
       });
   }

  //});
})

/* ********************** */
/* CONTROLADOR DE RESERVA */
/* ********************** */
.controller('reservasCtrl',function($scope,$stateParams,PropService,$http,$translate,ionicDatePicker,$ionicHistory){
  console.log("PAGINA DE RESERVA");

  var propId = $stateParams.id;
  //console.log("idprop="+propId);
  var resprop=$scope.prop = PropService.GetProp(propId);

  var npersons=$scope.npersons=[];

  for(var i=1;i<=resprop['maxpeople'];i++)
  {
    npersons.push(i);
  }

  /* ********* VOLVER A LA PÁGINA ANTERIOR ********* */
  $scope.goBack = function(){
    $ionicHistory.goBack();
  }

  /* *********************************** */

  $scope.putvalueout=function(reservation)
  {
    console.log("cambio out");
    reservation.checkout=reservation.checkin;
  }

  /* *********************************** */


  $scope.cardType = {};
  $scope.card = {};

  $scope.makeStripePayment = makeStripePayment;

  function makeStripePayment(reservation, cardinfo) {

    if (!window.stripe) {
        alert("stripe plugin not installed");
        return;
    }

    if (!cardinfo) {
        alert("Invalid Card Data");
        return;
    }

    alert(JSON.stringify(cardinfo));
    alert(JSON.stringify(reservation));

    stripe.charges.create({
      // amount is in cents so * 100
        amount: cardinfo.amount * 100,
        currency: 'eur',
        card: {
          "number": cardinfo.number,
          "exp_month": cardinfo.exp_month,
          "exp_year": cardinfo.exp_year,
          "cvc": cardinfo.cvc,
          "name": cardinfo.person_name
        },
        description: "Reservation by "+cardinfo.person_name+ " for property "+reservation.nameprop
      },
      function(response) {
        console.log(JSON.stringify(response, null, 2));
        alert("OK\n\n"+JSON.stringify(response, null, 2));
        alert("SAVE BOOKING");
      },
      function(response) {
        alert("KO\n\n"+JSON.stringify(response));
        alert("ERROR");
      } // error handler
    );
  }

  $scope.calcprice= function(reservation,cardinfo){
    console.log("calculando");
    console.log(reservation);
    var langact=$translate.use();
    var link = 'http://www.bcnapartmentrentals.com/app/appcall/compruebareserva.php';

    console.log(link+"?checkin="+reservation.checkin+"&checkout="+reservation.checkout+"&persons="+reservation.persons+"&idprop="+reservation.idprop+"&langact="+langact);

    $http.get(link+"?checkin="+reservation.checkin+"&checkout="+reservation.checkout+"&persons="+reservation.persons+"&idprop="+reservation.idprop+"&langact="+langact).then(function (res){
      reservation.price = res.data;
      cardinfo.amount=res.data
      console.log(reservation.price);
    });

  }

})

/* ********************* */
/* CONTROLADOR DEL MODAL */
/* ********************* */
.controller('ModalInstanceCtrl', function($scope, $uibModalInstance, prop, $http,$translate,ionicDatePicker) {

  console.log("MODAL");

  $scope.prop = prop;
  /* *************************** */

  $scope.datepickerObject = {
        titleLabel: 'Title',  //Optional
        todayLabel: 'Today',  //Optional
        closeLabel: 'Close',  //Optional
        setLabel: 'Set',  //Optional
        setButtonType : 'button-assertive',  //Optional
        todayButtonType : 'button-assertive',  //Optional
        closeButtonType : 'button-assertive',  //Optional
        inputDate: new Date(),  //Optional
        mondayFirst: true,  //Optional
        disabledDates: disabledDates, //Optional
        weekDaysList: weekDaysList, //Optional
        monthList: monthList, //Optional
        templateType: 'popup', //Optional
        showTodayButton: 'true', //Optional
        modalHeaderColor: 'bar-positive', //Optional
        modalFooterColor: 'bar-positive', //Optional
        from: new Date(2012, 8, 2), //Optional
        to: new Date(2018, 8, 25),  //Optional
        callback: function (val) {  //Mandatory
            datePickerCallback(val);
        },
        //dateFormat: 'dd-MM-yyyy', //Optional
        dateFormat: 'yyyy-MM-dd', //Optional
        closeOnSelect: false //Optional
    };

  $scope.datepickerObject2 = {
        titleLabel: 'Title',  //Optional
        todayLabel: 'Today',  //Optional
        closeLabel: 'Close',  //Optional
        setLabel: 'Set',  //Optional
        setButtonType : 'button-assertive',  //Optional
        todayButtonType : 'button-assertive',  //Optional
        closeButtonType : 'button-assertive',  //Optional
        inputDate: new Date(),  //Optional
        mondayFirst: true,  //Optional
        disabledDates: disabledDates, //Optional
        weekDaysList: weekDaysList, //Optional
        monthList: monthList, //Optional
        templateType: 'popup', //Optional
        showTodayButton: 'true', //Optional
        modalHeaderColor: 'bar-positive', //Optional
        modalFooterColor: 'bar-positive', //Optional
        from: new Date(2012, 8, 2), //Optional
        to: new Date(2018, 8, 25),  //Optional
        callback: function (val) {  //Mandatory
            datePickerCallback2(val);
        },
        //dateFormat: 'dd-MM-yyyy', //Optional
        dateFormat: 'yyyy-MM-dd', //Optional
        closeOnSelect: false //Optional
    };

  var disabledDates = [
        new Date(1437719836326),
        new Date(),
        new Date(2015, 7, 10), //months are 0-based, this is August, 10th!
        new Date('Wednesday, August 12, 2015'), //Works with any valid Date formats like long format
        new Date("08-14-2015"), //Short format
        new Date(1439676000000) //UNIX format
    ];

  var weekDaysList = ["Sun", "Mon", "Tue", "Wed", "thu", "Fri", "Sat"];

  var monthList = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

  var datePickerCallback = function (val) {
    if (typeof(val) === 'undefined') {
        console.log(' : No date selected');
    } else {
        console.log('Selected date is : ', val);
        $scope.reservation.checkin = val;

    }
 };

 var datePickerCallback2 = function (val) {
        if (typeof(val) === 'undefined') {
            console.log(' : No date selected');
        } else {
            console.log('Selected date is : ', val);
            $scope.reservation.checkout = val;
        }
  };

  /* *************************** */

  $scope.ok = function (reservation) {

    var langact=$translate.use();
    var link = 'http://www.bcnapartmentrentals.com/app/compruebareserva.php';

    $http.get(link+"?checkin="+reservation.checkin+"&checkout="+reservation.checkout+"&persons="+reservation.persons+"&idprop="+prop.idprop+"&langact="+langact).then(function (res){
      //console.log(link+"?checkin="+reservation.checkin+"&checkout="+reservation.checkout+"&persons="+reservation.persons+"&idprop="+prop.idprop+"&langact="+langact);
      $scope.response = res.data;
      //console.log($scope.response);
    });
    //$uibModalInstance.close('ok');
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

})

/* ********************* */
/* CONTROLADOR DE OFERTAS */
/* ********************* */
.controller('ofertaCtrl', function($scope,$translate,OfertasService ) {
  console.log("OFERTAS");

  OfertasService.GetOfertas($translate).then(function(offers){
    $scope.offers = offers.data;
  });
})

/* ******************* */
/* CONTROLADOR DE CHAT */
/* ******************* */
.controller('interesCtrl', function($scope,$translate) {
  console.log("CHAT");
})

/* ************************ */
/* CONTROLADOR DE FAVORITOS */
/* ************************ */
.controller('FavoritesCtrl', function($scope, FavoritesService,$ionicPopup) {
  console.log("FAVORITOS");
  // get the list of our favorites from the user service
  $scope.favorites = FavoritesService.getFavorites();

  //console.log("-"+JSON.stringify($scope.favorites)+"-");

  // Delete a favorite using the service and update scope var
  $scope.deleteFavorite = function (favorite) {
    $scope.favorites = FavoritesService.delete(favorite);
    var alertPopup = $ionicPopup.alert({
      title: favorite['name'],
      template: '<img src="img/props_hd/'+favorite.id+'/'+favorite.imagen+'"><br/>Deleted from favorites! :('
    });
  };

})

/* ******************** */
/* CONTROLADOR DE LOGIN */
/* ******************** */
.controller('LoginCtrl', function($scope,LoginService, $ionicPopup, $state) {
    console.log("LOGIN");
    $scope.data = {};
    $scope.login=0;

    $scope.login = function() {
        LoginService.loginUser($scope.data.username, $scope.data.password).success(function(data) {
            //console.log(data);
            $scope.login=1;
            $state.go('tabsController.inicio');
        }).error(function(data) {
            var alertPopup = $ionicPopup.alert({
                title: 'Login failed!',
                template: 'Please check your credentials!'
            });
        });
    }
})

/* **************************** */
/* CONTROLADOR DE MENU SUPERIOR */
/* **************************** */
/* .controller('NavCtrl', function($scope, $ionicSideMenuDelegate,$translate, $state,$ionicHistory,$http, $ionicPopup) {
  $scope.showMenu = function () {
    $ionicSideMenuDelegate.toggleLeft();
  }*/

  /* $scope.showRightMenu = function () {
    $ionicSideMenuDelegate.toggleRight();
  }*/

  /* $scope.ChangeLanguage = function(lang){
    //console.log("-"+lang);
	  $translate.use(lang);
    $scope.lang=$translate.use();
   // console.log($state);
    $ionicSideMenuDelegate.toggleRight();
    //console.log($scope.props);
    //console.log($state.$current.params);
    //$state.go($state.current, $state.$current.params, {reload: true, inherit: false});
	}

  $scope.logout = function() {
    $scope.login=0;
    $state.go('login');
  };*/

/* })*/
/* ****************************************** */
/* CONTROLADOR DE LECTOR DE CODIGOS DE BARRAS */
/* ****************************************** */
.controller('lectorController', function($scope,$cordovaBarcodeScanner) {
  console.log("LECTOR DE CODIGOS  DE BARRAS");

	$scope.scanBarcode = function() {
        $cordovaBarcodeScanner.scan().then(function(imageData) {
            alert(imageData.text);
            //console.log("Barcode Format -> " + imageData.format);
            //console.log("Cancelled -> " + imageData.cancelled);
        }, function(error) {
            console.log("An error happened -> " + error);
        });
    };

})

/* **************************** */
/* CONTROLADOR DE GEOLOCALIZDOR */
/* **************************** */
.controller('MapController', function($scope, $stateParams, $cordovaGeolocation, $ionicLoading, ColaboradoresService, $translate, $ionicPlatform,$cordovaSocialSharing,$ionicHistory) {

  console.log("MAPA");

  /* ************** COMPARTIR ************* */
  $scope.shareAnywhere = function() {
    $cordovaSocialSharing.share("This is your message", "This is your subject", "www/imagefile.png", "http://blog.nraboy.com");
  }

  $scope.shareViaTwitter = function(message, image, link) {
    $cordovaSocialSharing.canShareVia("twitter", message, image, link).then(function(result) {
      $cordovaSocialSharing.shareViaTwitter(message, image, link);
    }, function(error) {
      alert("Cannot share on Twitter");
    });
  }

  /* ********* VOLVER A LA PÁGINA ANTERIOR ********* */
  $scope.goBack = function(){
    $ionicHistory.goBack();
  }

  /* ************** MAPA  ************* */

    if ($scope.map){
      $scope.map.remove();
    }

    var bcnpoint = L.icon({ iconUrl: 'img/bcnpoint.png',popupAnchor:[0,-37], iconAnchor:[17, 34]});
    /*var bakery=L.icon({ iconUrl: 'img/bakery.png',popupAnchor:[0,-37],iconAnchor:[17, 34]});
    var bank=L.icon({ iconUrl: 'img/bank.png',popupAnchor:[0,-37],iconAnchor:[17, 34]});
    var beer=L.icon({ iconUrl: 'img/beer.png',popupAnchor:[0,-37],iconAnchor:[17, 34]});
    var bike=L.icon({ iconUrl: 'img/bike.png',popupAnchor:[0,-37],iconAnchor:[17, 34]});
    var cake=L.icon({ iconUrl: 'img/cake.png',popupAnchor:[0,-37],iconAnchor:[17, 34]});
    var car=L.icon({ iconUrl: 'img/car.png',popupAnchor:[0,-37],iconAnchor:[17, 34]});
    var delicatessen=L.icon({ iconUrl: 'img/delicatessen.png',popupAnchor:[0,-37],iconAnchor:[17, 34]});
    var gym=L.icon({ iconUrl: 'img/gym.png',popupAnchor:[0,-37],iconAnchor:[17, 34]});
    var hairdresser=L.icon({ iconUrl: 'img/hairdresser.png',popupAnchor:[0,-37],iconAnchor:[17, 34]});
    var jewelry=L.icon({ iconUrl: 'img/jewelry.png',popupAnchor:[0,-37],iconAnchor:[17, 34]});
    var monument=L.icon({ iconUrl: 'img/monument.png',popupAnchor:[0,-37],iconAnchor:[17, 34]});
    var pharmacy=L.icon({ iconUrl: 'img/pharmacy.png',popupAnchor:[0,-37],iconAnchor:[17, 34]});
    var restaurant=L.icon({ iconUrl: 'img/restaurant.png',popupAnchor:[0,-37],iconAnchor:[17, 34]});
    var spa=L.icon({ iconUrl: 'img/spa.png',popupAnchor:[0,-37],iconAnchor:[17, 34]});
    var supermarket=L.icon({iconUrl: 'img/supermarket.png',popupAnchor:[0,-37],iconAnchor:[17, 34]});*/

    var onepoint_1 = L.icon({ iconUrl: 'img/mapicons/number_1.png',popupAnchor:[0,-37], iconAnchor:[17, 34]});
    var onepoint_2 = L.icon({ iconUrl: 'img/mapicons/number_2.png',popupAnchor:[0,-37], iconAnchor:[17, 34]});
    var onepoint_3 = L.icon({ iconUrl: 'img/mapicons/number_3.png',popupAnchor:[0,-37], iconAnchor:[17, 34]});
    var onepoint_4 = L.icon({ iconUrl: 'img/mapicons/number_4.png',popupAnchor:[0,-37], iconAnchor:[17, 34]});
    var onepoint_5 = L.icon({ iconUrl: 'img/mapicons/number_5.png',popupAnchor:[0,-37], iconAnchor:[17, 34]});
    var onepoint_6 = L.icon({ iconUrl: 'img/mapicons/number_6.png',popupAnchor:[0,-37], iconAnchor:[17, 34]});
    var onepoint_7 = L.icon({ iconUrl: 'img/mapicons/number_7.png',popupAnchor:[0,-37], iconAnchor:[17, 34]});
    var onepoint_8 = L.icon({ iconUrl: 'img/mapicons/number_8.png',popupAnchor:[0,-37], iconAnchor:[17, 34]});
    var onepoint_9 = L.icon({ iconUrl: 'img/mapicons/number_9.png',popupAnchor:[0,-37], iconAnchor:[17, 34]});
    var onepoint_10 = L.icon({ iconUrl: 'img/mapicons/number_10.png',popupAnchor:[0,-37], iconAnchor:[17, 34]});
    var onepoint_11 = L.icon({ iconUrl: 'img/mapicons/number_11.png',popupAnchor:[0,-37], iconAnchor:[17, 34]});
    var onepoint_12 = L.icon({ iconUrl: 'img/mapicons/number_12.png',popupAnchor:[0,-37], iconAnchor:[17, 34]});
    var onepoint_13 = L.icon({ iconUrl: 'img/mapicons/number_13.png',popupAnchor:[0,-37], iconAnchor:[17, 34]});
    var onepoint_14 = L.icon({ iconUrl: 'img/mapicons/number_14.png',popupAnchor:[0,-37], iconAnchor:[17, 34]});
    var onepoint_15 = L.icon({ iconUrl: 'img/mapicons/number_15.png',popupAnchor:[0,-37], iconAnchor:[17, 34]});
    var onepoint_16 = L.icon({ iconUrl: 'img/mapicons/number_16.png',popupAnchor:[0,-37], iconAnchor:[17, 34]});
    var onepoint_17 = L.icon({ iconUrl: 'img/mapicons/number_17.png',popupAnchor:[0,-37], iconAnchor:[17, 34]});
    var onepoint_18 = L.icon({ iconUrl: 'img/mapicons/number_18.png',popupAnchor:[0,-37], iconAnchor:[17, 34]});
    var onepoint_19 = L.icon({ iconUrl: 'img/mapicons/number_19.png',popupAnchor:[0,-37], iconAnchor:[17, 34]});
    var onepoint_20 = L.icon({ iconUrl: 'img/mapicons/number_20.png',popupAnchor:[0,-37], iconAnchor:[17, 34]});

    var tilesmap = new L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
          attribution: 'Tiles Courtesy of MapBox',
          id: 'mapbox.streets-basic',
          accessToken: 'pk.eyJ1IjoieGF2aWVyY29zbyIsImEiOiJjaW5oYW93OTIwMDB5dnhseWQ2dGlkMjRtIn0.6tQwjQGUM0Zp9G7mmbOggg'
    });

    var controlp =L.control({position:'bottomleft'});

    $ionicLoading.show({
        template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Acquiring location!'
    });

    $scope.map = new L.map('maplaces',{maxZoom:18,minZoom:13,layers:[tilesmap], zoomControl: false});

    new L.Control.Zoom({ position: 'bottomleft' }).addTo($scope.map);

    $cordovaGeolocation.getCurrentPosition().then(function (position) {
      var lat  = position.coords.latitude;
      var long = position.coords.longitude;

      $scope.map.setView([lat, long], 16);

      var markercenter = new L.marker([lat, long],{icon:bcnpoint}).addTo($scope.map);

      markercenter.bindPopup("You are here.");

      $ionicLoading.hide();


    }, function(err) {
      // error
      $ionicLoading.hide();
      console.log("Location error!");
      console.log(err);
    });



    /* ************************* */

    var pois;

    ColaboradoresService.GetColaboradores($translate).then(function(colaboradores)
    {
      $scope.colaboradores = colaboradores.data;
      pois=$scope.colaboradores;

      for (var i = 0; i < pois.length; i++) {
        var posicion=pois[i][0];
        var markerplaces = new L.marker([pois[i][2], pois[i][3]],{icon:eval('onepoint_'+posicion)});

        markerplaces.bindPopup("<table><tr><td>"+pois[i][5]+"</td><td style='display: table-cell; vertical-align: top;'><h4 style='color:#3498db;font-weight:bold;'>"+pois[i][0]+"."+pois[i][1]+"</h4>"+pois[i][4]+"<br/><span style='color:#bcbcbc;font-weight:bold'>"+pois[i][6]+"</span><br/>"+pois[i][7]+"<br/>Offer by Bcn Apartment Rentals</td></tr></table>");
        markerplaces.addTo($scope.map);
      }
    });

    /* ************************* */

    $scope.onlyeat=function()
    {
      if ($scope.map){
        $scope.map.remove();
      }

      $ionicLoading.show({
          template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Acquiring location!'
      });

      var tilesmap = new L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Tiles Courtesy of MapBox',
            id: 'mapbox.streets-basic',
            accessToken: 'pk.eyJ1IjoieGF2aWVyY29zbyIsImEiOiJjaW5oYW93OTIwMDB5dnhseWQ2dGlkMjRtIn0.6tQwjQGUM0Zp9G7mmbOggg'
      });

      $scope.map = new L.map('maplaces',{maxZoom:18,minZoom:13,layers:[tilesmap], zoomControl: false});

      new L.Control.Zoom({ position: 'bottomleft' }).addTo($scope.map);

      $cordovaGeolocation.getCurrentPosition().then(function (position) {
        var lat  = position.coords.latitude;
        var long = position.coords.longitude;

        $scope.map.setView([lat, long], 16);

        var markercenter = new L.marker([lat, long],{icon:bcnpoint}).addTo($scope.map);

        markercenter.bindPopup("You are here.");

        $ionicLoading.hide();


      }, function(err) {
        // error
        $ionicLoading.hide();
        console.log("Location error!");
        console.log(err);
      });

      console.log("solo eat");
      pois=$scope.colaboradores;

      for (var i = 0; i < pois.length; i++) {
        if(pois[i][8]=='eat')
        {
          var posicion=pois[i][0];
          var markerplaces = new L.marker([pois[i][2], pois[i][3]],{icon:eval('onepoint_'+posicion)});

          markerplaces.bindPopup("<table><tr><td>"+pois[i][5]+"</td><td style='display: table-cell; vertical-align: top;'><h4 style='color:#3498db;font-weight:bold;'>"+pois[i][0]+"."+pois[i][1]+"</h4>"+pois[i][4]+"<br/><span style='color:#bcbcbc;font-weight:bold'>"+pois[i][6]+"</span><br/>"+pois[i][7]+"<br/>Offer by Bcn Apartment Rentals</td></tr></table>");
          markerplaces.addTo($scope.map);
        }
      }
    }

    /* ************************* */

    $scope.onlycoffee=function()
    {
      if ($scope.map){
        $scope.map.remove();
      }

      $ionicLoading.show({
          template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Acquiring location!'
      });

      var tilesmap = new L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Tiles Courtesy of MapBox',
            id: 'mapbox.streets-basic',
            accessToken: 'pk.eyJ1IjoieGF2aWVyY29zbyIsImEiOiJjaW5oYW93OTIwMDB5dnhseWQ2dGlkMjRtIn0.6tQwjQGUM0Zp9G7mmbOggg'
      });

      $scope.map = new L.map('maplaces',{maxZoom:18,minZoom:13,layers:[tilesmap], zoomControl: false});

      new L.Control.Zoom({ position: 'bottomleft' }).addTo($scope.map);

      $cordovaGeolocation.getCurrentPosition().then(function (position) {
        var lat  = position.coords.latitude;
        var long = position.coords.longitude;

        $scope.map.setView([lat, long], 16);

        var markercenter = new L.marker([lat, long],{icon:bcnpoint}).addTo($scope.map);

        markercenter.bindPopup("You are here.");

        $ionicLoading.hide();


      }, function(err) {
        // error
        $ionicLoading.hide();
        console.log("Location error!");
        console.log(err);
      });

      console.log("solo coffee");
      pois=$scope.colaboradores;

      for (var i = 0; i < pois.length; i++) {
        if(pois[i][8]=='coffee')
        {
          var posicion=pois[i][0];
          var markerplaces = new L.marker([pois[i][2], pois[i][3]],{icon:eval('onepoint_'+posicion)});

          markerplaces.bindPopup("<table><tr><td>"+pois[i][5]+"</td><td style='display: table-cell; vertical-align: top;'><h4 style='color:#3498db;font-weight:bold;'>"+pois[i][0]+"."+pois[i][1]+"</h4>"+pois[i][4]+"<br/><span style='color:#bcbcbc;font-weight:bold'>"+pois[i][6]+"</span><br/>"+pois[i][7]+"<br/>Offer by Bcn Apartment Rentals</td></tr></table>");
          markerplaces.addTo($scope.map);
        }
      }
    }

    /* ************************* */

    $scope.onlylife=function()
    {
      if ($scope.map){
        $scope.map.remove();
      }

      $ionicLoading.show({
          template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Acquiring location!'
      });

      var tilesmap = new L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Tiles Courtesy of MapBox',
            id: 'mapbox.streets-basic',
            accessToken: 'pk.eyJ1IjoieGF2aWVyY29zbyIsImEiOiJjaW5oYW93OTIwMDB5dnhseWQ2dGlkMjRtIn0.6tQwjQGUM0Zp9G7mmbOggg'
      });

      $scope.map = new L.map('maplaces',{maxZoom:18,minZoom:13,layers:[tilesmap], zoomControl: false});

      new L.Control.Zoom({ position: 'bottomleft' }).addTo($scope.map);

      $cordovaGeolocation.getCurrentPosition().then(function (position) {
        var lat  = position.coords.latitude;
        var long = position.coords.longitude;

        $scope.map.setView([lat, long], 16);

        var markercenter = new L.marker([lat, long],{icon:bcnpoint}).addTo($scope.map);

        markercenter.bindPopup("You are here.");

        $ionicLoading.hide();


      }, function(err) {
        // error
        $ionicLoading.hide();
        console.log("Location error!");
        console.log(err);
      });

      console.log("solo life");
      pois=$scope.colaboradores;

      for (var i = 0; i < pois.length; i++) {
        if(pois[i][8]=='life')
        {
          var posicion=pois[i][0];
          var markerplaces = new L.marker([pois[i][2], pois[i][3]],{icon:eval('onepoint_'+posicion)});

          markerplaces.bindPopup("<table><tr><td>"+pois[i][5]+"</td><td style='display: table-cell; vertical-align: top;'><h4 style='color:#3498db;font-weight:bold;'>"+pois[i][0]+"."+pois[i][1]+"</h4>"+pois[i][4]+"<br/><span style='color:#bcbcbc;font-weight:bold'>"+pois[i][6]+"</span><br/>"+pois[i][7]+"<br/>Offer by Bcn Apartment Rentals</td></tr></table>");
          markerplaces.addTo($scope.map);
        }
      }
    }

    /* ************************* */

    $scope.onlyfun=function()
    {
      if ($scope.map){
        $scope.map.remove();
      }

      $ionicLoading.show({
          template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Acquiring location!'
      });

      var tilesmap = new L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Tiles Courtesy of MapBox',
            id: 'mapbox.streets-basic',
            accessToken: 'pk.eyJ1IjoieGF2aWVyY29zbyIsImEiOiJjaW5oYW93OTIwMDB5dnhseWQ2dGlkMjRtIn0.6tQwjQGUM0Zp9G7mmbOggg'
      });

      $scope.map = new L.map('maplaces',{maxZoom:18,minZoom:13,layers:[tilesmap], zoomControl: false});

      new L.Control.Zoom({ position: 'bottomleft' }).addTo($scope.map);

      $cordovaGeolocation.getCurrentPosition().then(function (position) {
        var lat  = position.coords.latitude;
        var long = position.coords.longitude;

        $scope.map.setView([lat, long], 16);

        var markercenter = new L.marker([lat, long],{icon:bcnpoint}).addTo($scope.map);

        markercenter.bindPopup("You are here.");

        $ionicLoading.hide();


      }, function(err) {
        // error
        $ionicLoading.hide();
        console.log("Location error!");
        console.log(err);
      });

      console.log("solo fun");
      pois=$scope.colaboradores;

      for (var i = 0; i < pois.length; i++) {
        if(pois[i][8]=='fun')
        {
          var posicion=pois[i][0];
          var markerplaces = new L.marker([pois[i][2], pois[i][3]],{icon:eval('onepoint_'+posicion)});

          markerplaces.bindPopup("<table><tr><td>"+pois[i][5]+"</td><td style='display: table-cell; vertical-align: top;'><h4 style='color:#3498db;font-weight:bold;'>"+pois[i][0]+"."+pois[i][1]+"</h4>"+pois[i][4]+"<br/><span style='color:#bcbcbc;font-weight:bold'>"+pois[i][6]+"</span><br/>"+pois[i][7]+"<br/>Offer by Bcn Apartment Rentals</td></tr></table>");
          markerplaces.addTo($scope.map);
        }
      }
    }
})
