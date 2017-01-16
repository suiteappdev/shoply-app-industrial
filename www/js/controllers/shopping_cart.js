angular.module('starter.controllers').controller('shoppingCarController', function($scope, api, $ionicLoading,  $ionicPopup, $rootScope, shoppingCart, $state, storage, $ionicModal){
   $scope.total = shoppingCart.totalize();
   $scope.addressList  = angular.fromJson(storage.get('addressList')) || [];
   $scope.shouldShowDelete = false;
   $scope.shouldShowReorder = false;
   $scope.listCanSwipe = true

   $ionicModal.fromTemplateUrl('templates/modal/request_info.html', {
    scope: $scope
   }).then(function(modal){
   		$scope.modal = modal;
   });

    $scope.$watch('$root.shoppingCart', function(n, o){
        if(n.length > 0){
           $scope.total = (shoppingCart.totalize(n) - shoppingCart.totalizeDiscount(n) || 0);
           $scope.totalTyped = angular.copy($scope.total);
           $scope.TotalIva = shoppingCart.totalizeIva(n);
           $scope.subTotal = ($scope.total - $scope.TotalIva);
           $scope.descuento =  shoppingCart.totalizeDiscount(n);
          // $scope.descuento = shoppingCart.totalizeDiscount(n);
        }
    }, true);

   $scope.loadfrm = function(){
       api.arqueos().add("find/").post({
        _seller : $rootScope.user._id,
        ini :  moment(new Date()).startOf('day').format()
       }).success(function(res){
         if(res.length > 0){
            $rootScope.isClosedSell = true;
         }
       })
   }



   $scope.load = function(){
        api.user().get().success(function(res){
            $scope.records = res.filter(function(o){
                return o.type == 'CLIENT';
            });
        });
   }

    $scope.setReceived = function(){
      //comentamos esto ya que solo esta disponible el pago en efectivo
      /*angular.forEach($scope.paymentMethods, function(o){
        if(o.data.value){
            total = (total + o.data.value)
          }
      });*/

      $scope.received = $scope.totalTyped;

      var _sum = ($scope.totalParcial - $scope.received);

      if(_sum < 0){
          $scope.change = _sum * (-1) ;
      }else{
        $scope.change = 0;
      }
    }

    $scope.$watch('gdiscount', function(n, o){
      if(n || o){
        console.log("nuevo des", n);
        $scope.vgdescuento =  ($scope.total * $scope.gdiscount / 100);
        $scope.totalParcial = (angular.copy($scope.total) - ($scope.vgdescuento))  
        $scope.setReceived();      
      }
    });


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
                          console.log("producto filtrado por iva", _o)
                          _SUM.tipo = _o._iva.data.valor;
                          _SUM.total = (_SUM.total + _o.data.precio_venta);
                          _SUM.viva = (_SUM.viva + _o.data.valor_iva || 0);                     
                      });

                      _SUM.base = (_SUM.total - _SUM.viva);
                      $scope.formBill.data.ivadetails.push(_SUM);

                    })

                    $scope.formBill._product = $rootScope.shoppingCart.map(function(o){
                            var _obj = new Object();
                            _obj = o.data;
                            _obj.iva = o._iva;
                            _obj._reference = o._reference;
                            _obj._category = o._category;
                            _obj._id = o._id;
                            _obj.idcomposed = o.idcomposed;
                            _obj.refMixed = o._reference.reference.join("");
                            _obj.cantidad = o.data.unidades;
                            _obj.total = (o.data.precio_venta * o.data.unidades);

                          return _obj; 
                 });

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


   $scope.getPayment = function(){
      api.formas_pagos().get().success(function(res){
        $scope.paymentMethods = res || [];
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


    $scope.openFormBilling = function(){
      $scope.modal.show();
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

        if(storage.get("user").type == "SELLER"){
            var _data = angular.extend($scope.form, {
                _seller : angular.fromJson(storage.get('user'))._id,
                shoppingCart: $rootScope.shoppingCart,
                _client : $scope.form._client._id 
            });  

            _data.metadata = _data.metadata || new Object();
            _data.metadata.estado = "Facturado";
            _data.metadata.total = $scope.total;
            _data.metadata.cantidad = $rootScope.shoppingCart.length;
            _data.metadata.subtotal = $scope.subTotal;

                api.ivas().get().success(function(res){
                    var _filteredByIvas = [];
                    _data.metadata.ivadetails = [];
                    
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
                          console.log("producto filtrado por iva", _o)
                          _SUM.tipo = _o._iva.data.valor;
                          _SUM.total = (_SUM.total + _o.data.precio_venta);
                          _SUM.viva = (_SUM.viva + _o.data.valor_iva || 0);                     
                      });

                      _SUM.base = (_SUM.total - _SUM.viva);
                      _data.metadata.ivadetails.push(_SUM);

                    })

                  /*$scope.formBill._product = $rootScope.shoppingCart.map(function(o){
                            var _obj = new Object();
                            _obj = o.data;
                            _obj.iva = o._iva;
                            _obj._reference = o._reference;
                            _obj._category = o._category;
                            _obj._id = o._id;
                            _obj.idcomposed = o.idcomposed;
                            _obj.refMixed = o._reference.reference.join("");
                            _obj.cantidad = o.data.unidades;
                            _obj.total = (o.data.precio_venta * o.data.unidades);

                          return _obj; 
                 });*/

                api.pedido().post(_data).success(function(res){
                    if(res){
                        $rootScope.shoppingCart.length = 0;
                        delete $scope.form;
                        $scope.confirmRequest();
                        $ionicLoading.hide();
                    }
                });    
              })
        }else{
            var _data = angular.extend($scope.form, {
                _client : angular.fromJson(storage.get('user'))._id,
                shoppingCart: $rootScope.shoppingCart,
            });
            
                _data.metadata = _data.metadata || new Object();
                _data.metadata.estado = _data.metadata.estado = "Pendiente";  
            }

        /*if(angular.fromJson(storage.get("GPS"))){
                navigator.geolocation.getCurrentPosition(function(res){
                    console.log("location", res);
                    
                    _data.metadata.geo = {};
                    _data.metadata.geo.latitude = res.coords.latitude;
                    _data.metadata.geo.longitude = res.coords.longitude;

                    _data.metadata.total = shoppingCart.totalize();
                    _data.metadata.cantidad = $rootScope.shoppingCart.length;

                    _data.metadata.total_iva_5 = shoppingCart.totalizeIva(5);
                    _data.metadata.total_iva_10 = shoppingCart.totalizeIva(10);
                    _data.metadata.subtotal = (_data.metadata.total - (_data.metadata.total_iva_5 + _data.metadata.total_iva_10)); 
                    
                    console.log("data", _data);

                    $ionicLoading.show()

                    api.pedido().post(_data).success(function(res){
                        if(res){
                            $rootScope.shoppingCart.length = 0;
                            delete $scope.form;
                            $scope.confirmRequest();
                            $ionicLoading.hide();
                        }
                    });                     
                })
        }else{
            _data.metadata.total = shoppingCart.totalize();
            _data.metadata.envio = 2000;
            _data.metadata.cantidad = $rootScope.shoppingCart.length;

            _data.metadata.total_iva_5 = shoppingCart.totalizeIva(5);
            _data.metadata.total_iva_10 = shoppingCart.totalizeIva(10);
            _data.metadata.subtotal = (_data.metadata.total - (_data.metadata.total_iva_5 + _data.metadata.total_iva_10)); 

            $ionicLoading.show()

            api.pedido().post(_data).success(function(res){
                if(res){
                    $rootScope.shoppingCart.length = 0;
                    delete $scope.form;
                    $scope.confirmRequest();
                    $ionicLoading.hide();
                }
            }); 
        }*/
         } else {
           console.log('You are not sure');
         }
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

})