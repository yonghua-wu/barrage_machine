const Sequelize = require('sequelize')
const config = require('../config.js')
let Op = Sequelize.Op
let sequelize = new Sequelize(config.database.database, config.database.user, config.database.password, {
  host: config.database.host,
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 30000
  }
})
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err)
  })
let User = sequelize.define('user', {
  uid: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    unique: true,
    autoIncrement: true
  },
  open_id: {
    type: Sequelize.STRING(45),
    unique: true
  },
  session_key: {
    type: Sequelize.STRING(45)
  },
  nickname: {
    type: Sequelize.STRING(255)
  },
  gender: {
    type: Sequelize.INTEGER
  },
  avatar_url: {
    type: Sequelize.STRING(1023)
  },
  register_time: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  }
},
{
  timestamps: false
})

/**
 * 插入用户登陆信息
 * @param {string} openId openid
 * @param {string} sessionKey session key
 */
async function insertLoginInfo(openId, sessionKey) {
  return await User.create({
    open_id: openId,
    session_key: sessionKey
  })
}

/**
 * 通过openid保存用户信息
 * @param {string} openId 需保存信息的用户的openid
 * @param {string} nickname 昵称
 * @param {string} gender 性别，1男，2女，0未知
 * @param {string} avatarUrl 头像URL
 */
async function insertUserInfo(openId, nickname, gender, avatarUrl) {
  return await User.update({
    nickname: nickname,
    gender: gender,
    avatar_url: avatarUrl,
  }, {
    where: {
      open_id: {
        [Op.eq]: openId
      }
    }
  })
}

/**
 * 通过openid查询用户信息
 * @param {string} openId 用户的openid
 */
async function findUserInfo(openId) {
  return await User.findOne({
    where: {
      open_id: openId
    },
    // attributes: ['nickname', 'gender']
  })
}
/**
 * 更新session key
 * @param {string} openId 需要更新的用户的openid
 * @param {string} sessionKey 新的session key
 */
async function updateSessionKey(openId, sessionKey) {
  return await User.update({
    session_key: sessionKey
  }, {
    where: {
      open_id: {
        [Op.eq]: openId
      }
    }
  })
}
module.exports = {
  insertLoginInfo,
  insertUserInfo,
  findUserInfo,
  updateSessionKey
}
