const crypto = require('crypto');
const Users = require('../models/users-models')


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

exports.generateSessionToken = function() {
    const token = crypto.randomBytes(50).toString('hex');

    return token;
    

}

exports.isLoggedOn = async function(token) {
    const user = await Users.checkToken(token);
    console.log(user)
    console.log("hasldflas")
    console.log(user.length > 0)
    return (user.length > 0)? true: false;
}

exports.getUserId = async function(connection, session_token) {
    const [rows] = await connection.query('select users.id from users where session_token=(?)', session_token);
    return rows[0].id;
}