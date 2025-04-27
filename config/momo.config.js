module.exports = {
  accessKey: process.env.MOMO_ACCESS_KEY,
  secretKey: process.env.MOMO_SECRET_KEY,
  orderInfo: 'pay with MoMo',
  partnerCode: 'MOMO',
  redirectUrl: `${process.env.SUB_URLDEPLOY}`,
  ipnUrl: `${process.env.URLDEPLOY}/checkout/momo-callback`, 
  requestType: 'payWithMethod',
  extraData: '',
  orderGroupId: '',
  autoCapture: true,
  lang: 'vi',
}