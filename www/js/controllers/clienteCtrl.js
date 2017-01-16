angular.module('starter.controllers').controller('ClienteCtrl', function($scope, api, $ionicPopup) {
    $scope.createNA = function(){
        if($scope.formClientNA.$invalid){
			var alertPopup = $ionicPopup.alert({
				title: 'Formulario incompleto!',
				template: 'las contraseñas no coinciden'
			});

            return;

        } 

        $scope.form.type = "CLIENT";
        $scope.form.data.persona = 'natural';
        $scope.form.data.departamento = $scope.form.data.departamento.name;

        api.user().post($scope.form).success(function(res){
          if(res){
           $ionicPopup.alert({
				title: 'Correcto!',
				template: 'Has registrado un nuevo cliente'
			});

            delete $scope.form;
          }
        }).error(function(data, status){
            if(status == 409){
	            $ionicPopup.alert({
					title: 'Incorrecto!',
					template: 'Este email ya esta registrado'
				});
            }
         });
    }

    $scope.createEM = function(){
        if($scope.formClientEM.$invalid){
			var alertPopup = $ionicPopup.alert({
				title: 'Formulario incompleto!',
				template: 'las contraseñas no coinciden'
			});

            return;

        } 

        $scope.formEM.type = "CLIENT";
        $scope.formEM.data.persona = 'juridica';
        $scope.formEM.data.departamento = $scope.formEM.data.departamento.name;
        $scope.formEM.name = $scope.formEM.data.razon_social;
        $scope.formEM.last_name = $scope.formEM.data.representante_legal;

        api.user().post($scope.formEM).success(function(res){
          if(res){
           $ionicPopup.alert({
				title: 'Correcto!',
				template: 'Has registrado un nuevo cliente'
			});

            delete $scope.formEM;
          }
        }).error(function(data, status){
            if(status == 409){
	            $ionicPopup.alert({
					title: 'Incorrecto!',
					template: 'Este email ya esta registrado'
				});
            }
         }); 
    }

    $scope.load = function(){

    }
})


