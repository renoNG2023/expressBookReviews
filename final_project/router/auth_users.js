
const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  // Here, you should implement the logic to check if the username is valid.
  // For example, you might check if it meets certain criteria.

  // Replace the following line with your validation logic.
  return username.length >= 3; // Sample validation (replace with your logic)
};

const authenticateUser = (username, password) => {
  // Here, you should implement the logic to check if the username and password match the records.
  // You might want to check against your 'users' array or a database.

  // Replace the following line with your authentication logic.
  return users.some((user) => user.username === username && user.password === password);
};

// User login route
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  if (!isValid(username)) {
    return res.status(400).json({ message: "Invalid username." });
  }

  if (!authenticateUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  // If username and password are valid, create a JWT token
  const token = jwt.sign({ username }, 'your-secret-key');

  res.json({ token });
});

// Add or modify a book review route
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;
  const username = req.user; // You should get the user from the JWT token

  if (!review) {
    return res.status(400).json({ message: "Review is required." });
  }

  // Here you can update or add a review for the given ISBN
  if (books[isbn]) {
    books[isbn].reviews[username] = review;
    res.json({ message: "Review added/modified successfully." });
  } else {
    res.status(404).json({ message: "Book not found." });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
