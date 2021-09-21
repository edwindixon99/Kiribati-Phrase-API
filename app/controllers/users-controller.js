const Users = require('../models/users-models');
const auth = require('../middleware/user-googleauth');
const UserMW = require('../middleware/user-middleware');


const oauthSignIn = async function(token) {

    try {
        
        let googleUser = await auth.googleVerify(token);
    
        if (!googleUser) {
            // res.statusMessage = "Unverified user"
            // res.status(403).send() 
            return false;
        }
        // res.statusMessage = "Verified user"
        // res.status(200).send(googleUser)   
        return googleUser;     
        
    } catch(err) {
        // res.status(500).send(`ERROR ${err}`)
        return false
    }



}

exports.register = async function(req, res) {
    try {
        const idToken = req.body.idtoken;
        const user = await oauthSignIn(idToken);
        
        if (!user) {
            res.statusMessage = "Google user unverified"
            return res.status(403).send();
        }
        const userInfo = req.body
        userInfo['idtoken'] = user['sub'];

        const requiredKeys = ['idtoken', 'username', 'email']

        if (!(UserMW.checkObjectHasRequiredKeys(requiredKeys, userInfo))) {
            res.statusMessage = "Required keys not provided"
            return res.status(400).send();
        }

        if (!(UserMW.validUserRegistraion(userInfo))) {
            res.statusMessage = "Required keys invalid"
            return res.status(400).send();
        }

        await Users.insertUser(userInfo);


        res.status(201).send();


    } catch(err) {
        console.log(err)
        if (err.errno == 1062) {
            res.statusMessage = "User of same field already exists"
            return res.status(400).send()
        }
        res.status(500).send();
    }
}


exports.login = async function(req, res) {
    try {

        const idToken = req.body.idtoken;
        const user = await oauthSignIn(idToken);
        if (!user) {
            res.statusMessage = "Google user unverified"
            return res.status(403).send();
        }

        // const requiredKeys = ['idtoken', 'username', 'email']
        const sessionToken = UserMW.generateSessionToken();
        const googleId = user['sub'];

        


        await Users.updateSessionToken(googleId, sessionToken)
        // if (!(UserMW.checkObjectHasRequiredKeys(requiredKeys, userInfo))) {
        //     res.statusMessage = "Required keys not provided"
        //     return res.status(400).send();
        // }
        res.status(200).send(sessionToken);


    } catch(err) {
        
        res.status(500).send();
    }


}

exports.logout = async function(req, res) {
    try {
        const sessionToken = req.headers['x-authorization'];
        await Users.removeSessionToken(sessionToken);
        res.status(200).send();
    } catch(err) {
        
        res.status(500).send();
    }


}