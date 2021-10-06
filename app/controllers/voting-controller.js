const Votes = require('../models/voting-models')
const UserMW = require('../middleware/user-middleware')


validVote = async function(res, queryParams) {
    const translationId = queryParams[0]
    const sessionToken = queryParams[1]
    if (!sessionToken) {
        res.status(401).send();
        return
    }
    if (!(await UserMW.isLoggedOn(sessionToken))) {
        res.status(403).send();
        return 
    }
    if (!translationId) {
        res.status(400).send();
        return
    }
    
    return true;
}
exports.upvotePhrase = async function(req, res) {
    try {
        const translationId = req.params.id;
        const sessionToken = req.headers['x-authorization'];
        const queryParams = [sessionToken, translationId, 1];

        if (!validVote(res, queryParams)) {
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

        if (!validVote(res, queryParams)) {
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
        if (!validVote(res, queryParams)) {
            return
        }
        await Votes.deleteVoteEntry(queryParams);
        res.status(204).send();
    } catch(err) {
        console.log(err)
        res.status(500).send();
    }
    
}


exports.getVoteType = async function(req, res) {
    try {
        const translationId = req.params.id;
        const sessionToken = req.headers['x-authorization'];
        const queryParams = [sessionToken, translationId];
        if (!validVote(res, queryParams)) {
            return
        }
        const data = await Votes.getVoteEntry(queryParams);
        if (!data[0]) {
            return res.status(404).send();
        }
        const voteType = data[0].vote_type
        res.status(200).send({voteType});
    } catch(err) {
        console.log(err)
        res.status(500).send();
    }
    
}

 