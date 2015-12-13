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