const dbEngine = process.env.DB_ENV ;
const config = require('./knexfile')[dbEngine];

module.exports = require("knex")(config);