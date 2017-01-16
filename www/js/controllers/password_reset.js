angular.module('starter.controllers').controller('passwordResetCtrl', function($scope, constants, account, storage, $ionicPopup, $state){
    $scope.reset = function(){
        if($scope.resetForm.$valid){
            if($scope.form.data.newpwd != $scope.form.data.confirmpwd){
                     var confirmPopup = $ionicPopup.confirm({
                         title: 'Formulario Incompleto',
                         template: 'las contraseñas no coinciden',
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
                 return;
            }

            account.password_reset(angular.extend($scope.form.data, {id : angular.fromJson(storage.get('user'))._id})).then(function(res){
                if(res){
                    var confirmPopup = $ionicPopup.confirm({
                         title: 'Correcto',
                         template: 'Se ha cambiado la contraseña correctamente.',
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
                            delete localStorage.token;
                            delete localStorage.user;
                             delete $scope.form;
                            $state.go(constants.login_page);
                       } else {
                         console.log('You are not sure');
                       }
                     });
                }
            }, function(status){

                if(status == 400){
                    var confirmPopup = $ionicPopup.confirm({
                         title: 'No se pudo cambiar la contraseña',
                         template: 'las contraseñas no coinciden',
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

                }

                if(status == 404){
                    var confirmPopup = $ionicPopup.confirm({
                         title: 'No se pudo cambiar la contraseña',
                         template: 'El usuario no existe',
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
                }
            })
        }else{
           var confirmPopup = $ionicPopup.confirm({
                 title: 'Formulario no Completado, Rellene los campos',
                 template: 'El usuario no existe',
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
        }
    }
})