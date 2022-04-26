const QRCode = require('qrcode')

// module.exports = {}

const generateQR = async text => {
    try {
      return await QRCode.toDataURL(text)
    } catch (err) {
      console.error(err)
    }
  }



module.exports = {generateQR}