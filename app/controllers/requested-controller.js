const Requested = require('../models/requested-models')
const UserMW = require('../middleware/user-middleware')

const modifyInput = function(word) {
    return word.trim().replace(/\s+/g,' ');
}


exports.insertRequest = async function(req, res) {
    try {
        const word = modifyInput(req.body.word);
        const queryParams = [word, req.body.isKiri]
        const rows = await Requested.handleRequest(queryParams);
        res.status(201).send();

    } catch(err) {
        console.log(err)
        res.status(500).send();
    }
}


const makeJsonList = function(words) {
    const wordList = []
    // console.log(phrases)
    for (let i = 0; i < words.length; i++) {
        wordList.push({
            isKiri: words[i].is_kiribati,
            word: words[i].word
        })
    }
    return wordList;
}


exports.getRequestedEnglishWords = async function(req, res) {
    try {
        const words = await Requested.getEnglishRequests()

        const wordList = makeJsonList(words);
        res.status(200).send(wordList);

    } catch(err) {
        console.log(err)
        res.status(500).send();
    }
}


exports.getRequestedKiribatiWords = async function(req, res) {
    try {
        const words = await Requested.getKiribatiRequests()

        const wordList = makeJsonList(words);
        res.status(200).send(wordList);

    } catch(err) {
        console.log(err)
        res.status(500).send();
    }
}

 

