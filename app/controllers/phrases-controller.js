const Phrases = require('../models/phrases-models')
const UserMW = require('../middleware/user-middleware')


const getRating = function(phrase) {
    let rating = phrase.upvotes / (phrase.upvotes + phrase.downvotes);
    return rating;
}


const makeJsonList = function(phrases) {
    const phraseList = []
    // console.log(phrases)
    for (let i = 0; i < phrases.length; i++) {
        phraseList.push({
            id: phrases[i].id,
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
        const exactWord = req.query.exact
        console.log(exactWord)
        if (!engPhrase) {
            res.status(404).send()
        }
        const phrases = await Phrases.getKiriTranslation(engPhrase, exactWord)
        const phraseList = makeJsonList(phrases);

        // console.log(phrases)
        if (!phrases) {
            res.status(404).send()
        }
        res.status(200).send(phraseList)
    } catch (err) {
        res.status(500).send(`ERROR getting users ${err}`)
    }
}

const validSubmission = function(word, translation) {
    return (word.length > 0 && translation.length > 0)
}
exports.addPhrase = async function (req, res) {
    try {
        const language = req.params.lang
        const word = req.params.word
        const translation = req.body.translation
        const sessionToken = req.headers['x-authorization'];
        console.log(language)
        console.log(word)
        console.log(translation)
        if (!sessionToken) {
            res.status(401).send();
            return
        }
        if (!(await UserMW.isLoggedOn(sessionToken))) {
            res.status(403).send();
            return 
        }
        if (!(language === 'kiribati' || language === 'english')) {
            return res.status(404).send()
        }
        if (!validSubmission(word, translation)) {
            return res.status(400).send()
        }
        const phrases = await Phrases.addTranslation(sessionToken, language, word, translation)
        console.log(phrases)
        res.status(201).send()
    } catch (err) {
        if (err.errno === 1062) {
            res.statusMessage = "Translation already exists"
            res.status(400).send()    
        }
        console.log(err)
        res.status(500).send(`${err}`)
    }
}


// exports.getKiriPhrase = async function (req, res) {
//     try {
//         const engPhrase = req.params.word;
        
//         if (!engPhrase) {
//             res.status(404).send()
//         }
//         const phrases = await Phrases.getKiriTranslation(engPhrase)

        
//         if (!phrases || phrases.length == 0) {
//             res.status(404).send()
//         }
//         res.status(200).send()
//     } catch (err) {
//         res.status(500).send(`ERROR getting users ${err}`)
//     }
// }



exports.getEngPhrases = async function (req, res) {
    try {
        const kiriPhrase = req.query.q
        const exactWord = req.query.exact
        console.log(kiriPhrase)
        console.log(exactWord)
        if (!kiriPhrase) {
            res.status(404).send()
        }
        let phrases = await Phrases.getEngTranslation(kiriPhrase, exactWord)
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


// exports.getEngPhrase = async function (req, res) {
//     try {
//         const kiriPhrase = req.params.word
//         // console.log(kiriPhrase)
//         if (!kiriPhrase) {
//             res.status(404).send()
//         }
//         let phrases = await Phrases.getEngTranslation(kiriPhrase)
//         if (!phrases || phrases.length == 0) {
//             res.status(404).send()
//         }
        
//         // console.log(phrases)
//         // console.log(phraseList)
        
//         res.status(200).send()
//     } catch (err) {
//         res.status(500).send(`ERROR getting users ${err}`)
//     }
// }

// exports.getTranslation = async function (req, res) {
//     try {
//         const id = req.params.id
//         // console.log(kiriPhrase)
//         let translation = await Phrases.getSingleTranslation(id)
//         console.log(translation);
//         if (!translation || translation.length == 0) {
//             res.status(404).send()
//         }
        
//         // console.log(phrases)
//         // console.log(phraseList)
        
//         res.status(200).send(translation)
//     } catch (err) {
//         res.status(500).send(`ERROR getting users ${err}`)
//     }
// }