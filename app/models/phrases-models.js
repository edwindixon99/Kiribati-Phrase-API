const db = require('../../config/db')

const TRANSLATION_TABLE = 'translations'
const KIRIBATI_COLUMN = 'kiribati'
const ENGLISH_COLUMN = 'english'
const UPVOTE_COLUMN = 'upvotes'

const DOWNVOTE_COLUMN = 'downvotes'

const queryGen = (query, lang) => {
    let queryString ='SELECT ' +
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
        " LIKE '% " +
        query.toLowerCase() +
        " %'"
    queryString +=
        ' OR ' + lang + " LIKE '" + query.toLowerCase() + "'"
    queryString +=
        ' OR ' + lang + " LIKE '" + query.toLowerCase() + " %'"
    queryString +=
        ' OR ' + lang + " LIKE '% " + query.toLowerCase() + "'"

    return queryString;
}

exports.getKiriTranslation = async function (query) {
    const connection = await db.getPool().getConnection()
    const queryString = queryGen(query, KIRIBATI_COLUMN)

    const [rows] = await connection.query(queryString)
    // console.log(rows)
    connection.release()
    return rows
}

exports.getEngTranslation = async function (query) {
    const connection = await db.getPool().getConnection()
    const queryString = queryGen(query, ENGLISH_COLUMN)

    const [rows] = await connection.query(queryString)
    // console.log(rows)
    connection.release()
    return rows
}
