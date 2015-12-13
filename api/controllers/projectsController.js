var Project = require("../models/project");
var User = require("../models/user");

function projectsIndex(req, res){
  Project.find({}, function(err, projects) {
    if (err) return res.status(404).send(err);
    res.status(200).send(projects);
  });
}

function projectsCreate(req, res){
  console.log(req.body.project);
  var project = new Project(req.body.project);
  project.save(function(err){
    if (err) return res.status(500).send(err);
    var id = req.body.project.user_id;
    User.findById(id, function(err, user){
      if(err) return res.status(500).json({ message: 'Error looking up user' });
      if(!user) return res.status(404).json({ message: "User not found" });
      user.projects.push(project);
      user.save(function(err, user) {
        if(err) return res.status(500).json({ message: 'Error saving user' });
        return res.status(201).send(project);
      });
    });
  });
}

function projectsShow(req, res){
  var id = req.params.id;

  Project.findById({ _id: id }, function(err, project) {
    if (err) return res.status(500).send(err);
    if (!project) return res.status(404).send(err);

    res.status(200).send(project);
  })
}

function projectsUpdate(req, res){
  var id = req.params.id;

  Project.findByIdAndUpdate({ _id: id }, req.body.project, function(err, project){
    if (err) return res.status(500).send(err);
    if (!project) return res.status(404).send(err);

    res.status(200).send(project);
  })
}

function projectsDelete(req, res){
  var id = req.params.id;

  Project.remove({ _id: id }, function(err) {
    if (err) return res.status(500).send(err);
    res.status(200).send('done');
  })
}

module.exports = {
  projectsIndex:  projectsIndex,
  projectsCreate: projectsCreate,
  projectsShow:   projectsShow,
  projectsUpdate: projectsUpdate,
  projectsDelete: projectsDelete
}