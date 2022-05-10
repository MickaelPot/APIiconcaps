var mongoose = require ('mongoose');
var Schema = mongoose.Schema;

const user = new Schema({
  login: {
    type : String,
    required: true
  },
  mail: {
    type: String,
    required: true
},
password: {
    type: String,
    required: true
},

admin: {
  type: Boolean,
  required: true
},

actif: {
  type: Boolean,
  required: true
},

dateInscription:{
  type: Date,
  required: true
},

avatar:{
  type: String,
  required:false
},

description:{
  type: String,
  required:false
}

});


var SchemaUsers= mongoose.model('users', user);

module.exports=SchemaUsers;