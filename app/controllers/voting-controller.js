const Votes = require('../models/voting-models')
const UserMW = require('../middleware/user-middleware')


// validVote = async function(res, queryParams) {
//     const translationId = queryParams[1]
//     const sessionToken = queryParams[0]
//     console.log(sessionToken)
//     if (!sessionToken) {
//         res.status(401).send();
//         return
//     }
//     if (!(await UserMW.isLoggedOn(sessionToken))) {
//         res.status(403).send();
//         return 
//     }
//     if (!translationId) {
//         res.status(400).send();
//         return
//     }
    
//     return true;
// }
exports.upvotePhrase = async function(req, res) {
    try {
        const translationId = req.params.id;
        const sessionToken = req.headers['x-authorization'];
        const queryParams = [sessionToken, translationId, 1];

       
        if (! await UserMW.validTranslationRequest(res, queryParams)) {
            return
        }

        const status = await Votes.handleVoteEvent(queryParams);
        res.status(status).send();

    } catch(err) {
        console.log(err)
        res.status(500).send();
    }
}


exports.downvotePhrase = async function(req, res) {
    try {
        const translationId = req.params.id;
        const sessionToken = req.headers['x-authorization'];
        const queryParams = [sessionToken, translationId, 0];

        if (! await UserMW.validTranslationRequest(res, queryParams)) {
            return
        }

        const status = await Votes.handleVoteEvent(queryParams);
        res.status(status).send();

    } catch(err) {
        console.log(err)
        res.status(500).send();
    }
}


exports.removeVote = async function(req, res) {
    try {
        const translationId = req.params.id;
        const sessionToken = req.headers['x-authorization'];
        const queryParams = [sessionToken, translationId];
        if (!await UserMW.validTranslationRequest(res, queryParams)) {
            return
        }

        await Votes.deleteVoteEntry(queryParams);
        console.log("success")
        res.status(204).send();
    } catch(err) {
        console.log(err)
        res.status(500).send();
    }
    
}

exports.userVoteList = async function(req, res) {
    try {
        const sessionToken = req.headers['x-authorization'];
        if (!sessionToken) {
            res.status(401).send();
            return
        }
        console.log(sessionToken)
        console.log(await UserMW.isLoggedOn(sessionToken))

        if (!(await UserMW.isLoggedOn(sessionToken))) {
            res.status(403).send();
            return 
        }
        
        console.log("hello")
        const data = await Votes.getUserVotes(sessionToken);
        console.log(data)
        let result = {};
        for (let i=0; i < data.length; i++) {
            let transId = data[i].translation_id;
            result[transId] = data[i].vote_type
        }
        // const voteType = data[0].vote_type
        res.status(200).send(result);
    } catch(err) {
        console.log(err)
        res.status(500).send();
    }
}

 