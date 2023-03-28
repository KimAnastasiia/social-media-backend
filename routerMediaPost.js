const express = require('express');
const mysqlConnection = require("./mysqlConnection")
const crypto = require('crypto');
const routerMediaPost = express.Router();
let keyEncrypt = 'password';
let algorithm = 'aes256'

