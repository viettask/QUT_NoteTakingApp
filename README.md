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
   git clone https://github.com/viettask/IFQ666_react_web_assignment1.git
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

1. Basic create-react-app setup with a focus on the assignment requirements.

2. Responsive Design: The website adapts to all screen sizes, ensuring an optimal user experience on both desktop and mobile devices.

3. Header with navigation bar menu: A simple and accessible menu allowing users to navigate between pages such as Home, About, Resume, Portfolio, Search, and Photos.

4. Footer: A consistent footer across all pages with email contact and legal information.

5. Pages:

   - Home Page: Includes a hero image and introduction text.

   - About Page: Personal information.

   - Resume Page: Displays a professional summary, career history, skills, and qualifications.

   - Portfolio Page: Showcases projects and creations, populated from Github API.

6. External API integration.
   The project uses multiple online APIs:
   - API #1 – Project/portfolio data (for dynamic population of the Portfolio page)
   - API #2 – Google Maps API via @react-google-maps/api (Used for location features and geolocation-based interactions)

## Technologies Used
1. Core web technologies
   - HTML5 - structure and semantic layout
   - CSS3 - Styling, animations, responsive design
   - Javascript (ES6+) - logic, components, and API integration
     
2. Frontend Framework
   - React 18 - Component based UI development
   - React Router DOM 17 - Client-side routing for multiple pages

3. Styling & UI
   - Bootstrap 5 - layout and pre-built components
   - Lucide React - Icon library

4. APIs & Data fetching:
   - Axios - HTTP requests
   - @react-google-maps/api - Google Maps rendering + geolocation

5. Testing
   - React testing library
   - Jest DOM
   - User Event

6. Build Tools
   - Create React App (react-scripts)
     
## Repository Structure
 ```bash
/IFQ666_react_web_assignment1 
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
   git clone https://github.com/viettask/IFQ666_react_web_assignment1.git
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