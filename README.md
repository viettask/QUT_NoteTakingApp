# IFQ666 React Web Assignment 2

## Purpose

- This application is a React Native and Node.js-based productivity tool designed for efficient note-taking and data management. It integrates a mobile front-end with a back-end REST API, demonstrating skills in modern JavaScript, React components, asynchronous programming, and API interaction. The app aims to provide a user-friendly platform for managing notes with a seamless, consistent experience across devices.

## Contributing

Contributions from other developers who want to improve IFQ666 are welcome! 
Follow these steps to contribute effectively:

1. Fork the repository.
   Click the Fork button on Github to create your own copy of the project

2. Clone your fork
      ```bash
   git clone https://github.com/viettask/QUT_NoteTakingApp.git
   ```
   
3. Create a new branch for your feature or fix:
      ```bash
   git checkout -b feature-or-fix-name
   ```
      
4. Make your changes, and commit them with a meaningful message:
   Update README.md if needed
      ```bash
   git commit -m "Add <feature>/Fix <issue>"
   ```

5. Push your branch to your fork:
      ```bash
   git push origin feature-or-fix-name
   ```

6. Open a Pull Request (PR) against the main repository. The repository owner will review and merge once approved.

## Features

1. User Authentication:

   - Login & Registration:

      Users can create a new account (register) or log into their existing account.

      Secure login using credentials (username and password).

   - Session Management:

   Persistent user session stored via AsyncStorage for easy access to user data across sessions.

2. Notes Management:

   - View Notes:

      Display a list of all notes that belong to the logged-in user.

      Notes are fetched dynamically based on the user’s ID.

   - Add New Note:

      Users can create new notes by entering a title and content.

      A note is saved with a category, content, and a timestamp.

   - Edit Note:

      Users can edit the title, content, color and category of existing notes.

      Editing is done on a specific note (by clicking on it), and the changes are saved.

   - Delete Note:

      Users can delete notes, with a confirmation prompt to prevent accidental deletions.

   - Expandable Note View:

      Clicking on a note reveals its full content, including the title and description.

3. Category Management:

   - Categorized Notes:

      Notes can be assigned to categories (e.g., Work, Personal, etc.).

   - Category Selection:

      Users can choose or edit the category when creating or editing a note.

   - Category Display:

      Display category name and color alongside each note to visually categorize them.

4. UI Features:

   - Responsive Layout:

      The app adapts its layout based on screen size (for mobile devices and tablets).

   - Font Size Adjustment:

      Users can change the font size for better readability.

5. User Interface Components:

   - Input Forms:

   Forms for adding/editing notes and categories.

   - Action Buttons:

   Buttons for adding, editing, and deleting notes.

   A cancel button when editing a note.

   - Splash screen:

   The default view when first launching the application

   Includes a logo image and some text.

6. Database Integration:

   - MySQL Database:

   Users, Notes and categories are stored in a MySQL database.

   CRUD operations are performed via API calls (Express/Node.js backend).

7. API Integration:

   - REST API:

   All actions related to users, notes and categories are performed through REST API calls using Axios.

   API routes for getting, adding, updating, and deleting notes are available.

   API routes for getting and updating users are available

8. Styling & Theme:

   - Customizable Colors:

   Notes and categories can have specific colors that are visually represented in the app.

## Technologies Used

1. Frontend Technologies:

   - React Native:

   For building the cross-platform mobile app (iOS & Android).

   - React (with React Hooks):

   For building and managing components.

   - Axios:

   For making HTTP requests to the backend API (for fetching notes, categories, etc.).

   - AsyncStorage:

   To store user session data (user ID, username) locally on the device.

   - Context API (Font Size Context):

   For managing and providing the font size preference across the app.

   - React Navigation:

   For navigating between different screens in the app.

2. Backend Technologies:

   - Node.js:

   The runtime for building your server-side application.

   - Express.js:

   Web framework for handling HTTP requests and routing on the backend.

   - Knex.js:

   SQL query builder for Node.js, used to interact with the MySQL database.

   - MySQL:

   Relational database for storing notes, users, and categories.

   - JWT (JSON Web Tokens) (Optional if used):

   For authenticating users securely and managing sessions (if implemented).

3. Database & Storage:

   - MySQL Database:

   Relational database where notes and categories are stored.

   - Knex.js (Database ORM/Query Builder):

   To interact with MySQL through queries for adding, editing, deleting, and fetching notes and categories.

4. Authentication (Optional if used):

   - JWT (JSON Web Token):

   For managing secure authentication of users if implemented.

   - bcrypt.js (for password hashing):

   For securely hashing and checking user passwords.
     
## Repository Structure
 ```bash
/QUT_NoteTakingApp
├── src
│   ├── API                           # API components (Github, Google Maps Javascript, NewsAPI, PicSum) 
│   ├── assets                        # Public assets (icons, photos)
│   ├── features                      # Feature components
│   ├── pages                         # App pages (Home, About, Resume, Portfolio, Search, Photos)
│   ├── App.css                       # Global and component styles
│   ├── App.js                        # Main routing setup
│   ├── index.js                      # React entry point
├── LICENSE.txt                       # License file
├── package.json                      # Lists all project dependencies, scripts, and metadata for React
└── README.md
```

## Project Setup

To run this project locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/viettask/QUT_NoteTakingApp.git
   ```

2. Navigate into the project directory:
   ```bash
   cd IFQ666_react_web_assignment1
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Run the project:
   ```bash
   npm start
   ```

## Acknowledgements
- Google Maps JavaScript API
- React documentation
- Bootstrap documentation
- Online public APIs for project data

## License

This project is licensed under the MIT License.


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