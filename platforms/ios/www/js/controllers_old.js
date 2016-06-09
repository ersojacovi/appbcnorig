angular.module('app.controllers', ['ionic','ngCordova','ui.bootstrap','jett.ionic.filter.bar','ksSwiper','LocalStorageModule','ionic-datepicker'])

/* ********************* */
/* CONTROLADOR DE INICIO */
/* ********************* */
.controller('inicioCtrl', function($scope,$translate,PortadaService,PropService,$timeout, $ionicFilterBar,FavoritesService,$ionicPopup) {

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
.controller('propiedadesCtrl', function($scope,PropService,$translate) {
	PropService.GetProps().then(function(props){
		$scope.props = props.data;
	});
})


/* **************************** */
/* CONTROLADOR DE UNA PROPIEDAD */
/* **************************** */
.controller("propiedadCtrl", function($scope,$stateParams,PropService,DatesService,$uibModal, $log, $cordovaGeolocation, $ionicLoading , $ionicPlatform,$ionicHistory, FavoritesService,$cordovaSocialSharing,$translate,$http, $ionicPopup){

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

      /* *************** MODAL ************ */

      $scope.animationsEnabled = true;

      $scope.open = function () {
        //console.log("select");
        var modalInstance = $uibModal.open({
          animation: $scope.animationsEnabled,
          templateUrl: 'myModalContent.html',
          controller: 'ModalInstanceCtrl',
          resolve: {
            prop: function () {
              //console.log($scope.prop);
              return $scope.prop;
            }
          }
        });

        modalInstance.result.then(function (selectedItem) {
          $scope.selected = selectedItem;
        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
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

    $ionicPlatform.ready(function(){
      $ionicLoading.show({
          template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Wait a moment!'
      });
      var posOptions = {
          enableHighAccuracy: true,
          timeout: 50000,
          maximumAge: 100
      };

      $cordovaGeolocation.getCurrentPosition(posOptions).then(function () {
          var lat  = $scope.prop['latitude'];
          var long = $scope.prop['longitude'];

          //console.log(lat+" - "+long);

          var myLatlng = new google.maps.LatLng(lat, long);

          var mapOptions = {
              center: myLatlng,
              zoom: 15,
              mapTypeId: google.maps.MapTypeId.ROADMAP,
              scrollwheel: false,
              navigationControl: false,
              mapTypeControl: false,
              scaleControl: false,
              draggable: false
          };

          var maprop = new google.maps.Map(document.getElementById("maprop"), mapOptions);

          $scope.maprop = maprop;
          $ionicLoading.hide();

          google.maps.event.addListenerOnce($scope.maprop, 'idle', function(){

              var image="img/bcnpoint.png";
              var marker = new google.maps.Marker({
                  map: $scope.maprop,
                  animation: google.maps.Animation.DROP,
                  position: myLatlng,
                  icon: image
              });

              var infoWindow = new google.maps.InfoWindow({
                content: "You are here!"
              });

              google.maps.event.addListener(marker, 'click', function () {
                  infoWindow.open($scope.maprop, marker);
              });
          });
      } , function(err) {
          $ionicLoading.hide();
          console.log(err);
      });
    });

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

/* ********************* */
/* CONTROLADOR DEL MODAL */
/* ********************* */
.controller('ModalInstanceCtrl', function($scope, $uibModalInstance, prop, $http,$translate,ionicDatePicker) {

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

  OfertasService.GetOfertas($translate).then(function(offers){
    $scope.offers = offers.data;
  });
})

/* ******************* */
/* CONTROLADOR DE CHAT */
/* ******************* */
.controller('interesCtrl', function($scope,$translate) {
})

/* ************************ */
/* CONTROLADOR DE FAVORITOS */
/* ************************ */
.controller('FavoritesCtrl', function($scope, FavoritesService,$ionicPopup) {
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
.controller('MapController', function($scope, $cordovaGeolocation, $ionicLoading, ColaboradoresService, $translate, $ionicPlatform) {

    $ionicPlatform.ready(function(){
        var lang=$translate.use();

        if(lang=='En')
        {
          $ionicLoading.show({
              template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Acquiring location!'
          });
        }
        else if(lang=='Es')
        {
          $ionicLoading.show({
              template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Adquiriendo localización!'
          });
        }
        else if(lang=='Fr')
        {
          $ionicLoading.show({
              template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Acquisition emplacement!'
          });
        }
        else if(lang=='It')
        {
          $ionicLoading.show({
              template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Noleggio Acquisizione!'
          });
        }

        var posOptions = {
            enableHighAccuracy: true,
            timeout: 50000,
            maximumAge: 100
        };
        $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
            var lat  = position.coords.latitude;
            var long = position.coords.longitude;

            var myLatlng = new google.maps.LatLng(lat, long);

            var mapOptions = {
                center: myLatlng,
                zoom: 16,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            var map = new google.maps.Map(document.getElementById("map"), mapOptions);

            $scope.map = map;
            $ionicLoading.hide();

            google.maps.event.addListenerOnce($scope.map, 'idle', function(){

                var image="img/bcnpoint.png";
                var marker = new google.maps.Marker({
                    map: $scope.map,
                    animation: google.maps.Animation.DROP,
                    position: myLatlng,
                    icon: image
                });

                if(lang=='En')
                {
                  var infoWindow = new google.maps.InfoWindow({
                      content: "You are here!"
                  });
                }
                else if(lang=='Es')
                {
                  var infoWindow = new google.maps.InfoWindow({
                      content: "Está Aquí!"
                  });
                }
                else if(lang=='Fr')
                {
                  var infoWindow = new google.maps.InfoWindow({
                      content: "Tu es là!"
                  });
                }
                else if(lang=='It')
                {
                  var infoWindow = new google.maps.InfoWindow({
                      content: "Tu sei qui!"
                  });
                }


                google.maps.event.addListener(marker, 'click', function () {
                    infoWindow.open($scope.map, marker);
                });
            });

            /* ************************* */
            var infowindow;

            var pois;

            ColaboradoresService.GetColaboradores($translate).then(function(colaboradores)
            {
                $scope.colaboradores = colaboradores.data;
                pois=$scope.colaboradores;

              for (var i = 0; i < pois.length; i++) {
                  var myLatLng = new google.maps.LatLng(pois[i][1], pois[i][2]);
                  var marker = new google.maps.Marker({
                                  position: myLatLng,
                                  map: $scope.map,
                                  icon:pois[i][3],
                                  title: pois[i][0],
                  });
                  (function(i, marker) {
                      google.maps.event.addListener(marker,'click',function() {
                          if (!infowindow) {
                              infowindow = new google.maps.InfoWindow();
                          }
                          infowindow.setContent(pois[i][4]+pois[i][6]+pois[i][5]);
                          infowindow.open($scope.map, marker);
                      });
                  })(i, marker);
              }
            });
        }, function(err) {
            $ionicLoading.hide();
            console.log(err);
        });
    })
})
