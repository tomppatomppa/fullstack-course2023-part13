const express = require('express')
const app = express()

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')

require('express-async-errors')

const { tokenExtractor } = require('./util/middleware')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const authorsRouter = require('./controllers/authors')
const readinglistsRouter = require('./controllers/readinglists')
const logoutRouter = require('./controllers/logout')

app.use(express.json())
app.use('/api/login', loginRouter)

app.use(tokenExtractor)

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

app.use('/api/authors', authorsRouter)
app.use('/api/readinglists', readinglistsRouter)
app.use('/api/logout', logoutRouter)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()
