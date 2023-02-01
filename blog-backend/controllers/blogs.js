const router = require('express').Router()
const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')
const { Blog, User } = require('../models')

const tokenExtractor = (req, res, next) => {
  console.log(req.body)
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch {
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll()
  res.json(blogs)
})

router.get('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    res.json(req.blog)
  } else {
    res.json(404).end()
  }
})

router.put('/:id', blogFinder, async (req, res) => {
  req.blog.likes = req.body.likes
  const likesUpdatedBlog = await req.blog.save()
  res.json(likesUpdatedBlog)
})

router.post('/', tokenExtractor, async (req, res) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.create({ ...req.body, userId: user.id })
    return res.json(blog)
  } catch (error) {
    return res.status(400).json({ error })
  }
})

router.delete('/:id', blogFinder, async (req, res) => {
  await req.blog.destroy()
  return res.json(`Removed blog with id ${req.params.id}`)
})

module.exports = router
