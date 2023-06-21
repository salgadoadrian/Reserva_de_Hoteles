const sql = require('mssql');
const Server = require('../models/server');

const dbSettings = {
    user: 'adrian',
    password: 'Adrian.0102@',
    server: 'localhost',
    database: 'hotel',
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
}


async function dbConnection() {

    try {
        const pool = await sql.connect(dbSettings)
        return pool;
        
    } catch (error) {
        console.log('ERROR AL INICIAR BASE DE DATOS');
        //console.error(error)
    }

} 

module.exports = {
    dbConnection
}