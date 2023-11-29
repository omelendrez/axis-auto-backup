const documentNumber = (num) =>
  (parseInt(num, 10) + 10 ** 12).toString().substring(1)

module.exports = { documentNumber }
