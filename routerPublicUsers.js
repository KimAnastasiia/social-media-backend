const express = require('express');
const crypto = require('crypto');
const routerPublicUsers = express.Router();
let keyEncrypt = 'password';
let algorithm = 'aes256'
const objectOfApiKey = require("./objectApiKey")
const jwt = require("jsonwebtoken");
let fs=require("fs")
const database= require("./database")

routerPublicUsers.get("/",async(req,res)=>{

    let emailUser = req.query.email
    let name = req.query.name
    let id= req.query.id
    database.connect();
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

    try{
        const rows = await database.query(sqlQuery)
        database.disConnect()
        return res.send(rows)
    }catch(error){
        database.disConnect()
        return res.send({error:error});
    }

 
})
routerPublicUsers.get("/uniqueName",async(req,res)=>{

    let uniqueName = req.query.uniqueName
    database.connect()


    try{
        const rows = await database.query("SELECT uniqueName, name from user WHERE uniqueName=?", [uniqueName])
        database.disConnect()
        return res.send(rows)
    }catch(error){
        database.disConnect()
        return res.send({error:error});
    }
})


routerPublicUsers.get("/email",async(req,res)=>{
    let email = req.query.email
    database.connect()

    try{
        const rows = await database.query("SELECT email from user WHERE email=?", [email])

        if(rows.length>0){
            return res.send({
                messege:"email already in use",
                errorEmail: "error in email"
            });
             
        }else{
            database.disConnect()
            return res.send(rows)
        }
   
    }catch(error){
        database.disConnect()
        return res.send({error:error});
    }
})


routerPublicUsers.get("/avatar",(req,res)=>{

    let id = req.query.id
    let nameOfImg=id+"avatar.png"
    if (fs.existsSync("./public/images/"+nameOfImg)) {
        return res.send({message:true});
         
    }else{
        return res.send({message:false});
    }

})

routerPublicUsers.get("/:uniqueName",async(req,res)=>{

    let uniqueName = req.params.uniqueName
    database.connect()

    try{
        const rows = await database.query("SELECT name, id, email, uniqueName, close, lastTimeConnected from user WHERE uniqueName=?", [uniqueName])
        database.disConnect()
        return res.send(rows)

    }catch(error){
        database.disConnect()
        return res.send({error:error});
    }
})

routerPublicUsers.post("/verification",async(req,res)=>{
    let emailUser = req.body.email  
    let password = req.body.password
    let cipher = crypto.createCipher(algorithm, keyEncrypt);
    let passwordEncript = cipher.update(password, 'utf8', 'hex') + cipher.final('hex');

    database.connect()

    try{
        const user= await database.query("SELECT * FROM user where email= ? and password= ?", [emailUser, passwordEncript])
        if(user.length>=1 ){

 
            let apiKey = jwt.sign(
                { 
                    email: emailUser,
                    userId: user[0].id
                },
                "secret");

            objectOfApiKey.push(apiKey)

            return res.send(
            {
                messege:"user",
                apiKey: apiKey,
                name:user[0].name,
                userId: user[0].id,
                email: user[0].email,
                uniqueName: user[0].uniqueName
            })
        }
        else if(user.length==0){
            return res.send(
            {
                messege:"Incorrect password"
            })
        }
    }catch(error){
        database.disConnect()
        return res.send({error:error});
    }
})

routerPublicUsers.post("/",async(req,res)=>{

    let email = req.body.email
    let password = req.body.password
    let name =  req.body.name
    let phoneNumber =  req.body.phoneNumber
    let surname =  req.body.surname
    let uniqueName =  req.body.uniqueName
    let cipher = crypto.createCipher(algorithm, keyEncrypt);
    let passwordEncript = cipher.update(password, 'utf8', 'hex') + cipher.final('hex');
    database.connect()

    try{
        const emailUser=await database.query("SELECT email FROM user where email =? ", [email])

        if(emailUser.length>0){
            database.disConnect()
            return res.send({
                messege:"email already in use",
                error: "error in email"
            })
        }else{
            const uniqueNameUser=await database.query("SELECT uniqueName FROM user where uniqueName =? ", [uniqueName])
            if(uniqueNameUser.length>0){
                database.disConnect()
                return res.send({
                    messege:"uniqueName already in use",
                    error: "error in unique name"
                }) 
            }else{
                await database.query("INSERT INTO user (name, surname, password, phoneNumber, email, uniqueName, close ) VALUES  (?, ?, ?, ?, ?, ?, false) ", [name, surname, passwordEncript,phoneNumber,email,uniqueName])
                const user= await database.query("SELECT * FROM user where email=? and password=?", [email, passwordEncript])   
                if(user.length>=1){
        
                    let apiKey = jwt.sign(
                        { 
                            email: email,
                            userId: user[0].id
        
                        },
                        "secret");
        
                    objectOfApiKey.push(apiKey)
                    database.disConnect()
                    return res.send(
                    {
                        messege:"user",
                        apiKey: apiKey,
                        name: user[0].name,
                        userId: user[0].id,
                        uniqueName:  user[0].uniqueName
                    })
                        
                }  
            }
        }
    }catch(error){
        database.disConnect()
        return res.send({error:error})
    }
})
module.exports=routerPublicUsers
