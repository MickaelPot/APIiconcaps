const express = require('express');
const controler = require('../controler/nft.controler');

const messageRouter = express.Router();
messageRouter.post('/nft', controler.construitUnNft)

const messageRouter = express.Router();
messageRouter.post('/getNft', controler.renvoiListeNft)