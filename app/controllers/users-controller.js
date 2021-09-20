const Users = require('../models/users-models');
const auth = require('../middleware/user-middleware');

exports.oauthSignIn = async function(req, res) {

    try {
        const idToken = req.idtoken;

        auth.googleVerify(idToken);
    
        // let newUser = await checkUserNotIndb(idToken)
        res.statusMessage = "verified user"
        res.status(200).send()        
        
    } catch(err) {
        res.status(500).send(`ERROR ${err}`)
    }



}