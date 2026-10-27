const axios = require('axios');

const BASE_URL = process.env.BASE_URL || 'http://localhost:5001';

// Task 10: Get all books using async/await with Axios
async function getAllBooks(baseURL = BASE_URL) {
  try {
    const response = await axios.get(`${baseURL}/`);
    console.log("=== Task 10: Get all books (Axios async/await) ===");
    console.log(JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error("Task 10 Error:", error.message);
    throw error;
  }
}

// Task 11: Get book details by ISBN using Promises with Axios
function getBookByISBN(isbn = '1', baseURL = BASE_URL) {
  console.log(`=== Task 11: Get book details by ISBN '${isbn}' (Axios Promise) ===`);
  return axios.get(`${baseURL}/isbn/${isbn}`)
    .then((response) => {
      console.log(JSON.stringify(response.data, null, 2));
      return response.data;
    })
    .catch((error) => {
      console.error(`Task 11 Error for ISBN ${isbn}:`, error.message);
      throw error;
    });
}

// Task 12: Get book details by Author using async/await with Axios
async function getBooksByAuthor(author = 'Jane Austen', baseURL = BASE_URL) {
  try {
    console.log(`=== Task 12: Get books by Author '${author}' (Axios async/await) ===`);
    const encodedAuthor = encodeURIComponent(author);
    const response = await axios.get(`${baseURL}/author/${encodedAuthor}`);
    console.log(JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error(`Task 12 Error for author ${author}:`, error.message);
    throw error;
  }
}

// Task 13: Get book details by Title using Promises with Axios
function getBooksByTitle(title = 'Pride and Prejudice', baseURL = BASE_URL) {
  console.log(`=== Task 13: Get books by Title '${title}' (Axios Promise) ===`);
  const encodedTitle = encodeURIComponent(title);
  return axios.get(`${baseURL}/title/${encodedTitle}`)
    .then((response) => {
      console.log(JSON.stringify(response.data, null, 2));
      return response.data;
    })
    .catch((error) => {
      console.error(`Task 13 Error for title ${title}:`, error.message);
      throw error;
    });
}

// Run all Axios tasks sequentially if run directly
async function runAll() {
  console.log(`Starting Axios tasks against ${BASE_URL}...\n`);
  await getAllBooks();
  console.log("\n--------------------------------------------------\n");
  await getBookByISBN('1');
  console.log("\n--------------------------------------------------\n");
  await getBooksByAuthor('Jane Austen');
  console.log("\n--------------------------------------------------\n");
  await getBooksByTitle('Pride and Prejudice');
  console.log("\nAll Axios tasks completed successfully!");
}

if (require.main === module) {
  runAll().catch(() => process.exit(1));
}

module.exports = {
  getAllBooks,
  getBookByISBN,
  getBooksByAuthor,
  getBooksByTitle
};
