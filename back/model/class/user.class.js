const bcrypt = require("bcryptjs");

class User {
    constructor(element) {
        if (element.login) {
            this.login = element.login;
        }
        if (element.mail) {
            this.mail = element.mail;
        }
        if (element.password) {
            this.password = element.password;
        }
        if (element.admin) {
            if (element.admin === "true") {
                this.admin = true;
            }
            if (element.admin === "false") {
                this.admin = false;
            }
        } else {
            this.admin = false;
        }
        if (element.actif) {
            if (element.actif === "true") {
                this.actif = true;
            }
            if (element.actif === "false") {
                this.actif = false;
            }
        } else {
            this.actif = true;
        }
        this.dateInscription = element.dateInscription;
        if(element.avatar){
            this.avatar=element.avatar;
        }else{
            this.avatar="";
        }

        if(element.description){
            this.description= element.description;
        }
    }

    hashPsw = (passwordEnClair) => {
        try {
            const mdpHash = bcrypt.hashSync(passwordEnClair, 10);
            this.password = mdpHash;
            const reponseJSON = { "status": "succeed" };
            return reponseJSON;
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = User;