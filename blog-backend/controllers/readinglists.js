const router = require('express').Router()

const { SECRET } = require('../util/config')
const jwt = require('jsonwebtoken')
const { Blog, User, ReadingList } = require('../models')

const tokenExtractor = (req, res, next) => {
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

router.get('/', async (req, res) => {
  const allLists = await ReadingList.findAll({
    attributes: {
      exclude: ['id'],
    },
  })
  return res.json(allLists)
})

router.put('/:id', tokenExtractor, async (req, res) => {
  const readingListItem = await ReadingList.findOne({
    where: { blogId: req.params.id },
  })

  if (!readingListItem) {
    return res.json({
      error: `Readlist item with the id ${req.params.id} doesn't exist`,
    })
  }

  if (readingListItem.userId === req.decodedToken.id) {
    readingListItem.read = req.body.read
    await readingListItem.save()
    return res.json(readingListItem)
  }

  return res.json({ error: 'No permission to modify' })
})
router.post('/', tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  const blog = await Blog.findByPk(req.body.blogId)
  if (user && blog) {
    const createListItem = await ReadingList.create({
      blogId: blog.id,
      userId: user.id,
    })
    return res.json(createListItem)
  }

  //const blog = await ReadingList.create({})
  return res.json({ error: 'Invalid entry' })
})

module.exports = router