const express = require('express');
const controler = require('../controler/user.controler');

const userRouter = express.Router();
userRouter.post('/inscription', controler.construitUnUtilisateur)