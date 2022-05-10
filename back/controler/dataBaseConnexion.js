var mongoose = require ("mongoose");
var database= mongoose.connect("mongodb://localhost/projetnode");

console.log(database);
