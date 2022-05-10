const classNft = require("../model/class/nft.class");
const SchemaNft = require("../model/schema/nft");
const SchemaUsers = require("../model/schema/users");

async function construitUnNft(json){
    let monNft= await new classNft(json);

    const resultat= await insereUnNftEnBDD(monNft);
    return resultat;
}

const insereUnNftEnBDD = async (nft) => {

    const insertionNft = await SchemaNft.create(nft);
    if (insertionNft) {
        const JSONSuccess = { "succes": "message saved" };
        return JSONSuccess;
    } else {
        const JSONError = { "erreur" : "error" };
        return JSONError;
    }
}

const renvoiListeNft = async () => {
    let tabNft = new Array();
    const nft = await getAllNft();

    [...nft].forEach(element => {
        const nft = new classNft(element);
        tabNft.push(nft);
    })
    //a remplacer par le renvoi au client
    return tabNft
}

const getAllNft = async () => {
    const result = await SchemaNft.find();
    return result;
}

const modifieNft = async (json) => {

    const filter = {'name': {"$in": json.name}};
    const update = {'ownerLogin': json.ownerLogin};
    //console.log(SchemaNft.find(filter))
    const v = SchemaNft.find(filter);
    if (v) {
        const JSONMessage = { "success": "success" };
        console.log(v);
    } else {
        const JSONError = { "erreur": "impossible de modifier l'avatar. Veuillez choisir une autre photo" };
        console.log(JSONError);
    }
    return SchemaNft.findOneAndUpdate(filter, update);
}

module.exports = { construitUnNft , renvoiListeNft , modifieNft};