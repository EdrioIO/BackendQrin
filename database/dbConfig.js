const knex = require('knex');
const knexfile = require('../knexfile');
const dbEngine = process.env.DB_ENV;
// const config = require('./knexfile')[dbEngine];

module.exports = knex(knexfile[dbEngine]);


