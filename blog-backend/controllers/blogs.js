const router = require('express').Router()

const { Blog, User } = require('../models')
const { Op } = require('sequelize')

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id, {
    include: {
      model: User,
    },
  })
  next()
}

router.get('/', async (req, res) => {
  let where = {}

  if (req.query.search) {
    where = {
      [Op.or]: [
        { title: { [Op.substring]: req.query.search } },
        { author: { [Op.substring]: req.query.search } },
      ],
    }
  }

  const blogs = await Blog.findAll({
    include: {
      model: User,
      attributes: ['name'],
    },
    where,
    order: [['likes', 'DESC']],
  })

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
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.create({ ...req.body, userId: user.id })
    return res.json(blog)
  } catch (error) {
    return res.status(400).json({ error })
  }
})

router.delete('/:id', blogFinder, async (req, res) => {
  if (!req.blog) {
    return res.status(401).json({ error: 'Blog doesnt exists' })
  }
  const user = await User.findByPk(req.decodedToken.id)

  if (user.username.toString() === req.blog.user.username.toString()) {
    await req.blog.destroy()
    return res.json(`Blog deleted`)
  }
  return res.json({ error: `Unauthorized request` })
})

module.exports = router
