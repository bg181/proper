angular
  .module('logging', ['ngResource', 'angular-jwt', 'ui.router', 'satellizer'])
  .constant('API', 'http://localhost:3000/api')
  .config(MainRouter)
  .config(function($httpProvider){
    $httpProvider.interceptors.push('authInterceptor');
  })
  .config(function($authProvider) {
    $authProvider.facebook({ clientId: '1535877196647406'});
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
        url: "/register",
        templateUrl: "register.html"
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
  .module('logging')
  .controller('ProjectsController', ProjectsController);

ProjectsController.$inject = ["Project", "User", "CurrentUser"];
function ProjectsController(Project, User, CurrentUser){
  var self = this;


  self.all     = [];
  self.users   = [];
  self.project = {};

  self.getProjects = function(){
    console.log("getting projects...");
    Project.query(function(data){
      console.log(data);
      // return self.all = data; MADE THIS CHANGE:
      self.all = data;
    });
  };

  self.getUsers = function(){
     User.query(function(data){
      // return self.users = data.users; MADE THIS CHANGE:
      self.users = data.users;
    });
  };

  self.add = function(){
    var project = { project: self.project };
    Project.save(project, function(data){
      self.all.push(data);
      self.project = {};
    });
  };

  self.getProjects();
  self.getUsers();
  // getProjects();

  console.log(CurrentUser.getUser());
}
angular
  .module('logging')
  .controller('UsersController', UsersController);

UsersController.$inject = ['User', 'TokenService', '$state', 'CurrentUser', '$auth'];
function UsersController(User, TokenService, $state, CurrentUser, $auth){

  var self = this;

  self.all           = [];
  self.user          = {};
  self.getUsers      = getUsers;
  self.register      = register;
  self.login         = login;
  self.logout        = logout;
  self.checkLoggedIn = checkLoggedIn;

  self.authenticate = function(provider) {
    $auth.authenticate(provider);
  };

  // GETs all the users from the api
  function getUsers() {
    User.query(function(data){
     // return self.all = data.users; MADE THIS CHANGE
     self.all = data.users;
   });
  }

  // Actions to carry once register or login forms have been submitted
  function handleLogin(res) {
    var token = res.token ? res.token : null;
    if (token) {
      self.getUsers();
      $state.go('home');
    }
    // console.log(res);
    self.user = TokenService.decodeToken();
    CurrentUser.saveUser(self.user);
  }

  // POSTS the new user to register to the API
  function register() {
    User.register(self.user, handleLogin);
  }

  // POSTS the new user to login to the API
  function login() {
    User.login(self.user, handleLogin);
  }

  // A function to remove token form local storage and log user out
  function logout() {
    TokenService.removeToken();
    self.all  = [];
    self.user = {};
    CurrentUser.clearUser();
  }

  // Checks if the user is logged in
  function checkLoggedIn() {
    var loggedIn = !!TokenService.getToken();
    return loggedIn;
  }

  // Checks if the user is logged in, runs every time the page is loaded
  if (CurrentUser.getUser()) {
    self.getUsers();
    // self.user = TokenService.decodeToken();
    // console.log(self.user);
  }

return self;
}
angular
  .module('logging')
  .factory('Project', Project);

Project.$inject = ['$resource', 'API'];
function Project($resource, API){

  return $resource(
    API+'/projects/:id', {id: '@id'},
    { 'get':       { method: 'GET' },
      'save':      { method: 'POST' },
      'query':     { method: 'GET', isArray: true},
      'remove':    { method: 'DELETE' },
      'delete':    { method: 'DELETE' },
    },
    API+'/projects',
    { 'get'   :    { method: 'GET' },
      'save'  :    { method: 'POST' },
      'remove':    { method: 'DELETE' },
      'delete':    { method: 'DELETE' },
    });
}
angular
  .module('logging')
  .factory('User', User);

User.$inject = ['$resource', 'API'];
function User($resource, API){

  return $resource(
    API+'/users/:id', 
{id: '@id'},
    { 'get':       { method: 'GET' },
      'save':      { method: 'POST' },
      'query':     { method: 'GET', isArray: false},
      'remove':    { method: 'DELETE' },
      'delete':    { method: 'DELETE' },
      'register': {
        url: API +'/register',
        method: "POST"
      },
      'login':      {
        url: API + '/login',
        method: "POST"
      }
    }
  );
}
angular
  .module('logging')
  .factory('authInterceptor', AuthInterceptor);

// Like in insomnia this sets the header for our request so API can know we're authorized

AuthInterceptor.$inject = ['API', 'TokenService'];
function AuthInterceptor(API, TokenService) {

  return {
    request: function(config){
      var token = TokenService.getToken();

      if (config.url.indexOf(API) === 0 && token) {
        config.headers.Authorization = 'Bearer ' + token;
      }
      return config;
    },
    response: function(res){
      if (res.config.url.indexOf(API) === 0 && res.data.token) {
        TokenService.setToken(res.data.token);
      }
      return res;
    }
  };
}
angular
  .module('logging')
  .service('CurrentUser', CurrentUser);

CurrentUser.$inject = ["TokenService"];
function CurrentUser(TokenService){

  var self  = this;
  self.user = {}; 

  self.saveUser = function(user){
    self.user = user;
  };

  self.getUser = function(){
    return self.user;
  };

  self.clearUser = function(){
    // return self.user = {}; MADE THIS CHANGE
    self.user = {};
  };

}
angular
  .module('logging')
  .service('TokenService', TokenService);

TokenService.$inject = ['$window', 'jwtHelper'];
function TokenService($window, jwtHelper) {

  var self = this;

  self.setToken    = setToken;
  self.getToken    = getToken;
  self.removeToken = removeToken;
  self.decodeToken = decodeToken;

  function setToken(token) {
    return $window.localStorage.setItem('auth-token', token);
  }

  function getToken() {
    return $window.localStorage.getItem('auth-token');
  }

  function removeToken() {
    return $window.localStorage.removeItem('auth-token');
  }

  function decodeToken() {
    var token = self.getToken();
    return token ? jwtHelper.decodeToken(token) : {};
  }
}