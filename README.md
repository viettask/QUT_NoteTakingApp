1. Main folder
npm install express knex mysql2 dotenv cors bcryptjs jsonwebtoken
express: Web framework for Node.js.

knex: SQL query builder for MySQL (middleware for database operations).

mysql2: MySQL client for Node.js (used with Knex).

dotenv: For managing environment variables.

cors: To handle Cross-Origin Resource Sharing (important for connecting the server to your React Native client).

bcryptjs: For password hashing.

jsonwebtoken: For handling JWT authentication.

2. Client folder
npm install expo @react-navigation/native @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context react-native-gesture-handler react-native-reanimated axios

3. Server folder
npm install express knex mysql2 dotenv cors bcryptjs jsonwebtoken

4.
https://slproweb.com/products/Win32OpenSSL.html
# Generate a private key (private.key)
openssl genpkey -algorithm RSA -out private.key

# Generate a self-signed certificate (certificate.crt)
openssl req -new -x509 -key private.key -out certificate.crt -days 3650