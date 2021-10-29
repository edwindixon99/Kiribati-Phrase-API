const db = require('../../config/db')
const userMW = require('../middleware/user-middleware')



exports.handleRequest = async function (queryParams) {
    const connection = await db.getPool().getConnection()

    const query = "INSERT INTO requested (word, is_kiribati, number_of_requests) VALUES (?, ?, 1) ON DUPLICATE KEY UPDATE `number_of_requests` = `number_of_requests` + 1;"

    const [rows] = await connection.query(query, queryParams)

    connection.release()
    return rows;
}


exports.getRequest = async function () {
    const connection = await db.getPool().getConnection()

    const query = "select * from requested order by number_of_requests DESC"

    const [rows] = await connection.query(query)

    connection.release()
    return rows;
}