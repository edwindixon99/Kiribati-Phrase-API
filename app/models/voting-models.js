const db = require('../../config/db')

const TRANSLATION_TABLE = 'translations'
const KIRIBATI_COLUMN = 'kiribati'
const ENGLISH_COLUMN = 'english'
const UPVOTE_COLUMN = 'upvotes'
const DOWNVOTE_COLUMN = 'downvotes'

const joinedQuery = (query, lang) => {
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

const voteExists = async function(connection, queryParams) {
    const queryString = 'select * from votes join translations t on t.ID = votes.translation_id join users u on u.id = votes.user_id where session_token=(?) and translation_id=(?)'
    const [rows] = await connection.query(queryString, queryParams)

    return rows
}
exports.addVoteEntry = async function (queryParams) {
    const connection = await db.getPool().getConnection()

    const voteAlreadyExists = await voteExists(connection, queryParams);
    
    let status = 201;
    let queryString = '';
    const voteEntry = voteAlreadyExists[0];

    if (voteEntry) {
        console.log(voteEntry.vote_type)
        const newVT = queryParams[2];
        if (voteEntry.vote_type !== newVT) {
            console.log(voteEntry)
            queryString = 'update votes set vote_type=(?) where user_id=(select id from users where session_token=(?)) and translation_id=(?)'
            await connection.query(queryString, [newVT, voteEntry.session_token, voteEntry.translation_id])
            console.log("vote changed")
        } else {
            console.log("no change")
        }
          
    } else {
        queryString = 'insert into votes (user_id, translation_id, vote_type) values ((select users.id from users where session_token=(?)), (?), (?))'
        await connection.query(queryString, queryParams)
        console.log("vote added")
    }
    
    connection.release()
    return status;
}

