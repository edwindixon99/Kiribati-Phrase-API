const {OAuth2Client} = require('google-auth-library');

// https://developers.google.com/identity/sign-in/web/backend-auth
let CLIENT_ID = ""
const client = new OAuth2Client(CLIENT_ID);


exports.googleVerify = async function(token) {
    
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        // If request specified a G Suite domain:
        // const domain = payload['hd'];
      }
    verify().catch(console.error);
}
