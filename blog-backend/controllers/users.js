const router = require('express').Router()

const { User } = require('../models')

router.get('/', async (req, res) => {
  const allUsers = await User.findAll({})
  res.json(allUsers)
})

router.put('/:username', async (req, res) => {
  const userExists = await User.findOne({ username: req.params.username })
  userExists.username = req.body.username
  const updatedUsername = await userExists.save()
  res.json(updatedUsername)
})
router.post('/', async (req, res) => {
  const createdUser = await User.create(req.body)

  res.json(createdUser)
})

module.exports = router
