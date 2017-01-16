angular.module('starter.controllers').controller('requestCtrl', function(api, $scope, constants, account, storage, $ionicPopup, $state, $rootScope){
	$scope.load = function(){
		api.pedido().add("user/" + $rootScope.user._id).get().success(function(res){
			$scope.records = res || [];
		})
	}
})