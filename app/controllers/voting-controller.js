const Votes = require('../models/voting-models')
const UserMW = require('../middleware/user-middleware')


votechecker
exports.upvotePhrase = async function(req, res) {
    try {
        const translationId = req.params.id;
        const sessionToken = req.headers['x-authorization'];
        if (!sessionToken) {
            return res.status(401).send();
        }
        if (!(await UserMW.isLoggedOn(sessionToken))) {
            return res.status(403).send();
        }
        if (!translationId) {
            return res.status(400).send();
        }
        queryParams = [translationId, se]
        Votes.addVoteEntry(true);
        res.status(200).send();

    } catch(err) {
        res.status(500).send();
    }


}


