const Blog = require('./blog')
const User = require('./user')
const ReadingList = require('./readingList')
const Session = require('./session')
User.hasMany(Session)
User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog, { through: ReadingList, as: 'readings' })

module.exports = {
  Blog,
  User,
  ReadingList,
  Session,
}
