angular.module('starter.controllers').controller('commentCtrl', function($scope, $rootScope, $stateParams, api, $ionicPopup, $state, storage, $ionicLoading){
    $scope.load = function(){
    	if($stateParams.producto){
    		$scope.show();

    		api.producto($stateParams.producto).get().success(function(res){
    			$scope.record = res || [];
    			$scope.hide();
    		});
    	}
    }

    $scope.send = function(){
        var _data = angular.extend($scope.form.data, {user: angular.fromJson(storage.get("user"))});

        api.producto($stateParams.producto).add("/comentar").post($scope.form).success(function(res){
            if(res){
                $rootScope.$emit("add_comment", {index : $stateParams.index, comment : $scope.form});
                $scope.$$childHead.record.comments.push($scope.form);
                $scope.$$childHead.scrollCtrl.scrollBottom(100);
                delete $scope.form;
            }
        });
    }

    $scope.show = function() {
        $ionicLoading.show({
          template: '<ion-spinner icon="spiral"></ion-spinner>'
        });
    };

    $scope.hide = function(){
        $ionicLoading.hide();
    }
})