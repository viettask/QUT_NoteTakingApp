module.exports = {
  client: 'mysql2',  // Use mysql2 as the database client
  connection: {
    host: 'localhost', // MySQL host
    user: 'root',      // MySQL user
    password: '',      // MySQL password
    database: 'note_taking_app', // Your database name
  },
  pool: {
    min: 0,
    max: 7,
  },
};