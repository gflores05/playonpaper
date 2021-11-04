const knex = require('knex')({
  client: 'pg',
  version: '8.7.1',
  connection: {
    host : '127.0.0.1',
    port : 5432,
    user : 'paper',
    password : 'paper',
    database : 'paper'
  }
});

const userTable = knex.schema.createTable('users', function (table) {
  table.increments();
  table.string('name');
  table.timestamps();
})

console.log(userTable);
