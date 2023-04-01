const express = require('express')
const app = express()
const port = 4000
app.use(express.static('public'));
const routerUsers =  require("./routerUsers")
app.use(express.json())
const objectOfApiKey = require("./objectApiKey")
var cors = require('cors')
app.use(cors())

// IMPORTANT for UPLOAD pictures
var fileUpload = require('express-fileupload');
app.use(fileUpload());


app.use(express.json())
const jwt = require("jsonwebtoken");


app.use("/users", routerUsers)


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})