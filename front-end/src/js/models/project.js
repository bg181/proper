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
    }
  );
}