const express = require('express');
const mysqlConnection = require("./mysqlConnection")
const crypto = require('crypto');
const routerUsers = express.Router();
let keyEncrypt = 'password';
let algorithm = 'aes256'
mysqlConnection.connect((err)=> {
    if(err){
        console.log('Error ' +err);
    } else{
        console.log('Connected to database')
    }
});
routerUsers.get("/privetData",(req,res,next)=>{
  
    mysqlConnection.query("SELECT email, name, surname, id, phoneNumber FROM users", (err, rows) => {

        if (err)
            res.send({error:err});
        else
            console.log(rows);

        res.send(rows)
    })
})

routerUsers.post("/addUser",(req,res,next)=>{

    let email = req.body.email
    let password = req.body.password
    let name =  req.body.name
    let phoneNumber =  req.body.phoneNumber
    let surname =  req.body.surname
    let cipher = crypto.createCipher(algorithm, keyEncrypt);
    let passwordEncript = cipher.update(password, 'utf8', 'hex') + cipher.final('hex');

    mysqlConnection.query("INSERT INTO user (name, surname, password, phoneNumber, email) VALUES  ('"+name+"','"+surname+"','"+passwordEncript+"', "+phoneNumber+" ,'"+email+"'  ) ", (err, rows) => {

        if (err){
            res.send({error: err});
            return ;
        }
        else{
        res.send(
            {
                messege:"done",
                rows: rows
            })
        }
    })
})
module.exports=routerUsers
