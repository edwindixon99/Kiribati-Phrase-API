const db = require('../../config/db')
const userMW = require('../middleware/user-middleware')


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

exports.checkToken = async function(token) {
    const connection = await db.getPool().getConnection()

    console.log(token)
    const queryString = "select * from Kiribati.users where session_token= (?)"

    const [rows] = await connection.query(queryString, token)

    connection.release()

    return rows;
   
}

exports.userTranslations = async function (sessionToken) {
    const connection = await db.getPool().getConnection()

    const userId = await userMW.getUserId(sessionToken)
    // queryParams[0] = userId;
    const queryString = 'select id FROM Kiribati.translations where author_id=(?)'
    const [rows] = await connection.query(queryString, userId)

    connection.release()
    return rows
}

exports.getUserVotes = async function(sessionToken) {
    const connection = await db.getPool().getConnection()

    
    // console.log(voteEntry)
    // const voteType = voteEntry.vote_type
    // await decrementVoteCount(connection, voteType, voteEntry.translation_id);

    const userId = await userMW.getUserId(sessionToken)
    // queryParams[0] = userId;
    const queryString = 'select * FROM Kiribati.votes where user_id=(?)'
    const [rows] = await connection.query(queryString, userId)

    connection.release()
    return rows
} 