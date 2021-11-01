import express from 'express'
import bodyParser from 'body-parser'
import passport from 'passport'
import sequelize from './config/sequelize-config.js'
import routes from './routes/routes.js'
import strategy from './middleware/passport/passport.js'

const app = express()
const port = 5000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/uploads', express.static('uploads'))
app.use(passport.initialize())
strategy(passport)

routes(app)
sequelize.sync().then(() => console.log('db is ready'))

app.listen(port, () => {
  console.log(`App listen on port ${port}`)
})
