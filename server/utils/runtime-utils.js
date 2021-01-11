function isNull(obj) {
  if (obj === undefined || obj === null) {
    return true
  }
  return false
}

function isEmpty(str) {
  if (str === undefined || str === null || str === '') {
    return true
  }
  return false
}

function trimRight(str, charlist) {
  if (charlist === undefined) charlist = 's'

  return str.replace(new RegExp('[' + charlist + ']+$'), '')
}

function trimLeft(str, charlist) {
  if (charlist === undefined) charlist = 's'

  return str.replace(new RegExp('^[' + charlist + ']+'), '')
}

module.exports = { isNull, isEmpty, trimLeft, trimRight }
