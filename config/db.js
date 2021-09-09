const mysql = require('mysql2/promise');

let pool = null;

exports.createPool = async function() {
    pool = mysql.createPool({
        multipleStatements: true,
        host: process.env.PROJECT_MYSQL_HOST,
        user: process.env.PROJECT_MYSQL_USER,
        password: process.env.PROJECT_MYSQL_PASSWORD,
        database: process.env.PROJECT_MYSQL_DATABASE,
        port: process.env.PROJECT_MYSQL_PORT
    });
};

exports.getPool = function () {
    return pool;
}