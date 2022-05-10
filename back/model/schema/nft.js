var mongoose = require ('mongoose');
var Schema = mongoose.Schema;

/*
var messages = new Schema({
    sender: String,
    receiver: String,
    message: String,
  });
*/

const nft = new Schema({
    name: {
        type : String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    ownerLogin: {
        type: String,
        required: true
    },
    nftSource: {
        type: String,
        required: true
    }
});


var SchemaNft= mongoose.model('nft', nft);

module.exports=SchemaNft;