const crypto = require('crypto');


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