angular.module('starter.controllers').controller('OptionsCtrl', function($scope, constants,  storage, $ionicPopup, $state){
    $scope.closeSession = function(){
       var confirmPopup = $ionicPopup.confirm({
         title: 'Salir',
         template: 'Desea Cerrar la Session?',
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
            delete localStorage.token;
            delete localStorage.user;
            $state.go(constants.login_page);
         } else {
           console.log('You are not sure');
         }
       });
    }
})