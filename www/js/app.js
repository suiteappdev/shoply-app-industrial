angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ionic-modal-select', 'ngCordova', 'angular-preload-image', 'ui.utils.masks'])

.run(function($ionicPlatform, $rootScope, $state, $window, constants, storage, $http) {
    $rootScope.currency = constants.currency;
    $rootScope.base = constants.uploadFilesUrl;
    $window.moment.locale("es");
    $rootScope.shoppingCart = [];
    $rootScope.user = storage.get('user');

    $ionicPlatform.ready(function(){
      navigator.splashscreen.hide();
      var push = PushNotification.init({
            android: {
                senderID: "871168760"
            },
            ios: {
                alert: "true",
                badge: "true",
                sound: "true"
            },
            windows: {}
      });

      push.on('registration', function(data) {
        storage.save("device_token", data.registrationId);
      });

      push.on('notification', function(data) {
            // data.message,
            // data.title,
            // data.count,
            // data.sound,
            // data.image,
            // data.additionalData
      });

      push.on('error', function(e) {

      });

      try{
          cordova.getAppVersion.getPackageName().then(function(app) {
              //app company _id
              $rootScope._company = app.split("ID")[1];
              $rootScope.$apply();
          })

      }catch(e){
        console.log(e);
      }

     window.socket = new io(constants.socket);
          window.socket.on("connect", function(){
          console.log("Socket Status: OK")
     })
     
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
    }

    if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
    }

  });

  $rootScope.$on('$stateChangeStart', function(event, nextRoute, toParams, fromState, fromParams){
      if(nextRoute.name === 'tab.dash'){
        $rootScope.searchBtn = true;
      }else{
        $rootScope.searchBtn = false;;
      }

      if (nextRoute != null && nextRoute.access != null && nextRoute.access.requiredAuthentication && !storage.get('token')) {
            event.preventDefault();
            $state.transitionTo('login');
      }
  });
})

.config(function($stateProvider, $urlRouterProvider, $httpProvider, $ionicConfigProvider) {
     $ionicConfigProvider.tabs.position('bottom');
     $httpProvider.interceptors.push(function($injector, $q) {
        var rootScope = $injector.get('$rootScope');

        return {
            'request': function(config) {
                
                $httpProvider.defaults.withCredentials = false;
                
                if(window.localStorage.token){
                   $httpProvider.defaults.headers.common['x-shoply-auth'] =  window.localStorage.token ; // common
                   $httpProvider.defaults.headers.common['x-shoply-company']  = "583ee0528d125cd57cb4ba9c"//rootScope._company;
                }

                console.log(config, 'request')

                for (var x in config.data) {
                    if (typeof config.data[x] === 'boolean') {
                        config.data[x] += '';
                    }
                }

                return config || $q.when(config);
            },
            'response': function(response) {
                return response;

            },
            'responseError': function(rejection) {
                 switch(rejection.status){

                    case 401:
                    if(!window.location.hash.match("login")){
                        window.localStorage.clear();
                        window.location = "#/login";
                    }
                    else
                      return $q.reject(rejection);
                      break;

                    default:
                    return $q.reject(rejection);
                    break;

                 }
                  
                }
        };
    });
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    cache : false,
    access: { requiredAuthentication: true },
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html'
      }
    }
  })
  .state('tab.comments', {
    url: '/comments/:producto/:index',
    access: { requiredAuthentication: true },
    views: {
      'tab-dash': {
        templateUrl: 'templates/comments/add_comment.html',
        controller: 'commentCtrl'
      }
    }
  })
  .state('tab.chats', {
      url: '/chats',
      cache : false,
      access: { requiredAuthentication: true },
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    access: { requiredAuthentication: true },
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  })
  .state('tab.password-reset', {
    url: '/account/reset',
    access: { requiredAuthentication: true },
    views: {
      'tab-account': {
        templateUrl: 'templates/password_reset/password_reset.html',
        controller: 'passwordResetCtrl'
      }
    }
  })
  .state('tab.setting', {
    url: '/account/setting',
    access: { requiredAuthentication: true },
    views: {
      'tab-account': {
        templateUrl: 'templates/setting/setting.html',
        controller: 'settingCtrl'
      }
    }
  })
  .state('tab.request', {
    url: '/account/request',
    access: { requiredAuthentication: true },
    views: {
      'tab-account': {
        templateUrl: 'templates/request/request.html',
        controller: 'requestCtrl'
      }
    }
  })
  .state('tab.cliente', {
    url: '/account/cliente',
    access: { requiredAuthentication: true },
    views: {
      'tab-account': {
        templateUrl: 'templates/cliente/cliente.html',
        controller: 'ClienteCtrl'
      }
    }
  })
  .state('login', {
      url: '/login',
      templateUrl: 'templates/login/login.html',
      cache:false
  })
  .state('register', {
      url: '/register',
      templateUrl: 'templates/register/register.html'
  });;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
