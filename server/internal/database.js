const low = require('lowdb');
const config = require('../config');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync(config.db_path);
let db = undefined;

function _getDB() {
    if (db == undefined) {
      db = low(adapter);
    }
    return db;
}


function put(key, value) {
  console.log(`db put ${key}`, value)
  return _getDB().set(key, value).write();
}

function get(key) {
  let result = _getDB().get(key);
  console.log(`db get ${key}`, result.value());
  return result.value();

}

module.exports = {
  put,
  get
}