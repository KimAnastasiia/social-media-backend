const mysql = require('mysql');
const util = require('util');

let database = {
    configuration:{
        host: '127.0.0.1',
        user: 'root',
        password: '1234',
        database: 'socialmedia',
        multipleStatements: true
    },
    mysqlConnection:null,
    query:null,
    connect() {
        this.mysqlConnection = mysql.createConnection(this.configuration);

        this.mysqlConnection.connect();
        this.query = util.promisify(this.mysqlConnection.query).bind(this.mysqlConnection);
    },
    disConnect() {
        this.mysqlConnection.end();
    }
}

module.exports=database