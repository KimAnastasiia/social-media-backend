
const express = require('express');
const mysqlConnection = require("./mysqlConnection")
const crypto = require('crypto');
const routerMessages = express.Router();
const sharp = require('sharp');
const objectOfApiKey = require("./objectApiKey")
const jwt = require("jsonwebtoken");
const database= require("./database")




module.exports=routerMessages