angular.module('starter.controllers').controller('registerCtrl', function($scope, api, constants, account, storage, $ionicPopup, $state){
    $scope.load = function(){

    }

    $scope.register = function(){
    	if($scope.formRegister.$valid){
    		if($scope.form.data.password != $scope.form.data.confirmar_password){
				var alertPopup = $ionicPopup.alert({
					title: 'Formulario incompleto!',
					template: 'las contraseñas no coinciden'
				});

                 return;
    		}

    		api.user().add("exists/" + $scope.form.data.email).get().success(function(res){
    			if(res.exists == -1){
    				$scope.form.data.type = "USER";
		    		api.user().post($scope.form.data).success(function(res){

				     var confirmPopup = $ionicPopup.confirm({
				         title: 'Registro',
				         template: 'Registro Completado.',
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

				       confirmPopup.then(function(res) {
					         if(res) {
					          $state.go(constants.login_page);
					          delete $scope.form;
					         }
				       });
		    			});
    			}else{
				     var confirmPopup = $ionicPopup.confirm({
				         title: 'Email en Uso',
				         template: 'Este email ya esta en uso',
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
    			}
    		});
    	}
    }
})