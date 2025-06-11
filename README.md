🌍 The Royal Tourism - Backend
Welcome to the backend server for The Royal Tourism, a full-stack tourism management platform. This repository powers the core functionality of the application, providing a robust RESTful API to manage users, tour packages, bookings, and admin operations. It integrates seamlessly with the frontend and admin panel repositories.

✨ Features

User Authentication & Authorization: Secure login/register with JWT-based access control.
Tour Package Management: Create, read, update, and delete (CRUD) tour packages.
Booking System: Handle user bookings, view booking history, and manage statuses.
Admin Access Control: Role-based permissions for administrators to manage users and content.
RESTful API: Well-documented endpoints for frontend and admin panel integration.
Relational Database: Stores data efficiently using MySQL or PostgreSQL via Sequelize ORM.


🛠️ Tech Stack

Node.js (v16.x or higher) – JavaScript runtime.
Express.js (v4.x) – Web framework for building APIs.
MySQL or PostgreSQL – Relational database (configurable).
Sequelize (v6.x) – ORM for database operations.
JWT – JSON Web Tokens for secure authentication.
bcrypt – Password hashing for enhanced security.
dotenv – Environment variable management.
Other Dependencies: cors, morgan (logging), nodemon (development).


📦 Getting Started
Follow these steps to set up and run the backend server locally.
Prerequisites

Node.js (v16 or higher)
npm or yarn
MySQL or PostgreSQL installed locally or hosted (e.g., via Railway or Render)
Git
A code editor like VS Code

1. Clone the Repository
git clone https://github.com/zealr3/TheRoyalTourism_Backend.git
cd TheRoyalTourism_Backend

2. Install Dependencies
npm install

Or, if using yarn:
yarn install

3. Set Up the Database

MySQL/PostgreSQL: Create a database (e.g., royal_tourism_db).
For MySQL:CREATE DATABASE royal_tourism_db;


For PostgreSQL:CREATE DATABASE royal_tourism_db;




Ensure your database server is running.

4. Configure Environment Variables
Create a .env file in the root directory with the following:
PORT=5000
DB_HOST=localhost
DB_USER=your_db_user
DB_PASS=your_db_password
DB_NAME=royal_tourism_db
DB_DIALECT=mysql  # or 'postgres' for PostgreSQL
JWT_SECRET=your_secure_jwt_secret


Replace your_db_user, your_db_password, and your_secure_jwt_secret with your credentials.
Use a strong, random string for JWT_SECRET (e.g., generate one using openssl rand -base64 32).

5. Run Database Migrations
If using Sequelize migrations to set up tables:
npx sequelize-cli db:migrate

6. Start the Server
npm start

Or, for development with auto-restart:
npm run dev

The server should be running on http://localhost:5000. Test endpoints using Postman or curl.

📁 Folder Structure
TheRoyalTourism_Backend/
├── config/            # Database and server configurations
├── middleware/        # Custom middleware (e.g., auth, error handling)
├── models/            # Sequelize models for database tables
├── routes/            # API route handlers
├── .env               # Environment variables
├── package.json       # Project dependencies and scripts
└── server.js          # Entry point for the server


🔗 Related Repositories

Frontend: TheRoyalTourism_React – React-based user interface for travelers.
Admin Panel: TheRoyalTourism_Admin – React-based dashboard for administrators.

To fully experience the platform, run the frontend and admin panel alongside the backend.

🧪 Testing the API
Use tools like Postman to test endpoints. Example endpoints:

GET /api/tours – Fetch all tour packages.
POST /api/auth/register – Register a new user.
POST /api/bookings – Create a booking (requires JWT).

Ensure the frontend is running to interact with the API through the user interface.

🤝 Contributing
Contributions are welcome! To contribute:

Fork this repository.
Create a feature branch:git checkout -b feature/your-feature


Commit your changes:git commit -m 'Add your feature'


Push to the branch:git push origin feature/your-feature


Open a pull request.

Please include tests and follow the project's coding standards.

📄 License
This project is licensed under the MIT License. See the LICENSE file for details.

👤 Author
Zeal R.

GitHub: @zealr3
Email: your-email@example.com (replace with your contact email)


⭐️ Show Support
If you find this project useful or learned something from it, please give it a ⭐️ on GitHub! Your support motivates further development.
