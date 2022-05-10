var mongoose = require ('mongoose');
var Schema = mongoose.Schema;

/*
var messages = new Schema({
    sender: String,
    receiver: String,
    message: String,
  });
*/

const messages = new Schema({
    sender: {
        type : String,
        required: true
    },
    receiver: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
});


var SchemaMessages= mongoose.model('messages', messages);

module.exports=SchemaMessages;