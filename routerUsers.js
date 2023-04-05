const express = require('express');
const mysqlConnection = require("./mysqlConnection")
const crypto = require('crypto');
const routerUsers = express.Router();
let keyEncrypt = 'password';
let algorithm = 'aes256'
const objectOfApiKey = require("./objectApiKey")
const jwt = require("jsonwebtoken");



routerUsers.get("/",(req,res,next)=>{

    let emailUser = req.query.email

    mysqlConnection.query("SELECT email, name, surname, id, phoneNumber FROM user where email ='"+emailUser+"' ", (err, rows) => {

        if (err){
            res.send({error:err});
            return 
        } else {
            console.log(rows);
        }

        res.send(rows)
    })
})

routerUsers.get("/:name",(req,res,next)=>{

    let name = req.params.name
    
    mysqlConnection.query("SELECT * FROM user WHERE uniqueName LIKE '"+name+"%'", (err, rows) => {

        if (err){
            res.send({error:err});
            return 
        } else {
            console.log(rows);
        }

        res.send(rows)
    })
})

routerUsers.post("/verification",(req,res,next)=>{
    let emailUser = req.body.email
    let password = req.body.password
    let cipher = crypto.createCipher(algorithm, keyEncrypt);
    let passwordEncript = cipher.update(password, 'utf8', 'hex') + cipher.final('hex');
    
    

    mysqlConnection.query("SELECT * FROM user where email='"+emailUser+"' and password='"+passwordEncript+"'", (err, rows) => {
        if (err){
            res.send({error: err});
            return ;
        }
        else{
            console.log(rows)
        }
        if(rows.length>=1 ){

            console.log(rows[0].id)
            let apiKey = jwt.sign(
                { 
                    email: emailUser,
                    userId: rows[0].id
                },
                "secret");

            objectOfApiKey.push(apiKey)

            res.send(
            {
                messege:"user",
                apiKey: apiKey,
                name:rows[0].name,
                userId: rows[0].id
            })
        }
        if(rows.length==0){
            res.send(
            {
                messege:"Incorrect password",
            })
        }

    }
    )
})

routerUsers.post("/",(req,res,next)=>{

    let email = req.body.email
    let password = req.body.password
    let name =  req.body.name
    let phoneNumber =  req.body.phoneNumber
    let surname =  req.body.surname
    let cipher = crypto.createCipher(algorithm, keyEncrypt);
    let passwordEncript = cipher.update(password, 'utf8', 'hex') + cipher.final('hex');


    mysqlConnection.query("SELECT email FROM user where email ='"+email+"' ", (errUsedEmail, rowsUsedEmail) => {

        if (errUsedEmail){
            res.send({error:errUsedEmail});
            return 
        }
        if(rowsUsedEmail.length>0){
            res.send({
                messege:"email already in use",
                error: "error"
            });
            return 
        }else{
            mysqlConnection.query("INSERT INTO user (name, surname, password, phoneNumber, email) VALUES  ('"+name+"','"+surname+"','"+passwordEncript+"', "+phoneNumber+" ,'"+email+"'  ) ", (errPost , rowsPost) => {

                if (errPost){
                    res.send({error: errPost});
                    return ;
                }
                mysqlConnection.query("SELECT * FROM user where email='"+email+"' and password='"+passwordEncript+"'", (err, rows) => {
                    
                    if (err){
                        res.send({error: err});
                        return ;
                    }
                   
                    
                    if(rows.length>=1){
            
                        let apiKey = jwt.sign(
                            { 
                                email: email,
                                userId: rows[0].id
            
                            },
                            "secret");
            
                        objectOfApiKey.push(apiKey)
            
                        res.send(
                        {
                            messege:"user",
                            apiKey: apiKey,
                            name:rows[0].name,
                            userId: rows[0].id
                        })
                        return 
                    }
        
            
                })
        
            })
        }
    })
 
 
})
module.exports=routerUsers
