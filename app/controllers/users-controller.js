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

        


        const Updated = await Users.updateSessionToken(googleId, sessionToken)
        if (Updated.changedRows == 0) {
            return res.status(404).send();
        }
        
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


exports.getInfo = async function(req, res) {
    try {
        console.log("hello")
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
        let data = await Users.getUserVotes(sessionToken);
        console.log(data)
        let votingResult = {};
        for (let i=0; i < data.length; i++) {
            let transId = data[i].translation_id;
            votingResult[transId] = data[i].vote_type
        }

        console.log("hello")
        data = await Users.userTranslations(sessionToken);
        console.log(data)
        let translationsResult = {};
        for (let j=0; j < data.length; j++) {
            let transId = data[j].id;
            translationsResult[transId] = true
        }
        // const voteType = data[0].vote_type

        // const voteType = data[0].vote_type
        const result = {"votes" : votingResult, "translations": translationsResult}
        res.status(200).send(result);
    } catch(err) {
        console.log(err)
        res.status(500).send();
    }
}
