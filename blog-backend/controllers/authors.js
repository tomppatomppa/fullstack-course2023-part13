const router = require('express').Router()

const { Blog } = require('../models')
const { Sequelize } = require('sequelize')

router.get('/', async (req, res) => {
  const authors = await Blog.findAll({
    plain: false,
    group: ['author'],
    attributes: [
      'author',
      [Sequelize.fn('COUNT', Sequelize.col('author')), 'articles'],
      [Sequelize.fn('SUM', Sequelize.col('likes')), 'likes'],
    ],
    order: [['likes', 'DESC']],
  })
  return res.json(authors)
})

module.exports = router
