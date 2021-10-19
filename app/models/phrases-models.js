const { query } = require('express')
const db = require('../../config/db')
const userMW = require('../middleware/user-middleware')

const TRANSLATION_TABLE = 'translations'
const KIRIBATI_COLUMN = 'kiribati'
const ENGLISH_COLUMN = 'english'
const UPVOTE_COLUMN = 'upvotes'
const ID_COLUMN = 'id'

const DOWNVOTE_COLUMN = 'downvotes'

const queryGen = (query, lang, exact) => {
    let queryString ='SELECT ' +
        ID_COLUMN +
        ',' +
        KIRIBATI_COLUMN +
        ',' +
        ENGLISH_COLUMN +
        ',' +
        UPVOTE_COLUMN +
        ',' +
        DOWNVOTE_COLUMN +
        ' FROM ' +
        TRANSLATION_TABLE +
        ' WHERE ' +
        KIRIBATI_COLUMN +
        " LIKE concat('% ', ? ,' %')"
    queryString +=
        ' OR ' + lang + " LIKE ?"
    queryString +=
        ' OR ' + lang + " LIKE concat(?,' %')"
    queryString +=
        ' OR ' + lang + " LIKE concat('% ', ?)"

    if (query.length > 2 && !(exact == "true")) {
        queryString +=
        ' OR ' + lang + " LIKE concat(?, '%')"
    }
    queryString += "ORDER BY upvotes DESC, downvotes"
    
    return queryString;
}



exports.getKiriTranslation = async function (query, exact) {
    const connection = await db.getPool().getConnection()
    const queryString = queryGen(query, KIRIBATI_COLUMN, exact)
    const newparam = query.toLowerCase()
    const newparams = [newparam, newparam, newparam, newparam, newparam]
    const [rows] = await connection.query(queryString, newparams)
    // console.log(rows)
    connection.release()
    return rows
}

exports.getEngTranslation = async function (query, exact) {
    const connection = await db.getPool().getConnection()
    const queryString = queryGen(query, ENGLISH_COLUMN, exact)

    const newparam = query.toLowerCase()
    const newparams = [newparam, newparam, newparam, newparam, newparam]
    const [rows] = await connection.query(queryString, newparams)
    // console.log(rows)
    connection.release()
    return rows
}

// exports.getSingleTranslation= async function(id) {
//     const connection = await db.getPool().getConnection()

//     const [rows] = await connection.query("select * from translations where id=(?)", id)
//     // console.log(rows)
//     connection.release()
//     return rows
// }

const orderparams = function(language, word, translation) {
    if (language === 'kiribati') {
        return [translation, word]
    } else {
        return [word, translation]
    }
}


exports.addTranslation = async function (sessionToken, language, word, translation) {
    const connection = await db.getPool().getConnection()
    const userId = await userMW.getUserId(connection, sessionToken)
    let queryString = "INSERT INTO translations (ENGLISH, KIRIBATI, author_id) values (?, ?, ?)"
    let queryParams = orderparams(language, word, translation)
    queryParams.push(userId)
    console.log(queryParams)
    const [rows] = await connection.query(queryString, queryParams)

    // Upvote the added translation
    const translationId = rows.insertId
    queryParams = [userId, translationId]
    queryString = "INSERT INTO votes (user_id, translation_id, vote_type) values (?, ?, 1)"
    await connection.query(queryString, queryParams)

    // console.log(rows)
    connection.release()
    return rows
}
