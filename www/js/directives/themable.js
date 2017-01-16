angular.module('starter').directive('spThemable', function(){
    return {
        restrict:'EA',
        link : function(scope, element, attr){
            var _root = scope.$root;

            if(attr.isbuttonnav){
                element[0].firstChild.style.backgroundColor = attr.background;
                element[0].firstChild.style.color = attr.color;
            }

            var _headers = document.getElementsByClassName("bar-header");
            for (var i = 0; i < _headers.length; i++) {
                _headers[i].style.backgroundColor = attr.background;
                _headers[i].style.color = attr.color;
            };
    }
}
}); 

