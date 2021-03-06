const db = require('../../config/db')
const userMW = require('../middleware/user-middleware')



exports.handleRequest = async function (queryParams) {
    const connection = await db.getPool().getConnection()

    const query = "INSERT INTO requested (word, is_kiribati, number_of_requests) VALUES (?, ?, 1) ON DUPLICATE KEY UPDATE `number_of_requests` = `number_of_requests` + 1;"

    const [rows] = await connection.query(query, queryParams)

    connection.release()
    return rows;
}


exports.getKiribatiRequests = async function () {
    const connection = await db.getPool().getConnection()

    const query = "select * from requested where is_kiribati=1 and not exists( select * from translations where kiribati = word) order by number_of_requests DESC, id DESC"

    const [rows] = await connection.query(query)

    connection.release()
    return rows;
}

exports.getEnglishRequests = async function () {
    const connection = await db.getPool().getConnection()

    const query = "select * from requested where is_kiribati=0 and not exists( select * from translations where english = word) order by number_of_requests DESC, id DESC"

    const [rows] = await connection.query(query)

    connection.release()
    return rows;
}