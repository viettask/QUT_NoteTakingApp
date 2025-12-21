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
├── .gitignore
├── mySQL.sql
└── README.md
client
├── .expo
│   ├── devices.json
│   ├── packager-info.json
│   ├── README.md
│   └── settings.json
├── assets
│   └── note_taking_app.png
├── context
│   └── fontSizeContext.js
├── screens
│   ├── AboutScreen.js
│   ├── LoginScreen.js
│   ├── NoteScreen.js
│   ├── RegisterScreen.js
│   └── SettingsScreen.js
├── services
│   └── axios.js
├── App.js
├── app.json
├── client-licenses.json
├── index.js
├── package-lock.json
└── package.json
server
├── bin
│   └── www
├── config
│   ├── .env
│   └── knex.js
├── controllers
│   ├── authController.js
│   └── noteController.js
├── public
│   ├── images
│   ├── javascripts
│   └── stylesheets
│       └── style.css
├── routes
│   ├── authRoutes.js
│   └── noteRoutes.js
├── ssl
│   ├── cert.csr
│   ├── certificate.crt
│   ├── localhost-key.pem
│   ├── localhost.pem
│   └── private.key
├── views
│   ├── error.jade
│   ├── index.jade
│   └── layout.jade
├── app.js
├── package-lock.json
└── package.json
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

1. React Native

   Website: https://reactnative.dev/

   React Native is a framework for building cross-platform mobile apps using JavaScript and React.

2. React (with React Hooks)

   Website: https://reactjs.org/

   React is a JavaScript library for building user interfaces, which powers the front-end of this app.

3. Axios

   Website: https://axios-http.com/

   Axios is a promise-based HTTP client for JavaScript that is used to make requests to the backend API.

4. AsyncStorage

   Website: https://react-native-async-storage.github.io/async-storage/

   AsyncStorage is used to store data locally on the device (such as user session data).

5. React Navigation

   Website: https://reactnavigation.org/

   React Navigation is used to handle navigation and routing within the mobile app.

6. Node.js

   Website: https://nodejs.org/

   Node.js is the runtime environment used to build the backend of the app.

7. Express.js

   Website: https://expressjs.com/

   Express is a web framework for Node.js, used to create the RESTful API and handle server-side logic.

8. Knex.js

   Website: http://knexjs.org/

   Knex.js is a SQL query builder for Node.js used for interacting with the MySQL database.

9. MySQL

   Website: https://www.mysql.com/

   MySQL is the relational database used to store notes, categories, and user data.

10. Postman

   Website: https://www.postman.com/

   Postman is used for testing API endpoints during development.

11. Expo CLI

   Website: https://expo.dev/

   Expo is used to build and run React Native applications without needing to configure Xcode or Android Studio.

12. Git

   Website: https://git-scm.com/

   Git is used for version control and collaboration throughout the project.

13. GitHub (or GitLab/Bitbucket)

   Website: https://github.com/

   GitHub is used to host the repository for this project and collaborate with other developers.

14. bcrypt.js

   Website: https://www.npmjs.com/package/bcryptjs

   bcrypt.js is used for hashing and verifying user passwords in the backend.

15. JWT (JSON Web Tokens)

   Website: https://jwt.io/

   JWT is used for securely transmitting information between the client and server and managing user sessions.

16. Visual Studio Code (VS Code)

   Website: https://code.visualstudio.com/

   Visual Studio Code is the code editor used for writing and editing code.

17. React Native Debugger

   Website: https://github.com/jhen0409/react-native-debugger

   React Native Debugger is used for debugging and inspecting the app during development.

18. npm

   Website: https://www.npmjs.com/

   npm is the package manager used for managing dependencies in this project.

19. Yarn (Optional)

   Website: https://yarnpkg.com/

   Yarn is an alternative package manager to npm, used for managing dependencies in some parts of the project.

20. Expo Go

   Website: https://expo.dev/tools

   Expo Go is a mobile app that allows you to run your React Native projects on your physical device without needing to build it for production.

## License

This project is licensed under the MIT License.


