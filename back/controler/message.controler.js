const classMessage = require("../model/class/messages.class");
const SchemaMessage = require("../model/schema/messages");
require("../model/class/user.class");
require("../model/schema/users");
const {stringify} = require("nodemon/lib/utils"); // AJOUT
async function construitUnMessage(json){
    let monMessage= await new classMessage(json);

    const resultat= await insereUnMessageEnBDD(monMessage);
    return resultat;
}

const insereUnMessageEnBDD = async (message) => {

    const insertionMessage = await SchemaMessage.create(message);
    if (insertionMessage) {
        const JSONSuccess = { "succes": "message saved" };
        return JSONSuccess;
    } else {
        const JSONError = { "erreur" : "error" };
        return JSONError;
    }
}

const renvoiListeMessage = async (json) => {
    let tabMessage = new Array();
    const message = await getAllMessage(json);

    [...message].forEach(element => {
        const messages = new classMessage(element);
        tabMessage.push(messages);
    })
    //a remplacer par le renvoi au client
    return tabMessage
}

const getAllMessage = async (json) => {
    const result = await SchemaMessage.find({
        $or: [
            {'sender': {"$in": [json.sender,json.receiver]}},
            {'receiver': {"$in": [json.sender,json.receiver]}}
        ]
    });
    return result;
}
// FONCTION MODIFIE
const renvoiListeMessageUser = async (json) => {
    let tabMessage = new Array();
    const message = await getAllMessageOfOneUser(json);

    [...message].forEach(element => {
        const messages = new classMessage(element);
        console.log(tabMessage.indexOf(stringify(messages.sender)) < 0)
        //console.log(stringify(messages.sender))
            if(messages.sender !== json.sender){
                if(tabMessage.indexOf(stringify(messages.sender)) < 0){
                    tabMessage.push(stringify(messages.sender));
                }
            } else {
                if(tabMessage.indexOf(stringify(messages.receiver)) < 0){
                    tabMessage.push(stringify(messages.receiver));
                }
            }
        }

    )
    return tabMessage
}
// A VERIFIER
const getAllMessageOfOneUser = async (json) => {
    const result = await SchemaMessage.find({
        $or: [
            {'sender': {"$in": [json.sender]}},
            {'receiver': {"$in": [json.sender]}}
        ]
    });
    return result;
}
module.exports = { construitUnMessage , renvoiListeMessage, renvoiListeMessageUser };