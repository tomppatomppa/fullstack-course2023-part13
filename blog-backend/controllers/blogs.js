const router = require('express').Router()

const { Blog } = require('../models')

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

router.post('/', async (req, res) => {
  const blog = await Blog.create(req.body)
  return res.json(blog)
})

router.delete('/:id', blogFinder, async (req, res) => {
  await req.blog.destroy()
  return res.json(`Removed blog with id ${req.params.id}`)
})

module.exports = router
