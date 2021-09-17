const Phrases = require('../models/phrases-models')


const getRating = function(phrase) {
    let rating = phrase.upvotes / (phrase.upvotes + phrase.downvotes);
    return rating;
}


const makeJsonList = function(phrases) {
    const phraseList = []
    // console.log(phrases)
    for (let i = 0; i < phrases.length; i++) {
        phraseList.push({
            kiribati: phrases[i].kiribati,
            english: phrases[i].english,
            rating: getRating(phrases[i])
        })
    }
    return phraseList;
}

exports.getKiriPhrases = async function (req, res) {
    try {
        const engPhrase = req.query.q
        if (!engPhrase) {
            res.status(404).send()
        }
        const phrases = await Phrases.getKiriTranslation(engPhrase)
        const phraseList = makeJsonList(phrases);

        console.log(phrases)
        if (!phrases) {
            res.status(404).send()
        }
        res.status(200).send(phraseList)
    } catch (err) {
        res.status(500).send(`ERROR getting users ${err}`)
    }
}


exports.getKiriPhrase = async function (req, res) {
    try {
        const engPhrase = req.params.word;
        if (!engPhrase) {
            res.status(404).send()
        }
        const phrases = await Phrases.getKiriTranslation(engPhrase)

        
        if (!phrases || phrases.length == 0) {
            res.status(404).send()
        }
        res.status(200).send()
    } catch (err) {
        res.status(500).send(`ERROR getting users ${err}`)
    }
}



exports.getEngPhrases = async function (req, res) {
    try {
        const kiriPhrase = req.query.q
        // console.log(kiriPhrase)
        if (!kiriPhrase) {
            res.status(404).send()
        }
        let phrases = await Phrases.getEngTranslation(kiriPhrase)
        if (!phrases) {
            res.status(404).send()
        }
        
        // console.log(phrases)
        // console.log(phraseList)
        const phraseList = makeJsonList(phrases);
        res.status(200).send(phraseList)
    } catch (err) {
        res.status(500).send(`ERROR getting users ${err}`)
    }
}


exports.getEngPhrase = async function (req, res) {
    try {
        const kiriPhrase = req.params.word
        // console.log(kiriPhrase)
        if (!kiriPhrase) {
            res.status(404).send()
        }
        let phrases = await Phrases.getEngTranslation(kiriPhrase)
        if (!phrases || phrases.length == 0) {
            res.status(404).send()
        }
        
        // console.log(phrases)
        // console.log(phraseList)
        
        res.status(200).send()
    } catch (err) {
        res.status(500).send(`ERROR getting users ${err}`)
    }
}