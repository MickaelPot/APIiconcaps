var SchemaUsers = require('../model/schema/users.js');
const classUser = require('../model/class/user.class.js');
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");



const connexion = async (utilisateurJson) => {
    let connexion = false;
    let verifiePass = false;
    let verifL = false;
    let verifM = false;
    let verifMail = false;
    const verifLogin = await getOneUserWithName(utilisateurJson);
    if (verifLogin.erreur === "utilisateur inexistant en base de données") {
        verifMail = await getOneUserWithMail(utilisateurJson);
        console.log(verifMail);
        if (verifMail.erreur === "email inexistant en base de données") {
            const JSONError = { "erreur": "utilisateur ou mail inconnu" };
            return JSONError;
        } else {
            verifM = true;
        }
    } else {
        verifL = true;
    }

    if (verifL) {
        verifiePass = await verifieMDP(utilisateurJson.login, utilisateurJson.password);
    } else if (verifM) {
        verifiePass = await verifieMDP(verifMail[0].login, utilisateurJson.password);
    }
    if (verifiePass.succes) {
        connexion = true;
    }
    if (connexion && verifL) {
        return verifLogin[0];
    } else if (connexion && verifM) {
        return verifMail[0];
    } else {
        const JSONError = { "erreur": "mot de passe incorrect" };
        return JSONError;
    }
}

async function construitUnUtilisateur(json) {
    let monUtilisateur = await new classUser(json);
    const modifMDP = monUtilisateur.hashPsw(monUtilisateur.password);
    if (modifMDP.status) {
        monUtilisateur.dateInscription = new Date();
        const resultat = await insereUnUserEnBDD(monUtilisateur);
        return resultat;
    } else {
        const JSONError = { "erreur": "impossible d'inserer l'utilisateur en base de données" };
        return JSONError;
    }
}

const getAllUsers = async () => {
    const result = await SchemaUsers.find({});
    return result;
}

const getOneUserWithName = async (utilisateur) => {
    const result = await SchemaUsers.find({ "login": utilisateur.login });
    if (result[0]) {
        return result;
    } else {
        const JSONError = { "erreur": "utilisateur inexistant en base de données" };
        return JSONError;
    }
}

const getOneUserWithMail = async (utilisateur) => {
    const result = await SchemaUsers.find({ "mail": utilisateur.mail });
    if (result[0]) {
        return result;
    } else {
        const JSONError = { "erreur": "email inexistant en base de données" };
        return JSONError;
    }
}

const verifieMDP = async (login, passwordEnClair) => {
    const result = await SchemaUsers.find({ "login": login });
    if (result != "") {
        const boolVerif = await bcrypt.compareSync(passwordEnClair, result[0].password);
        if (boolVerif) {
            const JSONMessage = { "succes": "succes" };
            return JSONMessage;
        } else {
            const JSONError = { "erreur": "erreur de mot de passe" };
            return JSONError;
        }
    } else {
        const JSONError = { "erreur": "utilisateur inexistant en base de données" };
        return JSONError;
    }
}

const renvoiListeUsers = async () => {
    let tabUser = new Array();
    const users = await getAllUsers();

    users.forEach(element => {
        const utilisateur = new classUser(element);
        tabUser.push(utilisateur);
    })
    //a remplacer par le renvoi au client
    envoiAuClient(tabUser);
}

const insereUnUserEnBDD = async (user) => {
    //envoiAuClient(parametre);
    const resultat = await getOneUserWithName(user);
    if (resultat.erreur === "utilisateur inexistant en base de données") {
        const resultatMail = await getOneUserWithMail(user);
        if (resultatMail.erreur === "email inexistant en base de données") {
            //const dateInscription= new Date();
            //console.log(dateInscription)
            const insertionUser = await SchemaUsers.create(user);
            if (insertionUser) {
                const JSONSuccess = { "succes": "utilisateur crée" };
                //envoyer un email
               const mail= await envoiMail2(user.mail);

                return JSONSuccess;
            } else {
                const JSONError = { "erreur": "impossible d'inserer l'utilisateur en base de données" };
                return JSONError;
            }
        } else {
            const JSONError = { "erreur": "e-mail déja rentré. Avez vous oublié votre mot de passe ?" };
            return JSONError;
        }

    } else {
        const JSONError = { "erreur": "pseudo indisponible. Merci de le changer" };
        return JSONError;
    }
}

const modifieAvatar = async (login, avatar) => {
    if (login=="" || avatar=="") {
        const JSONError = { "erreur": "erreur de connexion. Merci de vous reconnecter" };
        return JSONError;
    } else {
        const filter = { login: login };
        const update = { avatar: "data:image/png;base64,"+avatar };
        const resultat = await SchemaUsers.findOneAndUpdate(filter, update);
        if (resultat) {
            const JSONMessage = { "success": "success" };
            return JSONMessage;
        } else {
            const JSONError = { "erreur": "impossible de modifier l'avatar. Veuillez choisir une autre photo" };
            return JSONError;
        }
    }
}

const modifieDescription = async (login, description) => {
    if (login=="" || description=="") {
        const JSONError = { "erreur": "erreur de connexion. Merci de vous reconnecter" };
        return JSONError;
    } else {
        const filter = { login: login };
        const update = { description: description };
        const resultat = await SchemaUsers.findOneAndUpdate(filter, update);
        if (resultat) {
            const JSONMessage = { "success": "success" };
            return JSONMessage;
        } else {
            const JSONError = { "erreur": "impossible de modifier la description" };
            return JSONError;
        }
    }
}

async function envoiMail(mail) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();
  
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });
  
    let info = await transporter.sendMail({
      from: '"ne pas répondre IconCaps" <mickael.pot@hotmail.fr>',
      to: mail, 
      subject: "Bienvenue sur IconCaps",
      text: "Votre compte a été crée. Merci de vous connecter",
      html: "<b>Bienvenue sur IconCaps</b>", 
    });
  
    console.log("Message sent: %s", info.messageId);
  
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  }
  
  envoiMail().catch(console.error);

  function envoiMail2(mail){
    var transporter = nodemailer.createTransport({
        service: 'hotmail',
        auth: {
          user: 'mick_74@hotmail.com',
          pass: '****'
        }
      });
      
      var mailOptions = {
        from: 'mick_74@hotmail.com',
        to: mail,
        subject: 'Bienvenue sur IconCaps',
        text: 'Votre compte a été crée. Merci de vous connecter'
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
  }


function envoiAuClient(tableau) {
    //A changer en JSON
    console.log(tableau);
}


module.exports = { renvoiListeUsers, insereUnUserEnBDD, verifieMDP, connexion, construitUnUtilisateur, modifieAvatar, modifieDescription };
