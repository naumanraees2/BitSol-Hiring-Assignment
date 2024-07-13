
require('dotenv').config();
module.exports = {
    host: process.env.DB_HOST ? process.env.DB_HOST : "localhost",
    user: process.env.DB_USER ? process.env.DB_USER : "root",
    password: process.env.DB_PASSWORD ? process.env.DB_PASSWORD : "",
    db: process.env.DB_NAME ? process.env.DB_NAME : "test_database",
    // dialect: 'mysql'
    dialect: "mysql"
}