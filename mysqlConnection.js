const mysql = require('mysql');

const mysqlConnection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '1234',
    database: 'socialmedia',
    multipleStatements: true
});

mysqlConnection.connect((err)=> {
    if(err){
        console.log('Error ' +err);
    } else{
        console.log('Connected to database')
    }
});

module.exports=mysqlConnection