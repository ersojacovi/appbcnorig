angular.module('app.services', [])

// *************************************************************************

.factory('BlankFactory', [function(){

}])

// *************************************************************************

.service('BlankService', [function(){

}])

// *************************************************************************

.factory('PropService', ['$http',function($http) {
  var props = [];
  var propsxubicacion=[];

  return {
    GetProps: function(){
      return $http.get("http://www.bcnapartmentrentals.com/app/appcall/fotosportada.php").then(function(response){
        props = response;
        return props;
      });
    },
    GetProp: function(propId){
      for(i=0;i<props.data.length;i++){
        if(props.data[i].idprop == propId){
          return props.data[i];
        }
      }
    },
    GetPropsxUbicacion: function (UbicId){
      propsxubicacion=[];
      for(i=0;i<props.data.length;i++){
        if(props.data[i].ubicacion == UbicId){
          propsxubicacion.push(props.data[i]);
        }
      }
      console.log(propsxubicacion);
      return propsxubicacion;
    }
  }
}])

// *************************************************************************

.factory('DatesService', ['$http',function($http) {
  var datesoc = [];

  return {
    GetDatesOc: function(propId){
      return $http.get("http://www.bcnapartmentrentals.com/app/appcall/ocupacion.php?idprop="+propId).then(function(response){
        datesoc = response;
        return datesoc;
      });
    }
  }
}])

// *************************************************************************

.factory('PortadaService', ['$http','$translate',function($http,$translate) {
  var regs = [];

  //console.log("PORTADA NUEVA");

  var lang=$translate.use();

  return {
    GetPortadas: function(){
      return $http.get("http://www.bcnapartmentrentals.com/app/appcall/portada.php?lang="+lang).then(function(response){
        regs = response;
        return regs;
      });
    }
  }
}])

// *************************************************************************


.factory('OfertasService',['$http','$translate', function($http,$translate){
  var offers=[];

  //console.log($translate.use());
  var lang=$translate.use();

  return {
    GetOfertas: function(){
      return $http.get("http://www.bcnapartmentrentals.com/app/appcall/ofertasactuales.php?lang="+lang).then(function(response){
        offers=response;
        return offers;
      })
    }
  }
}])

// *************************************************************************

.factory('ColaboradoresService',['$http','$translate', function($http,$translate){
  var colaboradores=[];

  var lang=$translate.use();
  console.log("places:"+lang);

  return {
    GetColaboradores: function(){
      return $http.get("http://www.bcnapartmentrentals.com/app/appcall/colaboradoresactivos.php?lang="+lang).then(function(response){
        //console.log("hola");
        colaboradores=response;
        return colaboradores;
      })
    }
  }

}])

// *************************************************************************

.factory('UbicacionesService',['$http','$translate', function($http,$translate){
  var ubicaciones=[];

  //console.log($translate.use());
  var lang=$translate.use();

  return {
    GetUbicaciones: function(){
      return $http.get("http://www.bcnapartmentrentals.com/app/appcall/ubicacionesactuales.php?lang="+lang).then(function(response){
        ubicaciones=response;
        return ubicaciones;
      })
    }
  }
}])

// *************************************************************************

.service('FavoritesService', function(localStorageService) {
  // ADD
  this.add = function (favorite) {
    var favorites = this.getFavorites() || [];

    //console.log(JSON.stringify(favorite));

    var newFav = {
      id: favorite.idprop,
      name: favorite.nameprop,
      imagen: favorite.imagen,
      minprecio: favorite.minprecio,
      numhab: favorite.numhab,
      estrellas: favorite.estrellas
    };

    var tam=favorites.length;
    var repe=0;

    for(var i=0;i<tam;i++)
    {
      var afav=favorites[i];
      if(afav.id==newFav.id) repe++;
    }
    //console.log(JSON.stringify(newFav));
    if (repe==0)
    {
      favorites.push(newFav);
    }
    console.log(JSON.stringify(favorites));
    localStorageService.set('Favorites', favorites);
  };

  // GET
  this.getFavorites = function () {
    return localStorageService.get('Favorites');
  };

  // DELETE
  this.delete = function (favorite) {
    var favorites = this.getFavorites();
    var favoritesnew=[];
    var tam=favorites.length;
    for(var i=0;i<tam;i++)
    {
      var afav=favorites[i];
      if(afav.id!=favorite.id) favoritesnew.push(afav);
    }
    //favorites.remove(favorites, favorite); // jshint ignore:line
    localStorageService.set('Favorites', favoritesnew);

    return this.getFavorites();
  };

  // DELETE A FAVORITE IN Inicio or propiedad
  this.deleteByProperty = function(property) {
    var favorites = this.getFavorites();
    var favoritesnew=[];
    var tam=favorites.length;
    for(var i=0;i<tam;i++)
    {
      var afav=favorites[i];
      if(afav.id!=property.idprop) favoritesnew.push(afav);
    }

    localStorageService.set('Favorites', favoritesnew);

    return this.getFavorites();

  }

  //IS A PROP A FAVORITE?
  this.isFavorite = function (idprop) {
    var favorites = this.getFavorites();
    var tam=favorites.length;
    var isfav=false;
    for(var i=0;i<tam;i++)
    {
      var afav=favorites[i];
      if(afav.id==idprop) isfav=true;
    }
    return isfav;
  };
})

// *************************************************************************

.service('LoginService', function($q) {
    return {
        loginUser: function(name, pw) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            if (name == 'user' && pw == 'secret') {
                deferred.resolve('Welcome ' + name + '!');
            } else {
                deferred.reject('Wrong credentials.');
            }
            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        }
    }
})
