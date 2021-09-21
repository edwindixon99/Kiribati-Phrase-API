const {OAuth2Client} = require('google-auth-library');

// https://developers.google.com/identity/sign-in/web/backend-auth
let CLIENT_ID = process.env.PROJECT_GOOGLE_CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);


exports.googleVerify = async function(token) {
    console.log(token)
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        // const userid = payload['sub'];
        console.log(payload)
        console.log(payload)
        console.log(payload)
        // If request specified a G Suite domain:
        // const domain = payload['hd'];
        return payload
    }
    try {
        console.log("hello")
        return await verify()
    } catch(err) {
        console.log(err);
    }
    
}

exports.checkObjectHasRequiredKeys = function(requiredKeys, objectToCheck) {
    return requiredKeys.every(key => Object.keys(objectToCheck).includes(key));
};

const validateEmail = function(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

const validateUsername = function(name) {
    const re = /^[a-zA-Z0-9_]+$/;
    return re.test(name);
}


exports.validUserRegistraion = function(reqObject) {
    let isValid = true;
    // validate email
    isValid = isValid && validateEmail(reqObject.email);
    // validate username
    isValid = isValid && validateUsername(reqObject.username);

    return isValid;
    

}
