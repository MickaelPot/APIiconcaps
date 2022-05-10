var express = require('express');
var app = express();
const option= require('./parameters/configuration.js');
var mongoose = require ('mongoose');
const controlerUser= require ('./back/controler/user.controler.js');
const controlerMessage= require ('./back/controler/message.controler');
const controlerNft= require ('./back/controler/nft.controler');
const cors = require('cors');
const http = require("http");
const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "*"
  }
});

app.use(cors({
  origin: "*"
}))

app.use(express.json({limit: "5000kb"}));


// 1. Connection à la base de données
mongoose.connect(option.mongoConnexion, {useNewUrlParser: true, useUnifiedTopology: true});
var database= mongoose.connection;
database.on('error', console.error.bind(console, 'MongoDB connection error:'));


app.post(function(req, res, next){
  next();
});

app.post('/inscription', async (req, res)=>{
  try{
    const json = await controlerUser.construitUnUtilisateur(req.query);
    console.log(json);
    res.send(json);
  }catch (error){
    console.log(error);
  }
});

app.post('/message',async (req,res)=>{
  try{
    const json = await controlerMessage.construitUnMessage(req.query);
    console.log(json);
    res.send(json);
  } catch (error){
    console.log(error)
  }
})

app.post('/nft',async (req,res)=>{
  try{
    const json = await controlerNft.construitUnNft(req.body);
    console.log(json);
    res.send(json);
  } catch (error){
    console.log(error)
  }
})

app.post('/getMessage',async (req,res)=>{
  try{
    const json = await controlerMessage.renvoiListeMessage(req.query);
    console.log("message")
    console.log(json);
    res.json(json);
  } catch (error){
    console.log(error)
  }
})

app.post('/messagerie',async (req,res)=>{
  try{
    const json = await controlerMessage.renvoiListeMessageUser(req.query);
    console.log("message")
    console.log(json);
    res.json(json);
  } catch (error){
    console.log(error)
  }
})

app.post('/getNft',async (req,res)=>{
  try{
    const json = await controlerNft.renvoiListeNft(req.query);
    console.log("nft")
    //console.log(json);
    res.json(json);
  } catch (error){
    console.log(error)
  }
})

app.post('/changeNft',async (req,res)=>{
  try{
    //console.log(req.body)
    const json = await controlerNft.modifieNft(req.body);
    console.log("nft")
    //console.log(json);
    res.json(json);
  } catch (error){
    console.log(error)
  }
})

app.post('/connexion', async (req, res)=>{
  try{
    const JSON = await controlerUser.connexion(req.query);
    //console.log(JSON);
    res.send(JSON);
  }catch (error){
    console.log(error);
  }
});

app.post('/ajouteAvatar', async (req, res) =>{
  try{
    const resultat = await controlerUser.modifieAvatar(req.body.login, req.body.reader)
    console.log(resultat);
    res.send(resultat);
  }catch (error){
    console.log(error);
  }
});

app.post('/ajouteDescription', async (req,res) =>{
  try{
    const resultat = await controlerUser.modifieDescription(req.body.login, req.body.description)
    console.log(resultat);
    res.send(resultat);
  }catch (error){
    console.log(error);
  }
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('chat message', (msg,login,to) => {
    console.log('message: ' + msg+ ' de :'+login+':a:'+to);
    io.emit('chat message', msg,login,to);
  });
});


app.listen(option.port);
server.listen(option.port+1,() => {console.log("running")});