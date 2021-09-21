const db = require('../../config/db')


exports.insertUser = async function(userInfo) {
    const connection = await db.getPool().getConnection()
    const q_params = [userInfo.username, userInfo.idtoken, userInfo.email];
    const queryString = "INSERT INTO Kiribati.users (username, ext_id_token, email) VALUES ((?), (?), (?))"

    const [rows] = await connection.query(queryString, q_params)
    // console.log(rows)
    connection.release()
    return rows
}


exports.updateSessionToken = async function(extId, token) {
    const connection = await db.getPool().getConnection()
    const q_params = [token, extId];

    const queryString = "UPDATE Kiribati.users SET session_token= (?) where ext_id_token= (?)"

    const [rows] = await connection.query(queryString, q_params)

    connection.release()
    return rows
}

exports.removeSessionToken = async function(token) {
    const connection = await db.getPool().getConnection()


    const queryString = "UPDATE Kiribati.users SET session_token= NULL where session_token= (?)"

    await connection.query(queryString, token)

    connection.release()
   
}