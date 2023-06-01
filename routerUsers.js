const express = require('express');
const crypto = require('crypto');
const routerUsers = express.Router();
let keyEncrypt = 'password';
let algorithm = 'aes256'
const sharp = require('sharp');
const database= require("./database")

routerUsers.get("/",async(req,res)=>{
    database.connect();
    try{
        const user= await database.query("SELECT name, surname, phoneNumber, id, email, uniqueName, presentation from user WHERE id=?", [req.infoInToken.userId])
        database.disConnect()
        return  res.send(user)
    }catch(error){
        database.disConnect()
        return res.send({error:error});
    }
})

routerUsers.put("/",async(req,res)=>{
    let name = req.body.name
    let surname = req.body.surname
    let phoneNumber = req.body.phoneNumber
    let email = req.body.email
    let uniqueName = req.body.uniqueName
    let presentation = req.body.presentation
    database.connect()

    try{
        await database.query("UPDATE user SET name=?, surname=?, phoneNumber=?, email=?, uniqueName=?, presentation=? where id=? ", [name, surname, phoneNumber, email, uniqueName,  presentation, req.infoInToken.userId])
        database.disConnect()
        return res.send({message:"done"});
    }catch(error){
        database.disConnect()
        return res.send({error:error});
    }

})


routerUsers.put("/photo",(req,res)=>{
    let img = req.files.myImage
    if (img != null) {
        img.mv('public/images/' + req.infoInToken.userId.toString()+'1.png', 
            function(err) {
                if (err) {
                    res.send("Error in upload picture");
                } else{
                    sharp('public/images/' + req.infoInToken.userId.toString()  +'1.png')
                    .resize(309,309)
                    .toFile('public/images/' + req.infoInToken.userId.toString() +'avatar.png', (errMini, infoMini) => {
                        if (errMini) {
                            console.error(errMini);
                            res.send("Error in resize picture");
                        } else {
                            res.send({message:"done"});
                        }
                    })
                    
                }
            }
        )
    }
})

routerUsers.put("/password",async(req,res)=>{
  
    let password = req.body.password
    let cipher = crypto.createCipher(algorithm, keyEncrypt);
    let passwordEncript = cipher.update(password, 'utf8', 'hex') + cipher.final('hex');
    database.connect()

    try{
        await database.query("UPDATE user SET password=? where id=?", [passwordEncript, req.infoInToken.userId])
        database.disConnect()
        return res.send({message:"done"});
    }catch(error){
        database.disConnect()
        return res.send({error:error});
    }
})
routerUsers.post("/checkPassword",async(req,res)=>{

    let password = req.body.password
    let cipher = crypto.createCipher(algorithm, keyEncrypt);
    let passwordEncript = cipher.update(password, 'utf8', 'hex') + cipher.final('hex');
    database.connect()

    try{
        const user = await database.query("SELECT * FROM user where id=? and password=?", [req.infoInToken.userId, passwordEncript])
        if(user.length>=1 ){
            database.disConnect()
            return res.send({ message:"right"})
        }else{
            database.disConnect()
            return res.send({ error:"Error" })
        }
    }catch(error){
        database.disConnect()
        return res.send({error:error});
    }
})
routerUsers.put("/private",async(req,res)=>{
  
    let private = req.body.private
    database.connect()
    try{
        await database.query("UPDATE user SET close=? where id=?", [private, req.infoInToken.userId])
        database.disConnect()
        return res.send({message:"done"});
    }catch(error){
        database.disConnect()
        return res.send({error:error});
    }
})
module.exports=routerUsers