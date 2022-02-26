const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const flash = require('express-flash')

const app = express()

const conn = require('./db/conn')
const { urlencoded } = require('express')
const cookieParser = require('cookie-parser')

// Models
const Tought = require('./models/Tought')
const User = require('./models/User')

// Import routes
const toughtsRoutes = require('./routes/toughtsRoutes')
const authRoutes = require('./routes/authRoutes')

//Import Controller
const ToughtController = require('./controllers/ToughtController')

// template engine
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

// read body
app.use(express.urlencoded({
   extended: true
}))

app.use(express.json())

// session middleware
app.use(
   session({
      name: 'session',
      secret: 'nosso_secret',
      resave: false,
      saveUninitialized: false,
      store: new FileStore({
         logFn: function () { },
         path: require('path').join(require('os').tmpdir(), 'sessions'),
      }),

      cookie: {
         secure: false,
         maxAge: 360000,
         expires: new Date(Date.now() + 360000),
         httpOnly: true
      }
   })
)

// flash messages
app.use(flash())

// set session to response
app.use((req, res, next) => {

   // check if user already has a session
   if (req.session.userid) {
      res.locals.session = req.session
   }

   next()
})

// public 
app.use(express.static('public'))

// routes
app.use('/toughts', toughtsRoutes)
app.use('/', authRoutes)

app.get('/', ToughtController.showToughts)

// connection
conn.sync()
   .then(() => {
      app.listen(3000)
   })
   .catch((err) => console.log(err))