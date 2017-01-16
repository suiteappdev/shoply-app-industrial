  'use strict';

/**
 * @ngdoc service
 * @name shoplyApp.constants
 * @description
 * # constants
 * Constant in the shoplyApp.
 */
angular.module('starter.controllers')
  .constant('constants', {
  	base_url : "http://www.shoply.com.co:8080/api/",
  	socket :'http://www.shoply.com.co:8080/api/',
  	login_page : 'login',                          
  	login_state_sucess : 'tab.dash',
    uploadURL : "http://www.shoply.com.co:8080/api/uploads",
    uploadFilesUrl : "http://www.shoply.com.co:8080/api/uploads/",
  });
 