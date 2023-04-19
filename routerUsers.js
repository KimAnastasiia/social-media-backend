const express = require('express');
const mysqlConnection = require("./mysqlConnection")
const crypto = require('crypto');
const routerUsers = express.Router();
let keyEncrypt = 'password';
let algorithm = 'aes256'
const objectOfApiKey = require("./objectApiKey")
const jwt = require("jsonwebtoken");
const sharp = require('sharp');

routerUsers.get("/",(req,res,next)=>{


    mysqlConnection.query("SELECT name, surname, phoneNumber, id, email, uniqueName, presentation from user WHERE id="+req.infoInToken.userId+"", (err, rows) => {

        if (err){
            res.send({error:err});
            return 
        } else {
            console.log(rows);
        }

        res.send(rows)
    })
})

routerUsers.put("/",(req,res,next)=>{
    let img = req.files.myImage
    let name = req.body.name
    let surname = req.body.surname
    let phoneNumber = req.body.phoneNumber
    let email = req.body.email
    let uniqueName = req.body.uniqueName
    let presentation = req.body.presentation

    mysqlConnection.query("UPDATE user SET name= '"+name+"', surname='"+surname+"', phoneNumber='"+phoneNumber+"', email='"+email+"', uniqueName='"+uniqueName+"', presentation='"+presentation+"' where id= "+req.infoInToken.userId, (err, rows) => {

        if (err){
            res.send({error:err});
            return 
        } else {
            if (img != null) {
                img.mv('public/images/' + req.infoInToken.userId.toString()+'.png', 
                    function(err) {
                        if (err) {
                            res.send("Error in upload picture");
                        } else{
                            sharp('public/images/' + req.infoInToken.userId.toString()  +'.png')
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
            console.log(rows);
        }

    })

})


module.exports=routerUsers