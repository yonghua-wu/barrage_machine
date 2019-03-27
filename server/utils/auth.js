const jwt = require('jsonwebtoken')
const secret = require('../config.js').serverSecret

/**
 * 制作jwt
 * @param {string} openId 需传递的openid
 * @returns {object or string}
 */
function getToken(openId) {
  let info = {
    user: openId
  }
  return jwt.sign(info, secret, {
    expiresIn: 60*60*12
  })
}

/**
 * 验证jwt是否有效
 * @param {string} token jwt
 * @returns {Promise}
 */
function authToken(token) {
  // jwt.verify(token, secret, callback)
  return new Promise((resolve, reject)=> {
    jwt.verify(token, secret, function(err, decode) {
      if (err) {
        reject(err)
      } else {
        resolve(decode.user)
      }
    })
  })
}
module.exports = {
  getToken,
  authToken
}