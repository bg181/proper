angular
  .module('AWOL', ['ngResource', 'angular-jwt', 'ui.router', 'satellizer'])
  .constant('API', 'http://localhost:3000/api')
  .config(MainRouter)
  .config(function($httpProvider){
    $httpProvider.interceptors.push('authInterceptor');
  })
  .config(function($authProvider) {
    $authProvider.facebook({ clientId: '1942210682670926'});
  });

  MainRouter.$inject = ['$stateProvider', '$urlRouterProvider'];

  function MainRouter($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: "/",
        templateUrl: "home.html",
      })
      .state('login', {
        url: "/login",
        templateUrl: "login.html"
      })
      .state('register', {
        url: "/registertakeo",
        templateUrl: "registertakeo.html"
      })
      .state('facebookLogIn', {
        url: "/facebookLogIn",
        templateUrl: "facebookLogIn.html"
      })
      .state('facebookRegister', {
        url: "/join",
        templateUrl: "facebookRegister.html"
      })
      .state('profile', {
        url: "/profile",
        templateUrl: "profile.html"
      })
      .state('users', {
        url: "/users",
        templateUrl: "users.html"
      })
      .state('projects', {
        url: "/projects",
        templateUrl: "projects.html",
        controller: "ProjectsController as projects"
      });

    $urlRouterProvider.otherwise("/");
  }

  angular
      .module('app', ['angularFileUpload'])
      .controller('AppController', function($scope, FileUploader) {
          $scope.uploader = new FileUploader();
      });