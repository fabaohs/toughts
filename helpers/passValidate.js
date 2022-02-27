module.exports.passValidate = function (password) {

   const lowercase = new RegExp(/[a-z]/)
   const uppercase = new RegExp(/[A-Z]/)
   const numbers = new RegExp(/[0-9]/)
   const specialCharacters = new RegExp(/[\!\@\#\$\%\^\&\*\)\(\+\=\.\<\>\{\}\[\]\:\;\'\"\|\~\`\_\-]/)

   const isValidPassword = () => {

      if (password.length < 6) {
         return false
      }

      if (!lowercase.test(password)) {
         return false
      }

      if (!uppercase.test(password)) {
         return false
      }

      if (!numbers.test(password)) {
         return false
      }

      if (!specialCharacters.test(password)) {
         return false
      }

      return true
   }

   return isValidPassword()

}