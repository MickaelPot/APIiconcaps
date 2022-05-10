const express = require('express');
const controler = require('../controler/message.controler');

const messageRouter = express.Router();
messageRouter.post('/message', controler.construitUnMessage)

const messageRouter = express.Router();
messageRouter.post('/getMessage', controler.renvoiListeMessage)

const messageRouter = express.Router();
messageRouter.post('/messagerie', controler.renvoiListeMessageUser)