const db = require('../../config/db')

const TRANSLATION_TABLE = 'translations'
const KIRIBATI_COLUMN = 'kiribati'
const ENGLISH_COLUMN = 'english'
const UPVOTE_COLUMN = 'upvotes'
const DOWNVOTE_COLUMN = 'downvotes'

const voteExists = async function(connection, queryParams) {
    const queryString = 'select * from votes join translations t on t.ID = votes.translation_id join users u on u.id = votes.user_id where session_token=(?) and translation_id=(?)'
    const [rows] = await connection.query(queryString, queryParams)

    return rows
}

// const incrementVoteCount = async function(connection , voteType, translationId) {
//     const voteTypeString = getVoteTypeString(voteType);
//     const queryString = `update translations set ${voteTypeString} = ${voteTypeString} + 1 where id = ${translationId} `

//     await connection.query(queryString)
// }

// const decrementVoteCount = async function(connection , voteType, translationId) {
//     const voteTypeString = getVoteTypeString(voteType);
//     const queryString = `update translations set ${voteTypeString} = ${voteTypeString} - 1 where id = ${translationId} `
    
//     const [result] = await connection.query(queryString)

// }

const getUserId = async function(connection, session_token) {
    const [rows] = await connection.query('select users.id from users where session_token=(?)', session_token);
    return rows[0].id;
}

const addVoteEntry = async function(connection, queryParams) {
    
    const userId = await getUserId(connection, queryParams[0])
    queryParams[0] = userId;
    let queryString = 'insert into votes (user_id, translation_id, vote_type) values ((?), (?), (?))'
    await connection.query(queryString, queryParams)
    const voteType = queryParams[2];
    const translationId = queryParams[1];
    // await incrementVoteCount(connection, voteType, translationId);
    // const voteTypeString = getVoteTypeString(voteType);
    // queryString = `update translations set ${voteTypeString} = ((select ${voteTypeString} from translations where translation_id = ${translationId}) + 1) where translation_id = ${translationId} `

    // await connection.query(queryString)
    // console.log("vote added")
}

const changeVoteEntry = async function(connection, newVT, voteEntry) {
    console.log(voteEntry)
    const oldVT = voteEntry.vote_type;
    let queryString = 'update votes set vote_type=(?) where user_id=(select id from users where session_token=(?)) and translation_id=(?)'
    await connection.query(queryString, [newVT, voteEntry.session_token, voteEntry.translation_id])

    // await incrementVoteCount(connection, newVT, voteEntry.translation_id);
    // await decrementVoteCount(connection, oldVT, voteEntry.translation_id);

    // console.log("vote changed")
}

const getVoteTypeString = function(voteType) {
    let voteTypeString = '';
    if (voteType) {
        voteTypeString = 'upvotes'
    } else {
        voteTypeString = 'downvotes'
    }
    // console.log(voteTypeString)
    return voteTypeString;
}

exports.handleVoteEvent = async function (queryParams) {
    const connection = await db.getPool().getConnection()

    const voteAlreadyExists = await voteExists(connection, queryParams);
    
    let status = 201;
    let queryString = '';
    const voteEntry = voteAlreadyExists[0];
    // console.log(voteEntry)

    if (voteEntry) {

        // console.log(voteEntry.vote_type)
        const newVT = queryParams[2];
        // console.log(newVT)
        // console.log(voteEntry.vote_type)
        if (voteEntry.vote_type !== newVT) {
            await changeVoteEntry(connection, newVT, voteEntry)
        } else {
            // console.log("no change")
        }
          
    } else {
        await addVoteEntry(connection, queryParams);
    }
    
    connection.release()
    return status;
}


exports.deleteVoteEntry = async function(queryParams) {
    const connection = await db.getPool().getConnection()

    const voteAlreadyExists = await voteExists(connection, queryParams);
    
    const voteEntry = voteAlreadyExists[0];
    // console.log(voteEntry)
    const voteType = voteEntry.vote_type
    // await decrementVoteCount(connection, voteType, voteEntry.translation_id);

    const userId = await getUserId(connection, queryParams[0])
    queryParams[0] = userId;
    const queryString = 'DELETE FROM Kiribati.votes where user_id=(?) and translation_id=(?)'
    await connection.query(queryString, queryParams)

    connection.release()
}

// exports.incrementVoteCount = async function() {
//     const connection = await db.getPool().getConnection()


//     const queryString = "select * from Kiribati.users where session_token= (?)"

//     const [rows] = await connection.query(queryString, token)

//     connection.release()

//     return rows;
// }
