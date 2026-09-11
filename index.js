import dotenv from 'dotenv'
import express from 'express'
import bookCollection from './books.js'
import { fileURLToPath } from 'url'
import path from 'path'
import { dateAddedAsString } from './utils.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../.env'), quiet: true })

const app = express()
const PORT = process.env.API_PORT
let books = bookCollection
app.use(express.urlencoded({ extended: true }))

app.get('/books', (req, res) => {
  let result = books.map((book) => {
    return {
      ...book,
      dateAdded: dateAddedAsString(book.dateAdded),
    }
  })

  const { title, author, status } = req.query

  if (title) {
    result = result.filter((book) =>
      book.title.toLowerCase().includes(title.toLowerCase()),
    )
  }

  if (author) {
    result = result.filter((book) =>
      book.author.toLowerCase().includes(author.toLowerCase()),
    )
  }

  if (status) {
    result = result.filter(
      (book) => book.status.toLowerCase() === status.toLowerCase(),
    )
  }

  res.json(result)
})

app.get('/books/:id', (req, res) => {
  const book = books.find((book) => book.id === parseInt(req.params.id))
  if (book) {
    let temp = { ...book }
    temp.dateAdded = dateAddedAsString(temp.dateAdded)
    res.json(temp)
  } else {
    res.sendStatus(404)
  }
})

app.post('/books', (req, res) => {
  const id = books.length + 1
  const title = req.body?.title
  const author = req.body?.author
  const status = req.body?.status
  const description = req.body?.description

  if (title && author && status && description) {
    let book = {
      id,
      title,
      author,
      status,
      description,
      dateAdded: new Date(),
    }
    books.push(book)
    res.json(book)
  } else {
    res
      .status(400)
      .json({ message: `provide title, author, status and descripiton` })
  }
})

app.patch('/books/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const status = req.body?.status

  const book = books.find((book) => book.id === id)
  if (book && status) {
    book.status = status
    res.json(book)
  } else {
    res.sendStatus(400)
  }
})

app.delete('/books/:id', (req, res) => {
  books = books.filter((book) => book.id !== parseInt(req.params.id))
  res.sendStatus(200)
})

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`)
})
