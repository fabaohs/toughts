const Tought = require('../models/Tought')
const Toughts = require('../models/Tought')
const User = require('../models/User')

module.exports = class ToughtController {

   static createTought(req, res) {
      res.render('toughts/create')
   }

   static async createToughtPost(req, res) {

      const tought = {
         title: req.body.title,
         UserId: req.session.userid
      }

      await Tought.create(tought)

      req.flash('message', 'Pensamento criado com sucesso')

      try {
         req.session.save(() => {
            res.redirect('/toughts/dashboard')
         })
      } catch (err) {
         console.log(err)
      }
   }

   static async showToughts(req, res) {
      const allToughtsRaw = await Toughts.findAll({ include: User })

      const allToughts = allToughtsRaw.map((result) => result.get({ plain: true }))

      res.render('toughts/home', { allToughts })
   }

   static async dashboard(req, res) {

      const userId = req.session.userid

      const user = await User.findOne({ where: { id: userId }, include: Tought, plain: true })

      // check if user exists
      if (!user) {
         res.redirect('login')
      }

      const toughts = user.Toughts.map((result) => result.dataValues)

      // verify if exists empty toughts
      let emptyToughts = false

      if (toughts.length === 0) {
         emptyToughts = true
      }


      res.render('toughts/dashboard', { toughts, emptyToughts })
   }

   static async removeTought(req, res) {
      const toughtId = req.body.id
      const UserId = req.session.userid

      try {
         await Tought.destroy({ where: { id: toughtId, UserId: UserId } })

         req.flash('message', 'Pensamento excluído.')

         req.session.save(() => {
            res.redirect('/toughts/dashboard')
         })

      } catch (error) {
         console.log('Ops... Houve um erro: ' + error)
      }

   }

   static async updateTought(req, res) {

      const id = req.params.id
      const UserId = req.session.userid

      const tought = await Tought.findOne({ where: { id: id, UserId: UserId }, raw: true })

      res.render('toughts/edit', { tought })
   }

   static async updateToughtPost(req, res) {

      const id = req.body.id
      const UserId = req.session.userid
      const tought = {
         title: req.body.title
      }


      try {
         await Tought.update(tought, { where: { id: id, UserId: UserId } })

         req.flash('message', 'Pensamento editado.')

         req.session.save(() => {
            res.redirect('/toughts/dashboard')
         })
      } catch (error) {
         console.log('Ops... Parece que houve um erro: ' + error)
      }
   }

}