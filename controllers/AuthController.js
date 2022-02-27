// Auth controls all functions related to login, registration and logout.

const User = require('../models/User')
const bcrypt = require('bcryptjs')

const passValidator = require('../helpers/passValidate')

module.exports = class AuthController {

   static register(req, res) {
      res.render('auth/register')
   }

   static async registerPost(req, res) {

      const { name, email, password, confirmpassword } = req.body

      // check if name contains numbers
      if (!isNaN(name)) {
         req.flash('message', 'O nome não pode conter números.')

         res.render('auth/register')
         return
      }

      // validates password
      if (password.length < 6) {
         req.flash('message', 'A senha deve conter ao menos 6 caracteres')

         res.render('auth/register')
         return
      }

      if (!passValidator.passValidate(password)) {
         req.flash('message', 'A senha deve conter caracteres maiúsculos (A - Z), minúsculos (a - z), especiais (- _ # $ !...) e números (0 - 9).')

         res.render('auth/register')
         return
      }

      // password match validation
      if (password != confirmpassword) {
         req.flash('message', 'As senhas estão diferentes. Tente novamente!')

         res.render('auth/register')
         return
      }

      // check if user exists
      const checkIfUserExists = await User.findOne({ where: { email: email } })

      if (checkIfUserExists) {
         req.flash('message', 'Este email já está sendo utilizado. Tente novamente ou faça login.')
         res.render('auth/register')

         return
      }

      // create a password
      const salt = bcrypt.genSaltSync(10)
      const hashedPassword = bcrypt.hashSync(password, salt)

      const user = {
         name,
         email,
         password: hashedPassword
      }

      try {
         const createdUser = await User.create(user)

         // init session
         req.session.userid = createdUser.id

         req.flash('message', 'Cadastro realizado com sucesso!')

         req.session.save(() => {
            res.redirect('/')
         })

      } catch (err) {
         console.log(err)
      }
   }

   static login(req, res) {
      res.render('auth/login')
   }

   static async loginPost(req, res) {

      const { email, password } = req.body

      // find user
      const user = await User.findOne({ where: { email: email } })
      if (!user) {
         req.flash('message', 'Essa conta não existe. Tente registrar-se primeiro.')
         res.render('auth/login')

         return
      }

      // check password
      const passwordMatch = bcrypt.compareSync(password, user.password)
      if (!passwordMatch) {
         req.flash('message', 'Senha incorreta. Digite novamente.')
         res.render('auth/login')

         return
      }

      // init session
      req.session.userid = user.id

      req.flash('message', 'Login realizado com sucesso!')

      req.session.save(() => {
         res.redirect('/')
      })

   }

   static logout(req, res) {
      req.session.destroy()
      res.redirect('/login')
   }
}