const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Helper Promise functions to satisfy Task 10 - Task 13 async retrieval requirements
const getAllBooksAsync = () => {
  return new Promise((resolve) => {
    resolve(books);
  });
};

const getBookByISBNAsync = (isbn) => {
  return new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject({ status: 404, message: `Book with ISBN ${isbn} not found` });
    }
  });
};

const getBooksByAuthorAsync = (author) => {
  return new Promise((resolve, reject) => {
    const authorParam = author.toLowerCase();
    const booksbyauthor = [];
    const keys = Object.keys(books);

    keys.forEach((key) => {
      if (books[key].author.toLowerCase() === authorParam) {
        booksbyauthor.push(books[key]);
      }
    });

    if (booksbyauthor.length > 0) {
      resolve(booksbyauthor);
    } else {
      reject({ status: 404, message: `No books found by author '${author}'` });
    }
  });
};

const getBooksByTitleAsync = (title) => {
  return new Promise((resolve, reject) => {
    const titleParam = title.toLowerCase();
    const booksbytitle = [];
    const keys = Object.keys(books);

    keys.forEach((key) => {
      if (books[key].title.toLowerCase() === titleParam) {
        booksbytitle.push(books[key]);
      }
    });

    if (booksbytitle.length > 0) {
      resolve(booksbytitle);
    } else {
      reject({ status: 404, message: `No books found with title '${title}'` });
    }
  });
};

// Task 10: Get all books using async/await with Axios
const getBooksWithAxios = async (baseURL = 'http://localhost:5001') => {
  try {
    const response = await axios.get(`${baseURL}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Task 11: Get book details by ISBN using Promises with Axios
const getBookByISBNWithAxios = (isbn, baseURL = 'http://localhost:5001') => {
  return axios.get(`${baseURL}/isbn/${isbn}`)
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};

// Task 12: Get book details by Author using async/await with Axios
const getBooksByAuthorWithAxios = async (author, baseURL = 'http://localhost:5001') => {
  try {
    const encodedAuthor = encodeURIComponent(author);
    const response = await axios.get(`${baseURL}/author/${encodedAuthor}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Task 13: Get book details by Title using Promises with Axios
const getBooksByTitleWithAxios = (title, baseURL = 'http://localhost:5001') => {
  const encodedTitle = encodeURIComponent(title);
  return axios.get(`${baseURL}/title/${encodedTitle}`)
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};

// Task 6: Register new user
public_users.post("/register", (req,res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "User already exists!" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "Customer successfully registered. Now you can login" });
});

// Task 1 & Task 10: Get the book list available in the shop
public_users.get('/', function (req, res) {
  getAllBooksAsync()
    .then((bookList) => res.status(200).json(bookList))
    .catch((err) => res.status(500).json({ message: "Error fetching book list" }));
});

// Task 2 & Task 11: Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  getBookByISBNAsync(isbn)
    .then((book) => res.status(200).json(book))
    .catch((err) => res.status(err.status || 404).json({ message: err.message || "Book not found" }));
});
  
// Task 3 & Task 12: Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  getBooksByAuthorAsync(author)
    .then((booksbyauthor) => res.status(200).json({ booksbyauthor }))
    .catch((err) => res.status(err.status || 404).json({ message: err.message || "Author not found" }));
});

// Task 4 & Task 13: Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  getBooksByTitleAsync(title)
    .then((booksbytitle) => res.status(200).json({ booksbytitle }))
    .catch((err) => res.status(err.status || 404).json({ message: err.message || "Title not found" }));
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }
  return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
});

module.exports.general = public_users;
module.exports.getAllBooksAsync = getAllBooksAsync;
module.exports.getBookByISBNAsync = getBookByISBNAsync;
module.exports.getBooksByAuthorAsync = getBooksByAuthorAsync;
module.exports.getBooksByTitleAsync = getBooksByTitleAsync;
module.exports.getBooksWithAxios = getBooksWithAxios;
module.exports.getBookByISBNWithAxios = getBookByISBNWithAxios;
module.exports.getBooksByAuthorWithAxios = getBooksByAuthorWithAxios;
module.exports.getBooksByTitleWithAxios = getBooksByTitleWithAxios;
