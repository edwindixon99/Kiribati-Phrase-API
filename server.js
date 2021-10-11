require('dotenv').config()
const db = require('./config/db')
const express = require('./config/express')

const app = express()
const port = process.env.port || 4941

async function testDbConnection() {
    try {
        await db.createPool()
        await db.getPool().getConnection()
    } catch (err) {
        console.error(`Unable to connect to MYSQL: ${err.message}`)
    }
}

testDbConnection().then(function () {
    app.listen(port, function () {
        console.log(`Listening on port: ${port}`)
    })
})
