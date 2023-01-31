require('dotenv').config()
const { Sequelize, QueryTypes } = require('sequelize')
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
})

const printBlog = ({ author, title, likes }) => {
  console.log(author + ': ' + JSON.stringify(title) + ', ' + likes + ' likes')
}
const showAllBlogs = async () => {
  try {
    await sequelize.authenticate()
    const blogs = await sequelize.query('SELECT * FROM blogs', {
      type: QueryTypes.SELECT,
    })
    blogs.map((blog) => printBlog(blog))
    sequelize.close()
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

showAllBlogs()
