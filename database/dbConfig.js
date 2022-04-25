const knex = require('knex');
const knexfile = require('../knexfile');
const dbEngine = process.env.DB_ENV || 'development';
// const config = require('./knexfile')[dbEngine];

console.log('Running on ' + dbEngine);

module.exports = knex(knexfile[dbEngine]);


