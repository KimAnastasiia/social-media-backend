const express = require('express')
const app = express()
const port = 4000
app.use(express.static('public'));
const routerUsers =  require("./routerUsers")
app.use(express.json()
)
var cors = require('cors')
app.use(cors())

app.use(express.json())
const jwt = require("jsonwebtoken");

app.use("/users", routerUsers)


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})