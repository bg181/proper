var mongoose = require("mongoose");

var databaseURL = 'mongodb://localhost:27017/yearbook';
mongoose.connect(databaseURL);

var Project = require("../models/project"); 
var User    = require("../models/user");

var project1 = new Project({
  title: "Prep",
  description: "A new take on homework.",
  github: "https://github.com/benlayer291/wdi-project-2",
  website: "https://freeprep.herokuapp.com"
})

project1.save(function(err, project) {
 if (err) return console.log(err);
 console.log("Project saved! ", project);
})

var project2 = new Project({
  title: "Maze",
  description: "A new take on mazes.",
  github: "https://github.com/benlayer291/wdi-project-1",
  website: "https://freemaze.herokuapp.com"
})

project2.save(function(err, project) {
 if (err) return console.log(err);
 console.log("Project saved! ", project);
})

var user1 = new User({
  name: "Ben Layer",
  github: "benlayer291",
  bio: "Education tech is my ting.",
  portfolio: "http://www.benlayer.com",
  projects: [project1, project2]
})

user1.save(function(err, user) {
 if (err) return console.log(err);
 console.log("User saved! ", user);
})

var user2 = new User({
  name: "Jake Fleming",
  github: "JakeyPedz",
  bio: "Anecjokes are my ting.",
  portfolio: "http://www.jakefleming.com",
})

user2.save();

var user3 = new User({
  name: "Guus Van Ooijen",
  github: "gvop",
  bio: "Cool trainers are my ting.",
  portfolio: "http://www.guusvanooijen.com",
})

user3.save();

var user4 = new User({
  name: "Ollie Holden",
  github: "odholden",
  bio: "Skateboarding is my ting.",
  portfolio: "http://www.ollieholden.com",
})

user4.save();

var user5 = new User({
  name: "Marika Devan",
  github: "webdev11",
  bio: "Films are my ting.",
  portfolio: "http://www.marikadevan.com",
})

user5.save();

var user6 = new User({
  name: "Alastair Knowles",
  github: "adjknowles",
  bio: "Music is my ting.",
  portfolio: "http://www.alastairknowles.com",
})

user6.save();