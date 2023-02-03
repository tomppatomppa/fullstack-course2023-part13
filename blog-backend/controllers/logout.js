const router = require('express').Router()
const { User, Session } = require('../models')

router.delete('/', async (req, res) => {
  if (!req.decodedToken) {
    return res.status(401).json({ error: 'Unauthorized logout' })
  }

  const userToLogout = await User.findOne({
    where: {
      id: req.decodedToken.id,
    },
  })
  if (!userToLogout) {
    return res.json('No user found')
  }
  await Session.destroy({ where: { userId: userToLogout.id } })

  res.json(`User ${req.decodedToken.username} logged out`)
})

router.get('/', async (req, res) => {
  const allSessions = await Session.findAll()
  return res.json(allSessions)
})

module.exports = router
