const router = require('express').Router()
const jwt = require('jsonwebtoken')

const { SECRET } = require('../util/config')
const { Blog, User } = require('../models')
const { Op, Sequelize } = require('sequelize')

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
