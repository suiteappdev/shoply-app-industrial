angular.module('starter.controllers').controller('dashboardCtrl', function($scope, $rootScope, $ionicPlatform,  $q,  $ionicScrollDelegate, $timeout, api, constants, account, storage, $ionicPopup, $ionicLoading, $state, shoppingCart, $ionicModal, $cordovaPrinter){
    $scope.localHistory = [];
   $scope.shouldShowDelete = false;
   $scope.shouldShowReorder = false;
   $scope.listCanSwipe = true

    $scope.records = [];
    $scope.total = 0;

    $rootScope.$watch('shoppingCart', function(n, o){
       $scope.totalize(n);       
       $scope.totalizeBases(n);       
       $scope.totalizeDiscount(n);       
       $scope.totalizeIva(n);       
    }, true);

   $ionicModal.fromTemplateUrl('templates/modal/request_info.html', {
    scope: $scope
   }).then(function(modal){
      $scope.modal = modal;
   });

  $scope.print = function(){

  }

  $scope.totalize = function(n){
        var total = 0;

        for (var i = 0; i < shoppingCart.totalize(n).length; i++) {
            total = (total + shoppingCart.totalize(n)[i])
        };

        $scope.total = total;
    }

    $scope.totalizeIva = function(n){
        var total = 0;

        for (var i = 0; i < shoppingCart.totalizeIva(n).length; i++) {
            total = (total + shoppingCart.totalizeIva(n)[i])
        };

        $scope.TotalIva = total;
    }

    $scope.totalizeBases = function(n){
        var total = 0;

        for (var i = 0; i < shoppingCart.totalizeBases(n).length; i++) {
            total = (total + shoppingCart.totalizeBases(n)[i])
        };

        $scope.subTotal = total;
    }

    $scope.totalizeDiscount = function(n){
        var total = 0;

        for (var i = 0; i < shoppingCart.totalizeDiscount(n).length; i++) {
            total = (total + shoppingCart.totalizeDiscount(n)[i])
        };

        $scope.descuento = total;
    }


    $rootScope.$on('add_comment', function(event, data){
      $scope.products[data.index].comments.push(data.comment);
    });

    $scope.agregarDescuento = function(){
          $scope.descuentoRecord = this.record;

          var confirmPopup = $ionicPopup.show({
            template: '<input type="number" style="text-align:center;margin-bottom: 5px;" placeholder="Descuento en %"  ng-model="$parent.pdiscount"><input type="number" style="text-align:center;" placeholder="Descuento en $"  ng-model="$parent.pdiscountPesos">',
            title: 'Descuentos',
            subTitle: 'Aplique el descuento',
            scope: $scope,
            buttons: [
              { text: 'Cancelar' },
              {
                text: '<b>Ok</b>',
                type: 'button-custom',
                onTap: function(e) {
                    if($scope.pdiscount){
                        return $scope.pdiscount;
                    }

                    if($scope.pdiscountPesos){
                        return $scope.pdiscountPesos;
                    }
                }
              }
            ]
          });

           confirmPopup.then(function(res) {
              if(res) {
                  if($scope.pdiscount){
                      $scope.descuentoRecord.porcentajeDTO = $scope.pdiscount;
                      $scope.descuentoRecord.descuento = ($scope.descuentoRecord.precio_venta * parseInt($scope.pdiscount) * $scope.descuentoRecord.cantidad) / 100;
                      $scope.descuentoRecord.precio_VentaFacturado = ($scope.descuentoRecord.precio_VentaFacturado - $scope.descuentoRecord.descuento)
                      $scope.descuentoRecord.precio_baseVlFacturado = (($scope.descuentoRecord.precio_baseFacturado || ($scope.descuentoRecord.precio + $scope.descuentoRecord.valor_utilidad)   * $scope.pdiscount) / 100);
                      $scope.descuentoRecord.ivaFacturado = $scope.descuentoRecord.ivaFacturado - (($scope.descuentoRecord.ivaFacturado * $scope.pdiscount) / 100);
                      $scope.descuentoRecord.precio_baseFacturado = ( $scope.descuentoRecord.precio_baseFacturado || $scope.descuentoRecord.precio + $scope.descuentoRecord.valor_utilidad) - ( $scope.descuentoRecord.precio_baseFacturado || $scope.descuentoRecord.precio + $scope.descuentoRecord.valor_utilidad) * $scope.pdiscount / 100;
                      $scope.descuentoRecord.vlUnicoD = ($scope.descuentoRecord.total * $scope.pdiscount) / 100;
                      $scope.descuentoRecord.vlUnicoP = ($scope.descuentoRecord.total - $scope.descuentoRecord.vlUnicoD);
                    }

                    if($scope.pdiscountPesos){
                      $scope.descuentoRecord.pesosDTO = $scope.pdiscountPesos;
                      $scope.descuentoRecord.descuento = $scope.pdiscountPesos;

                      $scope.descuentoRecord.precio_VentaFacturado = ($scope.descuentoRecord.precio_VentaFacturado - $scope.descuentoRecord.descuento)
                      $scope.descuentoRecord.precio_baseFacturado = ($scope.descuentoRecord.precio_VentaFacturado) / (($scope.descuentoRecord.iva.data.valor / 100) + 1) ;
                      
                      $scope.descuentoRecord.ivaFacturado =  $scope.descuentoRecord.precio_VentaFacturado - $scope.descuentoRecord.precio_baseFacturado;
                  }

             } else {
               return;
             }
           }); 
    }

    $scope.show = function() {
        $ionicLoading.show({
          template: '<ion-spinner icon="spiral"></ion-spinner>'
        });
    };

    $scope.formInfo = function(mode){
    if($rootScope.isClosedSell && mode == 'FA'){
       var confirmPopup = $ionicPopup.confirm({
             title: 'No se puede facturar',
             template: 'Tu periodo de facturación ha sido cerrado.',
                scope: $scope,
                buttons: [
                  { text: 'Cancelar' },
                  {
                    text: '<b>Ok</b>',
                    type: 'button-custom',
                    onTap: function(e) {
                      return true;
                    }
                  }
                ]
           });

       return;
    }
      $rootScope.mode = mode;
      $scope.modal.show();
    }

     $scope.showConfirm = function() {
       var confirmPopup = $ionicPopup.confirm({
         title: 'Salir',
         template: 'Desea salir de la aplicación?',
          scope: $scope,
          buttons: [
            { text: 'Cancelar' },
            {
              text: '<b>Ok</b>',
              type: 'button-custom',
              onTap: function(e) {
                return true;
              }
            }
          ]
       });

       confirmPopup.then(function(res) {
         if(res) {
          navigator.app.exitApp()
         } else {
           console.log('You are not sure');
         }
       });
     }; 

    $scope.history = function(){
        $scope.products = [];
        $scope.records = [];

        var deferedCategories = $q.defer();
        var deferedProducts = $q.defer();
        
        $scope.show();
        
        var _parent = $scope.localHistory.pop();
        
        if(_parent.parent == "#"){
          $scope.load();
          return;
        }

        var _reqCategories = api.categoria().add("childs/" + _parent.parent).get({cache:false});
        
        $q.all([_reqCategories]).then(function(values){
            $scope.records = values[0].data;
            $scope.hide();
        })
    }

    $scope.like = function(){
        var _product = this.record;
        var user = angular.fromJson(localStorage.user)._id;

        if(_product._like.indexOf(user) > -1){
          return;
        }
        
        api.producto(this.record._id).add("/like").post({ user : user }).success(function(res){
            if(res){
              _product._like.push(user);
            }
        });
    }

    $scope.add = function(){
        var _product = this.record;
          var myPopup = $ionicPopup.show({
            template: '<input type="number"  ng-init="$parent.cantidadModel = 1" style="text-align:center;" placeholder="Numero de Unidades"  ng-model="$parent.cantidadModel">',
            title: 'Unidades',
            subTitle: 'escriba el numero de unidades a pedir',
            scope: $scope,
            buttons: [
              { text: 'Cancelar' },
              {
                text: '<b>Ok</b>',
                type: 'button-custom',
                onTap: function(e) {
                  if (!$scope.cantidadModel) {
                    e.preventDefault();

                  } else {
                    return $scope.cantidadModel;
                  }
                }
              }
            ]
          });

          myPopup.then(function(res) {
            if(res){
                if($rootScope.shoppingCart.indexOf(_product) > -1){
                    _product.cantidad = parseInt($scope.cantidadModel);
                    _product.precio_baseFacturado = ((_product.precio_VentaFacturado || _product.precio + _product.valor_utilidad) * $scope.cantidadModel);
                    _product.precio_VentaFacturado = ((_product.precio_VentaFacturado || _product.precio_venta) * $scope.cantidadModel);
                    _product.ivaFacturado =  (_product.precio_VentaFacturado - _product.precio_baseFacturado);
                    _product.descuento = (_product.precio_VentaFacturado || _product.precio_venta * parseInt(_product.porcentajeDTO) * _product.cantidad) / 100;
                    _product.precio_VentaFacturado = ( _product.precio_VentaFacturado || _product.precio_venta -  _product.descuento);
                }else{
                    _product.cantidad = parseInt($scope.cantidadModel);
                    _product.precio_baseFacturado = ((_product.precio + _product.valor_utilidad) * $scope.cantidadModel);
                    _product.precio_VentaFacturado = ((_product.precio_venta) * $scope.cantidadModel);
                    _product.ivaFacturado =  (_product.precio_VentaFacturado - _product.precio_baseFacturado);
                    _product.descuento = (_product.precio_venta * parseInt(_product.porcentajeDTO) * _product.cantidad) / 100;
                    _product.precio_VentaFacturado = ( _product.precio_VentaFacturado || _product.precio_venta -  _product.descuento);
                    _product.total = _product.precio_venta, 
                    _product.vlUnicoD = 0;
                    _product.vlUnicoP = _product.precio_venta;

                    $rootScope.shoppingCart.push(_product);                  
                    }
                }
          });
    }

    $scope.remove = function(product){
     var confirmPopup = $ionicPopup.confirm({
         title: 'Quitar Producto',
         template: 'Desea eliminar este producto del carrito?',
            scope: $scope,
            buttons: [
              { text: 'Cancelar' },
              {
                text: '<b>Ok</b>',
                type: 'button-custom',
                onTap: function(e) {
                  return true;
                }
              }
            ]
       });

       confirmPopup.then(function(res) {
         if(res) {
            $rootScope.shoppingCart.splice($rootScope.shoppingCart.indexOf(product), 1);
         } else {
           return;
         }
       });
    }


    $scope.unFollow = function(){
        api.producto().add("unfollow").post(angular.fromJson(localStorage.user)._id).success(function(res){
            console.log("following" , res);
        });
    }

    $ionicPlatform.registerBackButtonAction(function (event) {
        if($state.current.name == 'tab.dash' && $scope.localHistory.length > 0){
            $scope.history();
        }else if($state.current.name == 'tab.dash' && $scope.localHistory.length == 0){
          $scope.showConfirm();
        }else{
            navigator.app.backHistory();
        }
    }, 100);

    $scope.hide = function(){
        $ionicLoading.hide();
    };

    $scope.load = function(){
        $scope.show();
        api.categoria().add("root").get().success(function(res){
            $scope.records = res || [];
            $scope.hide();
        });
        api.user().get().success(function(res){
            $scope.clients = res.filter(function(o){
                return o.type == 'CLIENT';
            });
        });
    }

    $scope.getPayment = function(){
      api.formas_pagos().get().success(function(res){
        $scope.paymentMethods = res || [];
      });   
    }

    $scope.confirmRequest = function(){
     var alertPopup = $ionicPopup.alert({
       title: 'Enviado!',
       template: 'Su pedido ha sido Enviado',
          scope: $scope,
          buttons: [
            {
              text: '<b>Ok</b>',
              type: 'button-custom',
              onTap: function(e) {
                return true;
              }
            }
          ]
     });

     alertPopup.then(function(res) {
       $scope.modal.hide();
       $scope.back();
     });
    }

    $scope.confirmRemition = function(){
     var alertPopup = $ionicPopup.alert({
       title: 'Enviado!',
       template: 'Su remisión ha sido enviada',
          scope: $scope,
          buttons: [
            {
              text: '<b>Ok</b>',
              type: 'button-custom',
              onTap: function(e) {
                return true;
              }
            }
          ]
     });

     alertPopup.then(function(res) {
       $scope.modal.hide();
       $scope.back();
     });
    }

    $scope.confirmBill = function(){
     var alertPopup = $ionicPopup.alert({
       title: 'Finalizado!',
       template: 'Su venta ha sido realizada',
          scope: $scope,
          buttons: [
            {
              text: '<b>Ok</b>',
              type: 'button-custom',
              onTap: function(e) {
                return true;
              }
            }
          ]
     });

     alertPopup.then(function(res) {
       $scope.modal.hide();
       $scope.back();
     });
    } 

    $scope.back = function(){
        $state.go('tab.dash');
    }

    $scope.browse = function(category, back){
        var deferedCategories = $q.defer();
        var deferedProducts = $q.defer();
        
        $scope.show();

        if(!back){
            $scope.localHistory.push(category); 
        }

        var _reqProducts = api.producto().add('category/' + category._id).get();
        var _reqCategories = api.categoria().add("childs/" + category._id).get();

        $q.all([_reqCategories, _reqProducts]).then(function(values){
            $scope.products = values[1].data.map(function(o){
                var _obj = new Object();

                _obj = o.data;
                _obj._company = o._company;
                _obj._iva = o._iva;
                _obj._reference = o._reference;
                _obj._category = o._category;
                _obj._id = o._id;
                _obj.idcomposed = o.idcomposed;
                _obj.refMixed = o._reference.reference.join("");

                return _obj; 
            }) || [];

            $scope.records = values[0].data;
            $scope.hide();
        })
    }

    $scope.back = function(){
      $scope.load();
    }

    $scope.toDashboard = function(){
        $state.go('tab.dash');
    }


    $scope.sendRequest = function(){
       var confirmPopup = $ionicPopup.confirm({
         title: 'Enviar Pedido',
         template: '¿ Desea realizar este pedido?',
          scope: $scope,
          buttons: [
            { text: 'Cancelar' },
            {
              text: '<b>Ok</b>',
              type: 'button-custom',
              onTap: function(e) {
                return true;
              }
            }
          ]
       });

       confirmPopup.then(function(res) {
        if(res) {
            var _data = angular.extend($scope.form, {
                _seller : angular.fromJson(storage.get('user'))._id,
                shoppingCart: $rootScope.shoppingCart,
                _client : $scope.form._client._id 
            });

            navigator.geolocation.getCurrentPosition(function(res){
              _data.data = {};
              _data.data.tipo = "Orden de Pedido";
              _data.data.total = $scope.total;
              _data.data.cantidad = $rootScope.shoppingCart.length;
              _data.data.subtotal = $scope.subTotal;
              _data.data.TotalIva = $scope.TotalIva;
              _data.data.descuento = $scope.descuento;
              _data.data.geo = {};
              _data.data.geo.latitude = res.coords.latitude;
              _data.data.geo.longitude = res.coords.longitude;
              api.pedido().post(_data).success(function(res){
                  if(res){
                      $rootScope.shoppingCart.length = 0;
                      delete $scope.form;
                      $scope.confirmRequest();
                      $ionicLoading.hide();
                  }
              });    
            })  
         } else {
           console.log('You are not sure');
         }
       });
    }

    $scope.sendRemition = function(){
       var confirmPopup = $ionicPopup.confirm({
         title: 'Enviar Remisión',
         template: '¿ Desea enviar esta remisión?',
          scope: $scope,
          buttons: [
            { text: 'Cancelar' },
            {
              text: '<b>Ok</b>',
              type: 'button-custom',
              onTap: function(e) {
                return true;
              }
            }
          ]
       });

       confirmPopup.then(function(res) {
        if(res) {
            var _data = angular.extend($scope.form, {
                _seller : angular.fromJson(storage.get('user'))._id,
                shoppingCart: $rootScope.shoppingCart,
                _client : $scope.form._client._id 
            });  

                navigator.geolocation.getCurrentPosition(function(res){
                  _data.data = {};
                  _data.data.tipo = "Remisión";
                  _data.data.total = $scope.total;
                  _data.data.cantidad = $rootScope.shoppingCart.length;
                  _data.data.subtotal = $scope.subTotal;
                  _data.data.TotalIva = $scope.TotalIva;
                  _data.data.descuento = $scope.descuento;
                  _data.data.geo = {};
                  _data.data.geo.latitude = res.coords.latitude;
                  _data.data.geo.longitude = res.coords.longitude;
                  
                  api.ivas().get().success(function(res){
                      var _filteredByIvas = [];
                      _data.data.ivadetails = [];
                      
                      angular.forEach(res, function(o){
                        _filteredByIvas.push($rootScope.shoppingCart.filter(function(i){
                              if(!i._iva){
                                i._iva = new Object();
                                i._iva.data = new Object();                        
                                i._iva.data.valor = 0;                        
                              }

                              return i._iva.data.valor == o.data.valor;
                          }));
                      });

                      angular.forEach(_filteredByIvas, function(o){
                        var _SUM = new Object();
                        _SUM.total = 0;
                        _SUM.viva = 0;

                        angular.forEach(o, function(_o){
                            _SUM.tipo = _o._iva.data.valor;
                            _SUM.total = (_SUM.total + _o.precio_venta);
                            _SUM.viva = (_SUM.viva + _o.valor_iva || 0);                     
                        });

                        _SUM.base = (_SUM.total - _SUM.viva);
                        _data.data.ivadetails.push(_SUM);

                      })

                      api.pedido().post(_data).success(function(res){
                          if(res){
                              $rootScope.shoppingCart.length = 0;
                              delete $scope.form;
                              $scope.confirmRemition();
                              $ionicLoading.hide();
                          }
                      });    
                })                

                })

         } else {
           console.log('You are not sure');
         }
       });
    }

    $scope.$watch('gdiscount', function(n, o){
      if(n || o){
        console.log("nuevo des", n);
        $scope.vgdescuento =  ($scope.total * $scope.gdiscount / 100);
        $scope.totalParcial = (angular.copy($scope.total) - ($scope.vgdescuento))  
        $scope.setReceived();      
      }
    });

    $scope.setReceived = function(){
      $scope.received = $scope.totalTyped;

      var _sum = ($scope.totalParcial - $scope.received);

      if(_sum < 0){
          $scope.change = _sum * (-1) ;
      }else{
        $scope.change = 0;
      }
    }

   $scope.bill = function(){
   var confirmPopup = $ionicPopup.confirm({
         title: 'Facturar',
         template: 'Desea realizar esta acción?',
            scope: $scope,
            buttons: [
              { text: 'Cancelar' },
              {
                text: '<b>Ok</b>',
                type: 'button-custom',
                onTap: function(e) {
                  return true;
                }
              }
            ]
       });

       confirmPopup.then(function(res) {
         if(res) {
                $scope.formBill = {};
                $scope.formBill.data =  {};
                $scope.formBill._seller = angular.fromJson(storage.get('user'))._id;
                $scope.formBill._client = $scope.form._client._id;
                $scope.formBill.data.descuentoGlobal = $scope.gdiscount || 0;
                $scope.formBill.data.valorDescuentoGlobal = $scope.vgdescuento;
                $scope.formBill.data.TotalIva = $scope.TotalIva;
                $scope.formBill.data.total = $scope.totalParcial || $scope.total;
                $scope.formBill.data.subtotal =  $scope.subTotal;

                $scope.form._paymentMethod.data.value = $scope.totalTyped;
                $scope.formBill._payments = [$scope.form._paymentMethod];

              
                console.log("formBill", $scope.formBill);
                
                api.ivas().get().success(function(res){
                    var _filteredByIvas = [];
                    $scope.formBill.data.ivadetails = [];
                    
                    angular.forEach(res, function(o){
                      _filteredByIvas.push($rootScope.shoppingCart.filter(function(i){
                            if(!i._iva){
                              i._iva = new Object();
                              i._iva.data = new Object();                        
                              i._iva.data.valor = 0;                        
                            }

                            return i._iva.data.valor == o.data.valor;
                        }));
                    });

                    angular.forEach(_filteredByIvas, function(o){
                      var _SUM = new Object();
                      _SUM.total = 0;
                      _SUM.viva = 0;

                      angular.forEach(o, function(_o){
                          _SUM.tipo = _o._iva.data.valor;
                          _SUM.total = (_SUM.total + _o.precio_venta);
                          _SUM.viva = (_SUM.viva + _o.valor_iva || 0);                     
                      });

                      _SUM.base = (_SUM.total - _SUM.viva);
                      $scope.formBill.data.ivadetails.push(_SUM);

                    })

                    $scope.formBill._product = $rootScope.shoppingCart;

                    api.facturacion().post($scope.formBill).success(function(res){
                      if(res){
                          delete $scope.formBill;
                          $rootScope.shoppingCart.length = 0;
                          $scope.confirmBill();
                      }
                    });      

              })
         } else {
           return;
         }
       });
          
   }

})