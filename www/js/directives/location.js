'use strict';

/**
 * @ngdoc directive
 * @name shoplyApp.directive:iva
 * @description
 * # iva
 */
angular.module('starter')
  .directive('departamentoField', function () {
  	function ctrl($scope , $window, $rootScope) {
  		$scope.records = $window.departamentos; 
		
      $scope.onChange = function(){
            $rootScope.$emit("departamentoField::changed", this.ngModel.code);
            $scope.$apply();
            
            return;
      }
  	}

    return {
      template: '<label class = "item item-input item-select"><div class = "input-label">Departamento</div><select ng-change="onChange()" ng-options="option.name for option in records track by option.code" ng-model="ngModel"></select></label>',
      restrict: 'E',
      scope : {
      	ngModel : "=",
        emptyOption : "@"
      },
      controller : ctrl,
      link: function postLink(scope, element, attrs) {
        console.log(element)
      }
    };
  });

  angular.module('starter')
  .directive('ciudadField', function ($window) {
    function ctrl($scope , $rootScope, $filter) {
      $scope.records = $window.municipios;

      $rootScope.$on("departamentoField::changed", function(event, value){
        $scope.records = angular.copy($window.municipios).filter(function(v){
          return (v.code_dpto == value);
        });

        $scope.$apply();
      }); 
    }

    return {
      template: '<label class = "item item-input item-select"><div class = "input-label">Ciudad</div><select ng-model="ngModel"><option ng-repeat="option in records" value="{{option.name}}">{{option.name}}</option></select></label>',
      restrict: 'E',
      scope : {
        ngModel : "=",
        emptyOption : "@"
      },
      controller : ctrl,
      link: function postLink(scope, element, attrs) {

      }
    };
  });

