const db = require('../../config/db');

KIRIBATI_COLUMN = 'kiribati'
ENGLISH_COLUMN = 'english'

exports.getKiriTranslation = async function(query){
    
    const connection = await db.getPool().getConnection();
    let queryString = "SELECT " + KIRIBATI_COLUMN + "," + ENGLISH_COLUMN + " FROM " + "null_TABLE" + " WHERE " + KIRIBATI_COLUMN + " LIKE '% " + query.toLowerCase() + " %'";
    queryString += " OR " + KIRIBATI_COLUMN + " LIKE '" + query.toLowerCase() + "'";
    queryString += " OR " + KIRIBATI_COLUMN + " LIKE '" + query.toLowerCase() + " %'";
    queryString += " OR " + KIRIBATI_COLUMN + " LIKE '% " + query.toLowerCase() + "'"

    const [rows] = await connection.query(queryString);
    console.log(rows)
    connection.release();
    return rows;
};


exports.getEngTranslation = async function(query){
    
    const connection = await db.getPool().getConnection();
    let queryString = "SELECT " + KIRIBATI_COLUMN + "," + ENGLISH_COLUMN + " FROM " + "null_TABLE" + " WHERE " + ENGLISH_COLUMN + " LIKE '% " + query.toLowerCase() + " %'";
    queryString += " OR " + ENGLISH_COLUMN + " LIKE '" + query.toLowerCase() + "'";
    queryString += " OR " + ENGLISH_COLUMN + " LIKE '" + query.toLowerCase() + " %'";
    queryString += " OR " + ENGLISH_COLUMN + " LIKE '% " + query.toLowerCase() + "'";

    const [rows] = await connection.query(queryString);
    console.log(rows)
    connection.release();
    return rows;
};

