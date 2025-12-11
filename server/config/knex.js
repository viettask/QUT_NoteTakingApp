const knexLib = require('knex');

// module.exports = {
//   client: 'mysql2',  // Use mysql2 as the database client
//   connection: {
//     host: '127.0.0.1', // MySQL host
//     port: 3306,        // port is separate
//     user: 'root',      // MySQL user
//     password: 'Rfd0cTht@',      // MySQL password
//     database: 'note_taking_app', // Your database name
//   },
//   pool: {
//     min: 0,
//     max: 7,
//   },
// };

const knex = knexLib({
  client: 'mysql2',  // Use mysql2 as the database client
  connection: {
    host: '127.0.0.1', // MySQL host
    port: 3306,        // port is separate
    user: 'root',      // MySQL user
    password: 'Rfd0cTht@',      // MySQL password
    database: 'note_taking_app', // Your database name
  },
  pool: { min: 0, max: 7 },
});

module.exports = knex;