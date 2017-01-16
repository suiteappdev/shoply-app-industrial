angular.module('starter.controllers').controller('settingCtrl', function($scope, constants, account, storage, $ionicPopup, $state){
	
	$scope.allowGPS = angular.fromJson(storage.get('GPS'));
	$scope.allowLocal = angular.fromJson(storage.get('LOCAL'));

	$scope.gps = function(){
		storage.save("GPS", this.allowGPS);
	}

	$scope.local = function(){
		storage.save("LOCAL", this.allowLocal);
	}

})