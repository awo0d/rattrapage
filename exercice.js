const express = require('express');
const fs = require('fs/promises'); // Utilisation de fs/promises pour des opérations asynchrones

const app = express();
const port = 3000;

const booksFilePath = 'books.json';

app.use(express.json());

// Endpoint pour récupérer tous les livres
app.get('/books', async (req, res) => {
  try {
    const data = await fs.readFile(booksFilePath, 'utf-8');
    const books = JSON.parse(data);
    res.json(books);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// Endpoint pour ajouter un nouveau livre
app.post('/books', async (req, res) => {
  try {
    const { id, title, author, publishedYear, genre, description } = req.body;

    if (!id || !title || !author || !publishedYear) {
      return res.status(400).send('Bad Request: Missing required information');
    }

    const data = await fs.readFile(booksFilePath, 'utf-8');
    const books = JSON.parse(data);

    const newBook = { id, title, author, publishedYear, genre, description };
    books.push(newBook);

    await fs.writeFile(booksFilePath, JSON.stringify(books, null, 2));
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// Endpoint pour supprimer un livre par son ID
app.delete('/books/:id', async (req, res) => {
  try {
    const idToDelete = req.params.id;

    const data = await fs.readFile(booksFilePath, 'utf-8');
    let books = JSON.parse(data);

    books = books.filter(book => book.id !== idToDelete);

    await fs.writeFile(booksFilePath, JSON.stringify(books, null, 2));
    res.send('Book deleted successfully');
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// Endpoint pour mettre à jour les détails d'un livre existant
app.put('/books/:id', async (req, res) => {
  try {
    const idToUpdate = req.params.id;
    const { title, author, publishedYear, genre, description } = req.body;

    const data = await fs.readFile(booksFilePath, 'utf-8');
    let books = JSON.parse(data);

    const updatedBooks = books.map(book => {
      if (book.id === idToUpdate) {
        return {
          ...book,
          title: title || book.title,
          author: author || book.author,
          publishedYear: publishedYear || book.publishedYear,
          genre: genre || book.genre,
          description: description || book.description,
        };
      }
      return book;
    });

    await fs.writeFile(booksFilePath, JSON.stringify(updatedBooks, null, 2));
    res.send('Book updated successfully');
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
