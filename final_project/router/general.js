
 const express = require('express');
const axios = require('axios'); // Import Axios for making HTTP requests
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Route for user registration
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  // Check if the username is valid (you need to implement this logic)
  if (!isValid(username)) {
    return res.status(400).json({ message: "Invalid username." });
  }

  // Check if the username already exists
  if (users.some((user) => user.username === username)) {
    return res.status(400).json({ message: "Username already exists." });
  }

  // Create a new user
  users.push({ username, password });

  // Return a success message
  return res.status(201).json({ message: "User registered successfully." });
});

// Route to get the list of available books
public_users.get('/', (req, res) => {
  // Send the list of books as a response
  res.json(books);
});

// Route to get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const { isbn } = req.params;

  // Find the book by ISBN in the books database
  const book = books[isbn];

  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ message: "Book not found." });
  }
});

// Route to get books by author
public_users.get('/author/:author', (req, res) => {
  const { author } = req.params;

  // Filter books by author
  const booksByAuthor = Object.values(books).filter(
    (book) => book.author === author
  );

  if (booksByAuthor.length > 0) {
    res.json(booksByAuthor);
  } else {
    res.status(404).json({ message: "Books by this author not found." });
  }
});

// Route to get books by title
public_users.get('/title/:title', (req, res) => {
  const { title } = req.params;

  // Filter books by title
  const booksByTitle = Object.values(books).filter(
    (book) => book.title === title
  );

  if (booksByTitle.length > 0) {
    res.json(booksByTitle);
  } else {
    res.status(404).json({ message: "Books with this title not found." });
  }
});

// Route to get book reviews based on ISBN
public_users.get('/review/:isbn', (req, res) => {
  const { isbn } = req.params;

  // Get book reviews based on ISBN (you need to implement this logic)
  const bookReviews = books[isbn]?.reviews || {};

  res.json(bookReviews);
});

module.exports.general = public_users;
