const express = require('express');
const mysqlConnection = require("./mysqlConnection")
const crypto = require('crypto');
const routerPublicUsers = express.Router();
let keyEncrypt = 'password';
let algorithm = 'aes256'
const objectOfApiKey = require("./objectApiKey")
const jwt = require("jsonwebtoken");



routerPublicUsers.get("/",(req,res,next)=>{

    let emailUser = req.query.email
    let name = req.query.name
    let id= req.query.id

    let sqlQuery="SELECT name, id, uniqueName FROM user"

    if(emailUser!=undefined){
        sqlQuery="SELECT name, id, uniqueName FROM user where email ='"+emailUser+"' "
    }
  
    if(name!=undefined){
        sqlQuery="SELECT  name, id, uniqueName FROM user WHERE uniqueName LIKE '"+name+"%'"
    }
    
    if(id!=undefined){
        sqlQuery="SELECT name, id, uniqueName, email FROM user where id ="+id
    }

    mysqlConnection.query(sqlQuery, (err, rows) => {

        if (err){
            res.send({error:err});
            return 
        } else {
            console.log(rows);
        }

        res.send(rows)
    })
 
})

routerPublicUsers.get("/:uniqueName",(req,res,next)=>{

    let uniqueName = req.params.uniqueName

    mysqlConnection.query("SELECT name, id, email, uniqueName from user WHERE uniqueName='"+uniqueName+"'", (err, rows) => {

        if (err){
            res.send({error:err});
            return 
        } else {
            console.log(rows);
        }

        res.send(rows)
    })
})

routerPublicUsers.post("/verification",(req,res,next)=>{
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
                userId: rows[0].id,
                email: rows[0].email,
                uniqueName: rows[0].uniqueName
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

routerPublicUsers.post("/",(req,res,next)=>{

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
                            userId: rows[0].id,
                            uniqueName:  rows[0].uniqueName,
                        })
                        return 
                    }
        
            
                })
        
            })
        }
    })
 
 
})
module.exports=routerPublicUsers