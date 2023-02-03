const router = require('express').Router()

const { Blog, User, ReadingList } = require('../models')

router.get('/', async (req, res) => {
  const allLists = await ReadingList.findAll({
    attributes: {
      exclude: ['id'],
    },
  })
  return res.json(allLists)
})

router.put('/:id', async (req, res) => {
  console.log(req.params)
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
router.post('/', async (req, res) => {
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
