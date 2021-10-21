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
        if (!phrases || phrases.length === 0) {
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
        const word = req.params.word.toLowerCase();
        const translation = req.body.translation.toLowerCase();
        const sessionToken = req.headers['x-authorization'];
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
        if (!phrases|| phrases.length === 0) {
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

exports.getRecent = async function (req, res) {
    try {
        let translationCount = req.query.count
        
        if (translationCount) {
            if (!(/^\+?(0|[1-9]\d*)$/.test(translationCount))) {
                return res.status(400).send()
            }
            translationCount = ((translationCount > 50)? 50: parseInt(translationCount))
        } else {
            translationCount = 50;
        }
        let phrases = await Phrases.getRecentTranslations(translationCount)
        if (!phrases || phrases.length === 0) {
            res.status(404).send()
        }
        const phraseList = makeJsonList(phrases);
        res.status(200).send(phraseList)
    } catch (err) {
        res.status(500).send(`ERROR getting users ${err}`)
    }
}

exports.deleteTranslation = async function (req, res) {
    try {
        const translationId = req.params.id;
        const sessionToken = req.headers['x-authorization'];
    

        if (! await UserMW.validTranslationRequest(res, [sessionToken, translationId])) {
            return 
        }


        console.log("hello")
        if (!(/^\+?(0|[1-9]\d*)$/.test(translationId))) {
            return res.status(400).send()
        }
        const userId = await UserMW.getUserId(sessionToken)
        const authorId = await Phrases.getTranslationAuthor(translationId)
        console.log(userId)
        console.log(authorId)
        if (userId != authorId) {
            return res.status(403).send()
        }

        let phrases = await Phrases.removeTranslation(userId, translationId)
        if (!phrases || phrases.affectedRows === 0) {
            res.status(404).send()
        }
        console.log(phrases)
        res.status(204).send()
    } catch (err) {
        res.status(500).send(`ERROR getting users ${err}`)
    }
}