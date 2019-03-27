/**
 * 显示loading框
 * @param {string} text
 */
function showLoading(text = '加载中') {
  // eslint-disable-next-line no-undef
  wx.showLoading({
    title: text,
    mask: true
  })
}
/**
 * 隐藏loading框
 */
function hideLoading() {
  // eslint-disable-next-line no-undef
  wx.hideLoading()
}
/**
 * 模态弹窗，type的值为【'success','warn','fail'】，text为提示内容
 * @param {string} type
 * @param {string} text
 */
function showToast(type = 'success', text = '成功') {
  var option = {
    title: text,
    image: '/images/success.png',
    mask: true
  }
  switch (type) {
    case 'fail':
      option.title = (text === '成功' ? '失败' : text)
      option.icon = ''
      option.image = '/images/fail.png'
      break
    case 'warn':
      option.title = (text === '成功' ? '提醒' : text)
      option.icon = ''
      option.image = '/images/warn.png'
      break
  }
  // eslint-disable-next-line no-undef
  wx.showToast(option)
}

module.exports = {
  showToast,
  showLoading,
  hideLoading
}