const { SECRET } = require('../util/config')
const jwt = require('jsonwebtoken')

const { Session } = require('../models')

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const token = authorization.substring(7)
    const decodedToken = jwt.verify(token, SECRET)

    const sessionToken = await Session.findOne({
      where: { token: token, userId: decodedToken.id },
    })

    if (!sessionToken || !decodedToken) {
      return res.status(401).json({ error: 'Invalid or expired token' })
    }

    req.decodedToken = decodedToken
  }
  next()
}

module.exports = {
  tokenExtractor,
}
