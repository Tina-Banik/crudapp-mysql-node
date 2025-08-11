Book Management CRUD Application
This is a full-featured CRUD (Create, Read, Update, Delete) application for managing a bookstore. It's built with Node.js, Express, and MySQL, and includes robust features for book, order, and user management. The application handles image uploads for books and users, and securely manages data.
Features
Book Management:
Add new books with images.
View a list of all available books.
Retrieve a single book's details by its unique ID.
Get a list of books sorted by price from lowest to highest.
Update details for existing books.
Delete a book and its associated image file from the server.
Order Management:
Users can place orders for books.
Users can view their complete order history.
User Management:
Secure user registration with an uploaded profile image.
User login functionality.
Update user profile details.
Delete a user account and associated data.
Technologies Used
This project leverages the following key dependencies:
bcryptjs: For hashing and securing user passwords.
cors: To enable Cross-Origin Resource Sharing.
dotenv: For managing environment variables.
express: The core web application framework for Node.js.
jsonwebtoken: For user authentication and authorization using JSON Web Tokens.
multer: Middleware for handling multipart/form-data, primarily for file uploads (images).
mysql: The database driver for connecting to a MySQL database.

This is a simple yet robust CRUD (Create, Read, Update, Delete) application built using Node.js, Express.js for the backend, and MySQL as the relational database. This project serves as a foundational example for developing web APIs that interact with a database, demonstrating essential data manipulation operations.
Purpose:
To demonstrate basic CRUD operations using Node.js and MySQL.
To provide a clear, concise example of setting up a RESTful API.
To serve as a starting point for more complex Node.js/MySQL applications.
Features : 
Create: Add new records to the database.
Read: Retrieve single or all records from the database.
Update: Modify existing records in the database.
Delete: Remove records from the database.
RESTful API: Designed with clear and intuitive API endpoints.
Error Handling: Basic error handling for common scenarios.
Technologies Used
Node.js: JavaScript runtime environment.
Express.js: Fast, unopinionated, minimalist web framework for Node.js.
MySQL: Open-source relational database management system.
Nodemon (optional, for development): Automatically restarts the Node.js application when file changes are detected.
Dotenv (optional, but recommended): Loads environment variables from a .env file.
(List any other npm packages you've used, e.g., mysql2 for database interaction, body-parser)
