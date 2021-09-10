const Phrases = require('../models/phrases-models')

exports.getKiriPhrases = async function (req, res) {
    try {
        const engPhrase = req.query.q
        if (!engPhrase) {
            res.status(404).send()
        }
        const phrases = Phrases.getKiriTranslation(engPhrase)
        const phraseList = []
        for (let i = 0; i < phrases.length; i++) {
            phraseList.push({
                kiribati: phrases[i].kiribati,
                english: phrases[i].english,
            })
        }
        console.log(phrases)
        if (!phrases) {
            res.status(404).send()
        }
        res.status(200).send(phraseList)
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
        let phrases = Phrases.getEngTranslation(kiriPhrase)
        if (!phrases) {
            res.status(404).send()
        }
        const phraseList = []
        // console.log(phrases)
        for (let i = 0; i < phrases.length; i++) {
            phraseList.push({
                kiribati: phrases[i].kiribati,
                english: phrases[i].english,
            })
        }
        console.log(phrases)

        res.status(200).send(phraseList)
    } catch (err) {
        res.status(500).send(`ERROR getting users ${err}`)
    }
}
